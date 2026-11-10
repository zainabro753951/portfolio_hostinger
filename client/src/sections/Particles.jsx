import { memo } from 'react';

const Particles = memo(() => {
  return (
    <div
      className="fixed inset-0 pointer-events-none hidden md:block select-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {[...Array(15)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full animate-pulse motion-reduce:animate-none"
          style={{
            left: `${(i * 7.3) % 100}%`,
            top: `${(i * 13.7) % 100}%`,
            background:
              i % 3 === 0
                ? 'rgb(var(--brand-cyan))'
                : i % 3 === 1
                  ? 'rgb(var(--brand-blue))'
                  : 'rgb(var(--brand-purple))',
            opacity: 0.15 + (i % 3) * 0.1,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${3 + (i % 4)}s`,
          }}
        />
      ))}
    </div>
  );
});

Particles.displayName = 'Particles';
export default Particles;
