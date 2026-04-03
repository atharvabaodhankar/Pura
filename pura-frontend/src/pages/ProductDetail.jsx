import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../stores/cartStore';
import { ArrowLeft, ShoppingBag, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  
  const addToCart = useCartStore(state => state.addToCart);

  useEffect(() => {
    async function fetchProduct() {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (productError || !productData) {
        console.error('Error fetching product:', productError);
        navigate('/');
        return;
      }
      
      const { data: variantsData } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productData.id);
        
      setProduct(productData);
      setVariants(variantsData || []);
      if (variantsData?.length > 0) {
        setSelectedVariant(variantsData[0]);
      }
      setLoading(false);
    }
    
    fetchProduct();
  }, [slug, navigate]);

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(product, selectedVariant?.id, quantity);
    setTimeout(() => setAdding(false), 1000);
  };

  if (loading) return (
    <div className="min-h-screen pt-32 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sage-dark"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-warm-white pt-32 pb-20 px-6 md:px-12 lg:px-16 overflow-x-hidden">
      {/* Back Button */}
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
          
          {/* Ambient Blobs */}
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
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-sage-dark text-sage-dark' : 'text-charcoal/20'}`} />
                ))}
                <span className="text-sm font-medium text-charcoal ml-1">4.8</span>
              </div>
              <span className="text-text-muted text-sm border-l border-glass-border pl-4">124 Reviews</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-heading font-semibold text-charcoal">₹{product.price}</span>
            {product.compare_price && (
              <s className="text-xl text-text-muted opacity-50">₹{product.compare_price}</s>
            )}
          </div>

          <p className="text-text-muted leading-relaxed text-lg">
            {product.description}
          </p>

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
                    <div className="w-4 h-4 rounded-full" style={{ background: variant.color_hex }} />
                    <span className="text-sm font-medium">{variant.variant_name} {variant.size_ml && `(${variant.size_ml}ml)`}</span>
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
              >
                −
              </button>
              <span className="w-12 flex items-center justify-center text-lg font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-14 border-none bg-transparent cursor-pointer hover:bg-black/5 text-charcoal text-xl font-light transition-colors"
              >
                +
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={adding}
              className="btn-primary flex-1 h-14 justify-center gap-3 text-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              {adding ? 'Adding...' : 'Add to Bag'}
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
    </div>
  );
}
