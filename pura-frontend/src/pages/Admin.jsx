import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const { profile, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && profile?.role === 'admin') {
      fetchOrders();
    }
  }, [profile, authLoading]);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data);
    setLoading(false);
  };

  const updateOrderStatus = async (orderId, status) => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    fetchOrders();
  };

  if (authLoading || loading) return <div className="pt-32 px-16 text-center">Loading admin panel...</div>;
  if (profile?.role !== 'admin') return <div className="pt-32 px-16 text-center text-red-600">Access Denied. Admin only.</div>;

  return (
    <div className="pt-32 px-16 max-w-[1200px] mx-auto pb-20">
      <h1 className="font-heading text-4xl mb-8">Admin Dashboard</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-glass-border p-8">
        <h2 className="font-heading text-2xl mb-6">Recent Orders</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-glass-border text-sm text-text-muted">
                <th className="pb-4 font-medium">Order ID</th>
                <th className="pb-4 font-medium">Customer</th>
                <th className="pb-4 font-medium">Amount</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-glass-border/50">
                  <td className="py-4 text-sm font-mono text-charcoal/70">{order.id.slice(0, 8)}</td>
                  <td className="py-4">
                    <div className="text-sm font-medium">{order.profiles?.full_name || 'Guest'}</div>
                    <div className="text-xs text-text-muted">{order.profiles?.email}</div>
                  </td>
                  <td className="py-4 text-sm font-medium text-sage-dark">₹{order.total_amount}</td>
                  <td className="py-4 text-sm text-text-muted">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                      ${order.status === 'pending' ? 'bg-amber-100 text-amber-800' : ''}
                      ${order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : ''}
                      ${order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' : ''}
                      ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : ''}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="text-xs border border-glass-border rounded px-2 py-1 bg-warm-white text-charcoal outline-none cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-text-muted text-sm">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
