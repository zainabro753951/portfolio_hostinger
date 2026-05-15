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
import { useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
// 🧩 SERVICE CARD (Uses shared GlassCard, TechBadge, GradientText)
// ═══════════════════════════════════════════════════════════════════════════
const ServiceCard = ({ service, index }) => {
  const features = safeParse(service?.features);
  const serviceImage = safeParse(service?.serviceImage);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;
  const palette = SERVICE_COLOR_PALETTES[index % SERVICE_COLOR_PALETTES.length];

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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.7, ease: 'power3.out' }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -10 }}
    >
      <div
        className="relative rounded-2xl overflow-hidden h-full p-8"
        style={{
          background: THEME.bgCard,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${THEME.border}`,
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Glow */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-10 transition-all duration-700"
          style={{ background: palette.gradient }}
        />

        {/* Icon */}
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 overflow-hidden shadow-lg"
          style={{ background: palette.gradient }}
        >
          {serviceImage?.url ? (
            <img
              className="w-full h-full object-cover"
              src={`${backendUrl}${serviceImage.url}`}
              alt=""
            />
          ) : (
            <service.icon size={28} style={{ color: '#ffffff' }} />
          )}
        </motion.div>

        {/* Title */}
        <h3
          className="text-2xl font-bold mb-4 transition-colors duration-300"
          style={{ color: THEME.textWhite }}
        >
          {service.title}
        </h3>

        {/* Description */}
        <p className="mb-6 leading-relaxed" style={{ color: THEME.textGray }}>
          {service.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-8">
          {features.map((feature, fIndex) => (
            <motion.span
              key={fIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + fIndex * 0.05 }}
              viewport={{ once: true }}
            >
              <TechBadge name={feature} />
            </motion.span>
          ))}
        </div>

        {/* CTA */}
        <Link to={`/services/${service?.slug}`}>
          <motion.span
            whileHover={{ x: 8 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-300 cursor-pointer"
            style={{ color: THEME.cyan }}
          >
            <span>Learn More</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              <ArrowRight size={18} />
            </motion.div>
          </motion.span>
        </Link>

        {/* Bottom Line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, rgba(2, 211, 254, 0.3), transparent)' }}
        />
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 📋 PROCESS STEP
// ═══════════════════════════════════════════════════════════════════════════
const ProcessStep = ({ step, index, isLast }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1, duration: 0.6, ease: 'power3.out' }}
    viewport={{ once: true }}
    whileHover={{ x: 8 }}
    className="relative flex items-start gap-6 group"
  >
    {/* Connector Line */}
    {!isLast && (
      <div
        className="absolute left-8 top-16 w-0.5 h-16 opacity-30"
        style={{ background: 'linear-gradient(to bottom, #02d3fe, transparent)' }}
      />
    )}

    {/* Number Badge */}
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
      style={{ background: THEME.gradientCyanBlue, boxShadow: '0 0 20px rgba(2, 211, 254, 0.2)' }}
    >
      <span className="text-2xl font-bold" style={{ color: '#ffffff' }}>
        {step.number}
      </span>
    </motion.div>

    {/* Content Card */}
    <div
      className="flex-1 rounded-2xl p-6 transition-all duration-300"
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
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-xl font-bold transition-colors duration-300"
          style={{ color: THEME.textWhite }}
        >
          {step.title}
        </h3>
        <div className="flex items-center gap-2 text-sm" style={{ color: THEME.textGrayDark }}>
          <Clock size={14} />
          <span>{step.duration}</span>
        </div>
      </div>
      <p className="leading-relaxed mb-4" style={{ color: THEME.textGray }}>
        {step.description}
      </p>
      <div className="flex items-center gap-2">
        <step.icon size={18} style={{ color: THEME.cyan }} />
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: THEME.cyan }}
        >
          Step {step.number}
        </span>
      </div>
    </div>
  </motion.div>
);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'power3.out' }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <div
        className="relative rounded-2xl p-6 text-center overflow-hidden transition-all duration-300 h-full"
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
      >
        {/* Glow */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500"
          style={{ background: gradients[index % gradients.length] }}
        />

        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg relative z-10"
          style={{ background: gradients[index % gradients.length] }}
        >
          <service.icon size={28} style={{ color: '#ffffff' }} />
        </motion.div>

        <h3
          className="text-lg font-semibold mb-2 transition-colors duration-300 relative z-10"
          style={{ color: THEME.textWhite }}
        >
          {service.title}
        </h3>
        <p className="text-sm relative z-10" style={{ color: THEME.textGray }}>
          {service.description}
        </p>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 🏗️ MAIN SERVICES PAGE
// ═══════════════════════════════════════════════════════════════════════════
const Services = () => {
  const { services: sc } = useSelector((state) => state.service);
  const containerRef = useRef(null);

  // Map services with color palettes
  const services = sc.map((service, idx) => {
    const palette = SERVICE_COLOR_PALETTES[idx % SERVICE_COLOR_PALETTES.length];
    return { ...service, ...palette };
  });

  // GSAP Animations
  useGSAP(
    () => {
      gsap.from('.benefit-item', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.benefits-section', start: 'top 85%', once: true },
      });
    },
    { scope: containerRef }
  );

  return (
    <LazyMotion features={domAnimation}>
      <div
        ref={containerRef}
        className="relative min-h-screen overflow-x-hidden"
        style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
      >
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 🌌 BACKGROUND LAYERS (Matches ProjectDetailsPage EXACTLY)         */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse"
            style={{ background: 'rgba(2, 211, 254, 0.12)' }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse"
            style={{ animationDelay: '1s', background: 'rgba(78, 144, 225, 0.12)' }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-[100px] animate-pulse"
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
        <section className="relative pt-24 pb-12" style={{ zIndex: 2 }}>
          <div className="max-w-7xl mx-auto px-6 py-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center"
            >
              <motion.span
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
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
                className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
                style={{ color: THEME.textWhite }}
              >
                My <GradientText>Services</GradientText>
              </h1>

              <p
                className="text-lg max-w-2xl mx-auto leading-relaxed"
                style={{ color: THEME.textGray }}
              >
                Comprehensive digital solutions tailored to your needs. From concept to launch, I'll
                help you build something amazing.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 📊 BENEFITS BAR                                                    */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="benefits-section py-12 border-y"
          style={{ zIndex: 2, borderColor: THEME.border }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {BENEFITS.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="benefit-item flex items-center justify-center gap-3"
                  style={{ color: THEME.textGray }}
                  whileHover={{ scale: 1.05 }}
                >
                  <benefit.icon size={20} style={{ color: THEME.cyan }} />
                  <span className="font-medium">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 💼 MAIN SERVICES                                                   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative py-24" style={{ zIndex: 2 }}>
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span
                className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
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
                className="text-4xl sm:text-5xl font-bold mb-6"
                style={{ color: THEME.textWhite }}
              >
                How Can I <GradientText>Help You</GradientText>
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <ServiceCard key={service.title} service={service} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 🔷 ADDITIONAL SERVICES                                             */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative py-24 overflow-hidden" style={{ zIndex: 2 }}>
          {/* Center Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px]"
            style={{ background: 'rgba(2, 211, 254, 0.05)' }}
          />

          <div className="max-w-7xl mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span
                className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
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
                className="text-4xl sm:text-5xl font-bold mb-6"
                style={{ color: THEME.textWhite }}
              >
                Additional <span style={{ color: THEME.cyan }}>Offerings</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          className="relative py-24"
          style={{ zIndex: 2, background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span
                className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
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
                className="text-4xl sm:text-5xl font-bold mb-6"
                style={{ color: THEME.textWhite }}
              >
                How I <GradientText>Work</GradientText>
              </h2>
              <p className="max-w-2xl mx-auto" style={{ color: THEME.textGray }}>
                A proven process that ensures every project is delivered on time, within budget, and
                exceeds expectations.
              </p>
            </motion.div>

            <div className="space-y-8">
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
        {/* 💡 CTA SECTION (Matches ProjectDetailsPage CTA style)              */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative py-24" style={{ zIndex: 2 }}>
          <div className="max-w-4xl mx-auto px-6">
            <div
              className="rounded-2xl p-8 md:p-12 text-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(2, 211, 254, 0.15), rgba(154, 92, 183, 0.15))',
                border: '1px solid rgba(2, 211, 254, 0.2)',
                boxShadow: '0 0 40px rgba(2, 211, 254, 0.05)',
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
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
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
                style={{ color: THEME.textWhite }}
              >
                Ready to Start Your <span style={{ color: THEME.cyan }}>Project?</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
                style={{ color: THEME.textGray }}
              >
                Let's discuss how I can help bring your vision to life. Get in touch for a free
                consultation.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <PrimaryButton icon={ArrowRight} className="px-10 py-4">
                  Get a Free Quote
                </PrimaryButton>
                <OutlineButton icon={MessageCircle}>Contact Me</OutlineButton>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
};

export default Services;
