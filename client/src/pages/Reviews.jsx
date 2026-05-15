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
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      onClick={() => onClick(index)}
      className={`cursor-pointer group relative overflow-hidden ${isActive ? 'ring-1' : ''}`}
      style={{
        borderColor: isActive ? THEME.cyan : THEME.border,
        transition: 'border 0.3s ease',
      }}
    >
      <GlassCard className="h-full p-6" hover={false}>
        {/* Background Glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"
          style={{ background: testimonial.gradient }}
        />

        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
              viewport={{ once: true }}
            >
              <Star size={14} fill="#fbbf24" className="text-yellow-400" />
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <p className="text-sm leading-relaxed mb-6 line-clamp-3" style={{ color: THEME.textGray }}>
          "{testimonial.text}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-10 h-10 rounded-full object-cover border-2"
              style={{ borderColor: THEME.border }}
            />
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: testimonial.gradient }}
            >
              <Sparkles size={8} className="text-white" />
            </div>
          </div>
          <div>
            <h4
              className="font-semibold text-sm transition-colors duration-300 group-hover:text-cyan-400"
              style={{ color: THEME.textWhite }}
            >
              {testimonial.name}
            </h4>
            <p className="text-xs" style={{ color: THEME.textGrayDark }}>
              {testimonial.role}
            </p>
          </div>
        </div>

        {/* Company Tag */}
        <span
          className="inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium text-white"
          style={{ background: testimonial.gradient }}
        >
          {testimonial.company}
        </span>
      </GlassCard>
    </motion.div>
  );
};

