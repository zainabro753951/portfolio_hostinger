import { safeParse, SERVICE_COLOR_PALETTES } from '@/Utils/Utils.js';
import { GradientText, OutlineButton, PrimaryButton, TechBadge, THEME } from '@/components/UI';
import { useGSAP } from '@gsap/react';
import { domAnimation, LazyMotion, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Calendar,
  Clock,
  Code,
  Globe,
  Layers,
  MessageCircle,
  Palette,
  Shield,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DEFAULT_PALETTES = [
  { gradient: 'linear-gradient(135deg, #02d3fe, #4e90e1)' },
  { gradient: 'linear-gradient(135deg, #9a5cb7, #ec4899)' },
  { gradient: 'linear-gradient(135deg, #4e90e1, #9a5cb7)' },
  { gradient: 'linear-gradient(135deg, #f59e0b, #02d3fe)' },
];

const ADDITIONAL_SERVICES = [
  {
    icon: Smartphone,
    title: 'Mobile Development',
    description: 'Creating responsive mobile-first experiences and progressive web apps.',
  },
  {
    icon: Globe,
    title: 'SEO Optimization',
    description: 'Improving your website visibility and ranking on search engines.',
  },
  {
    icon: Layers,
    title: '3D Design',
    description: 'Adding depth to your projects with stunning 3D elements and animations.',
  },
  {
    icon: Sparkles,
    title: 'Consulting',
    description: 'Expert advice to help you make the right technical decisions.',
  },
];

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Discovery',
    description:
      'Understanding your goals, target audience, and project requirements through in-depth discussions.',
    icon: MessageCircle,
    duration: '1-2 Days',
  },
  {
    number: '02',
    title: 'Strategy',
    description: 'Developing a comprehensive plan with timelines, milestones, and deliverables.',
    icon: Calendar,
    duration: '2-3 Days',
  },
  {
    number: '03',
    title: 'Design',
    description: 'Creating wireframes, mockups, and prototypes to visualize the final product.',
    icon: Palette,
    duration: '1-2 Weeks',
  },
  {
    number: '04',
    title: 'Development',
    description: 'Building the solution with clean code and modern technologies.',
    icon: Code,
    duration: '2-4 Weeks',
  },
  {
    number: '05',
    title: 'Launch',
    description: 'Deploying your project and ensuring everything runs smoothly.',
    icon: Shield,
    duration: '1 Day',
  },
];

const BENEFITS = [
  { icon: Clock, text: 'On-time Delivery' },
  { icon: Shield, text: 'Quality Assurance' },
  { icon: MessageCircle, text: '24/7 Support' },
  { icon: Zap, text: 'Fast Turnaround' },
];

