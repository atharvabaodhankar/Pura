import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useCartStore = create((set, get) => ({
  cart: [],
  isLoading: false,
  total: 0,

  calculateTotal: (items) => {
    return items.reduce((sum, item) => {
      const price = item.products?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
  },

  fetchCart: async () => {
    set({ isLoading: true });
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const { data, error } = await supabase
        .from('cart')
        .select(`
          id, quantity, product_id, variant_id,
          products (id, name, price, images, compare_price),
          product_variants (id, variant_name, color_hex)
        `)
        .eq('user_id', session.user.id);
        
      if (!error && data) {
        set({ 
          cart: data, 
          total: get().calculateTotal(data),
          isLoading: false 
        });
        return;
      }
    }
    
    const localCart = JSON.parse(localStorage.getItem('pura_cart') || '[]');
    set({ 
      cart: localCart, 
      total: get().calculateTotal(localCart),
      isLoading: false 
    });
  },

  addToCart: async (product, variantId, quantity = 1) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const { data: existing } = await supabase
        .from('cart')
        .select()
        .eq('user_id', session.user.id)
        .eq('product_id', product.id)
        .eq('variant_id', variantId)
        .single();
        
      if (existing) {
        await supabase
          .from('cart')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('cart')
          .insert({
            user_id: session.user.id,
            product_id: product.id,
            variant_id: variantId,
            quantity
          });
      }
      get().fetchCart();
    } else {
      const currentCart = get().cart;
      const existingIdx = currentCart.findIndex(
        item => item.product_id === product.id && 
                (item.variant_id === variantId || (!item.variant_id && !variantId))
      );
      
      let newCart = [...currentCart];
      if (existingIdx >= 0) {
        newCart[existingIdx].quantity += quantity;
      } else {
        newCart.push({
          id: Math.random().toString(36).substr(2, 9),
          product_id: product.id,
          variant_id: variantId,
          quantity,
          products: product,
          product_variants: null // Simple mockup for variants in local cart
        });
      }
      
      localStorage.setItem('pura_cart', JSON.stringify(newCart));
      set({ 
        cart: newCart,
        total: get().calculateTotal(newCart)
      });
    }
  },
  
  updateQuantity: async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase
        .from('cart')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId);
      get().fetchCart();
    } else {
      const currentCart = get().cart;
      const newCart = currentCart.map(item => 
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem('pura_cart', JSON.stringify(newCart));
      set({ 
        cart: newCart,
        total: get().calculateTotal(newCart)
      });
    }
  },
  
  removeFromCart: async (cartItemId) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase
        .from('cart')
        .delete()
        .eq('id', cartItemId);
      get().fetchCart();
    } else {
      const newCart = get().cart.filter(item => item.id !== cartItemId);
      localStorage.setItem('pura_cart', JSON.stringify(newCart));
      set({ 
        cart: newCart,
        total: get().calculateTotal(newCart)
      });
    }
  },

  clearCart: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('cart').delete().eq('user_id', session.user.id);
      set({ cart: [], total: 0 });
    } else {
      localStorage.removeItem('pura_cart');
      set({ cart: [], total: 0 });
    }
  }
}));
