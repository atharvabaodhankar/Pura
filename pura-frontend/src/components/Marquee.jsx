const items = [
  'Natural Origin', 'Dermatologist Tested', 'Paraben Free', 'Family Safe',
  'Cruelty Free', 'Aloe Vera Enriched', 'No Harsh Chemicals', 'pH Balanced',
];

export default function Marquee() {
  return (
    <div className="bg-charcoal py-5 overflow-hidden flex">
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="contents">
            <span className="font-heading text-[1.1rem] italic text-cream/70 tracking-[0.05em] shrink-0">
              {item}
            </span>
            <span className="text-sage-light text-[1.2rem] shrink-0 not-italic">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
