import { useEffect, useRef } from 'react';
import useFadeUp from '../hooks/useFadeUp';

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

function FloatingCard({ className, style, children, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`absolute cursor-pointer transition-transform duration-600 ${className}`}
      style={{
        background: 'var(--color-glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--color-glass-border)',
        borderRadius: '24px',
        padding: '2rem',
        boxShadow: 'var(--shadow-card)',
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function Hero() {
  const textRef = useFadeUp();
  const visualRef = useFadeUp(0.3);

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center relative overflow-hidden px-16 pt-32 pb-16 max-md:px-6 max-md:pt-28 max-md:pb-12"
    >
      {/* Organic blobs */}
      <div
        className="absolute opacity-45 animate-morph-blob"
        style={{
          width: 600, height: 600,
          borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
          filter: 'blur(60px)',
          background: 'radial-gradient(circle, #b8d4b9, #7a9e7e44)',
          top: -100, right: -80,
          animationDuration: '14s',
        }}
      />
      <div
        className="absolute opacity-45 animate-morph-blob"
        style={{
          width: 400, height: 400,
          borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
          filter: 'blur(60px)',
          background: 'radial-gradient(circle, #e8d5b8, #c4a88266)',
          bottom: -50, left: 200,
          animationDuration: '10s',
          animationDelay: '-5s',
        }}
      />
      <div
        className="absolute opacity-45 animate-morph-blob"
        style={{
          width: 300, height: 300,
          borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
          filter: 'blur(60px)',
          background: 'radial-gradient(circle, #d4e8d4, #7a9e7e44)',
          top: '40%', left: -60,
          animationDuration: '16s',
          animationDelay: '-3s',
        }}
      />

      <div className="relative z-2 grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-[1300px] mx-auto w-full">
        {/* Text */}
        <div ref={textRef} className="fade-up">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[2rem] text-[0.75rem] tracking-[0.1em] uppercase text-sage-dark mb-6"
            style={{
              background: 'rgba(122,158,126,0.15)',
              border: '1px solid rgba(122,158,126,0.3)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span
              className="w-1.5 h-1.5 bg-sage rounded-full animate-pulse-dot"
            />
            100% Natural Origin · Dermatologist Tested
          </div>

          <h1 className="font-heading text-[clamp(3.5rem,6vw,6rem)] font-light leading-[1.05] tracking-[-0.02em] text-charcoal mb-4">
            Clean hands.<br />
            <em className="italic text-sage-dark">Pure life.</em>
          </h1>

          <p className="text-[1.05rem] text-text-muted leading-[1.7] max-w-[420px] mb-10 font-light">
            Plant-powered protection for every hand in your home. Gentle on skin, tough on germs — formulated with love for your family.
          </p>

          <div className="flex gap-4 items-center flex-wrap">
            <a href="#products" className="btn-primary">
              Explore Products
              <ArrowIcon />
            </a>
            <a href="#why" className="btn-ghost">Our Promise</a>
          </div>
        </div>

        {/* Visual - Floating Cards */}
        <div ref={visualRef} className="fade-up relative h-[520px] max-md:h-[350px]" style={{ perspective: 1200 }}>
          {/* Main Sanitizer */}
          <FloatingCard
            className="w-[220px] top-[30px] left-1/2 z-3 animate-float-main"
            style={{ transform: 'translateX(-50%) rotateY(-8deg) rotateX(4deg)' }}
            onClick={scrollToProducts}
          >
            <div className="w-full aspect-square rounded-[16px] mb-4 flex items-center justify-center overflow-hidden" style={{ background: '#eef7ee' }}>
              <img src="/cards/card1.png" className="w-[80%] h-[80%] object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.18)]" alt="Pura Sanitizer" />
            </div>
            <div className="font-heading text-[1.1rem] font-semibold text-charcoal mb-0.5">Pura Sanitizer</div>
            <div className="text-[0.75rem] text-text-muted tracking-[0.06em]">Aloe &amp; Green Tea</div>
            <div className="text-[1rem] font-medium text-sage-dark mt-2">₹149</div>
          </FloatingCard>

          {/* Cream */}
          <FloatingCard
            className="w-[170px] top-[120px] left-[10px] z-2 animate-float-left"
            style={{
              transform: 'rotateY(10deg) rotateX(-3deg) rotateZ(-4deg)',
              animationDelay: '-2s',
            }}
            onClick={scrollToProducts}
          >
            <div className="w-full aspect-square rounded-[16px] mb-4 flex items-center justify-center overflow-hidden" style={{ background: '#faf4ec' }}>
              <img src="/cards/card2.png" className="w-[80%] h-[80%] object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.18)]" alt="Restore Cream" />
            </div>
            <div className="font-heading text-[1.1rem] font-semibold text-charcoal mb-0.5">Restore Cream</div>
            <div className="text-[0.75rem] text-text-muted tracking-[0.06em]">Shea &amp; Honey</div>
            <div className="text-[1rem] font-medium text-sage-dark mt-2">₹199</div>
          </FloatingCard>

          {/* Mini set */}
          <FloatingCard
            className="w-[160px] top-[200px] right-0 z-2 animate-float-right"
            style={{
              transform: 'rotateY(-12deg) rotateX(5deg) rotateZ(5deg)',
              animationDelay: '-4s',
            }}
            onClick={scrollToProducts}
          >
            <div className="w-full aspect-square rounded-[16px] mb-4 flex items-center justify-center overflow-hidden" style={{ background: '#f0f7f0' }}>
              <img src="/cards/card3.png" className="w-[80%] h-[80%] object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.18)]" alt="Duo Set" />
            </div>
            <div className="font-heading text-[1.1rem] font-semibold text-charcoal mb-0.5">Duo Set</div>
            <div className="text-[1rem] font-medium text-sage-dark mt-2">₹299</div>
          </FloatingCard>

          {/* Stats card */}
          <FloatingCard
            className="w-[200px] bottom-[20px] left-[30%] z-1 animate-float-main"
            style={{ padding: '1.2rem 1.5rem', animationDelay: '-1s' }}
          >
            <div className="flex gap-8 items-center">
              <div className="text-center">
                <div className="font-heading text-[1.8rem] font-semibold text-sage-dark">99.9%</div>
                <div className="text-[0.7rem] text-text-muted tracking-[0.05em]">Germ Kill</div>
              </div>
              <div className="w-px h-10 bg-glass-border" />
              <div className="text-center">
                <div className="font-heading text-[1.8rem] font-semibold text-earth-dark">100%</div>
                <div className="text-[0.7rem] text-text-muted tracking-[0.05em]">Natural</div>
              </div>
              <div className="w-px h-10 bg-glass-border" />
              <div className="text-center">
                <div className="font-heading text-[1.8rem] font-semibold text-charcoal">0</div>
                <div className="text-[0.7rem] text-text-muted tracking-[0.05em]">Parabens</div>
              </div>
            </div>
          </FloatingCard>
        </div>
      </div>
    </section>
  );
}
