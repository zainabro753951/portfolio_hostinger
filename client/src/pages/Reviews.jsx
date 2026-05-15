import { GlassCard, GradientText, THEME } from '@/components/UI';
import StatCard from '@/sections/StatCard';
import { getClientSatisfactionRate, safeParse, TESTIMONIAL_GRADIENTS } from '@/Utils/Utils';
import { AnimatePresence, domAnimation, LazyMotion, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════
// 🧩 TESTIMONIAL CARD
// ═══════════════════════════════════════════════════════════════════════════
const TestimonialCard = ({ testimonial, index, onClick, isActive }) => {
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
      layout
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? {} : { delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={prefersReducedMotion ? undefined : { y: -8 }}
      onClick={() => onClick(index)}
      className={`cursor-pointer group relative overflow-hidden h-full ${isActive ? 'ring-1 sm:ring-2' : ''}`}
      style={{
        borderColor: isActive ? THEME.cyan : THEME.border,
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        borderRadius: '1rem',
      }}
      role="button"
      aria-label={`View testimonial by ${testimonial.name}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick(index);
      }}
    >
      <GlassCard className="h-full p-4 sm:p-5 md:p-6" hover={false}>
        {/* Background Glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"
          style={{ background: testimonial.gradient }}
          aria-hidden="true"
        />

        {/* Rating */}
        <div
          className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4"
          role="img"
          aria-label={`${testimonial.rating} out of 5 stars`}
        >
          {[...Array(Math.min(testimonial.rating, 5))].map((_, i) => (
            <motion.div
              key={i}
              initial={prefersReducedMotion ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
              whileInView={prefersReducedMotion ? undefined : { scale: 1, rotate: 0 }}
              transition={prefersReducedMotion ? {} : { delay: 0.2 + i * 0.1, type: 'spring' }}
              viewport={{ once: true }}
            >
              <Star
                size={12}
                className="sm:w-3.5 sm:h-3.5"
                fill="#fbbf24"
                style={{ color: '#fbbf24' }}
                aria-hidden="true"
              />
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <p
          className="text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-3"
          style={{ color: THEME.textGray }}
        >
          "{testimonial.text}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-shrink-0">
            <img
              src={testimonial.image}
              alt={`${testimonial.name}, ${testimonial.role}`}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2"
              style={{ borderColor: THEME.border }}
              loading="lazy"
              decoding="async"
              width="40"
              height="40"
            />
            <div
              className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center"
              style={{ background: testimonial.gradient }}
              aria-hidden="true"
            >
              <Sparkles size={6} className="sm:w-3 sm:h-3 text-white" aria-hidden="true" />
            </div>
          </div>
          <div className="min-w-0">
            <h4
              className="font-semibold text-xs sm:text-sm transition-colors duration-300 group-hover:text-cyan-400 truncate"
              style={{ color: THEME.textWhite }}
            >
              {testimonial.name}
            </h4>
            <p className="text-[10px] sm:text-xs truncate" style={{ color: THEME.textGrayDark }}>
              {testimonial.role}
            </p>
          </div>
        </div>

        {/* Company Tag */}
        <span
          className="inline-block mt-3 sm:mt-4 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium text-white truncate max-w-full"
          style={{ background: testimonial.gradient }}
        >
          {testimonial.company}
        </span>
      </GlassCard>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 📝 REVIEWS PAGE
// ═══════════════════════════════════════════════════════════════════════════
const Reviews = () => {
  const containerRef = useRef(null);
  const carouselRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE || '';

  const { testimonials = [] } = useSelector((state) => state.testimonial);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔄 DATA PROCESSING
  // ═══════════════════════════════════════════════════════════════════════════

  const processedTestimonials = useMemo(() => {
    if (!testimonials?.length) return [];
    return testimonials.map((t, i) => {
      const imgData = safeParse(t.clientImage);
      const imageUrl = imgData?.url
        ? `${backendUrl.replace(/\/+$/, '')}/${imgData.url.replace(/^\/+/, '')}`
        : '/default-avatar.jpg';
      const gradients = TESTIMONIAL_GRADIENTS || [
        'linear-gradient(135deg, #4e90e1, #02d3fe)',
        'linear-gradient(135deg, #9a5cb7, #ec4899)',
        'linear-gradient(135deg, #fbbf24, #f59e0b)',
        'linear-gradient(135deg, #10b981, #059669)',
      ];

      return {
        id: t.id || i,
        name: t.clientName || 'Client',
        role: t.designationRole || '',
        company: t.company || '',
        image: imageUrl,
        rating: Math.min(t.ratting || 5, 5),
        text: t.message || '',
        gradient: gradients[i % gradients.length],
      };
    });
  }, [testimonials, backendUrl]);

  // Stats
  const statsData = useMemo(() => {
    if (!processedTestimonials.length) return [];

    const uniqueClients = new Set(processedTestimonials.map((t) => t.name)).size;
    const totalRating = processedTestimonials.reduce((sum, t) => sum + t.rating, 0);
    const avgRating = (totalRating / processedTestimonials.length).toFixed(1);
    const satisfaction = getClientSatisfactionRate(processedTestimonials);

    return [
      {
        value: `${processedTestimonials.length}`,
        label: 'Testimonials',
        icon: MessageCircle,
        gradient: 'linear-gradient(135deg, #4e90e1, #02d3fe)',
      },
      {
        value: `${uniqueClients}`,
        label: 'Happy Clients',
        icon: ThumbsUp,
        gradient: 'linear-gradient(135deg, #9a5cb7, #ec4899)',
      },
      {
        value: avgRating,
        label: 'Average Rating',
        icon: Star,
        gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      },
      {
        value: `${satisfaction}%`,
        label: 'Satisfaction Rate',
        icon: Award,
        gradient: 'linear-gradient(135deg, #10b981, #059669)',
      },
    ];
  }, [processedTestimonials]);

  // Current testimonial for Carousel
  const currentTestimonial = useMemo(
    () => processedTestimonials[activeIndex] || processedTestimonials[0] || {},
    [activeIndex, processedTestimonials]
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // 🎬 EFFECTS & ANIMATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      gsap.from('.review-section-header', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.review-section-header',
          start: 'top 85%',
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isAutoPlaying || processedTestimonials.length <= 1 || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % processedTestimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, processedTestimonials.length, prefersReducedMotion]);

  // Reset activeIndex if it goes out of bounds
  useEffect(() => {
    if (activeIndex >= processedTestimonials.length && processedTestimonials.length > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, processedTestimonials.length]);

  // Navigation Handlers
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

  const slideVariants = useMemo(
    () => ({
      enter: (dir) => ({ x: dir > 0 ? 100 : -100, opacity: 0, scale: 0.95 }),
      center: { x: 0, opacity: 1, scale: 1 },
      exit: (dir) => ({ x: dir < 0 ? 100 : -100, opacity: 0, scale: 0.95 }),
    }),
    []
  );

  // SEO Structured Data
  const structuredData = useMemo(() => {
    if (!processedTestimonials.length) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Client Testimonials',
      description: 'Reviews and testimonials from satisfied clients.',
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
          name: 'Web Development Services',
        },
      })),
    };
  }, [processedTestimonials]);

  if (processedTestimonials.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: THEME.bg }}
        role="status"
        aria-label="No testimonials available"
      >
        <p style={{ color: THEME.textGray }} className="text-sm sm:text-base px-4">
          No testimonials available.
        </p>
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <main
        ref={containerRef}
        className="relative min-h-screen min-h-[100dvh]"
        style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
        aria-label="Client Testimonials"
      >
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        )}

        {/* 🌌 BACKGROUND LAYERS */}
        <div
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 0 }}
          aria-hidden="true"
        >
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

        {/* ✨ Particles */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} aria-hidden="true">
          {[...Array(10)].map((_, i) => (
            <div
              key={`p-${i}`}
              className="absolute w-1 h-1 rounded-full animate-pulse"
              style={{
                left: `${(i * 11.3) % 100}%`,
                top: `${(i * 17.7) % 100}%`,
                background: i % 3 === 0 ? THEME.cyan : i % 3 === 1 ? THEME.blue : THEME.purple,
                opacity: 0.2 + (i % 3) * 0.1,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${3 + (i % 4)}s`,
              }}
            />
          ))}
        </div>

        {/* 🦸 HERO SECTION */}
        <header
          className="relative pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8 md:pb-12"
          style={{ zIndex: 2 }}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? {} : { duration: 0.8 }}
              className="text-center"
            >
              <span
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6"
                style={{
                  background: 'rgba(2, 211, 254, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid rgba(2, 211, 254, 0.2)`,
                  color: THEME.cyan,
                }}
              >
                <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" aria-hidden="true" /> Testimonials
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 px-2 leading-tight">
                Client <GradientText>Reviews</GradientText>
              </h1>
              <p
                className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-4"
                style={{ color: THEME.textGray }}
              >
                Don't just take my word for it. Here's what my clients have to say about working
                together.
              </p>
            </motion.div>
          </div>
        </header>

        {/* 📋 FEATURED TESTIMONIAL CAROUSEL */}
        <section
          ref={carouselRef}
          className="relative py-10 sm:py-16 md:py-24"
          style={{ zIndex: 2 }}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          aria-label="Featured testimonial carousel"
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] rounded-full blur-[100px] sm:blur-[120px] md:blur-[150px]"
            style={{ background: 'rgba(154, 92, 183, 0.05)' }}
            aria-hidden="true"
          />

          <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 relative">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={prefersReducedMotion ? undefined : { once: true }}
              transition={prefersReducedMotion ? {} : { duration: 0.6 }}
              className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16"
            >
              <span
                className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4"
                style={{
                  background: 'rgba(154, 92, 183, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid rgba(154, 92, 183, 0.2)`,
                  color: THEME.purple,
                }}
              >
                Featured Review
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold px-2 leading-tight">
                What Clients <span style={{ color: THEME.purple }}>Say</span>
              </h2>
            </motion.div>

            <GlassCard
              className="p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl overflow-hidden relative min-h-[300px] sm:min-h-[340px] md:min-h-[380px]"
              hover={false}
            >
              <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ background: currentTestimonial.gradient }}
                aria-hidden="true"
              />
              <motion.div
                initial={
                  prefersReducedMotion ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }
                }
                animate={prefersReducedMotion ? undefined : { scale: 1, rotate: 0 }}
                transition={prefersReducedMotion ? {} : { type: 'spring', stiffness: 200 }}
                className="absolute -top-3 sm:-top-4 md:-top-5 left-4 sm:left-6 md:left-8 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg z-10"
                style={{ background: 'linear-gradient(135deg, #4e90e1, #9a5cb7)' }}
                aria-hidden="true"
              >
                <Quote
                  size={14}
                  className="sm:w-4 sm:h-4 md:w-6 md:h-6 text-white"
                  aria-hidden="true"
                />
              </motion.div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentTestimonial.id || activeIndex}
                  custom={direction}
                  variants={prefersReducedMotion ? undefined : slideVariants}
                  initial={prefersReducedMotion ? 'center' : 'enter'}
                  animate={prefersReducedMotion ? 'center' : 'center'}
                  exit={prefersReducedMotion ? undefined : 'exit'}
                  transition={prefersReducedMotion ? {} : { duration: 0.5, ease: 'easeInOut' }}
                  className="relative mt-2 sm:mt-4 pt-4 sm:pt-6"
                >
                  <div
                    className="flex gap-1 sm:gap-2 mb-4 sm:mb-6"
                    role="img"
                    aria-label={`${currentTestimonial.rating} out of 5 stars`}
                  >
                    {[...Array(Math.min(currentTestimonial.rating, 5))].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
                        animate={prefersReducedMotion ? undefined : { scale: 1 }}
                        transition={
                          prefersReducedMotion ? {} : { delay: 0.1 + i * 0.1, type: 'spring' }
                        }
                      >
                        <Star
                          size={14}
                          className="sm:w-4 sm:h-4 md:w-5 md:h-5"
                          fill="#fbbf24"
                          style={{ color: '#fbbf24' }}
                          aria-hidden="true"
                        />
                      </motion.div>
                    ))}
                  </div>

                  <p
                    className="text-base sm:text-xl md:text-2xl leading-relaxed mb-6 sm:mb-8 font-light px-2 sm:px-0"
                    style={{ color: THEME.textWhite }}
                  >
                    "{currentTestimonial.text}"
                  </p>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <motion.div
                      className="relative flex-shrink-0"
                      whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
                    >
                      <img
                        src={currentTestimonial.image}
                        alt={`${currentTestimonial.name}, ${currentTestimonial.role}`}
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 shadow-xl"
                        style={{ borderColor: THEME.border }}
                        loading="lazy"
                        width="64"
                        height="64"
                      />
                      <div
                        className="absolute -bottom-0.5 sm:-bottom-1 -right-0.5 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center"
                        style={{ background: currentTestimonial.gradient }}
                        aria-hidden="true"
                      >
                        <Sparkles
                          size={8}
                          className="sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-white"
                          aria-hidden="true"
                        />
                      </div>
                    </motion.div>
                    <div className="min-w-0">
                      <h4
                        className="text-base sm:text-lg md:text-xl font-bold mb-0.5 sm:mb-1 truncate"
                        style={{ color: THEME.textWhite }}
                      >
                        {currentTestimonial.name}
                      </h4>
                      <p
                        className="text-xs sm:text-sm md:text-base truncate max-w-[180px] sm:max-w-xs"
                        style={{ color: THEME.textGray }}
                      >
                        {currentTestimonial.role}
                      </p>
                      <span
                        className="inline-block mt-1 sm:mt-2 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-white truncate max-w-[150px] sm:max-w-xs"
                        style={{ background: currentTestimonial.gradient }}
                      >
                        {currentTestimonial.company}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div
                className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t"
                style={{ borderTop: `1px solid ${THEME.border}` }}
              >
                {/* Dots */}
                <nav
                  aria-label="Testimonial pagination"
                  className="flex gap-2 sm:gap-3 flex-wrap justify-center"
                >
                  {processedTestimonials.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => goToTestimonial(index)}
                      whileHover={prefersReducedMotion ? undefined : { scale: 1.2 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
                      className="h-1.5 sm:h-2 rounded-full transition-all duration-300"
                      style={{
                        background: index === activeIndex ? THEME.cyan : 'rgba(255,255,255,0.2)',
                        width: index === activeIndex ? '20px' : '8px',
                        boxShadow:
                          index === activeIndex ? `0 0 8px rgba(2, 211, 254, 0.5)` : 'none',
                      }}
                      aria-label={`Go to testimonial ${index + 1}`}
                      aria-current={index === activeIndex ? 'true' : undefined}
                    />
                  ))}
                </nav>

                {/* Arrows */}
                <div className="flex gap-2 sm:gap-3">
                  <motion.button
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.1, x: -2 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
                    onClick={prevTestimonial}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${THEME.border}`,
                      color: THEME.textGray,
                    }}
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={16} className="sm:w-5 sm:h-5" aria-hidden="true" />
                  </motion.button>
                  <motion.button
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.1, x: 2 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
                    onClick={nextTestimonial}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${THEME.border}`,
                      color: THEME.textGray,
                    }}
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={16} className="sm:w-5 sm:h-5" aria-hidden="true" />
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* 📝 ALL REVIEWS GRID */}
        <section
          className="relative py-10 sm:py-16 md:py-24"
          style={{ zIndex: 2 }}
          aria-label="All client reviews"
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
            <div className="review-section-header text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
              <span
                className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4"
                style={{
                  background: 'rgba(78, 144, 225, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid rgba(78, 144, 225, 0.2)`,
                  color: THEME.blue,
                }}
              >
                All Reviews
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2 leading-tight">
                More <GradientText>Testimonials</GradientText>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {processedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id || index}
                  testimonial={testimonial}
                  index={index}
                  onClick={goToTestimonial}
                  isActive={index === activeIndex}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 📊 STATS SECTION */}
        <section
          className="relative py-10 sm:py-16 md:py-24"
          style={{ zIndex: 2 }}
          aria-label="Client satisfaction statistics"
        >
          <div
            className="absolute bottom-0 left-0 w-64 h-64 sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full blur-[100px] sm:blur-[120px] md:blur-[150px] pointer-events-none"
            style={{ background: 'rgba(2, 211, 254, 0.05)' }}
            aria-hidden="true"
          />
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 relative">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={prefersReducedMotion ? undefined : { once: true }}
              transition={prefersReducedMotion ? {} : { duration: 0.6 }}
              className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16"
            >
              <span
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4"
                style={{
                  background: 'rgba(2, 211, 254, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid rgba(2, 211, 254, 0.2)`,
                  color: THEME.cyan,
                }}
              >
                <TrendingUp size={12} className="sm:w-3.5 sm:h-3.5" aria-hidden="true" />
                By The Numbers
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2 leading-tight">
                Client <GradientText>Satisfaction</GradientText>
              </h2>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {statsData.map((stat, index) => (
                <StatCard key={stat.label || index} stat={stat} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* 💡 CTA SECTION */}
        <section
          className="relative py-10 sm:py-16 md:py-24"
          style={{ zIndex: 2 }}
          aria-label="Call to action"
        >
          <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
            <div
              className="rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 text-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(2, 211, 254, 0.15), rgba(154, 92, 183, 0.15))',
                border: `1px solid rgba(2, 211, 254, 0.2)`,
                boxShadow: '0 0 40px rgba(2, 211, 254, 0.05)',
              }}
            >
              <motion.div
                initial={
                  prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
                }
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                viewport={prefersReducedMotion ? undefined : { once: true }}
                transition={prefersReducedMotion ? {} : { duration: 0.6 }}
                className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full mb-4 sm:mb-6 mx-auto"
                style={{ background: 'rgba(2, 211, 254, 0.15)' }}
                aria-hidden="true"
              >
                <Sparkles
                  size={24}
                  className="sm:w-7 sm:h-7 md:w-8 md:h-8"
                  style={{ color: THEME.cyan }}
                  aria-hidden="true"
                />
              </motion.div>
              <motion.h2
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={prefersReducedMotion ? undefined : { once: true }}
                transition={prefersReducedMotion ? {} : { duration: 0.6, delay: 0.1 }}
                className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-2 leading-tight"
                style={{ color: THEME.textWhite }}
              >
                Join My <span style={{ color: THEME.cyan }}>Happy Clients</span>
              </motion.h2>
              <motion.p
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={prefersReducedMotion ? undefined : { once: true }}
                transition={prefersReducedMotion ? {} : { duration: 0.6, delay: 0.2 }}
                className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0"
                style={{ color: THEME.textGray }}
              >
                Let's work together and create something amazing. Your satisfaction is my top
                priority.
              </motion.p>
              <motion.button
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : { scale: 1.05, boxShadow: '0 0 40px rgba(2, 211, 254, 0.3)' }
                }
                whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                className="px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg relative overflow-hidden group mx-auto block"
                style={{
                  background: THEME.gradientCyanBlue,
                  color: '#ffffff',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                aria-label="Start your project"
              >
                <span
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  }}
                  aria-hidden="true"
                />
                <span className="relative z-10">Start Your Project</span>
              </motion.button>
            </div>
          </div>
        </section>
      </main>
    </LazyMotion>
  );
};

export default Reviews;
