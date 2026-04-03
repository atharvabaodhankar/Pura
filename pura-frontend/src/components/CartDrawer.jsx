import { ShoppingBag, X, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, total, updateQuantity, removeFromCart } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-[200] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-warm-white z-[210] shadow-2xl transition-transform duration-500 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b border-glass-border flex items-center justify-between bg-white/50 backdrop-blur-md">
          <h2 className="font-heading text-2xl flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-sage-dark" />
            Your Bag
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors cursor-pointer border-none bg-transparent">
            <X className="w-5 h-5 text-charcoal/60" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="m-auto text-center text-text-muted flex flex-col items-center gap-4">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p>Your bag is empty.</p>
              <button onClick={onClose} className="btn-primary mt-4">Continue Shopping</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white border border-glass-border animate-fade-card">
                <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                  <img src={item.products?.images?.[0]} alt={item.products?.name} className="w-[80%] h-[80%] object-contain drop-shadow-md" />
                </div>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-heading font-semibold text-lg leading-tight pr-4 truncate">{item.products?.name}</h4>
                      <button onClick={() => removeFromCart(item.id)} className="text-charcoal/40 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {item.product_variants && (
                      <div className="text-xs text-text-muted flex items-center gap-1.5 mb-2">
                        <span className="w-2 h-2 rounded-full block" style={{ background: item.product_variants.color_hex }} />
                        {item.product_variants.variant_name}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex border border-glass-border rounded-full overflow-hidden w-24 h-8 bg-warm-white">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="flex-1 border-none bg-transparent cursor-pointer hover:bg-black/5 text-charcoal transition-colors">−</button>
                      <span className="flex-1 flex items-center justify-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="flex-1 border-none bg-transparent cursor-pointer hover:bg-black/5 text-charcoal transition-colors">+</button>
                    </div>
                    <div className="font-medium text-sage-dark">₹{(item.products?.price || 0) * item.quantity}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-glass-border shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-text-muted font-medium">Subtotal</span>
              <span className="font-heading text-2xl font-semibold text-charcoal">₹{total}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="btn-primary w-full justify-center text-[0.95rem] py-4 gap-3 shadow-lg shadow-sage-dark/10"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-center text-xs text-text-muted mt-4">Safe & Secure Payment</p>
          </div>
        )}
      </div>
    </>
  );
}
