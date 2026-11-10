import LazyImage from '@/components/LazyImage';
import { OutlineButton, PrimaryButton } from '@/components/UI';
import { fadeUp, staggerParent, useMotionPrefs, VIEWPORT_ONCE } from '@/lib/motion';
import { safeParse } from '@/Utils/Utils';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
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
import { motion } from 'motion/react';
import { memo, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const ADDITIONAL_SERVICES = [
  {
    icon: Smartphone,
    title: 'Mobile Applications',
    description: 'High-performance responsive PWAs and cross-platform mobile experiences.',
  },
  {
    icon: Globe,
    title: 'Technical SEO & Performance',
    description: 'Core Web Vitals tuning, structured schemas, and lightning-fast page loading.',
  },
  {
    icon: Layers,
    title: 'Design Systems & UI/UX',
    description: 'Modular tokenized component libraries, design systems, and interaction models.',
  },
  {
    icon: Sparkles,
    title: 'Technical Architecture',
    description: 'Strategic consulting on database schemas, microservices, and API scalability.',
  },
];

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Discovery & Planning',
    description:
      'In-depth architectural analysis, requirements gathering, and scope alignment to build a resilient foundation.',
    icon: MessageCircle,
    duration: '1-2 Days',
  },
  {
    number: '02',
    title: 'System Architecture & Strategy',
    description: 'Establishing data schemas, technology stack decisions, milestone roadmap, and deliverables.',
    icon: Calendar,
    duration: '2-3 Days',
  },
  {
    number: '03',
    title: 'Interface Prototyping & Design',
    description: 'Interactive wireframes, motion states, and refined UI components aligned with your brand language.',
    icon: Palette,
    duration: '1-2 Weeks',
  },
  {
    number: '04',
    title: 'Full-Stack Development',
    description: 'Writing maintainable, clean code with strict type-safety, test coverage, and modern API standards.',
    icon: Code,
    duration: '2-4 Weeks',
  },
  {
    number: '05',
    title: 'Production Deployment & Launch',
    description: 'Automated CI/CD deployment, performance benchmarking, security checks, and post-launch monitoring.',
    icon: Shield,
    duration: '1 Day',
  },
];

const BENEFITS = [
  { icon: Clock, text: 'Milestone-Driven Delivery' },
  { icon: Shield, text: 'Clean Code & Security First' },
  { icon: MessageCircle, text: 'Transparent Communication' },
  { icon: Zap, text: 'Optimized Core Web Vitals' },
];

