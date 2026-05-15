import { safeParse } from '@/Utils/Utils';
import { GlassCard, OutlineButton, PrimaryButton, TechBadge, THEME } from '@/components/UI';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  ExternalLink,
  FileText,
  Layers,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import MarkUpTextRender from '../sections/MarkUpTextRender';
import Particles from '../sections/Particles';

gsap.registerPlugin(useGSAP);

// ── Helpers ──────────────────────────────────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const STATUS_CONFIG = {
  active: {
    color: THEME.emerald || '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.2)',
  },
  draft: { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.2)' },
  inactive: {
    color: '#64748b',
    bg: 'rgba(100, 116, 139, 0.1)',
    border: 'rgba(100, 116, 139, 0.2)',
  },
};

// ── Section Heading ──────────────────────────────────────────────
const SectionHeading = memo(({ icon: Icon, title, subtitle }) => (
  <header className="mb-6 sm:mb-8">
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      className="flex items-center gap-2 sm:gap-3 mb-2"
    >
      <div
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(2, 211, 254, 0.15)' }}
      >
        <Icon
          size={18}
          className="sm:w-5 sm:h-5"
          style={{ color: THEME.cyan }}
          aria-hidden="true"
        />
      </div>
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: THEME.textWhite }}>
        {title}
      </h2>
    </motion.div>
    {subtitle && (
      <p className="text-xs sm:text-sm ml-10 sm:ml-14" style={{ color: THEME.textMuted }}>
        {subtitle}
      </p>
    )}
  </header>
));
SectionHeading.displayName = 'SectionHeading';

// ── Feature Card ─────────────────────────────────────────────────
const FeatureCard = memo(({ feature, index }) => (
  <motion.div
    initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
    whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={prefersReducedMotion ? {} : { duration: 0.45, delay: index * 0.07 }}
    whileHover={prefersReducedMotion ? undefined : { y: -4 }}
    className="h-full"
  >
    <div
      className="group relative p-3 sm:p-4 rounded-xl transition-all duration-300 cursor-default h-full"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${THEME.border}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(2, 211, 254, 0.2)';
        e.currentTarget.style.background = 'rgba(15, 23, 42, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = THEME.border;
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all mt-0.5"
          style={{ background: 'rgba(2, 211, 254, 0.1)' }}
        >
          <Check
            size={12}
            className="sm:w-3.5 sm:h-3.5"
            style={{ color: THEME.cyan }}
            aria-hidden="true"
          />
        </div>
        <p
          className="text-xs sm:text-sm font-medium transition-colors leading-relaxed break-words"
          style={{ color: THEME.textGray }}
        >
          {feature}
        </p>
      </div>
    </div>
  </motion.div>
));
FeatureCard.displayName = 'FeatureCard';

// ── Process Step ─────────────────────────────────────────────────
const ProcessStep = memo(({ number, title, description, delay, isLast }) => (
  <motion.div
    initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
    whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={prefersReducedMotion ? {} : { duration: 0.55, delay }}
    className="relative flex gap-4 sm:gap-5"
    role="listitem"
  >
    <div className="flex flex-col items-center">
      <motion.div
        whileHover={prefersReducedMotion ? undefined : { scale: 1.1, rotate: 5 }}
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 z-10"
        style={{ background: THEME.gradientCyanBlue, boxShadow: '0 0 15px rgba(2, 211, 254, 0.2)' }}
        aria-hidden="true"
      >
        <span style={{ color: '#ffffff' }}>{number}</span>
      </motion.div>
      {!isLast && (
        <div
          className="w-px flex-1 mt-2"
          style={{ background: 'linear-gradient(to bottom, rgba(2, 211, 254, 0.4), transparent)' }}
          aria-hidden="true"
        />
      )}
    </div>
    <div className={`${isLast ? 'pb-0' : 'pb-6 sm:pb-10'} w-full`}>
      <h3
        className="text-sm sm:text-base font-semibold mb-1 transition-colors duration-300"
        style={{ color: THEME.textWhite }}
      >
        {title}
      </h3>
      <p className="text-xs sm:text-sm leading-relaxed" style={{ color: THEME.textGrayDark }}>
        {description}
      </p>
    </div>
  </motion.div>
));
ProcessStep.displayName = 'ProcessStep';