// ═══════════════════════════════════════════════════════════════════════════
// 🧩 SERVICE CARD
// ═══════════════════════════════════════════════════════════════════════════
const ServiceCard = ({ service, index }) => {
  const features = safeParse(service?.features) || [];
  const serviceImage = safeParse(service?.serviceImage);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE || '';
  const palettes = SERVICE_COLOR_PALETTES || DEFAULT_PALETTES;
  const palette = palettes[index % palettes.length] || palettes[0];

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleMouseEnter = useCallback((e) => {
    e.currentTarget.style.borderColor = 'rgba(2, 211, 254, 0.3)';
    e.currentTarget.style.boxShadow = '0 0 30px rgba(2, 211, 254, 0.1)';
  }, []);

  const handleMouseLeave = useCallback((e) => {
    e.currentTarget.style.borderColor = THEME.border;
    e.currentTarget.style.boxShadow = 'none';
  }, []);

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={
        prefersReducedMotion ? {} : { delay: index * 0.15, duration: 0.7, ease: 'power3.out' }
      }
      viewport={{ once: true, margin: '-50px' }}
      whileHover={prefersReducedMotion ? undefined : { y: -5 }}
    >
      <article
        className="relative rounded-2xl overflow-hidden h-full p-4 sm:p-6 md:p-8"
        aria-labelledby={`service-title-${service?.id || index}`}
        style={{
          background: THEME.bgCard,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${THEME.border}`,
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Glow */}
        <div
          className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] opacity-10 transition-all duration-700 pointer-events-none"
          style={{ background: palette.gradient }}
          aria-hidden="true"
        />

        {/* Icon */}
        <motion.div
          whileHover={prefersReducedMotion ? undefined : { rotate: 360, scale: 1.1 }}
          transition={prefersReducedMotion ? {} : { duration: 0.6 }}
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-4 sm:mb-6 overflow-hidden shadow-lg"
          style={{ background: palette.gradient }}
        >
          {serviceImage?.url ? (
            <img
              className="w-full h-full object-cover"
              src={`${backendUrl.replace(/\/+$/, '')}/${serviceImage.url.replace(/^\/+/, '')}`}
              alt={`${service.title} icon`}
              loading="lazy"
              width="64"
              height="64"
            />
          ) : (
            <service.icon
              size={24}
              className="sm:w-7 sm:h-7 md:w-8 md:h-8"
              style={{ color: '#ffffff' }}
              aria-hidden="true"
            />
          )}
        </motion.div>

        {/* Title */}
        <h3
          id={`service-title-${service?.id || index}`}
          className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 leading-tight transition-colors duration-300"
          style={{ color: THEME.textWhite }}
        >
          {service.title}
        </h3>

        {/* Description */}
        <p
          className="mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base"
          style={{ color: THEME.textGray }}
        >
          {service.description}
        </p>

        {/* Features */}
        <div
          className="flex flex-wrap gap-2 mb-6 sm:mb-8"
          role="list"
          aria-label="Service Features"
        >
          {features.map((feature, fIndex) => (
            <motion.span
              key={fIndex}
              initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
              transition={prefersReducedMotion ? {} : { delay: 0.2 + fIndex * 0.05 }}
              viewport={{ once: true }}
              role="listitem"
            >
              <TechBadge name={feature} />
            </motion.span>
          ))}
        </div>

        {/* CTA */}
        <Link to={`/services/${service?.slug}`} aria-label={`Learn more about ${service.title}`}>
          <motion.span
            whileHover={prefersReducedMotion ? undefined : { x: 8 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-300 cursor-pointer py-2"
            style={{ color: THEME.cyan }}
          >
            <span>Learn More</span>
            <motion.div
              animate={prefersReducedMotion ? undefined : { x: [0, 5, 0] }}
              transition={
                prefersReducedMotion ? {} : { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
              }
            >
              <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" aria-hidden="true" />
            </motion.div>
          </motion.span>
        </Link>

        {/* Bottom Line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, rgba(2, 211, 254, 0.3), transparent)' }}
          aria-hidden="true"
        />
      </article>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 📋 PROCESS STEP
// ═══════════════════════════════════════════════════════════════════════════
const ProcessStep = ({ step, index, isLast }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
      transition={
        prefersReducedMotion ? {} : { delay: index * 0.1, duration: 0.6, ease: 'power3.out' }
      }
      viewport={{ once: true, margin: '-50px' }}
      whileHover={prefersReducedMotion ? undefined : { x: 8 }}
      className="relative flex items-start gap-4 sm:gap-6 group"
      role="listitem"
      aria-label={`Step ${step.number}: ${step.title}`}
    >
      {/* Connector Line */}
      {!isLast && (
        <div
          className="absolute left-7 sm:left-8 top-12 sm:top-16 w-0.5 h-12 sm:h-16 opacity-30 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, #02d3fe, transparent)' }}
          aria-hidden="true"
        />
      )}

      {/* Number Badge */}
      <motion.div
        whileHover={prefersReducedMotion ? undefined : { scale: 1.1, rotate: 5 }}
        className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shadow-lg"
        style={{ background: THEME.gradientCyanBlue, boxShadow: '0 0 20px rgba(2, 211, 254, 0.2)' }}
      >
        <span className="text-xl sm:text-2xl font-bold" style={{ color: '#ffffff' }}>
          {step.number}
        </span>
      </motion.div>

      {/* Content Card */}
      <div
        className="flex-1 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300"
        style={{
          background: THEME.bgCard,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${THEME.border}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(2, 211, 254, 0.3)';
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = THEME.border;
          e.currentTarget.style.background = THEME.bgCard;
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3 gap-2">
          <h3
            className="text-lg sm:text-xl font-bold transition-colors duration-300"
            style={{ color: THEME.textWhite }}
          >
            {step.title}
          </h3>
          <div
            className="flex items-center gap-2 text-xs sm:text-sm"
            style={{ color: THEME.textGrayDark }}
          >
            <Clock size={14} aria-hidden="true" />
            <span>{step.duration}</span>
          </div>
        </div>
        <p
          className="leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base"
          style={{ color: THEME.textGray }}
        >
          {step.description}
        </p>
        <div className="flex items-center gap-2">
          <step.icon
            size={16}
            className="sm:w-[18px] sm:h-[18px]"
            style={{ color: THEME.cyan }}
            aria-hidden="true"
          />
          <span
            className="text-[10px] sm:text-xs font-medium uppercase tracking-wider"
            style={{ color: THEME.cyan }}
          >
            Step {step.number}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 🔷 ADDITIONAL SERVICE CARD
// ═══════════════════════════════════════════════════════════════════════════
const AdditionalServiceCard = ({ service, index }) => {
  const gradients = [
    'linear-gradient(135deg, #02d3fe, #4e90e1)',
    'linear-gradient(135deg, #4e90e1, #9a5cb7)',
    'linear-gradient(135deg, #9a5cb7, #02d3fe)',
    'linear-gradient(135deg, #f59e0b, #02d3fe)',
  ];

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <motion.div
      initial={
        prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }
      }
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={
        prefersReducedMotion ? {} : { delay: index * 0.1, duration: 0.5, ease: 'power3.out' }
      }
      viewport={{ once: true }}
      whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.02 }}
    >
      <article
        className="relative rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center overflow-hidden transition-all duration-300 h-full"
        style={{
          background: THEME.bgCard,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${THEME.border}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(2, 211, 254, 0.3)';
          e.currentTarget.style.boxShadow = '0 0 30px rgba(2, 211, 254, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = THEME.border;
          e.currentTarget.style.boxShadow = 'none';
        }}
        aria-label={service.title}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none"
          style={{ background: gradients[index % gradients.length] }}
          aria-hidden="true"
        />

        <motion.div
          whileHover={prefersReducedMotion ? undefined : { rotate: 360 }}
          transition={prefersReducedMotion ? {} : { duration: 0.6 }}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg relative z-10"
          style={{ background: gradients[index % gradients.length] }}
        >
          <service.icon
            size={24}
            className="sm:w-7 sm:h-7"
            style={{ color: '#ffffff' }}
            aria-hidden="true"
          />
        </motion.div>

        <h3
          className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 transition-colors duration-300 relative z-10 leading-tight"
          style={{ color: THEME.textWhite }}
        >
          {service.title}
        </h3>
        <p
          className="text-xs sm:text-sm relative z-10 leading-relaxed"
          style={{ color: THEME.textGray }}
        >
          {service.description}
        </p>
      </article>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 🏗️ MAIN SERVICES PAGE
// ═══════════════════════════════════════════════════════════════════════════
const Services = () => {
  const containerRef = useRef(null);
  const { services: sc } = useSelector((state) => state.service);
  const navigate = useNavigate();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Map services with color palettes safely
  const services = useMemo(() => {
    const palettes = SERVICE_COLOR_PALETTES || DEFAULT_PALETTES;
    return (sc || []).map((service, idx) => {
      const palette = palettes[idx % palettes.length] || palettes[0];
      return { ...service, ...palette };
    });
  }, [sc]);

  // ✅ New function: Handle Free Quote click & navigate to contact with params
  const handleFreeQuote = useCallback(() => {
    const params = new URLSearchParams({
      source: 'services-page',
      subject: 'Free Quote Request - Services',
      message: `Hi, I visited your services page and would like to request a free quote.\n\nI'm interested in discussing:\n${
        services
          ?.slice(0, 3)
          .map((s) => `• ${s.title}`)
          .join('\n') || '• General inquiry'
      }\n\nPlease let me know your availability and pricing details.\n\nBest regards,`,
      services:
        services
          ?.slice(0, 5)
          .map((s) => s.slug)
          .join(',') || '',
    });
    navigate(`/contact?${params.toString()}`);
  }, [navigate, services]);

  // SEO Structured Data
  const structuredData = useMemo(() => {
    if (!services.length) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@graph': services.map((s, i) => ({
        '@type': 'Service',
        name: s.title,
        description: s.description,
        url: `${window.location.origin}/services/${s.slug}`,
      })),
    };
  }, [services]);

  // GSAP Animations
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      gsap.from('.benefit-item', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.benefits-section', start: 'top 85%', once: true },
      });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <LazyMotion features={domAnimation}>
      <div
        ref={containerRef}
        className="relative min-h-screen min-h-[100dvh] overflow-x-hidden"
        style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
        role="main"
        aria-label="Services Page"
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
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <div
            className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full blur-[80px] md:blur-[120px] animate-pulse"
            style={{ background: 'rgba(2, 211, 254, 0.12)' }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full blur-[80px] md:blur-[120px] animate-pulse"
            style={{ animationDelay: '1s', background: 'rgba(78, 144, 225, 0.12)' }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full blur-[60px] md:blur-[100px] animate-pulse"
            style={{ animationDelay: '2s', background: 'rgba(154, 92, 183, 0.1)' }}
          />
        </div>

        {/* Particles */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} aria-hidden="true">
          {[...Array(15)].map((_, i) => (
            <div
              key={`p-${i}`}
              className="absolute w-1 h-1 rounded-full animate-pulse"
              style={{
                left: `${(i * 7.3) % 100}%`,
                top: `${(i * 13.7) % 100}%`,
                background: i % 3 === 0 ? THEME.cyan : i % 3 === 1 ? THEME.blue : THEME.purple,
                opacity: 0.2 + (i % 3) * 0.1,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${3 + (i % 4)}s`,
              }}
            />
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 🦸 HERO SECTION                                                    */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <header className="relative pt-20 sm:pt-24 pb-8 sm:pb-12" style={{ zIndex: 2 }}>
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-12 sm:py-16 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: 'easeOut' }}
              className="text-center"
            >
              <motion.span
                initial={
                  prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }
                }
                animate={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
                transition={prefersReducedMotion ? {} : { delay: 0.2 }}
                className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6"
                style={{
                  background: 'rgba(2, 211, 254, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(2, 211, 254, 0.2)',
                  color: THEME.cyan,
                }}
              >
                What I Offer
              </motion.span>

              <h1
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 px-2 leading-tight"
                style={{ color: THEME.textWhite }}
              >
                My <GradientText>Services</GradientText>
              </h1>

              <p
                className="text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed px-4"
                style={{ color: THEME.textGray }}
              >
                Comprehensive digital solutions tailored to your needs. From concept to launch, I'll
                help you build something amazing.
              </p>
            </motion.div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 📊 BENEFITS BAR                                                    */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="benefits-section py-6 sm:py-8 md:py-12 border-y"
          style={{ zIndex: 2, borderColor: THEME.border }}
          aria-label="Key Benefits"
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {BENEFITS.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="benefit-item flex items-center justify-center gap-2 sm:gap-3 px-2 py-3 rounded-lg hover:bg-white/5 transition-colors"
                  style={{ color: THEME.textGray }}
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                  role="listitem"
                >
                  <benefit.icon
                    size={16}
                    className="sm:w-5 sm:h-5"
                    style={{ color: THEME.cyan }}
                    aria-hidden="true"
                  />
                  <span className="font-medium text-xs sm:text-sm">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 💼 MAIN SERVICES                                                   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="relative py-12 sm:py-16 md:py-24"
          style={{ zIndex: 2 }}
          aria-label="Core Services"
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
            <header className="text-center mb-8 sm:mb-12 md:mb-16">
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span
                  className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4"
                  style={{
                    background: 'rgba(154, 92, 183, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(154, 92, 183, 0.2)',
                    color: THEME.purple,
                  }}
                >
                  Core Services
                </span>
                <h2
                  className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2 leading-tight"
                  style={{ color: THEME.textWhite }}
                >
                  How Can I <GradientText>Help You</GradientText>
                </h2>
              </motion.div>
            </header>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {services.map((service, index) => (
                <ServiceCard
                  key={service.id || `service-${index}`}
                  service={service}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 🔷 ADDITIONAL SERVICES                                             */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="relative py-12 sm:py-16 md:py-24 overflow-hidden"
          style={{ zIndex: 2 }}
          aria-label="Additional Services"
        >
          {/* Center Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 md:w-[600px] md:h-[600px] rounded-full blur-[80px] md:blur-[150px] pointer-events-none"
            style={{ background: 'rgba(2, 211, 254, 0.05)' }}
            aria-hidden="true"
          />

          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 relative">
            <header className="text-center mb-8 sm:mb-12 md:mb-16">
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span
                  className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4"
                  style={{
                    background: 'rgba(2, 211, 254, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(2, 211, 254, 0.2)',
                    color: THEME.cyan,
                  }}
                >
                  More Services
                </span>
                <h2
                  className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2 leading-tight"
                  style={{ color: THEME.textWhite }}
                >
                  Additional <span style={{ color: THEME.cyan }}>Offerings</span>
                </h2>
              </motion.div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {ADDITIONAL_SERVICES.map((service, index) => (
                <AdditionalServiceCard key={service.title} service={service} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 📋 PROCESS SECTION                                                 */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="relative py-12 sm:py-16 md:py-24"
          style={{ zIndex: 2, background: 'rgba(255,255,255,0.02)' }}
          aria-label="My Work Process"
        >
          <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6">
            <header className="text-center mb-8 sm:mb-12 md:mb-16">
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span
                  className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4"
                  style={{
                    background: 'rgba(78, 144, 225, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(78, 144, 225, 0.2)',
                    color: THEME.blue,
                  }}
                >
                  My Process
                </span>
                <h2
                  className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2 leading-tight"
                  style={{ color: THEME.textWhite }}
                >
                  How I <GradientText>Work</GradientText>
                </h2>
                <p
                  className="max-w-2xl mx-auto text-sm sm:text-base px-4"
                  style={{ color: THEME.textGray }}
                >
                  A proven process that ensures every project is delivered on time, within budget,
                  and exceeds expectations.
                </p>
              </motion.div>
            </header>

            <div className="space-y-6 sm:space-y-8" role="list" aria-label="Process Steps">
              {PROCESS_STEPS.map((step, index) => (
                <ProcessStep
                  key={step.number}
                  step={step}
                  index={index}
                  isLast={index === PROCESS_STEPS.length - 1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 💡 CTA SECTION                                                     */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="relative py-12 sm:py-16 md:py-24"
          style={{ zIndex: 2 }}
          aria-label="Call to Action"
        >
          <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
            <div
              className="rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(2, 211, 254, 0.15), rgba(154, 92, 183, 0.15))',
                border: '1px solid rgba(2, 211, 254, 0.2)',
                boxShadow: '0 0 40px rgba(2, 211, 254, 0.05)',
              }}
            >
              <motion.div
                initial={
                  prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
                }
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-4 sm:mb-6 mx-auto"
                style={{ background: 'rgba(2, 211, 254, 0.15)' }}
              >
                <Sparkles
                  size={24}
                  className="sm:w-8 sm:h-8"
                  style={{ color: THEME.cyan }}
                  aria-hidden="true"
                />
              </motion.div>

              <motion.h2
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-2 leading-tight"
                style={{ color: THEME.textWhite }}
              >
                Ready to Start Your <span style={{ color: THEME.cyan }}>Project?</span>
              </motion.h2>

              <motion.p
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4"
                style={{ color: THEME.textGray }}
              >
                Let's discuss how I can help bring your vision to life. Get in touch for a free
                consultation.
              </motion.p>

              <motion.div
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
              >
                <PrimaryButton
                  onClick={handleFreeQuote} // ✅ Click handler
                  icon={ArrowRight}
                  className="px-6 sm:px-10 py-3 sm:py-4 w-full sm:w-auto justify-center"
                >
                  Get a Free Quote
                </PrimaryButton>
                <OutlineButton icon={MessageCircle} className="w-full sm:w-auto justify-center">
                  Contact Me
                </OutlineButton>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
};

export default Services;
