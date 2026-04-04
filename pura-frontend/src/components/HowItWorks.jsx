import { useState } from 'react';
import useFadeUp from '../hooks/useFadeUp';
import {
  Leaf, FlaskConical, Droplets, Beaker,
  Flower2, Sparkles, Sun, Layers, Dna,
  Sprout, Microscope, TestTube, Hand,
  Wind, Citrus, Nut, CheckCircle2,
} from 'lucide-react';

const ArrowSvg = () => (
  <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
    <line x1="4" y1="14" x2="24" y2="14" />
    <polyline points="17 7 24 14 17 21" />
  </svg>
);

// Small icon wrapper for source pills
const SIcon = ({ Icon }) => <Icon className="w-3.5 h-3.5 shrink-0" />;

// Step node icon wrapper
const StepIcon = ({ Icon }) => <Icon className="w-7 h-7" style={{ color: 'rgba(44,44,42,0.75)' }} />;

const pfData = {
  aloe: {
    label: 'Aloe & Green Tea',
    LabelIcon: Leaf,
    sources: [
      { Icon: Leaf,         text: 'Aloe Vera — Sourced from organic farms' },
      { Icon: FlaskConical, text: 'Green Tea — Cold-extracted antioxidants' },
      { Icon: Droplets,     text: 'Ethanol 70% — Pharmaceutical grade' },
      { Icon: Sparkles,     text: 'Glycerin — Plant-derived humectant' },
    ],
    steps: [
      { Icon: Sprout,      gradient: 'linear-gradient(135deg,#d4ecd5,#7ab87f)', label: 'Step 1', title: 'Harvest', desc: 'Aloe leaves & green tea leaves ethically sourced' },
      { Icon: Microscope,  gradient: 'linear-gradient(135deg,#c8e8c8,#4a8f50)', label: 'Step 2', title: 'Extract', desc: 'Cold-press aloe gel + steam-distill green tea catechins' },
      { Icon: TestTube,    gradient: 'linear-gradient(135deg,#b8d8b8,#3d6b42)', label: 'Step 3', title: 'Blend', desc: 'Mix with ethanol 70% + glycerin at controlled pH 6.5' },
      { Icon: Hand,       gradient: 'linear-gradient(135deg,#a8c5aa,#4a6b4e)', label: 'Result', title: 'Sanitize & Soothe', desc: 'Kills 99.9% germs while aloe hydrates & green tea protects' },
    ],
    result: { text: 'Kills 99.9% germs · Soothes with aloe · Antioxidant protection · No dry-out effect', stats: [{ val: '99.9%', lbl: 'Germ Kill' }, { val: 'pH 6.5', lbl: 'Skin Safe' }, { val: '100%', lbl: 'Natural Origin' }] },
  },
  lavender: {
    label: 'Lavender & Rose',
    LabelIcon: Flower2,
    sources: [
      { Icon: Wind,     text: 'Lavender Oil — Steam-distilled from Provence' },
      { Icon: Flower2,  text: 'Rose Water — Bulgarian rose hydrosol' },
      { Icon: Droplets, text: 'Ethanol 70% — Pharmaceutical grade' },
      { Icon: Sparkles, text: 'Glycerin — Plant-derived humectant' },
    ],
    steps: [
      { Icon: Sprout,     gradient: 'linear-gradient(135deg,#e8e0f4,#9b7ed4)', label: 'Step 1', title: 'Harvest', desc: 'Lavender & rose petals hand-picked at peak bloom' },
      { Icon: Microscope, gradient: 'linear-gradient(135deg,#d8c8f0,#7c5cbf)', label: 'Step 2', title: 'Distill', desc: 'Steam distillation captures pure essential oils & hydrosol' },
      { Icon: TestTube,   gradient: 'linear-gradient(135deg,#c8b0e8,#6345a8)', label: 'Step 3', title: 'Blend', desc: 'Infused into ethanol base with rose water & glycerin' },
      { Icon: Hand,      gradient: 'linear-gradient(135deg,#b0a0d8,#4a3090)', label: 'Result', title: 'Sanitize & Calm', desc: 'Kills germs while lavender calms & rose tones skin' },
    ],
    result: { text: 'Kills 99.9% germs · Calming lavender aroma · Rose water tones skin · Stress-relief scent', stats: [{ val: '99.9%', lbl: 'Germ Kill' }, { val: '2-in-1', lbl: 'Sanitize + Tone' }, { val: '0%', lbl: 'Parabens' }] },
  },
  citrus: {
    label: 'Citrus & Vitamin E',
    LabelIcon: Sun,
    sources: [
      { Icon: Sun,      text: 'Citrus Extract — Cold-pressed lemon & orange peel' },
      { Icon: Sparkles, text: 'Vitamin E — Tocopherol from sunflower oil' },
      { Icon: Droplets, text: 'Ethanol 70% — Pharmaceutical grade' },
      { Icon: Sparkles, text: 'Glycerin — Plant-derived humectant' },
    ],
    steps: [
      { Icon: Citrus,     gradient: 'linear-gradient(135deg,#fce8d4,#e8944a)', label: 'Step 1', title: 'Press', desc: 'Cold-press citrus peels to extract bioflavonoids' },
      { Icon: Microscope, gradient: 'linear-gradient(135deg,#f8d8b0,#c87941)', label: 'Step 2', title: 'Enrich', desc: 'Vitamin E tocopherol added as antioxidant booster' },
      { Icon: TestTube,   gradient: 'linear-gradient(135deg,#f0c060,#a85f2e)', label: 'Step 3', title: 'Blend', desc: 'Combined with ethanol base at optimal concentration' },
      { Icon: Hand,      gradient: 'linear-gradient(135deg,#e8a050,#8b4010)', label: 'Result', title: 'Sanitize & Brighten', desc: 'Kills germs, Vitamin E repairs & citrus brightens skin tone' },
    ],
    result: { text: 'Kills 99.9% germs · Vitamin E repairs skin · Citrus brightens · Energising scent', stats: [{ val: '99.9%', lbl: 'Germ Kill' }, { val: 'Vit E', lbl: 'Skin Repair' }, { val: '0%', lbl: 'Sulphates' }] },
  },
  shea: {
    label: 'Shea & Honey',
    LabelIcon: Layers,
    sources: [
      { Icon: Layers,   text: 'Shea Butter — Unrefined, West African origin' },
      { Icon: Sparkles, text: 'Raw Honey — Wildflower, cold-processed' },
      { Icon: Leaf,     text: 'Aloe Vera — Organic cold-pressed gel' },
      { Icon: Sun,      text: 'Vitamins A & E — Natural tocopherols' },
    ],
    steps: [
      { Icon: Nut,        gradient: 'linear-gradient(135deg,#f8ede0,#e8b88a)', label: 'Step 1', title: 'Source', desc: 'Unrefined shea nuts cold-pressed, raw honey cold-processed' },
      { Icon: Microscope, gradient: 'linear-gradient(135deg,#f0d8b0,#c49060)', label: 'Step 2', title: 'Refine', desc: 'Shea emulsified, honey filtered to retain enzymes & nutrients' },
      { Icon: TestTube,   gradient: 'linear-gradient(135deg,#e8c890,#9a7040)', label: 'Step 3', title: 'Formulate', desc: 'Blended with aloe gel + vitamins A & E at low heat' },
      { Icon: Hand,      gradient: 'linear-gradient(135deg,#d4a870,#704820)', label: 'Result', title: 'Repair & Moisturise', desc: 'Shea rebuilds barrier, honey locks moisture, aloe soothes' },
    ],
    result: { text: 'Repairs dry skin overnight · Locks in moisture · Soothes irritation · Rich in vitamins A & E', stats: [{ val: '72hr', lbl: 'Moisture Lock' }, { val: 'Vit A+E', lbl: 'Skin Renewal' }, { val: '0%', lbl: 'Mineral Oil' }] },
  },
  collagen: {
    label: 'Collagen & Hyaluronic',
    LabelIcon: Dna,
    sources: [
      { Icon: Dna,      text: 'Collagen Peptides — Marine-derived, hydrolysed' },
      { Icon: Droplets, text: 'Hyaluronic Acid — Low & high molecular weight' },
      { Icon: Sun,      text: 'Vitamin C — Stabilised ascorbyl glucoside' },
      { Icon: Layers,   text: 'Ceramides — Plant-derived skin barrier lipids' },
    ],
    steps: [
      { Icon: Dna,        gradient: 'linear-gradient(135deg,#dff0f4,#70c8e0)', label: 'Step 1', title: 'Synthesise', desc: 'Collagen hydrolysed into bioavailable peptides for skin absorption' },
      { Icon: Microscope, gradient: 'linear-gradient(135deg,#c0e4f0,#3d8a9e)', label: 'Step 2', title: 'Layer', desc: 'Dual-weight HA — high MW seals surface, low MW penetrates deep' },
      { Icon: TestTube,   gradient: 'linear-gradient(135deg,#a8d8e8,#2a6878)', label: 'Step 3', title: 'Stabilise', desc: 'Vitamin C & ceramides added to stabilise and protect formula' },
      { Icon: Hand,      gradient: 'linear-gradient(135deg,#90c8d8,#1a5060)', label: 'Result', title: 'Plump & Firm', desc: 'Collagen firms, HA plumps, Vitamin C brightens, ceramides protect' },
    ],
    result: { text: 'Firms & plumps skin · Deep hydration · Brightens tone · Restores skin barrier', stats: [{ val: '1000×', lbl: 'HA Water Hold' }, { val: '2-MW', lbl: 'Deep Penetration' }, { val: '0%', lbl: 'Fragrance' }] },
  },
  rose: {
    label: 'Rose & Argan Oil',
    LabelIcon: Flower2,
    sources: [
      { Icon: Flower2,  text: 'Rose Extract — Bulgarian Damascena rose' },
      { Icon: Layers,   text: 'Argan Oil — Cold-pressed Moroccan argan kernels' },
      { Icon: Nut,      text: 'Jojoba Oil — Desert-grown, wax ester rich' },
      { Icon: Sparkles, text: 'Vitamin E — Natural tocopherol antioxidant' },
    ],
    steps: [
      { Icon: Flower2,    gradient: 'linear-gradient(135deg,#ffe8ec,#f09098)', label: 'Step 1', title: 'Extract', desc: 'Rose petals CO₂-extracted to preserve bioactive compounds' },
      { Icon: Microscope, gradient: 'linear-gradient(135deg,#f0c0c4,#d4707a)', label: 'Step 2', title: 'Press', desc: 'Argan & jojoba cold-pressed to retain fatty acids & sterols' },
      { Icon: TestTube,   gradient: 'linear-gradient(135deg,#e0a0a8,#b85060)', label: 'Step 3', title: 'Blend', desc: 'Oils emulsified with rose extract + Vitamin E at low temp' },
      { Icon: Hand,      gradient: 'linear-gradient(135deg,#d08090,#903040)', label: 'Result', title: 'Nourish & Protect', desc: 'Argan nourishes deeply, rose soothes, jojoba balances, Vit E shields' },
    ],
    result: { text: 'Intensely nourishes dry skin · Anti-inflammatory rose · Balances oil · Antioxidant shield', stats: [{ val: '80%', lbl: 'Oleic Acid' }, { val: 'CO₂', lbl: 'Extracted' }, { val: '0%', lbl: 'Silicones' }] },
  },
};

