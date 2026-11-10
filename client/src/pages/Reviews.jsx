import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Quote,
  Sparkles,
  Star,
  ThumbsUp,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

import { getClientSatisfactionRate, safeParse, TESTIMONIAL_GRADIENTS } from '@/Utils/Utils';
import StatCard from '@/sections/StatCard';
import LazyImage from '@/components/LazyImage';
import { useMotionPrefs, fadeUp, staggerParent, VIEWPORT_ONCE } from '@/lib/motion';

// ═══════════════════════════════════════════════════════════════════════════
// 🧩 TESTIMONIAL CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const TestimonialCard = ({ testimonial, index, onClick, isActive }) => {
  const { prefersReducedMotion } = useMotionPrefs();

  return (
    <motion.div
      variants={fadeUp}
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      onClick={() => onClick(index)}
      role="button"
      tabIndex={0}
      aria-label={`View testimonial by ${testimonial.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(index);
        }
      }}
      className={`group relative h-full flex flex-col justify-between p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/60 ${
        isActive
          ? 'bg-surface-card border-2 border-brand-cyan shadow-glow-cyan'
          : 'bg-surface-card/80 backdrop-blur-sm border border-line-subtle hover:border-brand-cyan/40 hover:bg-surface-card'
      }`}
    >
      {/* Top accent glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-b from-brand-cyan/5 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          {/* Header row: Stars & Quote Icon */}
          <div className="flex items-center justify-between mb-4">
            <div
              className="flex items-center gap-1"
              role="img"
              aria-label={`${testimonial.rating} out of 5 stars`}
            >
              {[...Array(Math.min(testimonial.rating, 5))].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className="fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
              ))}
            </div>
            <Quote
              size={18}
              className="text-ink-muted/40 group-hover:text-brand-cyan/60 transition-colors"
              aria-hidden="true"
            />
          </div>

          {/* Testimonial message */}
          <blockquote className="text-ink-secondary text-sm sm:text-base leading-relaxed mb-6 font-normal">
            "{testimonial.text}"
          </blockquote>
        </div>

        {/* Client identity */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0 w-10 h-10 rounded-full ring-2 ring-white/10 group-hover:ring-brand-cyan/50 overflow-hidden transition-all">
              <LazyImage
                src={testimonial.image}
                fallback="/default-avatar.jpg"
                alt={`${testimonial.name}, ${testimonial.role}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-heading font-semibold text-sm text-ink truncate group-hover:text-brand-cyan transition-colors">
                {testimonial.name}
              </h4>
              <p className="text-xs text-ink-muted truncate">
                {testimonial.role || 'Client'}
              </p>
            </div>
          </div>

          {testimonial.company && (
            <span className="hidden sm:inline-block flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-mono text-ink-secondary bg-surface-base border border-line-subtle max-w-[120px] truncate">
              {testimonial.company}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 📝 REVIEWS PAGE MAIN
// ═══════════════════════════════════════════════════════════════════════════
const Reviews = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE || '';
  const { testimonials = [] } = useSelector((state) => state.testimonial);
  const { prefersReducedMotion } = useMotionPrefs();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔄 DATA TRANSFORMATION
  // ═══════════════════════════════════════════════════════════════════════════
  const processedTestimonials = useMemo(() => {
    if (!testimonials?.length) return [];
    return testimonials.map((t, i) => {
      const imgData = safeParse(t.clientImage);
      const imageUrl = imgData?.url
        ? `${backendUrl.replace(/\/+$/, '')}/${imgData.url.replace(/^\/+/, '')}`
        : '/default-avatar.jpg';
      const gradients = TESTIMONIAL_GRADIENTS || [
        'linear-gradient(135deg, #02d3fe, #4e90e1)',
        'linear-gradient(135deg, #4e90e1, #9a5cb7)',
        'linear-gradient(135deg, #9a5cb7, #ec4899)',
        'linear-gradient(135deg, #10b981, #02d3fe)',
      ];

      return {
        id: t.id || i,
        name: t.clientName || 'Valued Client',
        role: t.designationRole || '',
        company: t.company || '',
        image: imageUrl,
        rating: Math.min(Number(t.ratting) || 5, 5),
        text: t.message || '',
        gradient: gradients[i % gradients.length],
      };
    });
  }, [testimonials, backendUrl]);

  // Keep activeIndex within bounds
  useEffect(() => {
    if (activeIndex >= processedTestimonials.length && processedTestimonials.length > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, processedTestimonials.length]);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || processedTestimonials.length <= 1 || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % processedTestimonials.length);
    }, 6500);

    return () => clearInterval(interval);
  }, [isAutoPlaying, processedTestimonials.length, prefersReducedMotion]);

  // Navigation handlers
  const nextTestimonial = useCallback(() => {
    setDirection(1);
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % processedTestimonials.length);
  }, [processedTestimonials.length]);

  const prevTestimonial = useCallback(() => {
    setDirection(-1);
    setIsAutoPlaying(false);
    setActiveIndex(
      (prev) => (prev - 1 + processedTestimonials.length) % processedTestimonials.length
    );
  }, [processedTestimonials.length]);

  const goToTestimonial = useCallback(
    (index) => {
      setDirection(index > activeIndex ? 1 : -1);
      setIsAutoPlaying(false);
      setActiveIndex(index);
    },
    [activeIndex]
  );

  // Active testimonial
  const currentTestimonial = useMemo(
    () => processedTestimonials[activeIndex] || processedTestimonials[0] || {},
    [activeIndex, processedTestimonials]
  );

  // Stats calculation
  const statsData = useMemo(() => {
    if (!processedTestimonials.length) return [];

    const uniqueClients = new Set(processedTestimonials.map((t) => t.name)).size;
    const totalRating = processedTestimonials.reduce((sum, t) => sum + (t.rating || 5), 0);
    const avgRating = (totalRating / processedTestimonials.length).toFixed(1);
    const rawSatisfaction = getClientSatisfactionRate(processedTestimonials);
    const satisfaction = Number.isFinite(Number(rawSatisfaction)) ? rawSatisfaction : 100;

    return [
      {
        value: `${processedTestimonials.length}`,
        label: 'Total Reviews',
        icon: MessageCircle,
        gradient: 'linear-gradient(135deg, rgba(2, 211, 254, 0.2), rgba(78, 144, 225, 0.2))',
      },
      {
        value: `${uniqueClients}`,
        label: 'Happy Clients',
        icon: ThumbsUp,
        gradient: 'linear-gradient(135deg, rgba(78, 144, 225, 0.2), rgba(154, 92, 183, 0.2))',
      },
      {
        value: avgRating,
        label: 'Average Rating',
        icon: Star,
        gradient: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))',
      },
      {
        value: `${satisfaction}%`,
        label: 'Satisfaction Rate',
        icon: Award,
        gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(2, 211, 254, 0.2))',
      },
    ];
  }, [processedTestimonials]);

  // SEO Schema.org structured data
  const structuredData = useMemo(() => {
    if (!processedTestimonials.length) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Client Testimonials',
      description: 'Authentic reviews and testimonials from clients.',
      itemListElement: processedTestimonials.slice(0, 10).map((t, i) => ({
        '@type': 'Review',
        position: i + 1,
        reviewBody: t.text,
        author: {
          '@type': 'Person',
          name: t.name,
          jobTitle: t.role,
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: t.rating,
          bestRating: 5,
        },
        itemReviewed: {
          '@type': 'Service',
          name: 'Full Stack Web Development',
        },
      })),
    };
  }, [processedTestimonials]);

  const slideVariants = useMemo(
    () => ({
      enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
      center: { x: 0, opacity: 1 },
      exit: (dir) => ({ x: dir < 0 ? 40 : -40, opacity: 0 }),
    }),
    []
  );

  // Empty State
  if (processedTestimonials.length === 0) {
    return (
      <div
        id="reviews-page"
        className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-surface-card border border-line-subtle flex items-center justify-center text-ink-muted mb-4">
          <MessageCircle size={28} />
        </div>
        <h1 className="font-heading text-2xl font-bold text-ink mb-2">No Reviews Yet</h1>
        <p className="text-ink-secondary text-sm max-w-md mb-6">
          Testimonials will appear here once client collaborations and project reviews are published.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-card hover:bg-surface-elevated border border-line-subtle text-ink text-sm font-medium transition-all"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div id="reviews-page" className="relative min-h-screen text-ink overflow-x-clip bg-surface-base">
      {/* Schema.org Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* 🌌 AMBIENT BACKGROUND GLOWS (Pure CSS, 0 JS load) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 h-80 w-80 sm:h-96 sm:w-96 rounded-full bg-brand-cyan/10 blur-[130px]" />
        <div className="absolute top-2/3 right-1/4 h-80 w-80 sm:h-96 sm:w-96 rounded-full bg-brand-blue/10 blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/3 h-72 w-72 rounded-full bg-brand-purple/10 blur-[150px]" />
      </div>

      <div className="relative z-10">
        {/* ═══════════════════════════════════════════════════════════════════
            HERO SECTION
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 mb-4 sm:mb-6 shadow-glow-cyan">
                <Sparkles size={13} className="text-brand-cyan" aria-hidden="true" />
                Client Feedback
              </span>

              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-ink mb-4 sm:mb-6 leading-tight">
                Client{' '}
                <span className="bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple bg-clip-text text-transparent">
                  Reviews & Endorsements
                </span>
              </h1>

              <p className="text-ink-secondary text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Direct experiences from founders, product owners, and engineering leads who have
                partnered with me to build scalable modern web applications.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            FEATURED TESTIMONIAL CAROUSEL
           ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="py-8 sm:py-12"
          aria-label="Featured review showcase"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.5 }}
              className="relative rounded-3xl bg-surface-card/90 backdrop-blur-xl border border-line-subtle p-6 sm:p-10 md:p-12 shadow-2xl overflow-hidden min-h-[340px] sm:min-h-[380px] flex flex-col justify-between"
            >
              {/* Background ambient radial inside card */}
              <div
                className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-cyan/10 blur-[80px] pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-brand-purple/10 blur-[80px] pointer-events-none"
                aria-hidden="true"
              />

              {/* Floating Quote Badge */}
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-blue flex items-center justify-center text-surface-base shadow-glow-cyan">
                  <Quote size={20} className="text-surface-base" aria-hidden="true" />
                </div>
                <div
                  className="flex items-center gap-1 bg-surface-base/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-line-subtle"
                  role="img"
                  aria-label={`${currentTestimonial.rating} out of 5 stars`}
                >
                  {[...Array(Math.min(currentTestimonial.rating, 5))].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-amber-400 text-amber-400"
                      aria-hidden="true"
                    />
                  ))}
                  <span className="text-xs font-mono font-semibold text-ink ml-1.5">
                    {currentTestimonial.rating}.0
                  </span>
                </div>
              </div>

              {/* Carousel Content */}
              <div className="relative z-10 flex-1 flex flex-col justify-between">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentTestimonial.id || activeIndex}
                    custom={direction}
                    variants={prefersReducedMotion ? undefined : slideVariants}
                    initial={prefersReducedMotion ? 'center' : 'enter'}
                    animate="center"
                    exit={prefersReducedMotion ? undefined : 'exit'}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col justify-between h-full"
                  >
                    <blockquote className="font-heading text-lg sm:text-2xl md:text-3xl font-light text-ink leading-relaxed mb-6 sm:mb-8">
                      "{currentTestimonial.text}"
                    </blockquote>

                    {/* Author profile */}
                    <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full ring-2 ring-brand-cyan/60 overflow-hidden flex-shrink-0 shadow-lg">
                          <LazyImage
                            src={currentTestimonial.image}
                            fallback="/default-avatar.jpg"
                            alt={`${currentTestimonial.name}, ${currentTestimonial.role}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-base sm:text-lg text-ink">
                            {currentTestimonial.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-ink-secondary">
                            {currentTestimonial.role || 'Client'}
                          </p>
                        </div>
                      </div>

                      {currentTestimonial.company && (
                        <div className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/25">
                          {currentTestimonial.company}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls bar */}
              <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10 relative z-10">
                {/* Dots indicator */}
                <nav
                  aria-label="Testimonial navigation dots"
                  className="flex items-center gap-1.5 sm:gap-2 flex-wrap"
                >
                  {processedTestimonials.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => goToTestimonial(index)}
                      className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan ${
                        index === activeIndex
                          ? 'w-7 bg-brand-cyan shadow-glow-cyan'
                          : 'w-2 bg-ink-muted/30 hover:bg-ink-muted/60'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                      aria-current={index === activeIndex ? 'true' : undefined}
                    />
                  ))}
                </nav>

                {/* Arrow Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevTestimonial}
                    aria-label="Previous testimonial"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-elevated/80 hover:bg-surface-elevated border border-line-subtle hover:border-brand-cyan/50 text-ink flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                  >
                    <ChevronLeft size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={nextTestimonial}
                    aria-label="Next testimonial"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-elevated/80 hover:bg-surface-elevated border border-line-subtle hover:border-brand-cyan/50 text-ink flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                  >
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            ALL REVIEWS GRID
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-12 sm:py-20" aria-label="All client testimonials">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-14">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-medium text-brand-blue bg-brand-blue/10 border border-brand-blue/20 mb-3">
                Wall of Trust
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-ink">
                More{' '}
                <span className="bg-gradient-to-r from-brand-cyan to-brand-blue bg-clip-text text-transparent">
                  Client Experiences
                </span>
              </h2>
            </div>

            <motion.div
              variants={staggerParent}
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            >
              {processedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id || index}
                  testimonial={testimonial}
                  index={index}
                  onClick={goToTestimonial}
                  isActive={index === activeIndex}
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CLIENT SATISFACTION (BY THE NUMBERS)
           ═══════════════════════════════════════════════════════════════════ */}
        {statsData.length > 0 && (
          <section className="py-12 sm:py-20" aria-label="Key performance stats">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-10 sm:mb-14">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium text-brand-purple bg-brand-purple/10 border border-brand-purple/20 mb-3">
                  <TrendingUp size={13} className="text-brand-purple" aria-hidden="true" />
                  Performance Metrics
                </span>
                <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-ink">
                  Client{' '}
                  <span className="bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-blue bg-clip-text text-transparent">
                    Satisfaction
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {statsData.map((stat, index) => (
                  <StatCard key={stat.label || index} stat={stat} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            CTA SECTION
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24" aria-label="Start your project call to action">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              variants={fadeUp}
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              className="relative rounded-3xl bg-gradient-to-br from-brand-cyan/10 via-surface-card to-brand-purple/10 border border-brand-cyan/25 p-8 sm:p-12 md:p-16 text-center shadow-2xl overflow-hidden"
            >
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan mx-auto mb-6 shadow-glow-cyan"
                aria-hidden="true"
              >
                <Sparkles size={28} />
              </div>

              <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-ink mb-4 sm:mb-6">
                Ready to Join My{' '}
                <span className="bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple bg-clip-text text-transparent">
                  Happy Clients?
                </span>
              </h2>

              <p className="text-ink-secondary text-sm sm:text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Whether you have an upcoming SaaS product, web application, or need high-performance
                frontend architecture, let's create something remarkable together.
              </p>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-heading font-semibold text-sm sm:text-base text-surface-base bg-gradient-to-r from-brand-cyan to-brand-blue hover:from-brand-cyan hover:to-brand-cyan transition-all duration-300 shadow-glow-cyan hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
              >
                <span>Start Your Project</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Reviews;
