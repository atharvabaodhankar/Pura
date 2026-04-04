import { useState } from 'react';
import useFadeUp from '../hooks/useFadeUp';
import { Leaf, Truck, RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react';

const perks = [
  { Icon: Leaf,      label: '100% Natural' },
  { Icon: Truck,     label: 'Free Shipping ₹299+' },
  { Icon: RotateCcw, label: '15-Day Returns' },
];

export default function CtaBanner() {
  const ref = useFadeUp();
  const rightRef = useFadeUp(0.15);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section className="px-16 mb-24 max-md:px-6 max-md:mb-16">
      <div
        className="relative overflow-hidden rounded-[40px]"
        style={{ background: 'var(--color-charcoal)' }}
      >
        {/* Background texture blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(122,158,126,0.35) 0%, transparent 65%)', top: -300, right: -200 }} />
          <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,168,130,0.15) 0%, transparent 70%)', bottom: -150, left: 200 }} />
          <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(122,158,126,0.2) 0%, transparent 70%)', top: 50, left: -50 }} />
        </div>

        {/* Thin top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(122,158,126,0.6), transparent)' }} />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left */}
          <div ref={ref} className="fade-up px-16 py-20 flex flex-col justify-center max-md:px-8 max-md:py-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-light" />
              <span className="text-[0.7rem] tracking-[0.22em] uppercase text-sage-light font-medium">Join 50,000+ families</span>
            </div>

            <h2 className="font-heading text-[clamp(2.4rem,4vw,3.6rem)] font-light text-cream leading-[1.1] mb-6">
              Start your<br />
              <em className="italic text-sage-light">Pura</em> ritual<br />
              today
            </h2>

            <p className="text-[0.9rem] text-cream/50 font-light leading-relaxed mb-10 max-w-sm">
              First order? Get 15% off + free shipping on orders above ₹299. Join thousands of families who've made the switch to clean skincare.
            </p>

            {/* Perks */}
            <div className="flex flex-wrap gap-4">
              {perks.map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(122,158,126,0.15)', border: '1px solid rgba(122,158,126,0.25)' }}>
                    <Icon className="w-3.5 h-3.5 text-sage-light" />
                  </div>
                  <span className="text-[0.78rem] text-cream/50 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — divider + form */}
          <div
            ref={rightRef}
            className="fade-up flex flex-col justify-center px-16 py-20 max-md:px-8 max-md:pt-0 max-md:pb-12"
            style={{ borderLeft: '1px solid rgba(245,240,232,0.07)' }}
          >
            {submitted ? (
              <div className="flex flex-col items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-sage-dark/20 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-sage-light" />
                </div>
                <div>
                  <div className="font-heading text-2xl text-cream mb-1">You're in.</div>
                  <div className="text-sm text-cream/50">Check your inbox — your 15% off code is on its way.</div>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <div className="font-heading text-[1.6rem] font-light text-cream mb-2">Claim your welcome offer</div>
                  <div className="text-[0.85rem] text-cream/40">Enter your email to unlock 15% off your first order.</div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div
                    className="flex rounded-[3rem] overflow-hidden transition-all duration-300 focus-within:ring-1 focus-within:ring-sage-dark/50"
                    style={{ background: 'rgba(245,240,232,0.07)', border: '1px solid rgba(245,240,232,0.15)' }}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-cream font-body text-[0.875rem] placeholder:text-cream/30"
                    />
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-sage-dark text-white border-none px-6 py-4 font-body text-[0.8rem] tracking-[0.06em] cursor-pointer transition-all duration-300 hover:bg-sage whitespace-nowrap group"
                    >
                      Get 15% Off
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>

                  <div className="text-[0.7rem] text-cream/25 pl-2">
                    No spam. Unsubscribe anytime. We care about your privacy.
                  </div>
                </form>

                {/* Social proof */}
                <div className="mt-10 pt-8" style={{ borderTop: '1px solid rgba(245,240,232,0.07)' }}>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {['#7a9e7e', '#a8c5aa', '#4a6b4e', '#c4a882'].map((bg, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-charcoal flex items-center justify-center text-[0.6rem] font-bold text-white" style={{ background: bg }}>
                          {['P', 'A', 'R', 'S'][i]}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-[0.78rem] text-cream/60 font-medium">Trusted by 50,000+ customers</div>
                      <div className="text-[0.7rem] text-cream/30">Rated 4.9/5 across 12,000+ reviews</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
