import { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const prog =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;
      setWidth(prog);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-0.5 z-[200] transition-[width] duration-100"
      style={{
        width: `${width}%`,
        background: 'linear-gradient(90deg, var(--color-sage), var(--color-earth))',
      }}
    />
  );
}
