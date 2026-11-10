import { EASE_OUT, VIEWPORT_ONCE, useMotionPrefs } from '@/lib/motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Fragment, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { safeParse, SERVICE_GRADIENTS } from '../Utils/Utils';

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 THEME (LEGACY BRIDGE)
// Pages still read these values for inline styles. Values are now ALIGNED with
// DESIGN_SYSTEM.md tokens so un-migrated pages already match the new palette.
// Do not add keys. New code must use Tailwind token classes
// (brand-*, surface-*, ink-*, line-*) instead of THEME.
// ═══════════════════════════════════════════════════════════════════════════
export const THEME = {
  cyan: '#02d3fe',
  blue: '#4e90e1',
  purple: '#9a5cb7',
  bg: '#0a0a0f',
  bgCard: 'rgba(25, 25, 35, 0.6)',
  bgCardHover: 'rgba(25, 25, 35, 0.8)',
  border: 'rgba(255, 255, 255, 0.08)',
  borderHover: 'rgba(2, 211, 254, 0.3)',
  borderPurple: 'rgba(154, 92, 183, 0.3)',
  textWhite: '#f5f7fa',
  textGray: '#a1a1b2',
  textGrayDark: '#737386',
  textMuted: '#737386',
  gradientPrimary: 'linear-gradient(135deg, #02d3fe 0%, #4e90e1 55%, #9a5cb7 100%)',
  gradientCyanBlue: 'linear-gradient(135deg, #02d3fe, #4e90e1)',
  gradientBluePurple: 'linear-gradient(135deg, #4e90e1, #9a5cb7)',
  glowCyan: '0 0 40px -8px rgba(2, 211, 254, 0.16)',
  glowPurple: '0 0 40px -8px rgba(154, 92, 183, 0.16)',
  emerald: '#10b981',
};

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base';

// ═══════════════════════════════════════════════════════════════════════════
// 🧩 PRIMITIVES — public API (props) unchanged
// ═══════════════════════════════════════════════════════════════════════════

export const GlassCard = memo(({ children, className = '', hover = true }) => (
  <div
    className={`relative overflow-hidden rounded-2xl border border-line-subtle bg-surface-card/60 transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none ${
      hover ? 'hover:border-brand-cyan/30 hover:shadow-glow-cyan' : ''
    } ${className}`}
  >
    {children}
  </div>
));
GlassCard.displayName = 'GlassCard';

export const TechBadge = memo(({ name, icon: Icon }) => (
  <span className="inline-flex cursor-default items-center gap-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/[0.08] px-3 py-1.5 text-xs font-medium text-brand-blue transition-colors duration-300 hover:border-brand-cyan/40 hover:bg-brand-cyan/15 hover:text-brand-cyan motion-reduce:transition-none sm:px-4 sm:py-2 sm:text-sm">
    {Icon && <Icon size={14} className="shrink-0 sm:h-4 sm:w-4" aria-hidden="true" />}
    {name}
  </span>
));
TechBadge.displayName = 'TechBadge';

