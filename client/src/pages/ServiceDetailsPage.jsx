import { safeParse } from '@/Utils/Utils';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
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
import { motion, useScroll, useTransform } from 'motion/react';
import { memo, useEffect, useRef, useState } from 'react';
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
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  draft: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/10  border-amber-500/20',
    dot: 'bg-amber-400',
  },
  inactive: {
    color: 'text-slate-400',
    bg: 'bg-slate-500/10  border-slate-500/20',
    dot: 'bg-slate-400',
  },
};

// ── Reusable Glass Card ──────────────────────────────────────────
const GlassCard = memo(({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={`glass rounded-2xl border border-white/10 backdrop-blur-xl ${className}`}
  >
    {children}
  </motion.div>
));

// ── Section Heading ──────────────────────────────────────────────
const SectionHeading = memo(({ icon: Icon, title, subtitle }) => (
  <div className="mb-8">
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-3 mb-2"
    >
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/20 flex-shrink-0">
        <Icon className="w-4 h-4 text-cyan-400" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-white font-display">{title}</h2>
    </motion.div>
    {subtitle && <p className="text-sm text-slate-500 ml-12">{subtitle}</p>}
  </div>
));

// ── Tech Chip ────────────────────────────────────────────────────
const TechChip = memo(({ tech, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.35, delay: index * 0.04 }}
    whileHover={{ scale: 1.05, y: -2 }}
    className="group relative px-4 py-2 rounded-xl bg-slate-800/50 border border-white/8 hover:border-cyan-500/30 transition-all duration-300 cursor-default"
  >
    <span className="text-sm font-medium text-slate-300 group-hover:text-cyan-400 transition-colors">
      {tech}
    </span>
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
  </motion.div>
));

// ── Feature Card ─────────────────────────────────────────────────
const FeatureCard = memo(({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 18, scale: 1 }}
    whileHover={{
      scale: 1.02,
      transition: {
        duration: 0.05,
      },
    }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay: index * 0.07 }}
    className="group relative p-4 rounded-xl bg-slate-800/30 border border-white/5 hover:border-cyan-500/20 hover:bg-slate-800/50 "
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:from-cyan-500/25 group-hover:to-blue-500/25 transition-all mt-0.5">
        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
      </div>
      <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors leading-relaxed">
        {feature}
      </p>
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
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-cyan-500/20 z-10 flex-shrink-0">
        {number}
      </div>
      {!isLast && (
        <div className="w-px flex-1 bg-gradient-to-b from-cyan-500/40 to-transparent mt-2" />
      )}
    </div>
    <div className={`${isLast ? 'pb-0' : 'pb-10'} w-full`}>
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  </motion.div>
));