const Reviews = () => {
  const containerRef = useRef(null);
  const carouselRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;

  const { testimonials = [] } = useSelector((state) => state.testimonial);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔄 DATA PROCESSING (Dynamic Logic)
  // ═══════════════════════════════════════════════════════════════════════════

  console.log(testimonials[0]?.name);

  // 1. Transform Testimonials
  const processedTestimonials = useMemo(() => {
    if (!testimonials?.length) return [];
    return testimonials.map((t, i) => {
      const imgData = safeParse(t.clientImage);
      const imageUrl = imgData?.url ? `${backendUrl}${imgData.url}` : '/default-avatar.jpg';

      return {
        id: t.id,
        name: t.clientName,
        role: t.designationRole,
        company: t.company,
        image: imageUrl,
        rating: t.ratting || 5,
        text: t.message,
        gradient: TESTIMONIAL_GRADIENTS[i % TESTIMONIAL_GRADIENTS.length],
      };
    });
  }, [testimonials, backendUrl]);

  // 2. Calculate Dynamic Stats
  const statsData = useMemo(() => {
    if (!processedTestimonials.length) return [];

    const totalProjects = new Set(processedTestimonials.map((t) => t.id)).size; // Or unique projectId if needed
    const uniqueClients = processedTestimonials.length; // Or unique companies
    const totalRating = processedTestimonials.reduce((sum, t) => sum + t.rating, 0);
    const avgRating = (totalRating / processedTestimonials.length).toFixed(1);
    const satisfaction = getClientSatisfactionRate(processedTestimonials);

    return [
      {
        value: `${totalProjects}`,
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
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || processedTestimonials.length <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % processedTestimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, processedTestimonials.length]);

  // Reset activeIndex if it goes out of bounds when data changes
  useEffect(() => {
    if (activeIndex >= processedTestimonials.length) {
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

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 100 : -100, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir < 0 ? 100 : -100, opacity: 0, scale: 0.95 }),
  };

  if (processedTestimonials.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: THEME.bg }}
      >
        <p style={{ color: THEME.textGray }}>No testimonials available.</p>
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <div
        ref={containerRef}
        className="relative min-h-screen"
        style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
      >
        {/* 🌌 BACKGROUND LAYERS */}
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

        {/* ✨ Particles */}
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

        {/* 🦸 HERO SECTION */}
        <section className="relative pt-24 pb-12" style={{ zIndex: 2 }}>
          <div className="max-w-7xl mx-auto px-6 py-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <span
                className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
                style={{
                  background: 'rgba(2, 211, 254, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid rgba(2, 211, 254, 0.2)`,
                  color: THEME.cyan,
                }}
              >
                <Sparkles size={14} className="inline mr-2 mb-0.5" /> Testimonials
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
                Client <GradientText>Reviews</GradientText>
              </h1>
              <p
                className="text-lg max-w-2xl mx-auto leading-relaxed"
                style={{ color: THEME.textGray }}
              >
                Don't just take my word for it. Here's what my clients have to say about working
                together.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 📋 FEATURED TESTIMONIAL CAROUSEL */}
        <section
          ref={carouselRef}
          className="relative py-24"
          style={{ zIndex: 2 }}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px]"
            style={{ background: 'rgba(154, 92, 183, 0.05)' }}
          />

          <div className="max-w-5xl mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span
                className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
                style={{
                  background: 'rgba(154, 92, 183, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid rgba(154, 92, 183, 0.2)`,
                  color: THEME.purple,
                }}
              >
                Featured Review
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                What Clients <span style={{ color: THEME.purple }}>Say</span>
              </h2>
            </motion.div>

            <GlassCard className="p-8 md:p-12 shadow-2xl overflow-hidden relative" hover={false}>
              <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ background: currentTestimonial.gradient }}
              />
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="absolute -top-5 left-8 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg z-10"
                style={{ background: 'linear-gradient(135deg, #4e90e1, #9a5cb7)' }}
              >
                <Quote size={24} className="text-white" />
              </motion.div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="relative mt-2"
                >
                  <div className="flex gap-2 mb-6">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.1, type: 'spring' }}
                      >
                        <Star size={20} fill="#fbbf24" className="text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>

                  <p
                    className="text-xl md:text-2xl leading-relaxed mb-8 font-light"
                    style={{ color: THEME.textWhite }}
                  >
                    "{currentTestimonial.text}"
                  </p>

                  <div className="flex items-center gap-4">
                    <motion.div className="relative" whileHover={{ scale: 1.1 }}>
                      <img
                        src={currentTestimonial.image}
                        alt={currentTestimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-2 shadow-xl"
                        style={{ borderColor: THEME.border }}
                      />
                      <div
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: currentTestimonial.gradient }}
                      >
                        <Sparkles size={12} className="text-white" />
                      </div>
                    </motion.div>
                    <div>
                      <h4 className="text-xl font-bold mb-1" style={{ color: THEME.textWhite }}>
                        {currentTestimonial.name}
                      </h4>
                      <p className="text-lg" style={{ color: THEME.textGray }}>
                        {currentTestimonial.role}
                      </p>
                      <span
                        className="inline-block mt-2 px-4 py-1.5 rounded-full text-xs font-medium text-white"
                        style={{ background: currentTestimonial.gradient }}
                      >
                        {currentTestimonial.company}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div
                className="flex items-center justify-between mt-8 pt-6"
                style={{ borderTop: `1px solid ${THEME.border}` }}
              >
                <div className="flex gap-3">
                  {processedTestimonials.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => goToTestimonial(index)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        background: index === activeIndex ? THEME.cyan : 'rgba(255,255,255,0.2)',
                        width: index === activeIndex ? '24px' : '12px',
                        boxShadow:
                          index === activeIndex ? `0 0 10px rgba(2, 211, 254, 0.5)` : 'none',
                      }}
                    />
                  ))}
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1, x: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevTestimonial}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${THEME.border}`,
                      color: THEME.textGray,
                    }}
                  >
                    <ChevronLeft size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, x: 2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextTestimonial}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${THEME.border}`,
                      color: THEME.textGray,
                    }}
                  >
                    <ChevronRight size={20} />
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* 📝 ALL REVIEWS GRID */}
        <section className="relative py-24" style={{ zIndex: 2 }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="review-section-header text-center mb-16">
              <span
                className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
                style={{
                  background: 'rgba(78, 144, 225, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid rgba(78, 144, 225, 0.2)`,
                  color: THEME.blue,
                }}
              >
                All Reviews
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                More <GradientText>Testimonials</GradientText>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
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
        <section className="relative py-24" style={{ zIndex: 2 }}>
          <div
            className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[150px]"
            style={{ background: 'rgba(2, 211, 254, 0.05)' }}
          />
          <div className="max-w-7xl mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span
                className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
                style={{
                  background: 'rgba(2, 211, 254, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid rgba(2, 211, 254, 0.2)`,
                  color: THEME.cyan,
                }}
              >
                <TrendingUp size={14} className="inline mr-2 mb-0.5" />
                By The Numbers
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Client <GradientText>Satisfaction</GradientText>
              </h2>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {statsData.map((stat, index) => (
                <StatCard key={index} stat={stat} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* 💡 CTA SECTION */}
        <section className="relative py-24" style={{ zIndex: 2 }}>
          <div className="max-w-4xl mx-auto px-6">
            <div
              className="rounded-2xl p-8 md:p-12 text-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(2, 211, 254, 0.15), rgba(154, 92, 183, 0.15))',
                border: `1px solid rgba(2, 211, 254, 0.2)`,
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
                Join My <span style={{ color: THEME.cyan }}>Happy Clients</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
                style={{ color: THEME.textGray }}
              >
                Let's work together and create something amazing. Your satisfaction is my top
                priority.
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(2, 211, 254, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-lg font-bold text-lg relative overflow-hidden group"
                style={{
                  background: THEME.gradientCyanBlue,
                  color: '#ffffff',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <span
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  }}
                />
                <span className="relative z-10">Start Your Project</span>
              </motion.button>
            </div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
};

export default Reviews;