// ── Color Config for Badges ───────────────────────────────────────────────────
const BADGE_COLORS = {
  // Cyan/Blue variants
  cyan: { bg: 'rgba(2, 211, 254, 0.12)', border: 'rgba(2, 211, 254, 0.4)', text: '#02d4fe' },
  blue: { bg: 'rgba(78, 144, 225, 0.12)', border: 'rgba(78, 144, 225, 0.4)', text: '#4e90e1' },

  // Success/Green
  green: { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.4)', text: '#10b981' },
  emerald: { bg: 'rgba(52, 211, 153, 0.12)', border: 'rgba(52, 211, 153, 0.4)', text: '#34d399' },

  // Warning/Yellow
  yellow: { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.4)', text: '#f59e0b' },
  orange: { bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.4)', text: '#f97316' },

  // Error/Red
  red: { bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.4)', text: '#ef4444' },
  rose: { bg: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244, 63, 94, 0.4)', text: '#f43f5e' },

  // Purple/Pink
  purple: { bg: 'rgba(154, 92, 183, 0.12)', border: 'rgba(154, 92, 183, 0.4)', text: '#9a5cb7' },
  pink: { bg: 'rgba(236, 72, 153, 0.12)', border: 'rgba(236, 72, 153, 0.4)', text: '#ec4899' },

  // Default fallback
  default: { bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.2)', text: THEME.textGray },
};

// ── Helper: Get badge style from color key or hex ───────────────────────────
const getBadgeStyle = (colorInput) => {
  // Agar predefined key hai (jaise 'cyan', 'green')
  if (BADGE_COLORS[colorInput]) {
    return BADGE_COLORS[colorInput];
  }
  // Agar hex/rgb string hai, to fallback generate karein
  return {
    bg: `${colorInput}15`,
    border: `${colorInput}40`,
    text: colorInput,
  };
};

// ── Stat Badge (Improved) ───────────────────────────────────────────────────
const StatBadge = ({ icon: Icon, label, value, color, variant = 'solid' }) => {
  // ✅ Color variants for consistent styling
  const variants = {
    solid: {
      bg: `${color}15`, // 8% opacity hex suffix
      border: `${color}40`, // 25% opacity
      text: color,
      icon: color,
    },
    soft: {
      bg: `${color}10`,
      border: 'transparent',
      text: color,
      icon: color,
    },
    outline: {
      bg: 'transparent',
      border: `${color}50`,
      text: color,
      icon: color,
    },
  };

  const style = variants[variant] || variants.solid;

  return (
    <div
      className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg 
                 transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        backdropFilter: 'blur(4px)',
      }}
      role="status"
    >
      <Icon
        size={12}
        className="sm:w-3.5 sm:h-3.5 flex-shrink-0 transition-transform duration-200 group-hover:rotate-3"
        style={{ color: style.icon }}
        aria-hidden="true"
      />

      {label && (
        <span className="text-[10px] sm:text-xs opacity-80" style={{ color: THEME.textGray }}>
          {label}
        </span>
      )}

      <span
        className="text-[10px] sm:text-xs font-semibold capitalize tracking-wide"
        style={{ color: style.text }}
      >
        {value}
      </span>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════
