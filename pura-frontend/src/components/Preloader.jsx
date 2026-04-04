import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Preloader({ isLoading }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShow(false), 800); // Small buffer for smooth exit
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: '-100%',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-cream overflow-hidden"
        >
          {/* Background Liquid Shape */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] opacity-20 bg-sage rounded-full blur-[100px]"
            style={{ borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%' }}
          />

          <div className="relative flex flex-col items-center">
            {/* Wordmark Animation */}
            <div className="overflow-hidden mb-4">
              <motion.h1
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading text-[clamp(4rem,10vw,8rem)] text-charcoal leading-none tracking-tight"
              >
                Pura<span className="text-sage">.</span>
              </motion.h1>
            </div>

            {/* Progress Bar Container */}
            <div className="w-48 h-[2px] bg-sage/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-sage"
              />
            </div>

            {/* Subtle Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-6 text-[0.7rem] uppercase tracking-[0.3em] text-text-muted font-light"
            >
              Clean Hands · Pure Life
            </motion.p>
          </div>
          
          {/* Animated Blobs for "Liquid" feel */}
          <motion.div 
            animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-[10%] left-[10%] w-32 h-32 bg-earth/10 rounded-full blur-3xl" 
          />
          <motion.div 
            animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute bottom-[10%] right-[10%] w-48 h-48 bg-sage/10 rounded-full blur-3xl" 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
