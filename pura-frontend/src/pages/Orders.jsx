import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, AlertCircle, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/my-orders`, {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-amber-500" />;
      default: return <AlertCircle className="w-4 h-4 text-text-muted" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-50 text-green-700 border-green-100';
      case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sage-dark"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-40 px-6 flex flex-col items-center justify-center text-center">
        <div className="bg-sage-light/10 p-8 rounded-full mb-8">
          <Package className="w-16 h-16 text-text-muted/40" />
        </div>
        <h2 className="text-3xl font-heading font-semibold text-charcoal mb-4">Please log in</h2>
        <p className="text-text-muted mb-10 max-w-xs mx-auto">You need to be logged in to view your order history.</p>
        <Link to="/login?redirect=orders" className="btn-primary px-10 h-14">Log In Now</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white pt-32 pb-20 px-6 md:px-12 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="fade-up">
            <Link to="/" className="flex items-center gap-2 text-text-muted hover:text-charcoal transition-colors mb-6 font-medium text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-charcoal">Your Orders</h1>
          </div>
          <div className="text-text-muted font-bold text-xs uppercase tracking-widest bg-white/50 backdrop-blur-md px-6 py-3 rounded-full border border-glass-border self-start md:self-auto">
            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Total
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="glass p-16 rounded-[40px] text-center border-glass-border">
            <ShoppingBag className="w-20 h-20 text-text-muted/20 mx-auto mb-8" />
            <h3 className="text-2xl font-heading font-semibold text-charcoal mb-4">No orders yet</h3>
            <p className="text-text-muted mb-10 text-lg">Your order history will appear here once you place your first order.</p>
            <Link to="/" className="btn-primary px-10 h-14 inline-flex items-center gap-2">
              Start Shopping <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="glass rounded-[40px] border-glass-border overflow-hidden hover:shadow-xl transition-all duration-500">
                {/* Order Header */}
                <div className="p-6 md:p-8 border-b border-glass-border bg-white/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-x-8 md:gap-x-12 gap-y-6">
                    <div>
                      <div className="text-[0.6rem] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Order Placed</div>
                      <div className="text-sm font-semibold text-charcoal">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div>
                      <div className="text-[0.6rem] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Total Amount</div>
                      <div className="font-heading text-lg font-bold text-charcoal">₹{order.total_amount}</div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <div className="text-[0.6rem] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Ship to</div>
                      <div className="text-sm font-semibold text-charcoal truncate max-w-[200px]">{order.shipping_address?.full_address || order.shipping_address}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-none border-glass-border/30 pt-4 lg:pt-0">
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[0.65rem] font-bold uppercase tracking-wider ${getStatusClass(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                    <div className="text-[0.65rem] font-bold text-text-muted opacity-50 uppercase tracking-tighter">
                      #PURA-{order.id.slice(0, 8).toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 md:p-8 space-y-8 bg-white/20">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-black/5 flex items-center justify-center p-2 shrink-0 border border-glass-border">
                        <img src={item.products?.images?.[0]} alt={item.products?.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-charcoal text-base md:text-lg">{item.products?.name}</h4>
                        <div className="text-xs md:text-sm text-text-muted mt-1">Quantity: {item.quantity} · Price: ₹{item.price}</div>
                        <Link to={`/product/${item.products?.slug}`} className="text-[0.65rem] font-bold text-sage-dark uppercase tracking-widest mt-3 inline-block hover:underline">
                          Buy it again
                        </Link>
                      </div>
                      <button className="w-full sm:w-auto px-6 py-3 rounded-full bg-white border border-glass-border text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-black/5 transition-colors cursor-pointer shadow-sm">
                        Track Package
                      </button>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                {order.status === 'delivered' && (
                  <div className="px-6 md:px-8 py-4 bg-sage-light/5 border-t border-glass-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <span className="text-xs md:text-sm font-semibold text-sage-dark">How was your product experience?</span>
                    <button className="text-[0.65rem] font-bold text-charcoal uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent">
                      Write a Review
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 p-8 md:p-12 rounded-[40px] bg-charcoal text-cream flex flex-col md:flex-row items-start md:items-center justify-between gap-8 overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-heading font-semibold mb-3">Order assistance?</h3>
            <p className="opacity-70 text-sm md:text-base max-w-sm">Our support team is available 24/7 to assist you with any questions about your delivery.</p>
          </div>
          <button className="w-full md:w-auto bg-cream text-charcoal px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform z-10 whitespace-nowrap shadow-xl">
            Contact Support
          </button>
          {/* Abstract blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sage-dark/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sage-light/10 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2" />
        </div>
      </div>
    </div>
  );
}