const tabKeys = Object.keys(pfData);

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('aloe');
  const headerRef = useFadeUp();
  const tabsRef = useFadeUp(0.1);
  const data = pfData[activeTab];

  return (
    <section
      id="how-it-works"
      className="py-32 px-16 bg-charcoal relative overflow-hidden max-md:py-20 max-md:px-6"
    >
      <div className="absolute pointer-events-none" style={{ top: -200, right: -200, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(122,158,126,0.18), transparent 70%)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: -150, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,168,130,0.1), transparent 70%)' }} />

      <div className="max-w-[1200px] mx-auto relative z-1">
        <div ref={headerRef} className="fade-up text-center mb-12">
          <div className="section-label justify-center before:hidden !text-sage-light">Product Process Flow</div>
          <h2 className="section-heading !text-cream">From nature to <em className="!text-sage-light">your Hand</em></h2>
          <p className="text-cream/50 mt-4 text-[0.9rem] leading-[1.7]">Select a product to see its full ingredient-to-benefit process flow.</p>
        </div>

        {/* Tabs */}
        <div ref={tabsRef} className="fade-up flex gap-2 justify-center flex-wrap mb-12">
          {tabKeys.map((key) => {
            const { LabelIcon } = pfData[key];
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-5 py-2 rounded-[2rem] font-body text-[0.78rem] tracking-[0.06em] cursor-pointer transition-all duration-300 whitespace-nowrap ${
                  activeTab === key
                    ? 'bg-sage-dark text-white border-sage-dark'
                    : 'bg-transparent text-cream/50 hover:text-sage-light'
                }`}
                style={{ border: activeTab === key ? '1px solid var(--color-sage-dark)' : '1px solid rgba(245,240,232,0.15)' }}
              >
                <LabelIcon className="w-3.5 h-3.5" />
                {pfData[key].label}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div key={activeTab} className="animate-pf-fade">
          {/* Sources */}
          <div className="flex gap-4 mb-6 flex-wrap">
            {data.sources.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-[2rem] px-4 py-2 text-[0.78rem] text-cream/60 transition-all duration-300 hover:text-sage-light"
                style={{ background: 'rgba(245,240,232,0.06)', border: '1px solid rgba(245,240,232,0.1)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(122,158,126,0.15)'; e.currentTarget.style.borderColor = 'rgba(122,158,126,0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(245,240,232,0.06)'; e.currentTarget.style.borderColor = 'rgba(245,240,232,0.1)'; }}
              >
                <SIcon Icon={s.Icon} />
                {s.text}
              </div>
            ))}
          </div>

          {/* Flow */}
          <div
            className="grid items-center gap-0 rounded-[24px] p-10 mb-6 max-md:grid-cols-1 max-md:gap-4 max-md:p-6"
            style={{ gridTemplateColumns: 'repeat(7, auto)', background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(245,240,232,0.08)' }}
          >
            {data.steps.map((step, i) => (
              <span key={i} className="contents">
                <div className="flex flex-col items-center text-center px-2 group">
                  <div
                    className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-4 transition-transform duration-350 group-hover:translate-y-[-5px] group-hover:scale-110"
                    style={{ background: step.gradient }}
                  >
                    <StepIcon Icon={step.Icon} />
                  </div>
                  <div className="text-[0.65rem] tracking-[0.14em] uppercase text-cream/35 mb-1">{step.label}</div>
                  <div className="font-heading text-[1rem] font-semibold text-cream leading-[1.2] mb-1">{step.title}</div>
                  <div className="text-[0.72rem] text-cream/45 leading-[1.5] max-w-[130px]">{step.desc}</div>
                </div>
                {i < data.steps.length - 1 && (
                  <div className="flex items-center text-sage/50 px-1 shrink-0 max-md:rotate-90 max-md:mx-auto">
                    <ArrowSvg />
                  </div>
                )}
              </span>
            ))}
          </div>

          {/* Result */}
          <div
            className="flex items-center gap-6 rounded-[16px] p-5 max-md:flex-col"
            style={{ background: 'rgba(122,158,126,0.1)', border: '1px solid rgba(122,158,126,0.2)' }}
          >
            <div className="w-10 h-10 rounded-full bg-sage-dark/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-sage-light" />
            </div>
            <div>
              <div className="text-[0.65rem] tracking-[0.14em] uppercase text-sage-light mb-1">Final Product Benefit</div>
              <div className="font-heading text-[1.1rem] font-semibold text-cream">{data.result.text}</div>
            </div>
            <div className="flex gap-8 ml-auto shrink-0 max-md:ml-0 max-md:gap-6">
              {data.result.stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="font-heading text-[1.6rem] font-semibold text-sage-light leading-none">{s.val}</div>
                  <div className="text-[0.65rem] text-cream/35 tracking-[0.08em] mt-1">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
