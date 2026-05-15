import { safeParse } from '@/Utils/Utils';
import {
  GlassCard,
  GradientText,
  OutlineButton,
  PrimaryButton,
  TechBadge,
  THEME,
} from '@/components/UI';
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
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import MarkUpTextRender from '../sections/MarkUpTextRender';

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
  <div className="mb-8">
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-3 mb-2"
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(2, 211, 254, 0.15)' }}
      >
        <Icon size={20} style={{ color: THEME.cyan }} />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold" style={{ color: THEME.textWhite }}>
        {title}
      </h2>
    </motion.div>
    {subtitle && (
      <p className="text-sm ml-14" style={{ color: THEME.textMuted }}>
        {subtitle}
      </p>
    )}
  </div>
));

// ── Feature Card ─────────────────────────────────────────────────
const FeatureCard = memo(({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay: index * 0.07 }}
    whileHover={{ y: -4 }}
  >
    <div
      className="group relative p-4 rounded-xl transition-all duration-300 cursor-default"
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
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all mt-0.5"
          style={{ background: 'rgba(2, 211, 254, 0.1)' }}
        >
          <Check size={14} style={{ color: THEME.cyan }} />
        </div>
        <p
          className="text-sm font-medium transition-colors leading-relaxed"
          style={{ color: THEME.textGray }}
        >
          {feature}
        </p>
      </div>
    </div>
  </motion.div>
));

// ── Process Step ─────────────────────────────────────────────────
const ProcessStep = memo(({ number, title, description, delay, isLast }) => (
  <motion.div
    initial={{ opacity: 0, x: -24 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.55, delay }}
    className="relative flex gap-5"
  >
    <div className="flex flex-col items-center">
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 z-10"
        style={{ background: THEME.gradientCyanBlue, boxShadow: '0 0 20px rgba(2, 211, 254, 0.2)' }}
      >
        <span style={{ color: '#ffffff' }}>{number}</span>
      </motion.div>
      {!isLast && (
        <div
          className="w-px flex-1 mt-2"
          style={{ background: 'linear-gradient(to bottom, rgba(2, 211, 254, 0.4), transparent)' }}
        />
      )}
    </div>
    <div className={`${isLast ? 'pb-0' : 'pb-10'} w-full`}>
      <h3
        className="text-base font-semibold mb-1 transition-colors duration-300"
        style={{ color: THEME.textWhite }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: THEME.textGrayDark }}>
        {description}
      </p>
    </div>
  </motion.div>
));

