import DynamicMetaUpdater from '@/components/DynamicMetaUpdater';
import LazyImage from '@/components/LazyImage';
import { OutlineButton, PrimaryButton, TechBadge } from '@/components/UI';
import { fadeUp, staggerParent, useMotionPrefs, VIEWPORT_ONCE } from '@/lib/motion';
import { safeParse } from '@/Utils/Utils';
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  FileText,
  Layers,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import MarkUpTextRender from '../sections/MarkUpTextRender';

// ── Section Heading Component ────────────────────────────────────────
const SectionHeading = memo(({ icon: Icon, title, subtitle }) => (
  <header className="mb-6 sm:mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan shrink-0">
        <Icon size={18} aria-hidden="true" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
        {title}
      </h2>
    </div>
    {subtitle && (
      <p className="text-xs sm:text-sm text-ink-secondary ml-13">
        {subtitle}
      </p>
    )}
  </header>
));
SectionHeading.displayName = 'SectionHeading';

// ── Feature Card ─────────────────────────────────────────────────────
const FeatureCard = memo(({ feature, index }) => (
  <div className="group flex items-start gap-3 p-4 rounded-xl border border-line-subtle bg-surface-card/60 transition-[border-color,box-shadow] duration-200 hover:border-brand-cyan/30 hover:shadow-glow-cyan h-full">
    <div className="grid h-6 w-6 place-items-center rounded-md bg-brand-cyan/15 text-brand-cyan shrink-0 mt-0.5">
      <CheckCircle2 size={14} aria-hidden="true" />
    </div>
    <span className="text-xs sm:text-sm font-medium text-ink-secondary leading-relaxed">
      {feature}
    </span>
  </div>
));
FeatureCard.displayName = 'FeatureCard';

// ── Process Step ─────────────────────────────────────────────────────
const ProcessStep = memo(({ number, title, description, isLast }) => (
  <div className="relative flex gap-4 sm:gap-6" role="listitem">
    {/* Node and Connector */}
    <div className="flex flex-col items-center">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-cyan to-brand-blue text-surface-void font-extrabold text-sm shrink-0 z-10 shadow-sm">
        {number}
      </div>
      {!isLast && (
        <div
          className="w-px flex-1 mt-2 bg-gradient-to-b from-brand-cyan via-brand-blue to-transparent opacity-30"
          aria-hidden="true"
        />
      )}
    </div>

    {/* Content */}
    <div className={`${isLast ? 'pb-0' : 'pb-8 sm:pb-10'} w-full`}>
      <h3 className="text-base sm:text-lg font-bold text-ink mb-1.5">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
        {description}
      </p>
    </div>
  </div>
));
ProcessStep.displayName = 'ProcessStep';

