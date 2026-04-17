import { motion } from 'framer-motion';
import { FlaskConical, Beaker, ShieldCheck, Zap, Droplets, Leaf } from 'lucide-react';
import useFadeUp from '../hooks/useFadeUp';

const formulations = [
  {
    category: "Hand Sanitizers",
    base: "70% v/v Pharmaceutical Grade Ethanol ($C_2H_5OH$)",
    products: [
      {
        name: "Aloe & Green Tea",
        tagline: "Soothe & Protect",
        color: "from-sage/20 to-sage-dark/10",
        icon: Leaf,
        ingredients: [
          { name: "Ethanol", formula: "C2H5OH", qty: "70% v/v", role: "Antimicrobial" },
          { name: "Aloe Vera Gel", formula: "(C6H10O5)n", qty: "8.0%", role: "Humectant" },
          { name: "Green Tea Extract", formula: "C22H18O11", qty: "1.5%", role: "Antioxidant" },
          { name: "Vegetable Glycerin", formula: "C3H8O3", qty: "2.0%", role: "Moisture Lock" }
        ]
      },
      {
        name: "Lavender & Rose",
        tagline: "Calm & Restore",
        color: "from-purple-500/10 to-indigo-500/10",
        icon: Droplets,
        ingredients: [
          { name: "Ethanol", formula: "C2H5OH", qty: "70% v/v", role: "Antimicrobial" },
          { name: "Rose Hydrosol", formula: "C8H10O", qty: "15.0%", role: "Toning" },
          { name: "Lavender Oil", formula: "C10H18O", qty: "1.0%", role: "Aromatherapy" },
          { name: "Glycerin", formula: "C3H8O3", qty: "2.0%", role: "Moisture" }
        ]
      },
      {
        name: "Citrus & Vitamin E",
        tagline: "Brighten & Energize",
        color: "from-orange-500/10 to-yellow-500/10",
        icon: Zap,
        ingredients: [
          { name: "Ethanol", formula: "C2H5OH", qty: "70% v/v", role: "Antimicrobial" },
          { name: "Citrus Extract", formula: "-", qty: "3.0%", role: "Brightening" },
          { name: "Ascorbyl Glucoside", formula: "C12H18O11", qty: "1.0%", role: "Vit C" },
          { name: "Vitamin E", formula: "C29H50O2", qty: "0.5%", role: "Repair" }
        ]
      }
    ]
  },
  {
    category: "Moisturizing Hand Creams",
    base: "Skin-Neutral Base with Natural Emollients",
    products: [
      {
        name: "Shea & Raw Honey",
        tagline: "Overnight Repair",
        color: "from-earth/20 to-earth-dark/10",
        icon: Beaker,
        ingredients: [
          { name: "Shea Butter", formula: "-", qty: "~25%", role: "Emollient" },
          { name: "Raw Honey", formula: "-", qty: "~5%", role: "Enzymatic Base" },
          { name: "Vitamin A", formula: "C36H60O2", qty: "0.1%", role: "Cell Turnover" },
          { name: "Vitamin E", formula: "C29H50O2", qty: "0.5%", role: "Antioxidant" }
        ]
      },
      {
        name: "Collagen & Hyaluronic",
        tagline: "Plump & Firm",
        color: "from-blue-500/10 to-cyan-500/10",
        icon: FlaskConical,
        ingredients: [
          { name: "Niacinamide", formula: "C6H6N2O", qty: "5.0%", role: "Barrier Support" },
          { name: "Peptide Complex", formula: "-", qty: "3.0%", role: "Collagen Boost" },
          { name: "Hyaluronic Acid", formula: "(C14H21NO11)n", qty: "0.8%", role: "Hydration" },
          { name: "Marine Collagen", formula: "-", qty: "2.0%", role: "Skin Firming" }
        ]
      },
      {
        name: "Rose & Argan Oil",
        tagline: "Intense Nourishment",
        color: "from-pink-500/10 to-rose-500/10",
        icon: ShieldCheck,
        ingredients: [
          { name: "Rose Water", formula: "-", qty: "40.0%", role: "Anti-inflammatory" },
          { name: "Argan Oil", formula: "-", qty: "~10%", role: "Fatty Acids" },
          { name: "Jojoba Oil", formula: "-", qty: "5.0%", role: "Sebum Mimic" },
          { name: "Rosehip Oil", formula: "-", qty: "2.0%", role: "Brightening" }
        ]
      }
    ]
  }
];