export const GradientText = memo(({ children, className = '' }) => (
  <span className={`bg-[image:var(--gradient-brand)] bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
));
GradientText.displayName = 'GradientText';

const BTN_BASE = `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:px-6 sm:text-base ${FOCUS_RING}`;
// Dark text on the cyan→blue gradient: ~6–11:1 contrast (white was ~1.8:1)
const BTN_PRIMARY = `${BTN_BASE} bg-[image:var(--gradient-cyan-blue)] text-surface-base hover:shadow-[0_10px_30px_-10px_rgb(var(--brand-cyan)/0.55)]`;
const BTN_OUTLINE = `${BTN_BASE} border border-brand-cyan/40 text-brand-cyan hover:border-brand-cyan hover:bg-brand-cyan/10`;

export const PrimaryButton = memo(
  ({ children, href, to, onClick, icon: Icon, className = '', type = 'button' }) => {
    const cls = `${BTN_PRIMARY} ${className}`;
    const inner = (
      <>
        {Icon && <Icon size={18} className="shrink-0" aria-hidden="true" />}
        <span>{children}</span>
      </>
    );
    if (to) {
      return (
        <Link to={to} onClick={onClick} className={cls}>
          {inner}
        </Link>
      );
    }
    if (href) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={cls}>
          {inner}
        </a>
      );
    }
    return (
      <button onClick={onClick} type={type} className={cls}>
        {inner}
      </button>
    );
  }
);
PrimaryButton.displayName = 'PrimaryButton';

export const OutlineButton = memo(({ children, href, to, onClick, icon: Icon, className = '' }) => {
  const cls = `${BTN_OUTLINE} ${className}`;
  const inner = (
    <>
      {Icon && <Icon size={18} className="shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </>
  );
  if (to) {
    return (
      <Link to={to} onClick={onClick} className={cls}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} onClick={onClick} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <button onClick={onClick} type="button" className={cls}>
      {inner}
    </button>
  );
});
OutlineButton.displayName = 'OutlineButton';

/** Metric progress bar — `width` is a 0–100 percentage. (GSAP removed) */
export const MetricBar = memo(({ label, value, width }) => {
  const { reduced } = useMotionPrefs();
  const pct = Math.min(100, Math.max(0, Number(width) || 0));

  return (
    <div
      className="w-full rounded-xl border border-line-subtle bg-surface-card/60 p-4"
      role="group"
      aria-label={`${label}: ${value}%`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="truncate text-xs text-ink-secondary sm:text-sm">{label}</span>
        <span className="shrink-0 text-xs font-bold text-brand-cyan sm:text-sm">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-soft">
        <motion.div
          className="h-full rounded-full bg-[image:var(--gradient-cyan-blue)]"
          style={{ width: `${pct}%` }}
          initial={{ x: reduced ? '0%' : '-100%' }}
          whileInView={{ x: '0%' }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: reduced ? 0.01 : 1.1, ease: EASE_OUT }}
        />
      </div>
    </div>
  );
});
MetricBar.displayName = 'MetricBar';

// ═══════════════════════════════════════════════════════════════════════════
// 🧩 HERO PIECES
// ═══════════════════════════════════════════════════════════════════════════

export const HeroBadge = memo(({ successNote }) => {
  const { reduced, isMobile } = useMotionPrefs();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : isMobile ? 10 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.01 : 0.5, delay: reduced ? 0 : 0.15, ease: EASE_OUT }}
      role="status"
      aria-label="Current availability status"
      className="mx-auto mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/10 px-3 py-1.5 sm:mb-6 sm:px-4 sm:py-2 md:mb-8 lg:mx-0"
    >
      <Sparkles size={14} className="shrink-0 text-brand-cyan" aria-hidden="true" />
      <span className="max-w-[220px] truncate text-xs text-ink-secondary sm:max-w-none sm:text-sm">
        {successNote || 'Available for work'}
      </span>
    </motion.div>
  );
});
HeroBadge.displayName = 'HeroBadge';

/**
 * Per-character reveal (motion/react — no GSAP). `.char` class kept for styling hooks.
 * Characters are grouped per word so long names WRAP at word boundaries
 * instead of overflowing at 300px. `headingRef` is optional (kept for compatibility).
 */
export const HeroHeading = memo(({ headingText, headingRef }) => {
  const { reduced, isMobile } = useMotionPrefs();

  const words = useMemo(() => {
    let offset = 0;
    return headingText.split(' ').map((word) => {
      const start = offset;
      offset += word.length + 1;
      return { word, start };
    });
  }, [headingText]);

  const name = useMemo(() => headingText.replace("HI, I'M ", ''), [headingText]);

  const parentVariants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          delayChildren: reduced ? 0 : 0.15,
          staggerChildren: reduced ? 0 : isMobile ? 0.03 : 0.045,
        },
      },
    }),
    [reduced, isMobile]
  );
  const charVariants = useMemo(
    () => ({
      hidden: { y: reduced ? 0 : '105%', opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: reduced ? 0.01 : 0.8, ease: EASE_OUT },
      },
    }),
    [reduced]
  );

  return (
    <motion.h1
      ref={headingRef}
      variants={parentVariants}
      initial="hidden"
      animate="visible"
      className="mb-3 overflow-hidden pb-1 text-[clamp(2rem,9.5vw,3.25rem)] font-bold leading-[1.08] tracking-tight text-ink sm:mb-4 md:mb-6 md:text-[clamp(3.25rem,6vw,4.75rem)]"
      aria-label={`Hi, I'm ${name}`}
    >
      {words.map(({ word, start }, wi) => (
        <Fragment key={`hero-word-${wi}`}>
          <span className="inline-block whitespace-nowrap" aria-hidden="true">
            {word.split('').map((char, ci) => (
              <motion.span
                key={`hero-char-${wi}-${ci}`}
                variants={charVariants}
                className={`char inline-block ${start + ci > 6 ? 'text-brand-cyan' : 'text-ink'}`}
              >
                {char}
              </motion.span>
            ))}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </motion.h1>
  );
});
HeroHeading.displayName = 'HeroHeading';

export const HeroStats = memo(({ stats }) => (
  <div
    className="flex w-full flex-wrap justify-center gap-x-6 gap-y-4 sm:gap-x-8 md:gap-x-10 lg:justify-start"
    role="list"
    aria-label="Professional statistics"
  >
    {stats.map((stat, index) => (
      <div
        key={`hero-stat-${index}`}
        role="listitem"
        className="min-w-0 flex-1 text-center sm:flex-none lg:text-left"
      >
        <div className="mb-0.5 truncate px-1 text-xl font-bold text-brand-cyan sm:text-2xl md:text-3xl">
          {stat.value}
        </div>
        <div className="mx-auto max-w-[120px] truncate px-1 text-xs text-ink-muted lg:mx-0">
          {stat.label}
        </div>
      </div>
    ))}
  </div>
));
HeroStats.displayName = 'HeroStats';

export const FloatingCard = memo(({ children, delay, position, label }) => {
  const { reduced, isMobile } = useMotionPrefs();
  const dist = reduced ? 0 : isMobile ? 16 : 32;
  return (
    <motion.div
      initial={{ opacity: 0, x: position === 'left' ? -dist : dist }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: reduced ? 0.01 : 0.7,
        delay: reduced ? 0 : isMobile ? Math.min(delay, 0.6) : delay,
        ease: EASE_OUT,
      }}
      className={`absolute z-20 max-w-[85%] rounded-2xl border border-line-subtle bg-surface-elevated/90 p-3 shadow-lg shadow-black/40 sm:p-4 ${
        position === 'left'
          ? 'bottom-12 left-0 sm:bottom-16 sm:left-2 md:-left-4 md:bottom-20 lg:-left-8'
          : 'right-0 top-12 sm:-right-2 sm:top-16 md:-right-3 md:top-20 lg:-right-4'
      }`}
      role="group"
      aria-label={label}
    >
      {children}
    </motion.div>
  );
});
FloatingCard.displayName = 'FloatingCard';

// ═══════════════════════════════════════════════════════════════════════════
// 🧩 SERVICE CARD — data logic (safeParse, image URL, slug link) preserved
// ═══════════════════════════════════════════════════════════════════════════

export const ServiceCard = memo(({ service, index }) => {
  const { reduced, isMobile } = useMotionPrefs();
  const serviceImage = safeParse(service?.serviceImage);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE || '';
  const imageUrl = serviceImage?.url
    ? `${backendUrl.replace(/\/+$/, '')}/${serviceImage.url.replace(/^\/+/, '')}`
    : '';
  const gradient = SERVICE_GRADIENTS[index % SERVICE_GRADIENTS.length];
  const titleId = `service-title-${service?.id || index}`;

  return (
    <article
      className="group relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-line-subtle bg-surface-card/60 transition-[border-color,box-shadow] duration-300 hover:border-brand-cyan/30 hover:shadow-glow-cyan motion-reduce:transition-none"
      aria-labelledby={titleId}
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            loading="lazy"
            decoding="async"
            width="400"
            height="300"
          />
        ) : (
          <div className="absolute inset-0 opacity-20" style={{ background: gradient }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-base/95 via-surface-base/60 to-transparent" />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-20"
          style={{ background: gradient }}
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: reduced ? 0 : isMobile ? 16 : 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_ONCE}
        transition={{
          duration: reduced ? 0.01 : 0.55,
          delay: reduced ? 0 : Math.min(index, 5) * (isMobile ? 0.05 : 0.1),
          ease: EASE_OUT,
        }}
        className="relative z-10 flex h-full w-full flex-col justify-between p-4 sm:p-5 md:p-6"
      >
        <div>
          <h3
            id={titleId}
            className="mb-2 text-lg font-bold leading-tight text-ink transition-colors duration-300 group-hover:text-brand-cyan sm:text-xl"
          >
            {service?.title}
          </h3>
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-ink-secondary sm:mb-5">
            {service?.description}
          </p>
        </div>

        <Link
          to={`/services/${service?.slug}`}
          aria-label={`View details for ${service?.title || 'this service'}`}
          className={`group/link inline-flex min-h-11 w-fit items-center gap-2 rounded-lg text-sm font-semibold text-brand-cyan ${FOCUS_RING}`}
        >
          <span className="relative inline-block overflow-hidden leading-tight">
            <span className="block transition-transform duration-300 group-hover/link:-translate-y-full motion-reduce:transition-none motion-reduce:group-hover/link:translate-y-0">
              View Details
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-0 translate-y-full transition-transform duration-300 group-hover/link:translate-y-0 motion-reduce:hidden"
            >
              Learn More
            </span>
          </span>
          <ArrowRight
            size={16}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover/link:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover/link:translate-x-0"
          />
        </Link>
      </motion.div>
    </article>
  );
});
ServiceCard.displayName = 'ServiceCard';
