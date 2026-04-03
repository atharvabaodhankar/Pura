export default function Footer() {
  const columns = [
    {
      title: 'Products',
      links: ['Hand Sanitizers', 'Hand Creams', 'Bundles', 'Refills'],
    },
    {
      title: 'Company',
      links: ['Our Story', 'Ingredients', 'Sustainability', 'Careers'],
    },
    {
      title: 'Support',
      links: ['FAQ', 'Shipping & Returns', 'Contact Us', 'Track Order'],
    },
  ];

  return (
    <footer className="bg-charcoal px-16 pt-16 pb-8 text-cream/50 max-md:px-6 max-md:pt-12">
      <div className="max-w-[1300px] mx-auto grid grid-cols-[2fr_1fr_1fr_1fr] gap-16 pb-12 border-b border-cream/8 max-md:grid-cols-2 max-md:gap-8">
        {/* Brand */}
        <div>
          <div className="font-heading text-[2rem] font-semibold text-cream mb-3">
            Pur<span className="text-sage-light">a</span>
          </div>
          <div className="text-[0.85rem] leading-[1.7] text-cream/40 max-w-[280px] mb-6">
            Clean hands. Pure life. Made with love for every family in India and beyond.
          </div>
          <div className="flex gap-3">
            {['ig', 'tw', 'fb', 'yt'].map((s) => (
              <a
                key={s}
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center text-cream/50 no-underline text-[0.8rem] transition-all duration-300 hover:bg-sage-dark hover:text-white"
                style={{
                  background: 'rgba(245,240,232,0.08)',
                  border: '1px solid rgba(245,240,232,0.1)',
                }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-heading text-[1.1rem] font-semibold text-cream mb-5">{col.title}</h4>
            <ul className="list-none">
              {col.links.map((link) => (
                <li key={link} className="mb-3">
                  <a
                    href="#"
                    className="text-cream/40 no-underline text-[0.85rem] transition-colors duration-300 hover:text-sage-light"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-[1300px] mx-auto mt-8 flex items-center justify-between text-[0.78rem] text-cream/25">
        <span>© 2025 Pura Naturals. All rights reserved.</span>
        <span>Made with 🌿 in India</span>
      </div>
    </footer>
  );
}
