import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL;

export const useCartStore = create((set, get) => ({
  cart: [],
  isLoading: false,
  total: 0,

  calculateTotal: (items) => {
    return items.reduce((sum, item) => {
      const price = item.products?.price || item.price || 0;
      return sum + (price * item.quantity);
    }, 0);
  },

  getHeaders: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': session ? `Bearer ${session.access_token}` : ''
    };
  },

  fetchCart: async () => {
    set({ isLoading: true });
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      try {
        const headers = await get().getHeaders();
        const res = await fetch(`${API_URL}/cart`, { headers });
        if (res.ok) {
          const data = await res.json();
          set({ 
            cart: data, 
            total: get().calculateTotal(data),
            isLoading: false 
          });
          return;
        }
      } catch (err) {
        console.error('Error fetching cart from backend:', err);
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
      try {
        const headers = await get().getHeaders();
        const res = await fetch(`${API_URL}/cart`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ productId: product.id, variantId, quantity })
        });
        
        if (res.ok) {
          get().fetchCart();
        }
      } catch (err) {
        console.error('Error adding to cart via backend:', err);
      }
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
          product_variants: null 
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
      try {
        const headers = await get().getHeaders();
        const res = await fetch(`${API_URL}/cart/${cartItemId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ quantity: newQuantity })
        });
        
        if (res.ok) {
          get().fetchCart();
        }
      } catch (err) {
        console.error('Error updating quantity via backend:', err);
      }
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
      try {
        const headers = await get().getHeaders();
        const res = await fetch(`${API_URL}/cart/${cartItemId}`, {
          method: 'DELETE',
          headers
        });
        
        if (res.ok) {
          get().fetchCart();
        }
      } catch (err) {
        console.error('Error removing from cart via backend:', err);
      }
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
      try {
        const headers = await get().getHeaders();
        const res = await fetch(`${API_URL}/cart`, {
          method: 'DELETE',
          headers
        });
        
        if (res.ok) {
          set({ cart: [], total: 0 });
        }
      } catch (err) {
        console.error('Error clearing cart via backend:', err);
      }
    } else {
      localStorage.removeItem('pura_cart');
      set({ cart: [], total: 0 });
    }
  }
}));
