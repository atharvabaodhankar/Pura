import useFadeUp from '../hooks/useFadeUp';
import { Leaf, Droplets, Layers, FlaskConical, Flower2, Sparkles } from 'lucide-react';

const ingredients = [
  { Icon: Leaf,         name: 'Aloe Vera Extract',  desc: 'Soothes and hydrates while actively fighting bacteria. Nature\'s own hand healer.' },
  { Icon: Sparkles,     name: 'Raw Honey',           desc: 'Natural humectant with antibacterial properties — locks moisture into skin cells.' },
  { Icon: Layers,       name: 'Shea Butter',         desc: 'Rich in vitamins A and E. Repairs the skin barrier and prevents dryness.' },
  { Icon: FlaskConical, name: 'Green Tea',            desc: 'Powerful antioxidant that neutralises free radicals and reduces inflammation.' },
  { Icon: Flower2,      name: 'Argan Oil',            desc: 'Moroccan liquid gold. Intensely nourishing for dry, sensitive skin.' },
  { Icon: Droplets,     name: 'Hyaluronic Acid',      desc: 'Holds 1000× its weight in water. Keeps hands plump and deeply moisturised.' },
];

export default function Ingredients() {
  const headingRef = useFadeUp();

  return (
    <section
      id="ingredients"
      className="bg-charcoal py-32 px-16 relative overflow-hidden max-md:py-20 max-md:px-6"
    >
      <div
        className="absolute pointer-events-none"
        style={{
          top: -200, right: -200,
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(122,158,126,0.3), transparent 70%)',
        }}
      />

      <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-24 items-center max-md:gap-12">
        <div ref={headingRef} className="fade-up">
          <div className="section-label !text-sage-light before:!bg-sage-light">
            What's Inside
          </div>
          <h2 className="section-heading !text-cream">
            Pure <em className="!text-sage-light">ingredients,</em><br />honest formula
          </h2>
          <p className="text-cream/60 mt-4 text-[0.9rem] leading-[1.7] font-light">
            Every ingredient is chosen for a reason. Nothing synthetic, nothing harmful — just nature's finest, scientifically optimised for your family's skin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {ingredients.map((ing, i) => (
            <IngredientCard key={i} ing={ing} delay={(i % 2 === 0 ? 0.1 : 0.2)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function IngredientCard({ ing, delay }) {
  const ref = useFadeUp(delay);
  const { Icon } = ing;
  return (
    <div
      ref={ref}
      className="fade-up rounded-[20px] p-6 cursor-pointer transition-all duration-300 hover:translate-y-[-4px]"
      style={{
        background: 'rgba(245,240,232,0.06)',
        border: '1px solid rgba(245,240,232,0.1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(122,158,126,0.15)';
        e.currentTarget.style.borderColor = 'rgba(122,158,126,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(245,240,232,0.06)';
        e.currentTarget.style.borderColor = 'rgba(245,240,232,0.1)';
      }}
    >
      <div className="w-10 h-10 rounded-xl bg-sage-dark/20 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-sage-light" />
      </div>
      <div className="font-heading text-[1.1rem] font-semibold text-cream mb-1">{ing.name}</div>
      <div className="text-[0.78rem] text-cream/50 leading-[1.5]">{ing.desc}</div>
    </div>
  );
}
