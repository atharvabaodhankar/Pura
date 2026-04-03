import useFadeUp from '../hooks/useFadeUp';

const cards = [
  { num: '01', title: '99.9% Germ Protection', desc: 'Clinically proven formula eliminates 99.9% of common bacteria and viruses — safe for kids and adults alike.' },
  { num: '02', title: 'No Harsh Chemicals', desc: 'Zero parabens, zero sulphates, zero artificial colours. Everything you see on the label is what goes on your skin.' },
  { num: '03', title: 'Dermatologist Tested', desc: 'Formulated with dermatologists and tested on sensitive skin. Approved for daily use by the entire family.' },
  { num: '04', title: 'pH Balanced Formula', desc: 'Maintains your skin\'s natural pH level, so your hands stay healthy, soft, and protected wash after wash.' },
  { num: '05', title: 'Eco-Conscious Packaging', desc: 'Recyclable materials, soy-based inks, and a refill programme that helps reduce plastic waste by 70%.' },
  { num: '06', title: 'Cruelty Free · Vegan', desc: '100% vegan ingredients. Never tested on animals. Certified by international cruelty-free organisations.' },
];

export default function WhyUs() {
  const headerRef = useFadeUp();

  return (
    <section id="why" className="py-32 px-16 max-w-[1300px] mx-auto relative z-1 max-md:py-20 max-md:px-6">
      <div ref={headerRef} className="fade-up text-center mb-16">
        <div className="section-label justify-center before:hidden">Our Promise</div>
        <h2 className="section-heading">Why families choose <em>Pura</em></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <WhyCard key={i} card={card} delay={((i % 3) + 1) * 0.1} />
        ))}
      </div>
    </section>
  );
}

function WhyCard({ card, delay }) {
  const ref = useFadeUp(delay);
  return (
    <div
      ref={ref}
      className="fade-up relative overflow-hidden cursor-pointer rounded-[24px] p-10 transition-all duration-400"
      style={{
        background: 'var(--color-glass-bg)',
        border: '1px solid var(--color-glass-border)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 30px 60px rgba(122,158,126,0.18)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Shine */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 60%)',
        }}
      />
      <div className="relative z-1">
        <div className="font-heading text-[4rem] font-light leading-none mb-2" style={{color: 'rgba(122,158,126,0.2)'}}>
          {card.num}
        </div>
        <div className="font-heading text-[1.4rem] font-semibold text-charcoal mb-2.5">
          {card.title}
        </div>
        <div className="text-[0.85rem] text-text-muted leading-[1.7]">
          {card.desc}
        </div>
      </div>
    </div>
  );
}