// ── Stat Badge ───────────────────────────────────────────────────────
const StatBadge = ({ icon: Icon, label, value, highlight = false }) => (
  <div
    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold backdrop-blur-sm ${
      highlight
        ? 'border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan'
        : 'border-line-subtle bg-surface-soft text-ink-secondary'
    }`}
    role="status"
  >
    <Icon size={13} className={highlight ? 'text-brand-cyan' : 'text-ink-muted'} aria-hidden="true" />
    {label && <span className="text-ink-muted font-normal">{label}</span>}
    <span className="capitalize">{value}</span>
  </div>
);

// ════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════
const ServiceDetailsPage = memo(() => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { reduced, isMobile } = useMotionPrefs();
  const prefs = useMemo(() => ({ reduced, isMobile }), [reduced, isMobile]);

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const { services } = useSelector((state) => state.service);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE || '';

  // Data hydration
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
        console.error('Failed to fetch service details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [slug, services]);

  const techStack = useMemo(() => safeParse(service?.techStack) || [], [service?.techStack]);
  const features = useMemo(() => safeParse(service?.features) || [], [service?.features]);
  const serviceImage = useMemo(
    () => safeParse(service?.serviceImage) || {},
    [service?.serviceImage]
  );

  const imageUrl = useMemo(() => {
    if (!serviceImage?.url) return '';
    const cleanUrl = backendUrl.replace(/\/+$/, '');
    const path = serviceImage.url.replace(/^\/+/, '');
    return `${cleanUrl}/${path}`;
  }, [serviceImage?.url, backendUrl]);

  const PROCESS_STEPS = useMemo(
    () => [
      {
        title: 'Discovery & System Requirements',
        desc: 'Analyze business scope, user personas, technical constraints, and deliverable targets.',
      },
      {
        title: 'Architectural Blueprint & UI/UX',
        desc: 'Interactive component layouts, data flows, and design system alignment crafted for approval.',
      },
      {
        title: 'Sprint Development & Testing',
        desc: 'Incremental agile sprints with clean, modular code, unit tests, and continuous CI verification.',
      },
      {
        title: 'Performance & Security Audit',
        desc: 'Core Web Vitals benchmarking, accessibility checks, vulnerability scans, and staging review.',
      },
      {
        title: 'Deployment & Ongoing Support',
        desc: 'Seamless production rollout, automated monitoring, and post-launch technical assistance.',
      },
    ],
    []
  );

  // SEO Structured Data
  const structuredData = useMemo(() => {
    if (!service || typeof window === 'undefined') return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      description: service.shortDescription || service.fullDescription,
      url: `${window.location.origin}/services/${slug}`,
      provider: { '@type': 'Organization', name: 'Portfolio' },
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

  const handleGetStarted = useCallback(() => {
    const params = new URLSearchParams({
      service: slug,
      subject: `Inquiry: ${service?.title || 'Service'}`,
      message: `Hi, I'm interested in starting a project for your "${service?.title || 'Service'}" offering.\n\nCategory: ${service?.category || 'General'}\nPreferred Timeline: ${service?.deliveryTime || 'Standard'}\n\nPlease let me know your current availability and estimated milestones.\n\nBest regards,`,
    });
    navigate(`/contact?${params.toString()}`);
  }, [navigate, service, slug]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-surface-base text-ink"
        aria-label="Loading service details"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-brand-cyan border-t-transparent animate-spin" />
          <span className="text-xs uppercase tracking-widest text-ink-muted">Loading Service</span>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-surface-base text-ink"
        aria-label="Service not found"
      >
        <div className="text-center space-y-4 px-4 max-w-md">
          <h2 className="text-xl font-bold text-ink">Service not found</h2>
          <p className="text-sm text-ink-secondary">
            The service requested could not be found or has been relocated.
          </p>
          <PrimaryButton onClick={() => navigate('/services')} className="justify-center mx-auto">
            Back to All Services
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative isolate overflow-x-clip bg-surface-base text-ink"
      id="service-details-page"
      aria-label={`${service.title} Service Details`}
    >
      {/* Reusable Dynamic Meta Updater */}
      <DynamicMetaUpdater
        title={service.seoMetaTitle || service.title || 'Service Details'}
        description={service.seoMetaDescription || service.shortDescription || ''}
        schemaId="service-jsonld"
        schema={structuredData}
      />

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
      <header className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="inline-flex items-center gap-2 mb-6 sm:mb-8 text-xs sm:text-sm font-medium text-ink-secondary hover:text-brand-cyan transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded-lg p-1.5 -ml-1.5"
            aria-label="Back to services list"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to Services</span>
          </button>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
            {/* Left Content */}
            <article className="order-2 md:order-1">
              {service?.category && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4 text-xs font-semibold uppercase tracking-wider text-brand-cyan border border-brand-cyan/20 bg-brand-cyan/10">
                  <Layers size={12} className="text-brand-cyan" aria-hidden="true" />
                  <span>{service.category}</span>
                </div>
              )}

              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink mb-4 sm:mb-5 leading-tight">
                {service.title}
              </h1>

              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-ink-secondary mb-6 sm:mb-8 max-w-xl">
                {service.shortDescription}
              </p>

              {/* Status & Delivery Badges */}
              <div className="flex flex-wrap gap-2.5 mb-8" aria-label="Service metadata">
                {service.deliveryTime && (
                  <StatBadge icon={Clock} label="Delivery:" value={service.deliveryTime} highlight={true} />
                )}
                <StatBadge
                  icon={BadgeCheck}
                  label="Status:"
                  value={service.status || 'Active'}
                />
                {service.isFeatured && (
                  <StatBadge icon={Star} label="" value="Featured" highlight={true} />
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <PrimaryButton
                  onClick={handleGetStarted}
                  icon={Zap}
                  className="w-full sm:w-auto justify-center"
                >
                  Start Project
                </PrimaryButton>
                <OutlineButton
                  to="/contact?subject=Service%20Consultation"
                  icon={Calendar}
                  className="w-full sm:w-auto justify-center"
                >
                  Schedule Call
                </OutlineButton>
              </div>
            </article>

            {/* Right Hero Image */}
            <div className="order-1 md:order-2">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 sm:-inset-6 rounded-3xl bg-[radial-gradient(closest-side,rgb(var(--brand-cyan)/0.15),rgb(var(--brand-purple)/0.10)_60%,transparent)]"
                />

                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line-strong bg-surface-card shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]">
                  <LazyImage
                    src={imageUrl}
                    alt={`${service.title} illustration`}
                    className="h-full w-full object-cover"
                    objectFit="cover"
                    objectPosition="center"
                    eager={true}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-base/50 via-transparent to-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📋 DETAILS & BREAKDOWNS                                            */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-12 sm:py-16 lg:py-24" aria-label="Detailed Service Information">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20 lg:space-y-24">
          {/* Overview Breakdown */}
          {service?.fullDescription && (
            <section aria-labelledby="overview-heading">
              <SectionHeading
                icon={FileText}
                title="Service Overview"
                subtitle="In-depth breakdown of deliverables and execution strategy"
              />
              <div className="rounded-2xl border border-line-subtle bg-surface-card/60 p-6 sm:p-8 lg:p-10 backdrop-blur-sm">
                <div className="text-sm sm:text-base leading-relaxed text-ink-secondary">
                  <MarkUpTextRender markedDesc={service.fullDescription} />
                </div>
              </div>
            </section>
          )}

          {/* Key Deliverables / Features */}
          {features.length > 0 && (
            <section aria-labelledby="features-heading">
              <SectionHeading
                icon={CheckCircle2}
                title="Key Deliverables"
                subtitle={`${features.length} core outputs guaranteed with this service`}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {features.map((feat, i) => (
                  <FeatureCard key={`${feat}-${i}`} feature={feat} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Tech Stack */}
          {techStack.length > 0 && (
            <section aria-labelledby="tech-heading">
              <SectionHeading
                icon={Code2}
                title="Technology Stack"
                subtitle="Frameworks and utilities leveraged for development"
              />
              <div className="rounded-2xl border border-line-subtle bg-surface-card/60 p-6 sm:p-8 backdrop-blur-sm">
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, i) => (
                    <TechBadge key={`${tech}-${i}`} name={tech} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Process Timeline */}
          <section aria-labelledby="process-heading">
            <SectionHeading
              icon={Cpu}
              title="Execution Roadmap"
              subtitle="5 structured phases from kickoff to production delivery"
            />
            <div className="rounded-2xl border border-line-subtle bg-surface-card/60 p-6 sm:p-8 lg:p-10 backdrop-blur-sm">
              <div role="list" aria-label="Development steps" className="max-w-3xl">
                {PROCESS_STEPS.map((step, i) => (
                  <ProcessStep
                    key={i}
                    number={i + 1}
                    title={step.title}
                    description={step.desc}
                    isLast={i === PROCESS_STEPS.length - 1}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action Banner */}
          <section aria-label="Start project call to action">
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
                  Ready to Start Your{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">
                    {service.title}?
                  </span>
                </h2>

                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-ink-secondary mb-8 sm:mb-10 max-w-xl mx-auto">
                  Let's align on technical scope, deliverables, and turnaround time. Request an estimate today.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 w-full">
                  <PrimaryButton
                    onClick={handleGetStarted}
                    icon={Zap}
                    className="w-full sm:w-auto justify-center"
                  >
                    Start Project
                  </PrimaryButton>
                  <OutlineButton
                    to="/contact?subject=Service%20Inquiry"
                    icon={Calendar}
                    className="w-full sm:w-auto justify-center"
                  >
                    Schedule Consultation
                  </OutlineButton>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
});

ServiceDetailsPage.displayName = 'ServiceDetailsPage';
export default ServiceDetailsPage;
