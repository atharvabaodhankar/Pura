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
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) {
        setOrders(data);
      }
      setLoading(false);
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
          <div>
            <Link to="/" className="flex items-center gap-2 text-text-muted hover:text-charcoal transition-colors mb-6 font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
            <h1 className="font-heading text-5xl font-semibold text-charcoal">Your Orders</h1>
          </div>
          <div className="text-text-muted font-medium bg-white/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-glass-border">
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
                <div className="p-8 border-b border-glass-border bg-white/40 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
                    <div>
                      <div className="text-[0.65rem] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Order Placed</div>
                      <div className="font-medium text-charcoal">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div>
                      <div className="text-[0.65rem] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Total Amount</div>
                      <div className="font-heading font-bold text-charcoal">₹{order.total_amount}</div>
                    </div>
                    <div>
                      <div className="text-[0.65rem] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Ship to</div>
                      <div className="font-medium text-charcoal truncate max-w-[200px]">{order.shipping_address}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${getStatusClass(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                    <div className="text-xs font-medium text-text-muted">
                      #PURA-{order.id.slice(0, 8).toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-8 space-y-6 bg-white/20">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex gap-6 items-center">
                      <div className="w-20 h-20 rounded-2xl bg-black/5 flex items-center justify-center p-2 shrink-0 border border-glass-border">
                        <img src={item.products?.images?.[0]} alt={item.products?.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-charcoal text-lg">{item.products?.name}</h4>
                        <div className="text-sm text-text-muted mt-1">Quantity: {item.quantity} · Price: ₹{item.price}</div>
                        <Link to={`/product/${item.products?.slug}`} className="text-xs font-bold text-sage-dark uppercase tracking-widest mt-3 inline-block hover:underline">
                          Buy it again
                        </Link>
                      </div>
                      <button className="px-6 py-3 rounded-full bg-white border border-glass-border text-sm font-semibold hover:bg-black/5 transition-colors cursor-pointer">
                        Track Package
                      </button>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                {order.status === 'delivered' && (
                  <div className="px-8 py-4 bg-sage-light/5 border-t border-glass-border flex items-center justify-between">
                    <span className="text-sm font-medium text-sage-dark">Delivered successfully. How was your experience?</span>
                    <button className="text-sm font-bold text-charcoal uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent">
                      Write a Review
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 p-8 rounded-[40px] bg-charcoal text-cream flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-2xl font-heading font-semibold mb-2">Need help with an order?</h3>
            <p className="opacity-70 text-sm">Our support team is available 24/7 to assist you with any questions.</p>
          </div>
          <button className="bg-cream text-charcoal px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform z-10">
            Contact Support
          </button>
          {/* Abstract blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sage-dark/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sage-light/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
        </div>
      </div>
    </div>
  );
}