export default function Formulations() {
  const headingRef = useFadeUp();

  return (
    <div className="min-h-screen bg-warm-white pt-32 pb-24 px-6 md:px-16 overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-sage/5 rounded-full blur-[120px] pointer-events-none animate-morph-blob" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-earth/5 rounded-full blur-[100px] pointer-events-none animate-pf-fade" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header ref={headingRef} className="fade-up mb-20 text-center">
          <div className="section-label justify-center">Scientific Transparency</div>
          <h1 className="section-heading mb-6">
            Our <em>Formulations</em> & Chemistry
          </h1>
          <p className="text-text-muted max-w-2xl mx-auto text-lg leading-relaxed">
            Every drop of Pura is a balance of traditional botanical wisdom and rigorous pharmaceutical science. 
            We provide full visibility into our chemical compositions, so you know exactly what touches your skin.
          </p>
        </header>

        {formulations.map((section, sIdx) => (
          <div key={sIdx} className="mb-24">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-end gap-6 mb-12 border-b border-glass-border pb-6"
            >
              <h2 className="font-heading text-4xl font-light text-charcoal">{section.category}</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-sage-dark font-bold mb-2 pb-1 bg-sage/10 px-3 py-1 rounded-full">
                Base: {section.base}
              </span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.products.map((product, pIdx) => (
                <ProductCard key={pIdx} product={product} delay={pIdx * 0.1} />
              ))}
            </div>
          </div>
        ))}

        <footer className="mt-20 glass-card p-12 text-center border-glass-border">
          <h3 className="font-heading text-3xl mb-4">Quality & Ethics Guarantee</h3>
          <p className="text-text-muted max-w-3xl mx-auto text-sm leading-8">
            All Pura formulations are EN 1500 certified for antimicrobial efficacy and are 100% free of Parabens, 
            Sulphates, Mineral Oils, and Silicones. Our ingredients are sourced globally from sustainable, 
            fair-trade cooperatives.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {["Paraben Free", "Cruelty Free", "Lab Tested", "Sustainable Sourcing"].map((tag) => (
              <span key={tag} className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-sage-dark flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                {tag}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}

function ProductCard({ product, delay }) {
  const { Icon } = product;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`glass-card p-8 group hover:shadow-card-hover transition-all duration-500`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[0.6rem] uppercase tracking-[0.2em] font-bold text-sage-dark/60 block mb-1">Product</span>
            <h3 className="font-heading text-2xl font-semibold text-charcoal">{product.name}</h3>
            <p className="text-xs italic text-text-muted">{product.tagline}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-sm border border-glass-border group-hover:scale-110 transition-transform duration-500">
            <Icon className="w-6 h-6 text-sage-dark" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-[0.65rem] uppercase tracking-widest font-bold text-text-muted opacity-50 border-b border-glass-border pb-1">Ingredient Breakdown</div>
          {product.ingredients.map((ing, iIdx) => (
            <div key={iIdx} className="flex justify-between items-center group/row">
              <div>
                <div className="text-[0.85rem] font-medium text-charcoal">{ing.name}</div>
                <div className="text-[0.65rem] font-mono text-text-muted italic">{ing.formula}</div>
              </div>
              <div className="text-right">
                <div className="text-[0.8rem] font-bold text-sage-dark">{ing.qty}</div>
                <div className="text-[0.6rem] uppercase tracking-widest text-text-muted">{ing.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
