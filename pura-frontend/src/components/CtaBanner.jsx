import useFadeUp from '../hooks/useFadeUp';

export default function CtaBanner() {
  const ref = useFadeUp();

  return (
    <div
      ref={ref}
      id="cta-banner"
      className="fade-up mx-16 mb-24 rounded-[32px] py-20 px-20 flex items-center justify-between relative overflow-hidden gap-8 max-md:mx-6 max-md:mb-16 max-md:p-12 max-md:flex-col"
      style={{ background: 'var(--color-charcoal)' }}
    >
      {/* Ambient blobs */}
      <div className="absolute pointer-events-none" style={{ width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(122,158,126,0.4) 0%, transparent 70%)', top: -200, right: -100 }} />
      <div className="absolute pointer-events-none" style={{ width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,168,130,0.2) 0%, transparent 70%)', bottom: -100, left: 300 }} />

      {/* Text */}
      <div className="relative z-2">
        <div className="text-[0.72rem] tracking-[0.2em] uppercase text-sage-light mb-3">Join 50,000+ families</div>
        <h2 className="font-heading text-[clamp(2rem,3.5vw,3rem)] font-light text-cream leading-[1.15] mb-2">
          Start your <em className="italic text-sage-light">Pura</em><br />ritual today
        </h2>
        <p className="text-[0.9rem] text-cream/50 font-light">First order? Get 15% off + free shipping on orders above ₹299</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 relative z-2 min-w-[300px] max-md:min-w-full max-md:w-full">
        <div
          className="flex rounded-[3rem] overflow-hidden"
          style={{
            background: 'rgba(245,240,232,0.08)',
            border: '1px solid rgba(245,240,232,0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-transparent border-none outline-none px-6 py-3.5 text-cream font-body text-[0.875rem] placeholder:text-cream/35"
          />
          <button
            className="bg-sage-dark text-white border-none px-6 py-3.5 font-body text-[0.8rem] tracking-[0.06em] cursor-pointer transition-colors duration-300 hover:bg-sage whitespace-nowrap"
          >
            Get 15% Off
          </button>
        </div>
        <div className="text-[0.72rem] text-cream/30 text-center">
          No spam. Unsubscribe anytime. We care about your privacy.
        </div>
      </div>
    </div>
  );
}