const ServiceDetailPage = memo(() => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const heroImageRef = useRef(null);

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { services } = useSelector((state) => state.service);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE || '';

  // ── SEO ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!service) return;
    document.title = service.seoMetaTitle || service.title || 'Service Details';
    let meta = document.querySelector('meta[name="description"]');
    const content = service.seoMetaDescription || service.shortDescription || '';
    if (meta) {
      meta.setAttribute('content', content);
    } else {
      meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = content;
      document.head.appendChild(meta);
    }
  }, [service]);

  // ── Data ─────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    if (services?.length) {
      const found = services.find((s) => s.slug === slug);
      if (found) {
        if (isMounted) setService(found);
        if (isMounted) setLoading(false);
        return;
      }
    }
    (async () => {
      try {
        const res = await fetch(`/api/services/${slug}`);
        const data = await res.json();
        if (data.success && isMounted) setService(data.data);
      } catch (err) {
        console.error('Failed to fetch service:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [slug, services]);

  // ── Parsed fields ────────────────────────────────────────────
  const techStack = useMemo(() => safeParse(service?.techStack) || [], [service?.techStack]);
  const features = useMemo(() => safeParse(service?.features) || [], [service?.features]);
  const serviceImage = useMemo(
    () => safeParse(service?.serviceImage) || {},
    [service?.serviceImage]
  );
  const imageUrl = useMemo(() => {
    if (!serviceImage?.url) return '/default-service.jpg';
    const cleanUrl = backendUrl.replace(/\/+$/, '');
    const path = serviceImage.url.replace(/^\/+/, '');
    return `${cleanUrl}/${path}`;
  }, [serviceImage?.url, backendUrl]);

  const statusCfg = useMemo(
    () => STATUS_CONFIG[service?.status] || STATUS_CONFIG.draft,
    [service?.status]
  );

  const PROCESS_STEPS = useMemo(
    () => [
      {
        title: 'Discovery & Planning',
        desc: 'Analyze requirements, define scope, build a milestone-driven roadmap.',
      },
      {
        title: 'Design & Prototyping',
        desc: 'Wireframes and interactive prototypes crafted for your approval.',
      },
      {
        title: 'Development',
        desc: 'Agile sprints with clean, documented code and CI/CD integration.',
      },
      {
        title: 'Testing & QA',
        desc: 'Unit, integration, and user acceptance testing for every deliverable.',
      },
      {
        title: 'Deployment & Support',
        desc: 'Production rollout with monitoring and 30 days of complimentary support.',
      },
    ],
    []
  );

  // ── GSAP ─────────────────────────────────────────────────────
  useGSAP(
    () => {
      if (!service || loading || prefersReducedMotion) return;

      const heroContent = heroRef.current?.querySelector('.hero-content');
      if (heroContent) {
        gsap.from(heroContent.children, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        });
      }

      if (heroImageRef.current) {
        gsap.from(heroImageRef.current, {
          x: 50,
          opacity: 0,
          duration: 1,
          delay: 0.3,
          ease: 'power3.out',
        });
      }

      const detailCards = document.querySelectorAll('.detail-card');
      detailCards.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
          y: 40,
          opacity: 0,
          duration: 0.6,
          delay: (index % 3) * 0.1,
          ease: 'power3.out',
        });
      });

      gsap.to('.gradient-orb', {
        scale: 1.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    },
    { scope: pageRef, dependencies: [service, loading] }
  );

  // ── Structured Data ──────────────────────────────────────────
  const structuredData = useMemo(() => {
    if (!service) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      description: service.shortDescription || service.fullDescription,
      url: `${window.location.origin}/services/${slug}`,
      provider: {
        '@type': 'Organization',
        name: 'Portfolio',
      },
      offers: {
        '@type': 'Offer',
        url: `${window.location.origin}/contact`,
        priceCurrency: 'USD',
        availability:
          service.status === 'active'
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
      },
    };
  }, [service, slug]);

  // ── Contact CTA ──────────────────────────────────────────────
  const handleGetStarted = useCallback(() => {
    const params = new URLSearchParams({
      service: slug,
      subject: `Interested in ${service.title} Service`,
      message: `Hi, I'm interested in your "${service.title}" service.\n\nCategory: ${service.category}\nPreferred Stack: ${techStack.slice(0, 3).join(', ')}\nExpected Timeline: ${service.deliveryTime || 'Flexible'}\n\nPlease let me know the next steps.\n\nBest regards,`,
    });
    navigate(`/contact?${params.toString()}`);
  }, [navigate, service, slug, techStack]);

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: THEME.bg }}
        aria-label="Loading service details"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-2 border-t-transparent"
          style={{ borderColor: THEME.cyan, borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (!service) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: THEME.bg }}
        aria-label="Service not found"
      >
        <div className="text-center space-y-4 sm:space-y-5 px-4">
          <p className="text-lg sm:text-xl" style={{ color: THEME.textWhite }}>
            Service not found
          </p>
          <PrimaryButton
            onClick={() => navigate('/services')}
            className="w-full sm:w-auto justify-center"
          >
            Back to Services
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <main
      ref={pageRef}
      className="relative  overflow-x-hidden"
      style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
      aria-label={`${service.title} Service Details`}
    >
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🌌 BACKGROUND LAYERS                                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <div
          className="gradient-orb absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full blur-[80px] md:blur-[120px] animate-pulse"
          style={{ background: 'rgba(2, 211, 254, 0.12)' }}
        />
        <div
          className="gradient-orb absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full blur-[80px] md:blur-[120px] animate-pulse"
          style={{ animationDelay: '1s', background: 'rgba(78, 144, 225, 0.12)' }}
        />
        <div
          className="gradient-orb absolute top-1/2 left-1/2 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full blur-[60px] md:blur-[100px] animate-pulse"
          style={{ animationDelay: '2s', background: 'rgba(154, 92, 183, 0.1)' }}
        />
      </div>

      <Particles />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🦸 HERO SECTION                                                    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center pt-20 pb-8 sm:pt-24 sm:pb-12"
        style={{ zIndex: 2 }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 w-full">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.5,
              delay: prefersReducedMotion ? 0 : 0.1,
            }}
            onClick={() => navigate('/services')}
            className="inline-flex items-center gap-2 mb-4 sm:mb-8 group transition-colors duration-300 hover:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-md p-1 -ml-1"
            style={{ color: THEME.textGray }}
            aria-label="Go back to services list"
          >
            <ArrowLeft
              size={16}
              className="sm:w-[18px] sm:h-[18px] transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden="true"
            />
            <span className="text-xs sm:text-sm font-medium">Back to Services</span>
          </motion.button>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Text Content */}
            <article ref={heroRef} className="hero-content order-2 md:order-1">
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? {} : { duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6"
                style={{
                  background: 'rgba(2, 211, 254, 0.1)',
                  border: '1px solid rgba(2, 211, 254, 0.2)',
                }}
              >
                <Layers
                  size={12}
                  className="sm:w-3.5 sm:h-3.5"
                  style={{ color: THEME.cyan }}
                  aria-hidden="true"
                />
                <span
                  className="text-[10px] sm:text-xs font-medium uppercase tracking-wider"
                  style={{ color: THEME.cyan }}
                >
                  {service.category}
                </span>
              </motion.div>

              <h1
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-[1.1] sm:leading-tight"
                style={{ color: THEME.textGray }}
              >
                {service.title}
              </h1>

              <p
                className="text-sm sm:text-lg md:text-xl mb-3 sm:mb-4 font-light max-w-xl"
                style={{ color: THEME.textGray }}
              >
                {service.shortDescription}
              </p>

              {/* Status / Delivery Badges */}
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? {} : { duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8"
                aria-label="Service details"
              >
                {service.deliveryTime && (
                  <StatBadge
                    icon={Clock}
                    label="Delivery:"
                    value={service.deliveryTime}
                    color={THEME.cyan}
                  />
                )}
                <StatBadge
                  icon={BadgeCheck}
                  label=""
                  value={service.status || 'draft'}
                  color={statusCfg.color}
                />
                {service.isFeatured && (
                  <StatBadge icon={Star} label="" value="Featured" color="#fbbf24" />
                )}
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? {} : { duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-3 sm:gap-4 w-full sm:w-auto"
              >
                <PrimaryButton
                  onClick={handleGetStarted}
                  icon={Zap}
                  className="w-full sm:w-auto justify-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base"
                >
                  Get Started
                </PrimaryButton>
                <OutlineButton
                  onClick={() => navigate('/contact?subject=Quick%20Inquiry')}
                  icon={Calendar}
                  className="w-full sm:w-auto justify-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base"
                >
                  Schedule Call
                </OutlineButton>
              </motion.div>
            </article>

            {/* Hero Image */}
            <figure ref={heroImageRef} className="relative hidden md:block order-1 md:order-2">
              <div
                className="absolute -inset-3 sm:-inset-4 rounded-2xl sm:rounded-3xl opacity-30 blur-2xl pointer-events-none"
                style={{ background: THEME.gradientPrimary }}
                aria-hidden="true"
              />
              <div
                className="relative rounded-xl sm:rounded-2xl overflow-hidden"
                style={{
                  boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                  border: `1px solid rgba(2, 211, 254, 0.1)`,
                }}
              >
                <img
                  src={imageUrl}
                  alt={`${service.title} hero image`}
                  onLoad={() => setImageLoaded(true)}
                  className={`w-full aspect-video object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  loading="eager"
                  width="800"
                  height="450"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(10,10,15,0.95), rgba(10,10,15,0.3), transparent)',
                  }}
                  aria-hidden="true"
                />

                {/* Overlay Info Card */}
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={prefersReducedMotion ? {} : { delay: 1.1 }}
                  className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5 rounded-lg sm:rounded-xl p-2.5 sm:p-4"
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${THEME.border}`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p
                        className="text-[10px] sm:text-xs font-medium uppercase tracking-wider"
                        style={{ color: THEME.textMuted }}
                      >
                        Category
                      </p>
                      <p className="text-xs sm:text-sm font-semibold" style={{ color: THEME.cyan }}>
                        {service.category}
                      </p>
                    </div>
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(2, 211, 254, 0.15)' }}
                      aria-hidden="true"
                    >
                      <Sparkles
                        size={16}
                        className="sm:w-[18px] sm:h-[18px]"
                        style={{ color: THEME.cyan }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative */}
              <div
                className="absolute -top-3 sm:-top-4 -right-3 sm:-right-4 w-20 h-20 sm:w-24 sm:h-24 rounded-full blur-xl animate-pulse"
                style={{ background: 'rgba(2, 211, 254, 0.2)' }}
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-3 sm:-bottom-4 -left-3 sm:-left-4 w-24 h-24 sm:w-32 sm:h-32 rounded-full blur-xl animate-pulse"
                style={{ animationDelay: '1s', background: 'rgba(78, 144, 225, 0.2)' }}
                aria-hidden="true"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📋 CONTENT SECTIONS                                                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-12 sm:py-16 md:py-24" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          {/* 1. Full Description */}
          <section className="mb-12 sm:mb-16 md:mb-20" aria-labelledby="overview-heading">
            <SectionHeading
              icon={FileText}
              title="Service Overview"
              subtitle="Detailed breakdown of what you get"
            />
            <GlassCard className="detail-card p-4 sm:p-6 md:p-8">
              <div
                className="prose prose-invert prose-sm sm:prose max-w-none break-words"
                style={{ color: THEME.textGray }}
              >
                <MarkUpTextRender markedDesc={service.fullDescription} />
              </div>
            </GlassCard>
          </section>

          {/* 2. Tech Stack */}
          {techStack.length > 0 && (
            <section className="mb-12 sm:mb-16 md:mb-20" aria-labelledby="tech-heading">
              <SectionHeading
                icon={Code2}
                title="Technology Stack"
                subtitle={`${techStack.length} tools & frameworks`}
              />
              <GlassCard className="detail-card p-4 sm:p-6 md:p-8">
                <div className="flex flex-wrap gap-2" role="list" aria-label="Technologies used">
                  {techStack.map((tech, i) => (
                    <TechBadge key={`${tech}-${i}`} name={tech} />
                  ))}
                </div>
              </GlassCard>
            </section>
          )}

          {/* 3. Features */}
          {features.length > 0 && (
            <section className="mb-12 sm:mb-16 md:mb-20" aria-labelledby="features-heading">
              <SectionHeading
                icon={CheckCircle2}
                title="Key Features"
                subtitle={`${features.length} deliverables included`}
              />
              <GlassCard className="detail-card p-4 sm:p-6 md:p-8">
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3"
                  role="list"
                  aria-label="Service features"
                >
                  {features.map((feat, i) => (
                    <FeatureCard key={`${feat}-${i}`} feature={feat} index={i} />
                  ))}
                </div>
              </GlassCard>
            </section>
          )}

          {/* 4. Process */}
          <section className="mb-12 sm:mb-16 md:mb-20" aria-labelledby="process-heading">
            <SectionHeading
              icon={Cpu}
              title="Development Process"
              subtitle="How we deliver your project"
            />
            <GlassCard className="detail-card p-4 sm:p-6 md:p-8">
              <div role="list" aria-label="Development steps">
                {PROCESS_STEPS.map((step, i) => (
                  <ProcessStep
                    key={i}
                    number={i + 1}
                    title={step.title}
                    description={step.desc}
                    delay={prefersReducedMotion ? 0 : i * 0.08}
                    isLast={i === PROCESS_STEPS.length - 1}
                  />
                ))}
              </div>
            </GlassCard>
          </section>

          {/* 5. CTA */}
          <section aria-label="Start project call to action">
            <div
              className="rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 detail-card text-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(2, 211, 254, 0.15), rgba(154, 92, 183, 0.15))',
                border: '1px solid rgba(2, 211, 254, 0.2)',
                boxShadow: '0 0 40px rgba(2, 211, 254, 0.05)',
              }}
            >
              <motion.div
                initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
                whileInView={prefersReducedMotion ? undefined : { scale: 1 }}
                viewport={{ once: true }}
                transition={prefersReducedMotion ? {} : { duration: 0.6 }}
                className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-4 sm:mb-6 mx-auto"
                style={{ background: 'rgba(2, 211, 254, 0.15)' }}
                aria-hidden="true"
              >
                <Sparkles size={24} className="sm:w-8 sm:h-8" style={{ color: THEME.cyan }} />
              </motion.div>
              <motion.h2
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={prefersReducedMotion ? {} : { duration: 0.6, delay: 0.1 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3"
                style={{ color: THEME.textWhite }}
              >
                Ready to Get Started?
              </motion.h2>
              <motion.p
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={prefersReducedMotion ? {} : { duration: 0.6, delay: 0.2 }}
                className="text-sm sm:text-base mb-6 sm:mb-7 max-w-xl mx-auto px-4 sm:px-0"
                style={{ color: THEME.textGray }}
              >
                Let's discuss your project requirements and create something exceptional together.
              </motion.p>
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={prefersReducedMotion ? {} : { duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
              >
                <PrimaryButton
                  onClick={handleGetStarted}
                  icon={ExternalLink}
                  className="w-full sm:w-auto justify-center"
                >
                  Start Project
                </PrimaryButton>
                <OutlineButton
                  onClick={() => navigate('/contact?subject=Quick%20Inquiry')}
                  icon={Calendar}
                  className="w-full sm:w-auto justify-center"
                >
                  Schedule Call
                </OutlineButton>
              </motion.div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
});

ServiceDetailPage.displayName = 'ServiceDetailPage';
export default ServiceDetailPage;
