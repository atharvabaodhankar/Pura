import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  ChevronRight, ShieldCheck, MapPin, CreditCard,
  ShoppingBag, ArrowLeft, CheckCircle2, LocateFixed,
  User, Mail, Home, Building2, Hash, Phone, Lock, Truck
} from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

// Floating-label input with leading icon
function Field({ label, icon: Icon, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-[0.7rem] font-bold text-charcoal/50 uppercase tracking-[0.15em]">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30 pointer-events-none" />
        )}
        {children}
      </div>
    </div>
  );
}

const inputCls = (hasIcon = true) =>
  `w-full bg-white border border-glass-border rounded-2xl py-3.5 text-sm text-charcoal placeholder:text-charcoal/30 outline-none transition-all duration-200 focus:border-sage-dark/50 focus:ring-2 focus:ring-sage-dark/10 ${hasIcon ? 'pl-11 pr-4' : 'px-4'}`;

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

  const handleMapClick = (e) => {
    setFormData(prev => ({ ...prev, location: { lat: e.latLng.lat(), lng: e.latLng.lng() } }));
  };

  const locateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setFormData(prev => ({ ...prev, location: { lat: pos.coords.latitude, lng: pos.coords.longitude } })),
        () => alert('Failed to get location.')
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login?redirect=checkout'); return; }
    if (cart.length === 0) return;
    if (!formData.location) { alert('Please pin your exact location on the map.'); return; }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const payload = {
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          variant_id: item.variant_id || null
        })),
        formData
      };

      const res = await fetch('http://localhost:5000/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || 'Failed to create order');

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RbbEPxt1kZYRUw',
        amount: orderData.razorpayOrder.amount,
        currency: 'INR',
        name: 'Pura Skincare',
        description: 'Order Payment',
        order_id: orderData.razorpayOrder.id,
        handler: async (response) => {
          try {
            const verifyRes = await fetch('http://localhost:5000/api/checkout/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
              alert('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            alert('Error verifying payment');
          }
        },
        prefill: { name: formData.fullName, email: formData.email, contact: formData.phone },
        theme: { color: '#4A5D4E' }
      };

      new window.Razorpay(options).open();
    } catch (error) {
      alert(error.message || 'There was an error processing your order.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──
  if (orderSuccess) {
    return (
      <div className="min-h-screen pt-40 px-6 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
        <div className="w-24 h-24 rounded-full bg-sage-light/20 flex items-center justify-center mb-8">
          <CheckCircle2 className="w-12 h-12 text-sage-dark" />
        </div>
        <h1 className="font-heading text-4xl font-semibold mb-4 text-charcoal">Order Confirmed!</h1>
        <p className="text-text-muted mb-8 text-lg">
          Thank you for your order. We're already preparing your package.
        </p>
        <div className="w-full p-6 rounded-3xl bg-white border border-glass-border mb-10 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-text-muted text-sm uppercase tracking-wider font-bold">Order Number</span>
            <span className="font-medium text-charcoal">#PURA-{orderSuccess.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted text-sm uppercase tracking-wider font-bold">Delivery Estimate</span>
            <span className="font-medium text-charcoal">3–5 Business Days</span>
          </div>
        </div>
        <div className="flex flex-col w-full gap-4">
          <Link to="/" className="btn-primary justify-center h-14">Continue Shopping</Link>
          <Link to="/orders" className="text-sage-dark font-semibold hover:underline">View Order History</Link>
        </div>
      </div>
    );
  }

  // ── Empty cart ──
  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-40 px-6 flex flex-col items-center justify-center text-center">
        <div className="bg-sage-light/10 p-8 rounded-full mb-8">
          <ShoppingBag className="w-16 h-16 text-text-muted/40" />
        </div>
        <h2 className="text-3xl font-heading font-semibold text-charcoal mb-4">Your bag is empty</h2>
        <p className="text-text-muted mb-10 max-w-xs mx-auto">Add something to your bag first.</p>
        <Link to="/" className="btn-primary px-10 h-14">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white pt-28 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16">

        {/* ── Page header ── */}
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-text-muted hover:text-charcoal transition-colors text-sm font-medium mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to store
          </Link>
          <h1 className="font-heading text-5xl font-semibold text-charcoal mb-4">Checkout</h1>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-text-muted">Bag</span>
            <ChevronRight className="w-3.5 h-3.5 text-text-muted/50" />
            <span className="text-charcoal font-semibold border-b border-charcoal pb-0.5">Information</span>
            <ChevronRight className="w-3.5 h-3.5 text-text-muted/50" />
            <span className="text-text-muted/50">Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* ── Left: Form ── */}
          <div className="lg:col-span-7 space-y-8">

            {/* Shipping card */}
            <div className="bg-white rounded-[28px] border border-glass-border overflow-hidden">
              {/* Card header */}
              <div className="flex items-center gap-3 px-8 py-5 border-b border-glass-border bg-warm-white/60">
                <div className="w-8 h-8 rounded-full bg-sage-dark/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-sage-dark" />
                </div>
                <div>
                  <div className="font-semibold text-charcoal text-sm">Shipping Details</div>
                  <div className="text-xs text-text-muted">Where should we deliver your order?</div>
                </div>
              </div>

              <form id="checkout-form" onSubmit={handlePlaceOrder} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Full Name" icon={User} className="md:col-span-2">
                  <input
                    type="text" name="fullName" value={formData.fullName}
                    onChange={handleInputChange} placeholder="Atharva Baodhankar"
                    required className={inputCls()}
                  />
                </Field>

                <Field label="Email Address" icon={Mail} className="md:col-span-2">
                  <input
                    type="email" name="email" value={formData.email}
                    readOnly className={`${inputCls()} bg-black/[0.03] cursor-not-allowed text-charcoal/60`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.65rem] font-bold text-sage-dark uppercase tracking-wider bg-sage-dark/10 px-2 py-0.5 rounded-full">Verified</span>
                </Field>

                <Field label="Street Address" icon={Home} className="md:col-span-2">
                  <input
                    type="text" name="address" value={formData.address}
                    onChange={handleInputChange} placeholder="House No, Street, Landmark"
                    required className={inputCls()}
                  />
                </Field>

                <Field label="City" icon={Building2}>
                  <input
                    type="text" name="city" value={formData.city}
                    onChange={handleInputChange} placeholder="Mumbai"
                    required className={inputCls()}
                  />
                </Field>

                <Field label="Postal Code" icon={Hash}>
                  <input
                    type="text" name="postalCode" value={formData.postalCode}
                    onChange={handleInputChange} placeholder="400001"
                    required className={inputCls()}
                  />
                </Field>

                <Field label="Phone Number" icon={Phone} className="md:col-span-2">
                  <input
                    type="tel" name="phone" value={formData.phone}
                    onChange={handleInputChange} placeholder="+91 98765 43210"
                    required className={inputCls()}
                  />
                </Field>

                {/* Map */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-[0.7rem] font-bold text-charcoal/50 uppercase tracking-[0.15em]">Pin Location on Map</div>
                      <div className="text-xs text-text-muted mt-0.5">Click the map or use Locate Me for precise delivery</div>
                    </div>
                    <button
                      type="button" onClick={locateMe}
                      className="flex items-center gap-1.5 text-xs font-bold text-sage-dark bg-sage-dark/8 hover:bg-sage-dark/15 px-3 py-1.5 rounded-full transition-colors border-none cursor-pointer"
                    >
                      <LocateFixed className="w-3.5 h-3.5" /> Locate Me
                    </button>
                  </div>

                  <div className={`rounded-2xl overflow-hidden border-2 transition-colors ${formData.location ? 'border-sage-dark/30' : 'border-glass-border'}`}>
                    {isLoaded ? (
                      <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '240px' }}
                        center={formData.location || { lat: 28.6139, lng: 77.209 }}
                        zoom={formData.location ? 16 : 11}
                        onClick={handleMapClick}
                        options={{ disableDefaultUI: true, zoomControl: true }}
                      >
                        {formData.location && <Marker position={formData.location} />}
                      </GoogleMap>
                    ) : (
                      <div className="h-[240px] bg-black/5 flex items-center justify-center animate-pulse">
                        <span className="text-text-muted text-sm">Loading Map...</span>
                      </div>
                    )}
                  </div>

                  {formData.location ? (
                    <div className="flex items-center gap-2 mt-2.5 text-xs text-sage-dark font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Location pinned — {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-2.5 text-xs text-amber-600 font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      Please pin your exact delivery location
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Payment card */}
            <div className="bg-white rounded-[28px] border border-glass-border overflow-hidden">
              <div className="flex items-center gap-3 px-8 py-5 border-b border-glass-border bg-warm-white/60">
                <div className="w-8 h-8 rounded-full bg-sage-dark/10 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-sage-dark" />
                </div>
                <div>
                  <div className="font-semibold text-charcoal text-sm">Payment Method</div>
                  <div className="text-xs text-text-muted">Secure payment via Razorpay</div>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-4 p-5 rounded-2xl border-2 border-sage-dark/20 bg-sage-dark/[0.03]">
                  <div className="w-5 h-5 rounded-full border-[3px] border-sage-dark flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-sage-dark" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-charcoal text-sm">Razorpay — UPI / Cards / Netbanking</div>
                    <div className="text-xs text-text-muted mt-0.5">Pay securely with any method via Razorpay</div>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-sage-dark shrink-0" />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit" form="checkout-form" disabled={loading}
                className="btn-primary w-full h-14 text-base justify-center gap-3 shadow-lg shadow-sage-dark/15 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cream/40 border-t-cream rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Place Order · ₹{total}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-text-muted/60">
                <ShieldCheck className="w-3.5 h-3.5" />
                256-bit SSL encrypted · Secured by Razorpay
              </div>
            </div>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-white rounded-[28px] border border-glass-border overflow-hidden">
              <div className="px-7 py-5 border-b border-glass-border bg-warm-white/60">
                <div className="text-[0.7rem] font-bold text-charcoal/50 uppercase tracking-[0.2em]">Order Summary</div>
              </div>

              {/* Items */}
              <div className="px-7 py-5 space-y-4 max-h-[320px] overflow-y-auto">
                {cart.map(item => {
                  const name  = item.products?.name   || item.name  || 'Product';
                  const image = item.products?.images?.[0] || item.image || '';
                  const price = item.products?.price  || item.price || 0;
                  return (
                    <div key={`${item.id}-${item.variant_id}`} className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-2xl bg-warm-white border border-glass-border flex items-center justify-center p-2 shrink-0">
                        <img src={image} alt={name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-charcoal text-sm truncate">{name}</div>
                        {item.product_variants?.variant_name && (
                          <div className="text-xs text-sage-dark font-medium mt-0.5">{item.product_variants.variant_name}</div>
                        )}
                        <div className="text-xs text-text-muted mt-0.5">Qty {item.quantity}</div>
                      </div>
                      <div className="text-sm font-bold text-charcoal shrink-0">₹{price * item.quantity}</div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="px-7 py-5 border-t border-glass-border space-y-3">
                <div className="flex justify-between text-sm text-text-muted">
                  <span>Subtotal</span>
                  <span className="font-medium text-charcoal">₹{total}</span>
                </div>
                <div className="flex justify-between text-sm text-text-muted">
                  <span>Shipping</span>
                  <span className="font-bold text-sage-dark flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" /> Free
                  </span>
                </div>
                <div className="flex justify-between text-sm text-text-muted">
                  <span>Taxes</span>
                  <span className="font-medium text-charcoal">Included</span>
                </div>
                <div className="flex justify-between text-base font-bold text-charcoal pt-3 border-t border-glass-border">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Trust badge */}
              <div className="px-7 py-4 border-t border-glass-border bg-warm-white/40 flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-sage-dark shrink-0" />
                <span className="text-xs text-text-muted">Safe checkout. Pura guarantees your security.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
