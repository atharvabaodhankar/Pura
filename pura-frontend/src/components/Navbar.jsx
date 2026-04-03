import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-100 px-16 py-6 flex items-center justify-between transition-all duration-400 ${
        scrolled
          ? 'bg-warm-white/85 backdrop-blur-[20px] border-b border-glass-border'
          : ''
      }`}
      style={{ transition: 'background 0.4s, backdrop-filter 0.4s' }}
    >
      <a
        href="#"
        className="font-heading text-[1.8rem] font-semibold tracking-[0.04em] text-charcoal no-underline"
      >
        Pur<span className="text-sage-dark">a</span>
      </a>

      <ul className="hidden md:flex gap-10 list-none">
        {[
          { href: '#products', label: 'Products' },
          { href: '#ingredients', label: 'Ingredients' },
          { href: '#how-it-works', label: 'How It Works' },
          { href: '#why', label: 'Why Pura' },
          { href: '#testimonials', label: 'Reviews' },
        ].map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="no-underline text-charcoal text-[0.875rem] font-normal tracking-[0.08em] uppercase relative transition-colors duration-300 hover:text-sage-dark group"
            >
              {link.label}
              <span className="absolute bottom-[-3px] left-0 w-0 h-px bg-sage-dark transition-all duration-300 group-hover:w-full" />
            </a>
          </li>
        ))}
        <li>
          <a
            href="#cta-banner"
            className="no-underline bg-charcoal text-cream px-6 py-2.5 rounded-[2rem] text-[0.8rem] tracking-[0.1em] uppercase transition-all duration-300 hover:bg-sage-dark hover:-translate-y-px"
          >
            Shop Now
          </a>
        </li>
      </ul>
    </nav>
  );
}