// ── Stat Badge ───────────────────────────────────────────────────
const StatBadge = ({ icon: Icon, label, value, accent = 'cyan' }) => {
  const colors = {
    cyan: 'text-cyan-400  border-white/10 bg-slate-800/50',
    emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    amber: 'text-amber-400  border-amber-500/20   bg-amber-500/5',
  };
  return (
    <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border ${colors[accent]}`}>
      <Icon className={`w-3.5 h-3.5 ${colors[accent].split(' ')[0]}`} />
      <span className="text-xs text-slate-400">{label}</span>
      <span className={`text-xs font-semibold ${colors[accent].split(' ')[0]} capitalize`}>
        {value}
      </span>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════
const ServiceDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const heroRef = useRef(null);

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { services } = useSelector((state) => state.service);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.18], [1, 0.96]);

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
  const seoKeywords = safeParse(service?.seoKeywords) || [];
  const serviceImage = safeParse(service?.serviceImage) || {};
  const imageUrl = serviceImage?.url ? `${backendUrl}${serviceImage.url}` : '/default-service.jpg';
  const statusCfg = STATUS_CONFIG[service?.status] || STATUS_CONFIG.draft;

  // ── GSAP ─────────────────────────────────────────────────────
  useGSAP(
    () => {
      if (!service || loading) return;
      const chars = heroRef.current?.querySelectorAll('.hero-char');
      if (chars?.length) {
        gsap.fromTo(
          chars,
          { y: 80, opacity: 0, rotateX: -35 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.1,
            stagger: 0.025,
            ease: 'power4.out',
            delay: 0.15,
          }
        );
      }
      gsap.to('.float-orb', {
        y: -14,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.4,
      });
    },
    { scope: pageRef, dependencies: [service, loading] }
  );

  // ── Contact CTA ──────────────────────────────────────────────
  const handleGetStarted = () => {
    const params = new URLSearchParams({
      service: slug,
      subject: `Interested in ${service.title} Service`,
      message: `Hi, I'm interested in your "${service.title}" service.\n\nCategory: ${service.category}\nPreferred Stack: ${techStack.slice(0, 3).join(', ')}\nExpected Timeline: ${service.deliveryTime || 'Flexible'}\n\nPlease let me know the next steps.\n\nBest regards,`,
    });
    navigate(`/contact?${params.toString()}`);
  };

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-mesh">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-2 border-cyan-500 border-t-transparent"
        />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-mesh">
        <div className="text-center space-y-5">
          <p className="text-xl text-white">Service not found</p>
          <button
            onClick={() => navigate('/services')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium"
          >
            Back to Services
          </button>
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
    <div ref={pageRef} className="relative min-h-screen gradient-mesh overflow-x-hidden">
      {/* ══════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════ */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[88vh] flex items-center justify-center pt-20"
      >
        {/* Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="float-orb absolute top-1/4 left-1/5 w-[480px] h-[480px] bg-cyan-500/15 rounded-full blur-[130px]" />
          <div className="float-orb absolute bottom-1/4 right-1/5 w-[380px] h-[380px] bg-blue-500/15 rounded-full blur-[110px]" />
          <div className="float-orb absolute top-1/2 left-1/2 w-[260px] h-[260px] bg-purple-500/10 rounded-full blur-[80px]" />
        </div>

        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/60 rounded-full"
              style={{ left: `${(i * 8.3) % 100}%`, top: `${(i * 13.7) % 100}%` }}
              animate={{ y: [0, -28, 0], opacity: [0.15, 0.5, 0.15] }}
              transition={{ duration: 3.5 + (i % 3) * 0.8, repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
          {/* Back */}
          <motion.button
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">All Services</span>
          </motion.button>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* ── Left: Text ── */}
            <div ref={heroRef} className="relative z-10">
              {/* Category badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass mb-5 border border-cyan-500/20"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                  {service.category}
                </span>
              </motion.div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-5 overflow-hidden leading-tight">
                {service.title
                  .toUpperCase()
                  .split('')
                  .map((char, i) => (
                    <span
                      key={i}
                      className="hero-char inline-block"
                      style={{
                        color: char === ' ' ? 'transparent' : '#ffffff',
                        textShadow: '0 0 40px rgba(0,212,255,0.25)',
                      }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
              </h1>

              {/* Short description */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="text-base sm:text-lg text-slate-400 mb-7 leading-relaxed max-w-lg"
              >
                {service.shortDescription}
              </motion.p>

              {/* Status / Delivery / Featured badges */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="flex flex-wrap gap-2.5 mb-8"
              >
                {service.deliveryTime && (
                  <StatBadge
                    icon={Clock}
                    label="Delivery:"
                    value={service.deliveryTime}
                    accent="cyan"
                  />
                )}

                <div
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold ${statusCfg.bg} ${statusCfg.color}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} animate-pulse`} />
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span className="capitalize">{service.status || 'draft'}</span>
                </div>

                {service.isFeatured && (
                  <StatBadge icon={Star} label="" value="Featured" accent="amber" />
                )}
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
                className="flex flex-wrap gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGetStarted}
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-shadow flex items-center gap-2 text-sm"
                >
                  <Zap className="w-4 h-4" />
                  Get Started
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/contact?subject=Quick%20Inquiry')}
                  className="px-7 py-3.5 rounded-xl glass text-white font-semibold border border-white/10 hover:border-cyan-500/30 transition-colors flex items-center gap-2 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Call
                </motion.button>
              </motion.div>
            </div>

            {/* ── Right: Image ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative hidden lg:block"
            >
              <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-purple-500/15 rounded-3xl blur-3xl opacity-70" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src={imageUrl}
                  alt={service.seoMetaTitle || service.title}
                  onLoad={() => setImageLoaded(true)}
                  className={`w-full h-[460px] object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/20 to-transparent" />

                {/* Overlay info card */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="absolute bottom-5 left-5 right-5 glass rounded-xl p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-right space-y-0.5">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                        Category
                      </p>
                      <p className="text-sm font-semibold text-cyan-400">{service.category}</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-5 -right-5 w-20 h-20 border border-cyan-500/15 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 17, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-7 -left-7 w-28 h-28 border border-purple-500/15 rounded-full"
              />
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-slate-900 to-transparent" />
      </motion.section>

      {/* ══════════════════════════════════════════════
          CONTENT SECTIONS
          ══════════════════════════════════════════════ */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 space-y-20">
        {/* 1. Full Description */}
        <section>
          <SectionHeading
            icon={FileText}
            title="Service Overview"
            subtitle="Detailed breakdown of what you get"
          />
          <GlassCard>
            <div className="p-6 md:p-8 prose prose-invert max-w-none">
              <MarkUpTextRender markedDesc={service.fullDescription} />
            </div>
          </GlassCard>
        </section>

        {/* 2. Tech Stack */}
        {techStack.length > 0 && (
          <section>
            <SectionHeading
              icon={Code2}
              title="Technology Stack"
              subtitle={`${techStack.length} tools & frameworks`}
            />
            <div className="flex flex-wrap gap-2.5">
              {techStack.map((tech, i) => (
                <TechChip key={`${tech}-${i}`} tech={tech} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* 3. Features */}
        {features.length > 0 && (
          <section>
            <SectionHeading
              icon={CheckCircle2}
              title="Key Features"
              subtitle={`${features.length} deliverables included`}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {features.map((feat, i) => (
                <FeatureCard key={`${feat}-${i}`} feature={feat} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* 4. Process */}
        <section>
          <SectionHeading
            icon={Cpu}
            title="Development Process"
            subtitle="How we deliver your project"
          />
          <GlassCard className="p-6 sm:p-8">
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

        {/* 7. CTA */}
        <section>
          <GlassCard className="overflow-hidden">
            <div className="relative p-8 sm:p-12 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-blue-500/8 to-purple-500/8" />
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-cyan-500/25"
                >
                  <Sparkles className="w-7 h-7 text-white" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-display">
                  Ready to Get Started?
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto mb-7 text-base">
                  Let's discuss your project requirements and create something exceptional together.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleGetStarted}
                    className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow flex items-center gap-2 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Start Project
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/contact?subject=Quick%20Inquiry')}
                    className="px-7 py-3.5 rounded-xl glass text-white font-semibold border border-white/10 hover:border-cyan-500/30 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule Call
                  </motion.button>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>
      </div>

      <div className="h-16" />
    </div>
  );
};

export default memo(ServiceDetailPage);
