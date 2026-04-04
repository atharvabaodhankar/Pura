import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFadeUp from '../hooks/useFadeUp';
import { useCartStore } from '../stores/cartStore';
import { Leaf, Droplets, FlaskConical, Flower2, Sparkles, Layers, Sun, Dna } from 'lucide-react';

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const products = [
  {
    id: 'b2a95c43-982e-4b44-9366-0746e537e5e1', 
    slug: 'aloe-green-tea-sanitizer',
    cat: 'sanitizer', tag: 'Bestseller', tagColor: null,
    img: '/products/san-aloe.png', imgBg: '#eef7ee',
    category: 'Hand Sanitizer', name: 'Aloe & Green Tea',
    desc: 'Kills 99.9% germs with a refreshing burst of green tea and soothing aloe vera extract.',
    ingredients: [
      { Icon: Leaf,         name: 'Aloe Vera' },
      { Icon: FlaskConical, name: 'Green Tea' },
      { Icon: Droplets,     name: 'Ethanol 70%' },
    ],
    variants: [
      { id: 'some-variant-id-1', color: '#7ab87f', title: 'Green Tea', active: true },
      { id: 'some-variant-id-2', color: '#a8c5aa', title: 'Mint' },
      { id: 'some-variant-id-3', color: '#c4dfc4', title: 'Cucumber' },
    ],
    price: 149, priceDisplay: '₹149', unit: '/ 100ml',
  },
  {
    id: 'd74652c7-0e6e-4e6f-8a48-a0c5cff6f759', 
    slug: 'lavender-rose-sanitizer',
    cat: 'sanitizer', tag: null,
    img: '/products/san-lavender.png', imgBg: '#f4f0fc',
    category: 'Hand Sanitizer', name: 'Lavender & Rose',
    desc: 'A calming floral blend that sanitizes deeply while leaving hands smelling like a garden.',
    ingredients: [
      { Icon: Flower2,  name: 'Lavender Oil' },
      { Icon: Sparkles, name: 'Rose Water' },
      { Icon: Droplets, name: 'Ethanol 70%' },
    ],
    variants: [
      { color: '#9b7ed4', title: 'Lavender', active: true },
      { color: '#e8b0c4', title: 'Rose' },
    ],
    price: 149, priceDisplay: '₹149', unit: '/ 100ml',
  },
  {
    id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', 
    slug: 'citrus-vitamin-e-sanitizer',
    cat: 'sanitizer', tag: 'New', tagColor: null,
    img: '/products/san-citrus.png', imgBg: '#fff5ed',
    category: 'Hand Sanitizer', name: 'Citrus & Vitamin E',
    desc: 'Zesty citrus energy paired with Vitamin E — protection that nourishes as it cleanses.',
    ingredients: [
      { Icon: Sun,      name: 'Citrus Extract' },
      { Icon: Sparkles, name: 'Vitamin E' },
      { Icon: Droplets, name: 'Ethanol 70%' },
    ],
    variants: [
      { color: '#e8944a', title: 'Citrus', active: true },
      { color: '#f0c060', title: 'Lemon' },
      { color: '#f4a830', title: 'Orange' },
    ],
    price: 169, priceDisplay: '₹169', unit: '/ 100ml',
  },
  {
    id: 'e1d9afbb-8c34-4b41-b8d5-115f2122c262', 
    slug: 'shea-raw-honey-cream',
    cat: 'cream', tag: 'Top Rated', tagColor: null,
    img: '/products/cream-shea.png', imgBg: '#fdf6ee',
    category: 'Moisturizing Hand Cream', name: 'Shea & Raw Honey',
    desc: 'Deep moisturizing formula with shea butter and raw honey. Repairs dry, cracked skin overnight.',
    ingredients: [
      { Icon: Layers,   name: 'Shea Butter' },
      { Icon: Sparkles, name: 'Raw Honey' },
      { Icon: Leaf,     name: 'Aloe Vera' },
    ],
    variants: [
      { color: '#e8b88a', title: 'Original', active: true },
      { color: '#f4d4a4', title: 'Light' },
    ],
    price: 199, priceDisplay: '₹199', unit: '/ 75ml',
  },
  {
    id: '8765e9fc-910f-48d6-9e66-6b2cbb13955b', 
    slug: 'collagen-hyaluronic-cream',
    cat: 'cream', tag: null,
    img: '/products/cream-collagen.png', imgBg: '#eef8fb',
    category: 'Moisturizing Hand Cream', name: 'Collagen & Hyaluronic',
    desc: 'Advanced anti-aging formula with collagen peptides and hyaluronic acid for plump, youthful hands.',
    ingredients: [
      { Icon: Dna,      name: 'Collagen Peptides' },
      { Icon: Droplets, name: 'Hyaluronic Acid' },
      { Icon: Sun,      name: 'Vitamin C' },
    ],
    variants: [
      { color: '#70c8e0', title: 'Classic', active: true },
      { color: '#a8e0f0', title: 'Light' },
    ],
    price: 249, priceDisplay: '₹249', unit: '/ 75ml',
  },
  {
    id: '7b3e2189-cdb2-4d51-87ab-8f9f72b7a428', 
    slug: 'rose-argan-oil-cream',
    cat: 'cream', tag: null,
    img: '/products/cream-rose.png', imgBg: '#fff4f6',
    category: 'Moisturizing Hand Cream', name: 'Rose & Argan Oil',
    desc: 'Luxuriously rich formula with Moroccan argan oil and rose extract. Intensely nourishing for very dry hands.',
    ingredients: [
      { Icon: Flower2, name: 'Rose Extract' },
      { Icon: Layers,  name: 'Argan Oil' },
      { Icon: Sparkles,name: 'Jojoba Oil' },
    ],
    variants: [
      { color: '#f09098', title: 'Rose', active: true },
      { color: '#c4a882', title: 'Argan' },
    ],
    price: 229, priceDisplay: '₹229', unit: '/ 75ml',
  },
  {
    id: '2cb8d0b2-7bc2-4afc-a2b8-935dfba03337', 
    slug: 'clean-hands-duo',
    cat: 'bundle', tag: 'Save 20%', tagColor: 'var(--color-earth-dark)',
    img: '/products/bundle-duo.png', imgBg: '#f4faf4',
    category: 'Bundle · Best Value', name: 'The Clean Hands Duo',
    desc: 'Sanitizer + Moisturizing Cream together — sanitize, then restore. The perfect daily hand care ritual.',
    ingredients: [],
    variants: [],
    price: 299, priceDisplay: '₹299', unit: null, oldPrice: '₹348',
  },
  {
    id: '5bdf8e9d-c5f1-4df0-b8d7-5674c935ee52', 
    slug: 'family-care-trio',
    cat: 'bundle', tag: 'Save 25%', tagColor: 'var(--color-earth-dark)',
    img: '/products/bundle-trio.png', imgBg: '#faf4fc',
    category: 'Bundle · Family Pack', name: 'Family Care Trio',
    desc: '3 products: Green Tea Sanitizer + Lavender Sanitizer + Shea Hand Cream. Everything a family needs.',
    ingredients: [],
    variants: [],
    price: 399, priceDisplay: '₹399', unit: null, oldPrice: '₹497',
  },
];

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'sanitizer', label: 'Sanitizers' },
  { key: 'cream', label: 'Hand Creams' },
  { key: 'bundle', label: 'Bundles' },
];

function ProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false);
  const cardRef = useRef(null);
  const addToCart = useCartStore(state => state.addToCart);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdded(true);
    
    // Format product for cart store
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      images: [product.img]
    }, null, 1);
    
    onAddToCart(product.name);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-12px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = '';
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      ref={cardRef}
      className="relative overflow-hidden cursor-pointer animate-fade-card block no-underline"
      style={{
        background: 'var(--color-glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--color-glass-border)',
        borderRadius: '28px',
        transition: 'transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s',
        transformStyle: 'preserve-3d',
        perspective: 800,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Shine overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-1"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 50%)',
          borderRadius: '28px',
        }}
      />

      {/* Image */}
      <div
        className="h-60 flex items-center justify-center relative overflow-hidden"
        style={{ background: product.imgBg }}
      >
        {product.tag && (
          <div
            className="absolute top-4 right-4 z-2 text-white text-[0.65rem] tracking-[0.1em] uppercase px-3 py-1 rounded-[2rem]"
            style={{ background: product.tagColor || 'var(--color-sage-dark)' }}
          >
            {product.tag}
          </div>
        )}
        <img
          src={product.img}
          alt={product.name}
          className="w-[80%] h-[80%] object-contain transition-transform duration-500"
          style={{
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
            transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)',
          }}
        />
      </div>

      {/* Info */}
      <div className="p-6 relative z-2">
        <div className="text-[0.7rem] tracking-[0.15em] uppercase text-sage-dark mb-1">
          {product.category}
        </div>
        <div className="font-heading text-2xl font-semibold text-charcoal mb-1 leading-[1.2]">
          {product.name}
        </div>
        <div className="text-[0.82rem] text-text-muted leading-[1.6] mb-5">
          {product.desc}
        </div>

        {/* Ingredient tags */}
        {product.ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.ingredients.map((ing, i) => {
              const Icon = ing.Icon;
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[0.68rem] tracking-[0.04em] font-medium px-2.5 py-1 rounded-[2rem] transition-all duration-200 hover:translate-y-[-1px]"
                  style={{
                    background: 'rgba(122,158,126,0.12)',
                    border: '1px solid rgba(122,158,126,0.25)',
                    color: 'var(--color-sage-dark)',
                  }}
                >
                  {Icon && <Icon className="w-3 h-3" />}
                  {ing.name}
                </span>
              );
            })}
          </div>
        )}

        {/* Variants */}
        {product.variants.length > 0 && (
          <div className="flex gap-1.5 mb-5">
            {product.variants.map((v, i) => (
              <div
                key={i}
                className="w-[22px] h-[22px] rounded-full transition-all duration-200 hover:scale-[1.15]"
                title={v.title}
                style={{
                  background: v.color,
                  border: v.active ? '2px solid var(--color-charcoal)' : '2px solid transparent',
                  transform: v.active ? 'scale(1.15)' : undefined,
                }}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="font-heading text-2xl font-semibold text-charcoal">
            {product.priceDisplay}{' '}
            {product.unit && <small className="font-body text-[0.7rem] text-text-muted font-normal">{product.unit}</small>}
            {product.oldPrice && (
              <small className="font-body text-[0.7rem] text-text-muted font-normal">
                {' '}<s className="opacity-50">{product.oldPrice}</s>
              </small>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="w-11 h-11 rounded-full flex items-center justify-center text-cream border-none cursor-pointer transition-all duration-300 shrink-0 relative z-10"
            style={{
              background: added ? 'var(--color-sage-dark)' : 'var(--color-charcoal)',
            }}
          >
            {added ? <CheckIcon /> : <PlusIcon />}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function Products({ onAddToCart }) {
  const [filter, setFilter] = useState('all');
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const headerRef = useFadeUp();

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(async data => {
        // Fetch variants for all products in parallel
        const withVariants = await Promise.all(
          data.map(async p => {
            let variants = [];
            try {
              const vRes = await fetch(`http://localhost:5000/api/products/${p.id}/variants`);
              if (vRes.ok) variants = await vRes.json();
            } catch (_) {}

            return {
              id: p.id,
              slug: p.slug,
              cat: p.category,
              name: p.name,
              desc: p.description,
              price: p.price,
              priceDisplay: `₹${p.price}`,
              oldPrice: p.compare_price ? `₹${p.compare_price}` : null,
              img: p.images && p.images.length > 0 ? p.images[0] : '',
              imgBg: '#fdf6ee',
              ingredients: [],
              variants: variants.map((v, i) => ({
                id: v.id,
                color: v.color_hex || '#ccc',
                title: v.variant_name,
                size_ml: v.size_ml,
                active: i === 0,
              })),
              category: p.category.charAt(0).toUpperCase() + p.category.slice(1),
              tags: p.tags || [],
            };
          })
        );
        setDbProducts(withVariants);
      })
      .catch(err => console.error("Error fetching products", err))
      .finally(() => setLoading(false));
  }, []);

  const dataToDisplay = dbProducts;
  const filtered = filter === 'all' ? dataToDisplay : dataToDisplay.filter((p) => p.cat === filter);

  return (
    <section id="products" className="py-32 px-16 max-w-[1400px] mx-auto relative z-1 max-md:py-20 max-md:px-6">
      <div ref={headerRef} className="fade-up flex justify-between items-end mb-16 max-md:flex-col max-md:items-start max-md:gap-6">
        <div>
          <div className="section-label">Our Collection</div>
          <h2 className="section-heading">
            Made for <em>every hand</em><br />in your home
          </h2>
        </div>
        <div
          className="flex gap-2 p-1.5 rounded-[2rem]"
          style={{
            background: 'rgba(122,158,126,0.08)',
            border: '1px solid var(--color-glass-border)',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-5 py-2 rounded-[2rem] border-none font-body text-[0.82rem] tracking-[0.06em] cursor-pointer transition-all duration-300 ${
                filter === tab.key
                  ? 'bg-charcoal text-cream'
                  : 'bg-transparent text-text-muted hover:text-charcoal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
         <div className="text-center py-20 text-text-muted">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
}
