import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { safeParse, SERVICE_GRADIENTS } from '../Utils/Utils';

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
  emerald: '#10b981',
};

// ═══════════════════════════════════════════════════════════════════════════
// 🧩 HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const isReduced = prefersReducedMotion();

// ═══════════════════════════════════════════════════════════════════════════
// 🧩 REUSABLE UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export const GlassCard = memo(({ children, className = '', hover = true }) => {
  const cardRef = useRef(null);

  const handleMouseEnter = useCallback(
    (e) => {
      if (!hover || !cardRef.current) return;
      cardRef.current.style.borderColor = 'rgba(2, 211, 254, 0.3)';
      cardRef.current.style.boxShadow = '0 0 30px rgba(2, 211, 254, 0.1)';
    },
    [hover]
  );

  const handleMouseLeave = useCallback(
    (e) => {
      if (!hover || !cardRef.current) return;
      cardRef.current.style.borderColor = THEME.border;
      cardRef.current.style.boxShadow = 'none';
    },
    [hover]
  );

  return (
    <div
      ref={cardRef}
      className={`relative rounded-xl sm:rounded-2xl overflow-hidden ${className}`}
      style={{
        background: THEME.bgCard,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${THEME.border}`,
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
});
GlassCard.displayName = 'GlassCard';

export const TechBadge = memo(({ name, icon: Icon }) => (
  <span
    className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 cursor-default focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] focus:ring-cyan-500"
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
    role="status"
    aria-label={`Technology: ${name}`}
  >
    {Icon && <Icon size={14} className="sm:w-4 sm:h-4" aria-hidden="true" />}
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

export const PrimaryButton = memo(
  ({ children, href, to, onClick, icon: Icon, className = '', type = 'button' }) => {
    const content = (
      <span
        className={`relative inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-white overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] focus:ring-cyan-500 transition-all duration-300 ${className}`}
        style={{ background: THEME.gradientCyanBlue }}
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
          aria-hidden="true"
        />
        {Icon && <Icon size={16} className="sm:w-5 sm:h-5 relative z-10" aria-hidden="true" />}
        <span className="relative z-10 text-sm sm:text-base">{children}</span>
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
    return (
      <button onClick={onClick} type={type}>
        {content}
      </button>
    );
  }
);
PrimaryButton.displayName = 'PrimaryButton';

export const OutlineButton = memo(({ children, href, onClick, icon: Icon, className = '' }) => {
  const content = (
    <span
      className={`inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] focus:ring-cyan-500 ${className}`}
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
      {Icon && <Icon size={16} className="sm:w-5 sm:h-5" aria-hidden="true" />}
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
  const containerRef = useRef(null);

  useGSAP(
    () => {
      if (isReduced || !barRef.current) {
        if (barRef.current) gsap.set(barRef.current, { width: `${width}%` });
        return;
      }
      gsap.fromTo(
        barRef.current,
        { width: '0%' },
        {
          width: `${width}%`,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    },
    { scope: containerRef, dependencies: [width] }
  );

  return (
    <div
      ref={containerRef}
      className="rounded-xl p-4 w-full"
      style={{ background: 'rgba(255,255,255,0.05)' }}
      role="group"
      aria-label={`${label}: ${value}%`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs sm:text-sm truncate mr-2" style={{ color: '#94a3b8' }}>
          {label}
        </span>
        <span className="font-bold text-xs sm:text-sm flex-shrink-0" style={{ color: THEME.cyan }}>
          {value}%
        </span>
      </div>
      <div className="w-full rounded-full h-2" style={{ background: '#1e293b' }}>
        <div
          ref={barRef}
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: isReduced ? `${width}%` : '0%',
            background: THEME.gradientCyanBlue,
          }}
        />
      </div>
    </div>
  );
});
MetricBar.displayName = 'MetricBar';

/* ═══════════════════════════════════════════════════════════════════ */
/* 🧩 EXTRACTED REUSABLE SUB-COMPONENTS (HERO & FLOATING)            */
/* ═══════════════════════════════════════════════════════════════════ */

export const HeroBadge = memo(({ successNote }) => (
  <motion.div
    initial={isReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
    animate={isReduced ? undefined : { opacity: 1, y: 0 }}
    transition={isReduced ? {} : { duration: 0.6, delay: 0.2 }}
    role="status"
    aria-label="Current availability status"
    className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 md:mb-8 max-w-full mx-auto lg:mx-0"
    style={{
      background: 'rgba(2, 211, 254, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(2, 211, 254, 0.2)',
    }}
  >
    <Sparkles
      size={14}
      className="sm:w-4 sm:h-4"
      style={{ color: THEME.cyan }}
      aria-hidden="true"
    />
    <span
      className="text-[10px] sm:text-xs md:text-sm truncate max-w-[200px] sm:max-w-none"
      style={{ color: THEME.textGray }}
    >
      {successNote || 'Available for work'}
    </span>
  </motion.div>
));
HeroBadge.displayName = 'HeroBadge';

export const HeroHeading = memo(({ headingText, headingRef }) => {
  const chars = useMemo(() => {
    return headingText.split('').map((char, index) => {
      const isHighlight = index > 6;
      return (
        <span
          key={`hero-char-${index}`}
          className="char inline-block"
          style={{
            color: char === ' ' ? 'transparent' : isHighlight ? THEME.cyan : THEME.textWhite,
            textShadow: isHighlight ? '0 0 30px rgba(2, 211, 254, 0.5)' : 'none',
            willChange: 'transform, opacity',
          }}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  }, [headingText]);

  const name = useMemo(() => headingText.replace("HI, I'M ", ''), [headingText]);

  return (
    <h1
      ref={headingRef}
      className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-3 sm:mb-4 md:mb-6 overflow-hidden leading-tight px-1 sm:px-0"
      style={{ color: THEME.textWhite }}
      aria-label={`Hi, I'm ${name}`}
    >
      {chars}
    </h1>
  );
});
HeroHeading.displayName = 'HeroHeading';

