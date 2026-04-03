import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';
import { Package, Map, PlusCircle, CheckCircle2 } from 'lucide-react';

const libraries = ['visualization'];

export default function Admin() {
  const { profile, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'heatmap', 'addProduct'

  // Add Product State
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    category: 'cream',
    price: '',
    compare_price: '',
    stock: '',
    image: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productSuccess, setProductSuccess] = useState(false);

  // Maps
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  useEffect(() => {
    if (!authLoading && profile?.role === 'admin') {
      fetchOrders();
    }
  }, [profile, authLoading]);

  const fetchOrders = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const res = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch orders');
      
      const ordersData = await res.json();
      setOrders(ordersData || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        fetchOrders();
      } else {
        console.error("Failed to update status");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const mapContainerStyle = { width: '100%', height: '500px', borderRadius: '16px' };
  const defaultCenter = { lat: 28.6139, lng: 77.2090 };

  const heatmapData = useMemo(() => {
    if (!isLoaded || !window.google) return [];
    
    return orders
      .filter(order => order.shipping_address && order.shipping_address.location)
      .map(order => new window.google.maps.LatLng(
        order.shipping_address.location.lat, 
        order.shipping_address.location.lng
      ));
  }, [orders, isLoaded]);

  const handleProductInput = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setProductSuccess(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const newProduct = {
        name: productData.name,
        slug: slug,
        description: productData.description,
        category: productData.category,
        price: parseFloat(productData.price) || 0,
        compare_price: productData.compare_price ? parseFloat(productData.compare_price) : null,
        stock: parseInt(productData.stock) || 0,
        is_active: true,
        images: productData.image ? [productData.image] : []
      };

      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });

      if (!res.ok) throw new Error('Failed to add product');
      
      setProductSuccess(true);
      setProductData({
        name: '', description: '', category: 'cream', price: '', compare_price: '', stock: '', image: ''
      });
      setTimeout(() => setProductSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Error adding product!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) return <div className="pt-32 px-16 text-center">Loading admin panel...</div>;
  if (profile?.role !== 'admin') return <div className="pt-32 px-16 text-center text-red-600">Access Denied. Admin only.</div>;

  return (
    <div className="pt-32 px-6 md:px-16 max-w-[1200px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <h1 className="font-heading text-4xl text-charcoal font-semibold">Admin Dashboard</h1>
        <div className="flex gap-2 p-1 bg-black/5 rounded-full inline-flex">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${activeTab === 'orders' ? 'bg-white shadow-md text-charcoal' : 'text-charcoal/60 hover:text-charcoal border-none bg-transparent'}`}
          >
            <Package className="w-4 h-4" /> Orders
          </button>
          <button 
            onClick={() => setActiveTab('heatmap')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${activeTab === 'heatmap' ? 'bg-white shadow-md text-charcoal' : 'text-charcoal/60 hover:text-charcoal border-none bg-transparent'}`}
          >
            <Map className="w-4 h-4" /> Heatmap
          </button>
          <button 
            onClick={() => setActiveTab('addProduct')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${activeTab === 'addProduct' ? 'bg-white shadow-md text-charcoal' : 'text-charcoal/60 hover:text-charcoal border-none bg-transparent'}`}
          >
            <PlusCircle className="w-4 h-4" /> New Product
          </button>
        </div>
      </div>
      
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl shadow-lg shadow-black/5 border border-glass-border p-8 animate-fade-up">
          <h2 className="font-heading text-2xl mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-glass-border text-xs text-text-muted uppercase tracking-widest font-bold">
                  <th className="pb-4">Order ID</th>
                  <th className="pb-4">Customer</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-glass-border/50 hover:bg-black/[0.02] transition-colors">
                    <td className="py-4 px-2 text-sm font-mono text-charcoal/70">{order.id.slice(0, 8)}</td>
                    <td className="py-4">
                      <div className="text-sm font-semibold text-charcoal">{order.profiles?.full_name || 'Guest'}</div>
                      <div className="text-xs text-text-muted">{order.profiles?.email}</div>
                      {order.shipping_address?.full_address && (
                        <div className="text-[0.65rem] text-charcoal/40 mt-1 max-w-[200px] truncate">{order.shipping_address.full_address}</div>
                      )}
                    </td>
                    <td className="py-4 text-sm font-bold text-sage-dark">₹{order.total_amount}</td>
                    <td className="py-4 text-sm text-text-muted">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider
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
                        className="text-xs font-semibold border border-glass-border rounded-lg px-3 py-2 bg-warm-white text-charcoal outline-none cursor-pointer focus:border-sage-dark"
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
                    <td colSpan="6" className="py-12 text-center text-text-muted text-sm">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'heatmap' && (
        <div className="bg-white rounded-3xl shadow-lg shadow-black/5 border border-glass-border p-8 animate-fade-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-heading text-2xl">Order Density Map</h2>
            <div className="text-sm font-medium text-text-muted bg-warm-white px-4 py-1.5 rounded-full">
              {heatmapData.length} valid order locations mapped
            </div>
          </div>
          
          <div className="rounded-2xl overflow-hidden border border-glass-border shadow-inner relative">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={5}
                options={{ disableDefaultUI: false }}
              >
                {heatmapData.length > 0 && (
                  <HeatmapLayer
                    data={heatmapData}
                    options={{ radius: 25, opacity: 0.8 }}
                  />
                )}
              </GoogleMap>
            ) : (
              <div className="h-[500px] flex items-center justify-center bg-black/5 animate-pulse">
                <span className="font-medium text-text-muted">Loading Map...</span>
              </div>
            )}
            
            {heatmapData.length === 0 && isLoaded && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white px-6 py-4 rounded-2xl shadow-xl border border-glass-border text-center">
                  <Map className="w-8 h-8 text-text-muted mx-auto mb-2 opacity-50" />
                  <div className="font-semibold text-charcoal">No location data</div>
                  <div className="text-sm text-text-muted mt-1">Orders with map pins will appear here.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'addProduct' && (
        <div className="bg-white rounded-3xl shadow-lg shadow-black/5 border border-glass-border p-8 animate-fade-up max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl mb-8">Add New Product</h2>
          
          {productSuccess && (
            <div className="mb-8 p-4 bg-sage-light/20 border border-sage-dark/20 rounded-xl flex items-center gap-3 text-sage-dark font-medium">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              Product added successfully! It is now live on the store.
            </div>
          )}

          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-2">Product Name</label>
              <input type="text" name="name" value={productData.name} onChange={handleProductInput} className="auth-input" required />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-2">Description</label>
              <textarea name="description" value={productData.description} onChange={handleProductInput} className="auth-input min-h-[100px] py-4" required></textarea>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-2">Category</label>
              <select name="category" value={productData.category} onChange={handleProductInput} className="auth-input cursor-pointer" required>
                <option value="sanitizer">Sanitizer</option>
                <option value="cream">Cream</option>
                <option value="bundle">Bundle</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-2">Stock Quantity</label>
              <input type="number" name="stock" value={productData.stock} onChange={handleProductInput} className="auth-input" required min="0" />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-2">Price (₹)</label>
              <input type="number" name="price" value={productData.price} onChange={handleProductInput} className="auth-input" required min="0" />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-2">Compare At Price (Optional)</label>
              <input type="number" name="compare_price" value={productData.compare_price} onChange={handleProductInput} className="auth-input" min="0" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-2">Image URL</label>
              <input type="url" name="image" value={productData.image} onChange={handleProductInput} className="auth-input" placeholder="https://example.com/image.jpg" required />
              {productData.image && (
                <div className="mt-4 w-24 h-24 rounded-2xl bg-black/5 border border-glass-border overflow-hidden">
                  <img src={productData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="md:col-span-2 pt-4">
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full h-14 justify-center text-lg">
                {isSubmitting ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
