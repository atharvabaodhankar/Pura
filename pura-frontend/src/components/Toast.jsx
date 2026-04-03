export default function Toast({ show }) {
  return (
    <div
      className={`fixed bottom-8 right-8 bg-charcoal text-cream px-7 py-4 rounded-[1rem] text-[0.875rem] z-[300] flex items-center gap-2.5 transition-all duration-400 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-[100px] opacity-0'
      }`}
      style={{
        boxShadow: 'var(--shadow-toast)',
        transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1), opacity 0.4s',
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Added to your bag
    </div>
  );
}
