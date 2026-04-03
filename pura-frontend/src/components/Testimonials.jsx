import useFadeUp from '../hooks/useFadeUp';

const testimonials = [
  {
    stars: '★★★★★',
    quote: '"I finally found a sanitizer that doesn\'t make my kids\' hands crack and peel. The Aloe & Green Tea variant is incredible — smells fresh, feels gentle."',
    name: 'Priya Sharma',
    location: 'Mumbai · Mother of 2',
    initial: 'P',
    gradient: 'linear-gradient(135deg, #7ab87f, #4a6b4e)',
  },
  {
    stars: '★★★★★',
    quote: '"The Shea & Honey cream is a miracle. My husband uses the sanitizer at work all day and his hands were so dry — now he uses the cream at night and the difference is unreal."',
    name: 'Ananya Verma',
    location: 'Pune · Healthcare Professional',
    initial: 'A',
    gradient: 'linear-gradient(135deg, #e8b88a, #c49060)',
  },
  {
    stars: '★★★★★',
    quote: '"Ordered the Family Trio for my parents. My father has very sensitive skin and was skeptical, but he\'s been using it for 3 months and absolutely loves it now. Worth every rupee."',
    name: 'Rahul Gupta',
    location: 'Delhi · Engineering Professional',
    initial: 'R',
    gradient: 'linear-gradient(135deg, #9b7ed4, #6345a8)',
  },
];

export default function Testimonials() {
  const headerRef = useFadeUp();

  return (
    <section
      id="testimonials"
      className="py-32 px-16 max-md:py-20 max-md:px-6"
      style={{ background: 'linear-gradient(170deg, #eef4ee 0%, var(--color-warm-white) 60%)' }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div ref={headerRef} className="fade-up text-center mb-16">
          <div className="section-label justify-center before:hidden">Real Families · Real Results</div>
          <h2 className="section-heading">What they're <em>saying</em></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <TestiCard key={i} t={t} delay={(i + 1) * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestiCard({ t, delay }) {
  const ref = useFadeUp(delay);
  return (
    <div
      ref={ref}
      className="fade-up rounded-[24px] p-8 cursor-pointer transition-all duration-400 hover:translate-y-[-6px]"
      style={{
        background: 'rgba(255,255,255,0.7)',
        border: '1px solid var(--color-glass-border)',
        backdropFilter: 'blur(15px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 20px 50px rgba(122,158,126,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)';
      }}
    >
      <div className="text-earth text-[1rem] mb-4 tracking-[0.1em]">{t.stars}</div>
      <div className="font-accent italic text-[1.05rem] text-charcoal leading-[1.6] mb-6">
        {t.quote}
      </div>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-heading text-[1rem] font-semibold text-white shrink-0"
          style={{ background: t.gradient }}
        >
          {t.initial}
        </div>
        <div>
          <div className="font-medium text-[0.9rem] text-charcoal">{t.name}</div>
          <div className="text-[0.75rem] text-text-muted">{t.location}</div>
        </div>
      </div>
    </div>
  );
}
