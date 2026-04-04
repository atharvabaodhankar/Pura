import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

function FloatingCard({ children, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.21, 1.02, 0.47, 0.98] 
      }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className={`glass-card p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 20,
      y: (clientY / innerHeight - 0.5) * 20,
    });
  };

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[110vh] flex items-center justify-center overflow-hidden pt-32 pb-20 px-6"
    >
      {/* Background blobs with parallax/mouse-follow */}
      <motion.div
        animate={{ 
          x: mousePos.x * 1.5, 
          y: mousePos.y * 1.5 + (typeof window !== 'undefined' ? window.scrollY * 0.1 : 0) 
        }}
        className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-sage/30 rounded-full blur-[120px] mix-blend-multiply pointer-events-none"
        style={{ borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%' }}
      />
      <motion.div
        animate={{ x: -mousePos.x, y: -mousePos.y }}
        className="absolute bottom-[5%] left-[10%] w-[400px] h-[400px] bg-earth/20 rounded-full blur-[100px] mix-blend-multiply pointer-events-none"
        style={{ borderRadius: '30% 60% 30% 70% / 60% 40% 60% 40%' }}
      />

      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-[1400px] mx-auto">
        
        {/* Left Side: Content */}
        <div className="relative max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card mb-8 border-sage/20"
          >
            <span className="w-2 h-2 bg-sage rounded-full animate-pulse" />
            <span className="text-[0.7rem] uppercase tracking-[0.2em] font-medium text-sage-dark">
              100% Organic · Vegan · Cruelty Free
            </span>
          </motion.div>

          <div className="mask-text overflow-hidden">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="font-heading text-[clamp(4rem,8vw,7.5rem)] font-light leading-[0.95] text-charcoal tracking-tight mb-8"
            >
              Pure Hands.<br />
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="italic text-sage font-light"
              >
                Gentle Soul.
              </motion.span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-[1.15rem] text-text-muted leading-relaxed max-w-lg mb-12 font-light"
          >
            Experience the harmony of nature and protection. Our plant-based formulas nourish your skin while shielding you from the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-5 items-center"
          >
            <a href="#products" className="btn-primary px-10 py-5 text-[1rem]">
              Shop Collection
              <ArrowIcon />
            </a>
            <a href="#about" className="group flex items-center gap-2 text-charcoal font-medium tracking-wide hover:text-sage transition-colors">
              <span className="w-10 h-10 rounded-full border border-charcoal/10 flex items-center justify-center group-hover:border-sage transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </span>
              Our Story
            </a>
          </motion.div>
        </div>

        {/* Right Side: Visual Composition */}
        <div className="relative h-[650px] flex items-center justify-center lg:justify-end pr-8">
          
          {/* Main Floating Image Card */}
          <motion.div
            style={{ y: y1 }}
            className="relative z-10 w-[320px] group"
          >
            <FloatingCard className="w-full aspect-[3/4] flex flex-col justify-between overflow-hidden p-0 rounded-[32px]">
              <div className="h-[75%] w-full bg-[#f4f7f4] flex items-center justify-center p-8 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  src="/cards/card1.png"
                  className="w-full h-full object-contain drop-shadow-2xl"
                  alt="Pure Sanitizer"
                />
              </div>
              <div className="p-8 bg-white/40 backdrop-blur-md">
                <h3 className="font-heading text-2xl font-medium text-charcoal">Botanical Mist</h3>
                <p className="text-sm text-text-muted mt-1 uppercase tracking-widest">Lavender & Mint</p>
                <div className="mt-4 flex justify-between items-end">
                  <span className="text-xl font-heading text-sage-dark">₹199</span>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-sage/10 text-sage-dark">Best Seller</span>
                </div>
              </div>
            </FloatingCard>
          </motion.div>

          {/* Secondary Card (Cream) */}
          <motion.div
            style={{ y: y2 }}
            className="absolute left-[0%] top-[10%] z-20 w-[220px]"
          >
            <FloatingCard delay={0.4} className="rounded-2xl p-4 bg-cream/40 overflow-hidden">
              <div className="aspect-square bg-warm-white rounded-xl mb-4 p-4">
                <img src="/cards/card2.png" className="w-full h-full object-contain" alt="Cream" />
              </div>
              <p className="text-[0.65rem] uppercase tracking-widest text-earth-dark font-bold mb-1">Coming Soon</p>
              <h4 className="font-heading text-lg text-charcoal">Aloe Recovery</h4>
            </FloatingCard>
          </motion.div>

          {/* Circle Stats */}
          <motion.div
            style={{ y: y1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-[10%] right-[-5%] z-30"
          >
            <div className="w-32 h-32 rounded-full glass-card border-none flex flex-col items-center justify-center text-center p-2 shadow-2xl">
              <span className="font-heading text-3xl text-sage-dark leading-none">99%</span>
              <span className="text-[10px] uppercase tracking-tighter text-text-muted mt-1">Natural<br/>Ingredients</span>
            </div>
          </motion.div>

          {/* Subtle Accent Shapes */}
          <div className="absolute top-[20%] right-[-10%] w-4 h-4 rounded-full bg-sage animate-ping opacity-20" />
          <div className="absolute bottom-[30%] left-[20%] w-2 h-2 rounded-full bg-earth animate-pulse" />
        </div>

      </div>

      {/* Decorative Floor */}
      <motion.div 
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-text-muted/40 uppercase text-[0.6rem] tracking-[0.4em]"
      >
        <span>Scroll to explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-charcoal/40 to-transparent" />
      </motion.div>
    </section>
  );
}