// ═══════════════════════════════════════════════════════════════════════════
// 🧩 SERVICE CARD
// ═══════════════════════════════════════════════════════════════════════════
const ServiceCard = memo(({ service, index }) => {
  const features = safeParse(service?.features) || [];
  const serviceImage = safeParse(service?.serviceImage);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE || '';

  const { reduced, isMobile } = useMotionPrefs();
  const prefs = useMemo(() => ({ reduced, isMobile }), [reduced, isMobile]);
  const cardVariants = useMemo(() => fadeUp(prefs, index * 0.05), [prefs, index]);

  const iconUrl = useMemo(() => {
    if (serviceImage?.url) {
      const cleanBase = backendUrl.replace(/\/+$/, '');
      const cleanPath = serviceImage.url.replace(/^\/+/, '');
      return `${cleanBase}/${cleanPath}`;
    }
    return '';
  }, [serviceImage?.url, backendUrl]);

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      whileHover={reduced || isMobile ? undefined : { y: -6, transition: { duration: 0.25 } }}
      className="group relative flex flex-col justify-between h-full rounded-2xl border border-line-subtle bg-surface-card/60 p-6 sm:p-8 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-brand-cyan/40 hover:shadow-glow-cyan overflow-hidden"
      aria-labelledby={`service-title-${service?.id || index}`}
    >
      {/* Subtle top-right ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[radial-gradient(closest-side,rgb(var(--brand-cyan)/0.12),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      <div>
        {/* Service Icon Box */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan shrink-0 overflow-hidden">
            {iconUrl ? (
              <LazyImage
                src={iconUrl}
                alt=""
                className="h-full w-full object-cover"
                objectFit="cover"
              />
            ) : (
              <Zap size={24} className="text-brand-cyan" aria-hidden="true" />
            )}
          </div>

          {service?.deliveryTime && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-ink-muted bg-surface-soft border border-line-subtle">
              <Clock size={12} className="text-brand-cyan" />
              {service.deliveryTime}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          id={`service-title-${service?.id || index}`}
          className="text-xl sm:text-2xl font-bold tracking-tight text-ink mb-3 group-hover:text-brand-cyan transition-colors duration-200"
        >
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed text-ink-secondary mb-6 line-clamp-3">
          {service.description}
        </p>

        {/* Features / Deliverables */}
        {features.length > 0 && (
          <ul className="space-y-2.5 mb-8" aria-label="Included deliverables">
            {features.slice(0, 4).map((feature, fIndex) => (
              <li key={fIndex} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-secondary">
                <CheckCircle2 size={15} className="text-brand-cyan shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CTA Footer */}
      <div className="pt-4 border-t border-white/10">
        <Link
          to={`/services/${service?.slug}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-cyan hover:text-brand-cyan/80 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded p-1 -ml-1"
          aria-label={`Explore details of ${service.title}`}
        >
          <span>Explore Service Details</span>
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </motion.article>
  );
});

ServiceCard.displayName = 'ServiceCard';

// ═══════════════════════════════════════════════════════════════════════════
// 🏗️ MAIN SERVICES PAGE
// ═══════════════════════════════════════════════════════════════════════════
const Services = memo(() => {
  const { services: sc, isLoading } = useSelector((state) => state.service);
  const navigate = useNavigate();

  const { reduced, isMobile } = useMotionPrefs();
  const prefs = useMemo(() => ({ reduced, isMobile }), [reduced, isMobile]);

  const parentVariants = useMemo(() => staggerParent(0.08, 0.05), []);
  const headerVariants = useMemo(() => fadeUp(prefs, 0), [prefs]);

  const services = useMemo(() => sc || [], [sc]);

  // Handle Free Quote navigation
  const handleFreeQuote = useCallback(() => {
    const params = new URLSearchParams({
      source: 'services-page',
      subject: 'Free Project Consultation & Quote',
      message: `Hi, I reviewed your services and would like to request an estimate.\n\nServices of interest:\n${
        services
          ?.slice(0, 3)
          .map((s) => `• ${s.title}`)
          .join('\n') || '• Full-Stack Development'
      }\n\nPlease share your current availability and estimate details.\n\nBest regards,`,
    });
    navigate(`/contact?${params.toString()}`);
  }, [navigate, services]);

  // Structured Data
  const structuredData = useMemo(() => {
    if (!services.length || typeof window === 'undefined') return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@graph': services.map((s) => ({
        '@type': 'Service',
        name: s.title,
        description: s.description,
        url: `${window.location.origin}/services/${s.slug}`,
      })),
    };
  }, [services]);

  return (
    <div className="relative isolate overflow-x-clip bg-surface-base text-ink" id="services-page">
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Subtle ambient lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-[120px] opacity-60"
          style={{ background: 'rgba(2, 211, 254, 0.08)' }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-[120px] opacity-60"
          style={{ background: 'rgba(154, 92, 183, 0.08)' }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🦸 HERO SECTION                                                    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <header className="relative pt-28 pb-10 sm:pt-36 sm:pb-14 lg:pt-40 lg:pb-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="mb-4 inline-block"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-cyan border border-brand-cyan/20 bg-brand-cyan/10">
              <Sparkles size={12} className="text-brand-cyan" aria-hidden="true" />
              Specialized Capabilities
            </span>
          </motion.div>

          <motion.h1
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink mb-4 sm:mb-6 leading-tight"
          >
            Engineering &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">
              Digital Services
            </span>
          </motion.h1>

          <motion.p
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="text-sm sm:text-base md:text-lg leading-relaxed text-ink-secondary max-w-2xl mx-auto"
          >
            From architecture design and frontend performance to scalable full-stack applications,
            delivering solutions that grow with your ambitions.
          </motion.p>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📊 KEY BENEFITS STRIP                                              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-6 sm:py-8 border-y border-line-subtle bg-surface-card/30" aria-label="Key Benefits">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {BENEFITS.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-2.5 p-2 rounded-xl text-center"
              >
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-cyan/10 text-brand-cyan shrink-0">
                  <benefit.icon size={16} aria-hidden="true" />
                </div>
                <span className="font-medium text-xs sm:text-sm text-ink-secondary text-left">
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 💼 CORE SERVICES GRID                                              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20 lg:py-24" aria-label="Core Services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-blue border border-brand-blue/20 bg-brand-blue/10 mb-4">
              Core Offerings
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink mb-4">
              Tailored Technical{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">
                Solutions
              </span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
              Explore specialized services built with attention to performance, maintainability, and clean user experience.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={`srv-skeleton-${i}`}
                  className="rounded-2xl border border-line-subtle bg-surface-card/60 p-8 space-y-4 animate-pulse"
                  aria-hidden="true"
                >
                  <div className="h-14 w-14 rounded-2xl bg-surface-soft" />
                  <div className="h-6 w-1/2 rounded bg-surface-soft" />
                  <div className="h-4 w-5/6 rounded bg-surface-soft/60" />
                  <div className="h-4 w-2/3 rounded bg-surface-soft/60" />
                </div>
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
              {services.map((service, index) => (
                <ServiceCard key={service.id || `service-${index}`} service={service} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl border border-line-subtle bg-surface-card/40">
              <p className="text-ink-secondary text-sm">Services are currently being updated.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🔷 ADDITIONAL SERVICES SECTION                                     */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20 lg:py-24 border-t border-line-subtle bg-surface-secondary/40" aria-label="Additional Capabilities">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-purple border border-brand-purple/20 bg-brand-purple/10 mb-4">
              Complementary Skills
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink mb-4">
              Extended{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">
                Capabilities
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {ADDITIONAL_SERVICES.map((item, index) => (
              <div
                key={item.title}
                className="rounded-2xl border border-line-subtle bg-surface-card/60 p-6 sm:p-7 text-center backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-brand-cyan/30 hover:shadow-glow-cyan flex flex-col items-center"
              >
                <div className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan mb-4 shrink-0">
                  <item.icon size={22} className="sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-ink mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📋 PROCESS TIMELINE                                                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20 lg:py-24" aria-label="Work Methodology">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-cyan border border-brand-cyan/20 bg-brand-cyan/10 mb-4">
              Methodology
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink mb-4">
              How We{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">
                Collaborate
              </span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-ink-secondary max-w-xl mx-auto">
              A structured 5-stage engineering pipeline designed for transparency, agility, and measurable delivery.
            </p>
          </div>

          <div className="relative pl-6 sm:pl-8 md:pl-0 space-y-6 sm:space-y-8" role="list" aria-label="Process Steps">
            {PROCESS_STEPS.map((step, index) => {
              const isLast = index === PROCESS_STEPS.length - 1;
              return (
                <div
                  key={step.number}
                  className="relative flex items-start gap-4 sm:gap-6 group"
                  role="listitem"
                >
                  {/* Step Connector Line */}
                  {!isLast && (
                    <div
                      className="absolute left-6 sm:left-7 top-14 bottom-[-1.5rem] w-px bg-gradient-to-b from-brand-cyan via-brand-blue to-transparent opacity-30"
                      aria-hidden="true"
                    />
                  )}

                  {/* Step Number Pill */}
                  <div className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-cyan to-brand-blue text-surface-void font-extrabold text-base sm:text-lg shrink-0 shadow-md">
                    {step.number}
                  </div>

                  {/* Step Card */}
                  <div className="flex-1 rounded-2xl border border-line-subtle bg-surface-card/70 p-5 sm:p-6 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-line-strong">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-ink">
                        {step.title}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                        <Clock size={12} className="text-brand-cyan" />
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed mb-3">
                      {step.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-cyan">
                      <step.icon size={14} />
                      <span>Stage {step.number}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 💡 CALL TO ACTION SECTION                                          */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20 lg:py-24" aria-label="Start a project call to action">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-line-strong bg-gradient-to-b from-surface-card via-surface-elevated to-surface-card p-6 sm:p-10 md:p-14 lg:p-16 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px rounded-3xl bg-[radial-gradient(ellipse_at_top,rgb(var(--brand-cyan)/0.14),transparent_65%)]"
            />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan mb-5 sm:mb-6 mx-auto">
                <Sparkles size={22} className="sm:w-6 sm:h-6" aria-hidden="true" />
              </div>

              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink mb-4 sm:mb-5 leading-tight">
                Ready to Accelerate Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">
                  Project Delivery?
                </span>
              </h2>

              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-ink-secondary mb-8 sm:mb-10 max-w-2xl mx-auto">
                Let's discuss scope, timeline, and architectural requirements. Request a free consultation or estimate today.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 w-full">
                <PrimaryButton
                  onClick={handleFreeQuote}
                  icon={ArrowRight}
                  className="w-full sm:w-auto justify-center"
                >
                  Request a Free Quote
                </PrimaryButton>
                <OutlineButton
                  to="/contact"
                  icon={MessageCircle}
                  className="w-full sm:w-auto justify-center"
                >
                  Contact Directly
                </OutlineButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

Services.displayName = 'Services';
export default Services;
