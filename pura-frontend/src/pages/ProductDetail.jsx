import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ShoppingBag, Star, ShieldCheck, Truck, RefreshCw, Send, CheckCircle2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

function StarRating({ value, onChange, size = 'md' }) {
  const [hovered, setHovered] = useState(0);
  const sz = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange && onChange(n)}
          onMouseEnter={() => onChange && setHovered(n)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={`border-none bg-transparent p-0 ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <Star
            className={`${sz} transition-colors ${
              n <= (hovered || value)
                ? 'fill-sage-dark text-sage-dark'
                : 'text-charcoal/20'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const initials = review.profiles?.full_name
    ? review.profiles.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  const date = new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="flex flex-col gap-3 p-5 rounded-2xl border border-glass-border bg-white/40 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sage-dark/10 flex items-center justify-center text-sage-dark text-sm font-bold">
            {initials}
          </div>
          <div>
            <div className="text-sm font-semibold text-charcoal">{review.profiles?.full_name || 'Customer'}</div>
            <div className="text-xs text-text-muted">{date}</div>
          </div>
        </div>
        <StarRating value={review.rating} size="sm" />
      </div>
      {review.comment && (
        <p className="text-sm text-text-muted leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
}

function ReviewForm({ productId, onSubmitted }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { setError('Please select a star rating.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${API}/reviews/product/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ rating, comment })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to submit review.'); return; }
      setSuccess(true);
      onSubmitted();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center gap-3 p-5 rounded-2xl border border-sage-dark/20 bg-sage-dark/5 text-sage-dark">
        <CheckCircle2 className="w-5 h-5 shrink-0" />
        <p className="text-sm font-medium">Thanks for your review! It'll appear after approval.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 rounded-2xl border border-glass-border bg-white/40 backdrop-blur-sm">
      <h4 className="text-sm font-bold uppercase tracking-widest text-charcoal/60">Write a Review</h4>
      <div className="flex flex-col gap-1">
        <span className="text-sm text-text-muted">Your rating</span>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Share your experience (optional)..."
        rows={3}
        className="w-full px-4 py-3 rounded-xl border border-glass-border bg-white/60 text-sm text-charcoal placeholder:text-text-muted resize-none focus:outline-none focus:border-sage-dark/40 transition-colors"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary self-start gap-2 text-sm py-2.5 px-5"
      >
        <Send className="w-4 h-4" />
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const addToCart = useCartStore(state => state.addToCart);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${API}/products/${slug}`);
        const productData = await res.json();
        if (!res.ok || !productData) { navigate('/'); return; }

        const vRes = await fetch(`${API}/products/${productData.id}/variants`);
        let variantsData = [];
        if (vRes.ok) variantsData = await vRes.json();

        setProduct(productData);
        setVariants(variantsData || []);
        if (variantsData?.length > 0) setSelectedVariant(variantsData[0]);
        setLoading(false);

        fetchReviews(productData.id);
      } catch (err) {
        navigate('/');
      }
    }
    fetchProduct();
  }, [slug, navigate]);

  const fetchReviews = async (productId) => {
    setReviewsLoading(true);
    try {
      const res = await fetch(`${API}/reviews/product/${productId}`);
      if (res.ok) setReviews(await res.json());

      if (user) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const mRes = await fetch(`${API}/reviews/product/${productId}/mine`, {
            headers: { 'Authorization': `Bearer ${session.access_token}` }
          });
          if (mRes.ok) setMyReview(await mRes.json());
        }
      }
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(product, selectedVariant?.id, quantity);
    setTimeout(() => setAdding(false), 1000);
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loading) return (
    <div className="min-h-screen pt-32 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sage-dark" />
    </div>
  );

  return (
    <div className="min-h-screen bg-warm-white pt-32 pb-20 px-6 md:px-12 lg:px-16 overflow-x-hidden">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-muted hover:text-charcoal transition-colors mb-12 border-none bg-transparent cursor-pointer font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to collection
      </button>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: Product Image */}
        <div className="relative fade-up visible">
          <div
            className="rounded-[40px] aspect-square flex items-center justify-center overflow-hidden border border-glass-border shadow-sm p-12"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain drop-shadow-2xl animate-float-slow"
            />
          </div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-sage-light/20 blur-[60px] rounded-full animate-morph-blob -z-10" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cream/30 blur-[60px] rounded-full animate-morph-blob -z-10" style={{ animationDelay: '-3s' }} />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col gap-8 fade-up visible" style={{ transitionDelay: '0.1s' }}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="section-label m-0">{product.category}</span>
              {product.tags?.map(tag => (
                <span key={tag} className="text-[0.65rem] px-2 py-0.5 bg-sage-dark/10 text-sage-dark rounded-full font-bold uppercase tracking-wider">{tag}</span>
              ))}
            </div>
            <h1 className="font-heading text-5xl font-semibold text-charcoal mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <StarRating value={avgRating ? Math.round(avgRating) : 4} size="sm" />
              <span className="text-sm font-medium text-charcoal">{avgRating || '—'}</span>
              <span className="text-text-muted text-sm border-l border-glass-border pl-4">
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-heading font-semibold text-charcoal">₹{product.price}</span>
            {product.compare_price && (
              <s className="text-xl text-text-muted opacity-50">₹{product.compare_price}</s>
            )}
          </div>

          <p className="text-text-muted leading-relaxed text-lg">{product.description}</p>

          {/* Variants */}
          {variants.length > 0 && (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-charcoal/60">Choose Variant</h4>
              <div className="flex flex-wrap gap-3">
                {variants.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      selectedVariant?.id === variant.id
                        ? 'border-sage-dark bg-sage-dark/5 shadow-sm'
                        : 'border-glass-border bg-white hover:border-charcoal/20'
                    }`}
                  >
                    {variant.color_hex && (
                      <div className="w-4 h-4 rounded-full border border-black/10" style={{ background: variant.color_hex }} />
                    )}
                    <span className="text-sm font-medium">
                      {variant.variant_name}{variant.size_ml ? ` (${variant.size_ml}ml)` : ''}
                    </span>
                    {variant.stock === 0 && (
                      <span className="text-[0.6rem] text-red-400 font-semibold uppercase">Out of stock</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex border border-glass-border rounded-full overflow-hidden h-14 bg-white/50 backdrop-blur-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-14 border-none bg-transparent cursor-pointer hover:bg-black/5 text-charcoal text-xl font-light transition-colors"
              >−</button>
              <span className="w-12 flex items-center justify-center text-lg font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-14 border-none bg-transparent cursor-pointer hover:bg-black/5 text-charcoal text-xl font-light transition-colors"
              >+</button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={adding || (selectedVariant && selectedVariant.stock === 0)}
              className="btn-primary flex-1 h-14 justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-5 h-5" />
              {adding ? 'Adding...' : selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 mt-4 border-t border-glass-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sage-light/20 flex items-center justify-center text-sage-dark">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-charcoal/40 uppercase tracking-tighter">Safe & Natural</div>
                <div className="text-sm font-medium">Eco Friendly</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cream/30 flex items-center justify-center text-sage-dark">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-charcoal/40 uppercase tracking-tighter">Fast Delivery</div>
                <div className="text-sm font-medium">Pan India</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sage-dark/10 flex items-center justify-center text-sage-dark">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-charcoal/40 uppercase tracking-tighter">15-Day Return</div>
                <div className="text-sm font-medium">Easy Swap</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Reviews Section ── */}
      <div className="max-w-[1200px] mx-auto mt-24">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="section-label">Customer Feedback</div>
            <h2 className="section-heading">
              What people <em>are saying</em>
            </h2>
          </div>
          {avgRating && (
            <div className="flex items-center gap-4 p-5 rounded-2xl border border-glass-border bg-white/40 backdrop-blur-sm">
              <span className="font-heading text-5xl font-semibold text-charcoal">{avgRating}</span>
              <div className="flex flex-col gap-1">
                <StarRating value={Math.round(avgRating)} size="sm" />
                <span className="text-xs text-text-muted">{reviews.length} verified reviews</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews list */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {reviewsLoading ? (
              <div className="text-center py-12 text-text-muted text-sm">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 text-text-muted text-sm border border-glass-border rounded-2xl">
                No reviews yet. Be the first to share your experience!
              </div>
            ) : (
              reviews.map(r => <ReviewCard key={r.id} review={r} />)
            )}
          </div>

          {/* Write a review */}
          <div className="flex flex-col gap-4">
            {!user ? (
              <div className="p-5 rounded-2xl border border-glass-border bg-white/40 text-sm text-text-muted text-center">
                <a href="/login" className="text-sage-dark font-semibold hover:underline">Sign in</a> to leave a review.
              </div>
            ) : myReview ? (
              <div className="flex items-center gap-3 p-5 rounded-2xl border border-sage-dark/20 bg-sage-dark/5 text-sage-dark">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">You've already reviewed this product.</p>
              </div>
            ) : (
              <ReviewForm
                productId={product.id}
                onSubmitted={() => fetchReviews(product.id)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