// ── Stat Badge ───────────────────────────────────────────────────
const StatBadge = ({ icon: Icon, label, value, color }) => (
  <div
    className="flex items-center gap-2 px-3.5 py-2 rounded-lg"
    style={{ border: `1px solid ${color}`, background: `${color.replace('0.3', '0.1')}` }}
  >
    <Icon size={14} style={{ color }} />
    <span className="text-xs" style={{ color: THEME.textGray }}>
      {label}
    </span>
    <span className="text-xs font-semibold capitalize" style={{ color }}>
      {value}
    </span>
  </div>
);

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════
const ServiceDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const heroImageRef = useRef(null);

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { services } = useSelector((state) => state.service);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;

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
    if (services?.length) {
      const found = services.find((s) => s.slug === slug);
      if (found) {
        setService(found);
        setLoading(false);
        return;
      }
    }
    (async () => {
      try {
        const res = await fetch(`/api/services/${slug}`);
        const data = await res.json();
        if (data.success) setService(data.data);
      } catch (err) {
        console.error('Failed to fetch service:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, services]);

  // ── Parsed fields ────────────────────────────────────────────
  const techStack = safeParse(service?.techStack) || [];
  const features = safeParse(service?.features) || [];
  const serviceImage = safeParse(service?.serviceImage) || {};
  const imageUrl = serviceImage?.url ? `${backendUrl}${serviceImage.url}` : '/default-service.jpg';
  const statusCfg = STATUS_CONFIG[service?.status] || STATUS_CONFIG.draft;

  // ── GSAP ─────────────────────────────────────────────────────
  useGSAP(
    () => {
      if (!service || loading) return;
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
      >
        <div className="text-center space-y-5">
          <p className="text-xl" style={{ color: THEME.textWhite }}>
            Service not found
          </p>
          <PrimaryButton onClick={() => navigate('/services')}>Back to Services</PrimaryButton>
        </div>
      </div>
    );
  }

  const PROCESS_STEPS = [
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
  ];

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen overflow-x-hidden"
      style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
    >
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🌌 BACKGROUND LAYERS                                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="gradient-orb absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse"
          style={{ background: 'rgba(2, 211, 254, 0.12)' }}
        />
        <div
          className="gradient-orb absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: '1s', background: 'rgba(78, 144, 225, 0.12)' }}
        />
        <div
          className="gradient-orb absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: '2s', background: 'rgba(154, 92, 183, 0.1)' }}
        />
      </div>

      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
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
      <section
        className="relative min-h-screen flex items-center justify-center pt-24 pb-12"
        style={{ zIndex: 2 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-12 w-full">
          {/* Back Button */}
          <motion.a
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => navigate('/services')}
            className="inline-flex items-center gap-2 mb-8 group transition-colors duration-300 hover:text-white cursor-pointer"
            style={{ color: THEME.textGray }}
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span className="text-sm font-medium">Back to Services</span>
          </motion.a>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div ref={heroRef} className="hero-content">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{
                  background: 'rgba(2, 211, 254, 0.1)',
                  border: '1px solid rgba(2, 211, 254, 0.2)',
                }}
              >
                <Layers size={14} style={{ color: THEME.cyan }} />
                <span
                  className="text-sm font-medium uppercase tracking-wider"
                  style={{ color: THEME.cyan }}
                >
                  {service.category}
                </span>
              </motion.div>

              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                style={{ color: THEME.textWhite }}
              >
                {service.title.split(' ').map((word, i) => (
                  <span key={i}>
                    {i > 0 && ' '}
                    <GradientText>{word}</GradientText>
                  </span>
                ))}
              </h1>

              <p className="text-xl mb-4 font-light" style={{ color: THEME.textGray }}>
                {service.shortDescription}
              </p>

              {/* Status / Delivery Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-3 mb-8"
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <PrimaryButton onClick={handleGetStarted} icon={Zap}>
                  Get Started
                </PrimaryButton>
                <OutlineButton
                  onClick={() => navigate('/contact?subject=Quick%20Inquiry')}
                  icon={Calendar}
                >
                  Schedule Call
                </OutlineButton>
              </motion.div>
            </div>

            {/* Hero Image */}
            <div ref={heroImageRef} className="relative hidden lg:block">
              <div
                className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl pointer-events-none"
                style={{ background: THEME.gradientPrimary }}
              />
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                  border: `1px solid rgba(2, 211, 254, 0.1)`,
                }}
              >
                <img
                  src={imageUrl}
                  alt={service.seoMetaTitle || service.title}
                  onLoad={() => setImageLoaded(true)}
                  className={`w-full aspect-video object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(10,10,15,0.95), rgba(10,10,15,0.3), transparent)',
                  }}
                />

                {/* Overlay Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="absolute bottom-5 left-5 right-5 rounded-xl p-4"
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${THEME.border}`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: THEME.textMuted }}
                      >
                        Category
                      </p>
                      <p className="text-sm font-semibold" style={{ color: THEME.cyan }}>
                        {service.category}
                      </p>
                    </div>
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(2, 211, 254, 0.15)' }}
                    >
                      <Sparkles size={18} style={{ color: THEME.cyan }} />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative */}
              <div
                className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-xl animate-pulse"
                style={{ background: 'rgba(2, 211, 254, 0.2)' }}
              />
              <div
                className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full blur-xl animate-pulse"
                style={{ animationDelay: '1s', background: 'rgba(78, 144, 225, 0.2)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📋 CONTENT SECTIONS                                                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto px-6">
          {/* 1. Full Description */}
          <section className="mb-20">
            <SectionHeading
              icon={FileText}
              title="Service Overview"
              subtitle="Detailed breakdown of what you get"
            />
            <GlassCard className="detail-card p-8">
              <div className="prose prose-invert max-w-none" style={{ color: THEME.textGray }}>
                <MarkUpTextRender markedDesc={service.fullDescription} />
              </div>
            </GlassCard>
          </section>

          {/* 2. Tech Stack */}
          {techStack.length > 0 && (
            <section className="mb-20">
              <SectionHeading
                icon={Code2}
                title="Technology Stack"
                subtitle={`${techStack.length} tools & frameworks`}
              />
              <GlassCard className="detail-card p-8">
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, i) => (
                    <TechBadge key={`${tech}-${i}`} name={tech} />
                  ))}
                </div>
              </GlassCard>
            </section>
          )}

          {/* 3. Features */}
          {features.length > 0 && (
            <section className="mb-20">
              <SectionHeading
                icon={CheckCircle2}
                title="Key Features"
                subtitle={`${features.length} deliverables included`}
              />
              <GlassCard className="detail-card p-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {features.map((feat, i) => (
                    <FeatureCard key={`${feat}-${i}`} feature={feat} index={i} />
                  ))}
                </div>
              </GlassCard>
            </section>
          )}

          {/* 4. Process */}
          <section className="mb-20">
            <SectionHeading
              icon={Cpu}
              title="Development Process"
              subtitle="How we deliver your project"
            />
            <GlassCard className="detail-card p-8">
              {PROCESS_STEPS.map((step, i) => (
                <ProcessStep
                  key={i}
                  number={i + 1}
                  title={step.title}
                  description={step.desc}
                  delay={i * 0.08}
                  isLast={i === PROCESS_STEPS.length - 1}
                />
              ))}
            </GlassCard>
          </section>

          {/* 5. CTA */}
          <section>
            <div
              className="rounded-2xl p-8 md:p-12 detail-card text-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(2, 211, 254, 0.15), rgba(154, 92, 183, 0.15))',
                border: '1px solid rgba(2, 211, 254, 0.2)',
                boxShadow: '0 0 40px rgba(2, 211, 254, 0.05)',
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                style={{ background: 'rgba(2, 211, 254, 0.15)' }}
              >
                <Sparkles size={32} style={{ color: THEME.cyan }} />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl font-bold mb-3"
                style={{ color: THEME.textWhite }}
              >
                Ready to Get Started?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base mb-7 max-w-xl mx-auto"
                style={{ color: THEME.textGray }}
              >
                Let's discuss your project requirements and create something exceptional together.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <PrimaryButton onClick={handleGetStarted} icon={ExternalLink}>
                  Start Project
                </PrimaryButton>
                <OutlineButton
                  onClick={() => navigate('/contact?subject=Quick%20Inquiry')}
                  icon={Calendar}
                >
                  Schedule Call
                </OutlineButton>
              </motion.div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default memo(ServiceDetailPage);
