import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { memo, useRef } from 'react';
import { Link } from 'react-router-dom';

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 EXACT THEME CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════
export const THEME = {
  cyan: '#02d3fe',
  blue: '#4e90e1',
  purple: '#9a5cb7',
  bg: '#0a0a0f',
  bgCard: 'rgba(15, 23, 42, 0.4)',
  bgCardHover: 'rgba(15, 23, 42, 0.6)',
  border: 'rgba(255, 255, 255, 0.05)',
  borderHover: 'rgba(2, 211, 254, 0.3)',
  borderPurple: 'rgba(154, 92, 183, 0.3)',
  textWhite: '#ffffff',
  textGray: '#94a3b8',
  textGrayDark: '#64748b',
  textMuted: '#475569',
  gradientPrimary: 'linear-gradient(135deg, #02d3fe, #4e90e1, #9a5cb7)',
  gradientCyanBlue: 'linear-gradient(135deg, #02d3fe, #4e90e1)',
  gradientBluePurple: 'linear-gradient(135deg, #4e90e1, #9a5cb7)',
  glowCyan: '0 0 30px rgba(2, 211, 254, 0.3)',
  glowPurple: '0 0 30px rgba(154, 92, 183, 0.3)',
  // Status
  emerald: '#10b981',
};

// ═══════════════════════════════════════════════════════════════════════════
// 🧩 REUSABLE UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export const GlassCard = memo(({ children, className = '', hover = true }) => (
  <div
    className={`relative rounded-2xl overflow-hidden ${className}`}
    style={{
      background: THEME.bgCard,
      backdropFilter: 'blur(10px)',
      border: `1px solid ${THEME.border}`,
      // 👇 CHANGE: 'all' ki jagah sirf border aur shadow par transition lagayein
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      // 👇 Optional: GSAP ke liye will-change hint
      willChange: 'transform, opacity',
    }}
    onMouseEnter={
      hover
        ? (e) => {
            e.currentTarget.style.borderColor = 'rgba(2, 211, 254, 0.3)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(2, 211, 254, 0.1)';
          }
        : undefined
    }
    onMouseLeave={
      hover
        ? (e) => {
            e.currentTarget.style.borderColor = THEME.border;
            e.currentTarget.style.boxShadow = 'none';
          }
        : undefined
    }
  >
    {children}
  </div>
));
GlassCard.displayName = 'GlassCard';

export const TechBadge = memo(({ name, icon: Icon }) => (
  <span
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 cursor-default"
    style={{
      background: 'rgba(2, 211, 254, 0.08)',
      border: '1px solid rgba(2, 211, 254, 0.2)',
      color: '#4e90e1',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'rgba(2, 211, 254, 0.15)';
      e.currentTarget.style.borderColor = 'rgba(2, 211, 254, 0.4)';
      e.currentTarget.style.color = '#02d3fe';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'rgba(2, 211, 254, 0.08)';
      e.currentTarget.style.borderColor = 'rgba(2, 211, 254, 0.2)';
      e.currentTarget.style.color = '#4e90e1';
    }}
  >
    {Icon && <Icon size={16} />}
    {name}
  </span>
));
TechBadge.displayName = 'TechBadge';

export const GradientText = memo(({ children, className = '' }) => (
  <span
    className={`bg-clip-text text-transparent ${className}`}
    style={{ backgroundImage: THEME.gradientPrimary }}
  >
    {children}
  </span>
));
GradientText.displayName = 'GradientText';

export const PrimaryButton = memo(({ children, href, to, onClick, icon: Icon, className = '' }) => {
  const content = (
    <span
      className={`relative inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white overflow-hidden group cursor-pointer ${className}`}
      style={{ background: THEME.gradientCyanBlue, transition: 'all 0.3s ease' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(2, 211, 254, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <span
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        }}
      />
      {Icon && <Icon size={18} className="relative z-10" />}
      <span className="relative z-10">{children}</span>
    </span>
  );
  if (to) {
    return <Link to={to}>{content}</Link>;
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {content}
      </a>
    );
  }
  return <button onClick={onClick}>{content}</button>;
});
PrimaryButton.displayName = 'PrimaryButton';

export const OutlineButton = memo(({ children, href, onClick, icon: Icon, className = '' }) => {
  const content = (
    <span
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer ${className}`}
      style={{
        background: 'transparent',
        border: `1px solid rgba(2, 211, 254, 0.4)`,
        color: '#02d3fe',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(2, 211, 254, 0.1)';
        e.currentTarget.style.borderColor = '#02d3fe';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = 'rgba(2, 211, 254, 0.4)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {Icon && <Icon size={18} />}
      {children}
    </span>
  );
  if (href) {
    return (
      <a href={href} onClick={onClick}>
        {content}
      </a>
    );
  }
  return <button onClick={onClick}>{content}</button>;
});
OutlineButton.displayName = 'OutlineButton';

/** Animated metric progress bar */
export const MetricBar = memo(({ label, value, width }) => {
  const barRef = useRef(null);

  useGSAP(
    () => {
      if (!barRef.current) return;
      gsap.fromTo(
        barRef.current,
        { width: '0%' },
        {
          width: `${width}%`,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: barRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    },
    { scope: barRef }
  );

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm" style={{ color: '#94a3b8' }}>
          {label}
        </span>
        <span className="font-bold" style={{ color: THEME.cyan }}>
          {value}
        </span>
      </div>
      <div className="w-full rounded-full h-2" style={{ background: '#1e293b' }}>
        <div
          ref={barRef}
          className="h-2 rounded-full"
          style={{
            width: '0%',
            background: THEME.gradientCyanBlue,
          }}
        />
      </div>
    </div>
  );
});
MetricBar.displayName = 'MetricBar';