export const HeroStats = memo(({ stats }) => {
  return (
    <div
      className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 justify-center lg:justify-start w-full"
      role="list"
      aria-label="Professional statistics"
    >
      {stats.map((stat, index) => (
        <div
          key={`hero-stat-${index}`}
          role="listitem"
          className="text-center min-w-0 flex-1 sm:flex-none"
        >
          <div
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 truncate px-1"
            style={{ color: THEME.cyan }}
          >
            {stat.value}
          </div>
          <div
            className="text-[10px] sm:text-xs truncate max-w-[120px] mx-auto lg:mx-0 px-1"
            style={{ color: THEME.textGrayDark }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
});
HeroStats.displayName = 'HeroStats';

export const FloatingCard = memo(({ children, delay, position, label }) => (
  <motion.div
    initial={isReduced ? { opacity: 1, x: 0 } : { opacity: 0, x: position === 'left' ? -50 : 50 }}
    animate={isReduced ? undefined : { opacity: 1, x: 0 }}
    transition={isReduced ? {} : { duration: 1, delay: isReduced ? 0 : delay }}
    className={`absolute z-20 p-3 sm:p-4 rounded-xl sm:rounded-2xl ${
      position === 'left'
        ? 'bottom-12 sm:bottom-16 md:bottom-20 left-0 sm:left-2 md:-left-4 lg:-left-8'
        : 'top-12 sm:top-16 md:top-20 right-0 sm:-right-2 md:-right-3 lg:-right-4'
    }`}
    role="complementary"
    aria-label={label}
    style={{
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${THEME.border}`,
      boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
      transformStyle: 'preserve-3d',
      maxWidth: '85%',
    }}
  >
    {children}
  </motion.div>
));
FloatingCard.displayName = 'FloatingCard';

export const ServiceCard = memo(({ service, index }) => {
  const serviceImage = safeParse(service?.serviceImage);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE || '';
  const imageUrl = serviceImage?.url
    ? `${backendUrl.replace(/\/+$/, '')}/${serviceImage.url.replace(/^\/+/, '')}`
    : '';

  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className="group relative rounded-2xl overflow-hidden h-full"
      role="article"
      aria-labelledby={`service-title-${service?.id || index}`}
      style={{
        background: THEME.bgCard,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${THEME.border}`,
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        transition: 'border-color 0.3s ease, transform 0.3s ease',
        minHeight: '280px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          // Trigger hover effect or navigation logic
        }
      }}
    >
      {/* 🔹 BACKGROUND LAYER */}
      <div className="absolute inset-0 pointer-events-none">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            decoding="async"
            width="400"
            height="300"
          />
        ) : (
          <div
            className="absolute inset-0 opacity-20 sm:opacity-30"
            style={{ background: SERVICE_GRADIENTS[index % SERVICE_GRADIENTS.length] }}
            aria-hidden="true"
          />
        )}
        {/* Dark Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,10,15,0.95), rgba(10,10,15,0.6), transparent)',
          }}
          aria-hidden="true"
        />
        {/* Hover Gradient Overlay */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-20' : 'opacity-0'}`}
          style={{ background: SERVICE_GRADIENTS[index % SERVICE_GRADIENTS.length] }}
          aria-hidden="true"
        />
      </div>

      {/* 🔹 CONTENT LAYER */}
      <motion.div
        initial={isReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        whileInView={isReduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={
          isReduced ? {} : { duration: 0.6, delay: isReduced ? 0 : index * 0.1, ease: 'power3.out' }
        }
        whileHover={isReduced ? undefined : { y: -5 }}
        className="relative z-10 p-4 sm:p-5 md:p-6 w-full h-full flex flex-col justify-between"
      >
        <div>
          <h3
            id={`service-title-${service?.id || index}`}
            className="text-lg sm:text-xl font-bold mb-2 leading-tight transition-colors duration-300 group-hover:text-cyan-400"
            style={{ color: THEME.textWhite }}
          >
            {service?.title}
          </h3>
          <p
            className="text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 line-clamp-3"
            style={{ color: THEME.textGray }}
          >
            {service?.description}
          </p>
        </div>

        <Link
          to={`/services/${service?.slug}`}
          className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold transition-colors duration-300 cursor-pointer py-2 group/link w-fit"
          style={{ color: THEME.cyan }}
          aria-label={`View details for ${service?.title || 'this service'}`}
        >
          <span className="relative inline-block overflow-hidden leading-tight">
            <span className="block transition-transform duration-300 group-hover/link:-translate-y-full">
              View Details
            </span>
            <span className="absolute inset-0 translate-y-full transition-transform duration-300 group-hover/link:translate-y-0">
              Learn More
            </span>
          </span>
          <motion.div
            animate={isReduced ? undefined : { x: [0, 5, 0] }}
            transition={isReduced ? {} : { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ArrowRight size={14} className="sm:w-4 sm:h-4" aria-hidden="true" />
          </motion.div>
        </Link>
      </motion.div>

      {/* Border Overlay */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500 group-hover:border-cyan-500/30"
        style={{ border: `1px solid ${THEME.border}` }}
      />
    </article>
  );
});
ServiceCard.displayName = 'ServiceCard';
