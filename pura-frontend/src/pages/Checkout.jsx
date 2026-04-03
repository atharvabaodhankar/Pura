import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ChevronRight, ShieldCheck, MapPin, CreditCard, ShoppingBag, ArrowLeft, CheckCircle2, LocateFixed } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCartStore();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    location: null
  });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const mapContainerStyle = {
    width: '100%',
    height: '250px'
  };

  const defaultCenter = {
    lat: 28.6139,
    lng: 77.2090 // New Delhi default
  };

  const handleMapClick = (e) => {
    setFormData(prev => ({
      ...prev,
      location: { lat: e.latLng.lat(), lng: e.latLng.lng() }
    }));
  };

  const locateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          location: { lat: position.coords.latitude, lng: position.coords.longitude }
        }));
      }, () => {
        alert("Failed to get location.");
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=checkout');
      return;
    }

    if (cart.length === 0) return;
    
    if (!formData.location) {
      alert("Please pin your exact location on the map.");
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const payload = {
        items: cart.map(item => ({
          product_id: item.id || item.product_id, // accommodate both cart structures
          quantity: item.quantity,
          variant_id: item.variant_id
        })),
        formData
      };

      const res = await fetch('http://localhost:5000/api/checkout/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || 'Failed to create order');

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RbbEPxt1kZYRUw', 
        amount: orderData.razorpayOrder.amount, // in paise
        currency: "INR",
        name: "Pura Skincare",
        description: "Order Payment",
        order_id: orderData.razorpayOrder.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('http://localhost:5000/api/checkout/verify', {
              method: 'POST',
              headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                supabaseOrderId: orderData.supabaseOrderId
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyRes.ok && verifyData.success) {
              await clearCart();
              setOrderSuccess(orderData.supabaseOrderId);
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch(err) {
            console.error("Verification error:", err);
            alert("Error verifying payment");
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#4A5D4E"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.message || 'There was an error processing your order.');
    } finally {
      setLoading(false); // Only resets when modal is closed or errored
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen pt-40 px-6 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
        <div className="w-24 h-24 rounded-full bg-sage-light/20 flex items-center justify-center mb-8 animate-bounce-subtle">
          <CheckCircle2 className="w-12 h-12 text-sage-dark" />
        </div>
        <h1 className="font-heading text-4xl font-semibold mb-4 text-charcoal">Order Confirmed!</h1>
        <p className="text-text-muted mb-8 text-lg">
          Thank you for your order. We've received it and our team is already working on preparing your package.
        </p>
        <div className="w-full p-6 rounded-3xl bg-white border border-glass-border mb-10 text-left">
          <div className="flex justify-between mb-2">
            <span className="text-text-muted text-sm uppercase tracking-wider font-bold">Order Number</span>
            <span className="font-medium text-charcoal">#PURA-{orderSuccess.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted text-sm uppercase tracking-wider font-bold">Delivery Estimate</span>
            <span className="font-medium text-charcoal">3-5 Business Days</span>
          </div>
        </div>
        <div className="flex flex-col w-full gap-4">
          <Link to="/" className="btn-primary justify-center h-14">Continue Shopping</Link>
          <Link to="/orders" className="text-sage-dark font-semibold hover:underline">View Order History</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-40 px-6 flex flex-col items-center justify-center text-center">
        <div className="bg-sage-light/10 p-8 rounded-full mb-8">
          <ShoppingBag className="w-16 h-16 text-text-muted/40" />
        </div>
        <h2 className="text-3xl font-heading font-semibold text-charcoal mb-4">Your bag is empty</h2>
        <p className="text-text-muted mb-10 max-w-xs mx-auto">Looks like you haven't added anything to your bag yet.</p>
        <Link to="/" className="btn-primary px-10 h-14">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white pt-32 pb-20 px-6 md:px-12 lg:px-16">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-12">
          <h1 className="font-heading text-5xl font-semibold text-charcoal mb-4">Checkout</h1>
          <div className="flex items-center gap-2 text-text-muted font-medium">
            <span>Bag</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-charcoal underline underline-offset-8">Information</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span className="opacity-50">Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left: Information Form */}
          <div className="lg:col-span-7 space-y-12">
            <section className="fade-up visible">
              <h2 className="text-xl font-semibold mb-8 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-sage-dark" />
                Shipping Details
              </h2>
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-charcoal/60 uppercase tracking-widest mb-3">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="auth-input" 
                    placeholder="Enter your full name" 
                    required 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-charcoal/60 uppercase tracking-widest mb-3">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="auth-input opacity-70 bg-black/5" 
                    placeholder="email@example.com" 
                    readOnly 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-charcoal/60 uppercase tracking-widest mb-3">Shipping Address</label>
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="auth-input" 
                    placeholder="House No, Street, Landmark" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-charcoal/60 uppercase tracking-widest mb-3">City</label>
                  <input 
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="auth-input" 
                    placeholder="City name" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-charcoal/60 uppercase tracking-widest mb-3">Postal Code</label>
                  <input 
                    type="text" 
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="auth-input" 
                    placeholder="6-digit ZIP" 
                    required 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-charcoal/60 uppercase tracking-widest mb-3">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="auth-input" 
                    placeholder="+91 XXXXX XXXXX" 
                    required 
                  />
                </div>
                <div className="md:col-span-2 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-bold text-charcoal/60 uppercase tracking-widest">Pin Location on Map</label>
                    <button type="button" onClick={locateMe} className="flex items-center gap-2 text-xs font-bold text-sage-dark hover:underline bg-transparent border-none cursor-pointer p-0">
                      <LocateFixed className="w-4 h-4" /> Locate Me
                    </button>
                  </div>
                  {isLoaded ? (
                    <div className="rounded-2xl overflow-hidden border border-glass-border shadow-inner">
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={formData.location || defaultCenter}
                        zoom={formData.location ? 16 : 11}
                        onClick={handleMapClick}
                        options={{ disableDefaultUI: true, zoomControl: true }}
                      >
                        {formData.location && <Marker position={formData.location} />}
                      </GoogleMap>
                    </div>
                  ) : (
                    <div className="h-[250px] bg-black/5 rounded-2xl flex items-center justify-center animate-pulse border border-glass-border">
                      <span className="text-text-muted text-sm font-medium">Loading Map...</span>
                    </div>
                  )}
                  {!formData.location && <p className="text-xs text-amber-600 font-medium mt-2">Please pin your exact location on the map.</p>}
                </div>
              </form>
            </section>

            <section className="fade-up visible" style={{ transitionDelay: '0.1s' }}>
              <h2 className="text-xl font-semibold mb-8 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-sage-dark" />
                Payment Method
              </h2>
              <div 
                className="p-6 rounded-3xl border-2 border-sage-dark bg-sage-light/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border-4 border-sage-dark flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-sage-dark" />
                  </div>
                  <div>
                    <span className="font-bold block">Cash on Delivery</span>
                    <span className="text-sm text-text-muted">Pay with cash when your items arrive</span>
                  </div>
                </div>
                <ShieldCheck className="w-6 h-6 text-sage-dark" />
              </div>
            </section>

            <div className="pt-8 border-t border-glass-border">
              <button 
                type="submit" 
                form="checkout-form"
                disabled={loading}
                className="btn-primary w-full h-16 text-lg justify-center gap-4 shadow-xl shadow-sage-dark/20"
              >
                {loading ? 'Processing...' : `Place Order · ₹${total}`}
                <ChevronRight className="w-5 h-5" />
              </button>
              <p className="text-center text-xs text-text-muted mt-6 uppercase tracking-[0.2em] font-medium opacity-50">
                Encrypted & Secure Transaction
              </p>
            </div>
          </div>

          {/* Right: Summary Box */}
          <div className="lg:col-span-5 sticky top-32">
            <div className="glass shadow-xl p-8 rounded-[40px] border-glass-border">
              <h3 className="text-sm font-bold text-charcoal/60 uppercase tracking-[0.2em] mb-8">Order Summary</h3>
              
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={`${item.id}-${item.variant_id}`} className="flex gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-black/5 flex items-center justify-center p-2 shrink-0 border border-glass-border">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
                      <h4 className="font-semibold text-charcoal truncate">{item.name}</h4>
                      <div className="text-xs text-text-muted uppercase tracking-wider font-medium">Qty: {item.quantity}</div>
                      <div className="text-sm font-bold text-sage-dark">₹{item.price * item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-glass-border">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{total}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Shipping</span>
                  <span className="text-sage-dark font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Taxes (Included)</span>
                  <span className="font-medium">₹0</span>
                </div>
                <div className="flex justify-between text-xl font-semibold text-charcoal pt-4 border-t border-glass-border">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-charcoal/5 rounded-2xl inline-flex items-center gap-3 w-full">
                <ShieldCheck className="w-5 h-5 text-sage-dark" />
                <span className="text-xs font-medium text-text-muted">
                  Safe Checkout. Pura Guarantees your security.
                </span>
              </div>
            </div>

            <Link 
              to="/" 
              className="flex items-center justify-center gap-2 text-text-muted hover:text-charcoal transition-colors mt-8 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Bag
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
