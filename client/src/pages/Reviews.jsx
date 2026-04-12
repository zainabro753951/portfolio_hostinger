import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "motion/react";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  MessageCircle,
  Award,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import review1 from "../assets/images/review-1.jpg";
import review2 from "../assets/images/review-2.jpg";
import review3 from "../assets/images/review-3.jpg";

gsap.registerPlugin(ScrollTrigger);

// ✅ Optimized: Static data moved outside component
const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CEO, TechStart Inc.",
    image: review1,
    rating: 5,
    text: "Working with Alex was an absolute pleasure. The attention to detail and creativity brought to our project exceeded all expectations. Our website traffic increased by 150% after the redesign!",
    project: "Website Redesign",
    color: "from-blue-500 to-cyan-400",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Manager, InnovateCo",
    image: review2,
    rating: 5,
    text: "Alex has an incredible ability to understand client needs and translate them into beautiful, functional designs. The animations and interactions added a whole new level of polish to our product.",
    project: "SaaS Dashboard",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Director, Brandify",
    image: review3,
    rating: 5,
    text: "The brand identity Alex created for us perfectly captures our company vision. Professional, creative, and always delivered on time. Highly recommend for any design project!",
    project: "Brand Identity",
    color: "from-orange-400 to-pink-500",
  },
];

const STATS_DATA = [
  { value: "50+", label: "Projects Completed", icon: ThumbsUp, color: "from-blue-500 to-cyan-400" },
  { value: "30+", label: "Happy Clients", icon: MessageCircle, color: "from-purple-500 to-pink-500" },
  { value: "5.0", label: "Average Rating", icon: Star, color: "from-yellow-400 to-orange-500" },
  { value: "100%", label: "Satisfaction Rate", icon: Award, color: "from-green-400 to-emerald-500" },
];

// ✅ Optimized: Separate component for testimonial card
const TestimonialCard = ({ testimonial, index, onClick, isActive }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => onClick(index)}
      className={`cursor-pointer group ${isActive ? 'ring-2 ring-cyan-400' : ''}`}
    >
      <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 h-full overflow-hidden">
        {/* Glow Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        
        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
              viewport={{ once: true }}
            >
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
          "{testimonial.text}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/20 group-hover:border-cyan-400/50 transition-colors"
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r ${testimonial.color} flex items-center justify-center`}>
              <Sparkles size={10} className="text-white" />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm group-hover:text-cyan-400 transition-colors">
              {testimonial.name}
            </h4>
            <p className="text-gray-500 text-xs">{testimonial.role}</p>
          </div>
        </div>

        {/* Project Tag */}
        <span className={`inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${testimonial.color} text-white`}>
          {testimonial.project}
        </span>
      </div>
    </motion.div>
  );
};

// ✅ Optimized: Stats counter component with animation
const StatCard = ({ stat, index }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate counter
          const target = parseInt(stat.value) || 5;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);

          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => observer.disconnect();
  }, [stat.value]);

  const displayValue = stat.value.includes('%') ? `${count}%` : 
                       stat.value.includes('.') ? `${count}.0` : `${count}+`;

  return (
    <motion.div
      ref={nodeRef}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group"
    >
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 text-center border border-white/10 hover:border-cyan-400/30 transition-all duration-300 overflow-hidden">
        {/* Background Glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        
        <motion.div 
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className={`w-14 h-14 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}
        >
          <stat.icon size={28} className="text-white" />
        </motion.div>
        
        <div className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          {displayValue}
        </div>
        <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
      </div>
    </motion.div>
  );
};

const Reviews = () => {
  const containerRef = useRef(null);
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  // ✅ Optimized: Memoized current testimonial
  const currentTestimonial = useMemo(() => 
    TESTIMONIALS_DATA[activeIndex], 
    [activeIndex]
  );

  // ✅ Optimized: GSAP animation with proper cleanup
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".review-section-header", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".review-section-header",
          start: "top 85%",
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ✅ Optimized: Auto-rotate with pause on hover
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // ✅ Optimized: Navigation handlers
  const nextTestimonial = useCallback(() => {
    setDirection(1);
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setDirection(-1);
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  }, []);

  const goToTestimonial = useCallback((index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setIsAutoPlaying(false);
    setActiveIndex(index);
  }, [activeIndex]);

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <LazyMotion features={domAnimation}>
      <div ref={containerRef} className="bg-gray-900 min-h-screen pt-24">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10" />
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <motion.span
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-cyan-400 text-sm font-medium mb-6 border border-white/10"
              >
                <Sparkles size={14} className="inline mr-2" />
                Testimonials
              </motion.span>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white">
                Client{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Reviews
                </span>
              </h1>
              
              <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                Don't just take my word for it. Here's what my clients have to say
                about working together.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Testimonial Carousel */}
        <section 
          ref={carouselRef}
          className="py-24 relative overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[150px]" />

          <div className="max-w-5xl mx-auto px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-purple-400 text-sm font-medium mb-4 border border-white/10">
                Featured Review
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
                What Clients <span className="text-purple-400">Say</span>
              </h2>
            </motion.div>

            {/* Carousel */}
            <div className="relative">
              {/* Main Testimonial Card */}
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${currentTestimonial.color} opacity-5`} />
                
                {/* Quote Icon */}
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="absolute -top-6 left-8 w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg"
                >
                  <Quote size={28} className="text-white" />
                </motion.div>

                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="relative"
                  >
                    {/* Rating */}
                    <div className="flex gap-2 mb-6">
                      {[...Array(currentTestimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 + i * 0.1, type: "spring" }}
                        >
                          <Star size={24} className="text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-xl md:text-2xl text-white leading-relaxed mb-8 font-light">
                      "{currentTestimonial.text}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="relative"
                        whileHover={{ scale: 1.1 }}
                      >
                        <img
                          src={currentTestimonial.image}
                          alt={currentTestimonial.name}
                          className={`w-20 h-20 rounded-full object-cover border-4 border-white/10 shadow-xl`}
                        />
                        <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r ${currentTestimonial.color} flex items-center justify-center`}>
                          <Sparkles size={16} className="text-white" />
                        </div>
                      </motion.div>
                      <div>
                        <h4 className="text-2xl font-bold text-white mb-1">
                          {currentTestimonial.name}
                        </h4>
                        <p className="text-gray-400 text-lg">{currentTestimonial.role}</p>
                        <motion.span 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className={`inline-block mt-2 px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r ${currentTestimonial.color} text-white`}
                        >
                          {currentTestimonial.project}
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/10">
                  {/* Dots */}
                  <div className="flex gap-3">
                    {TESTIMONIALS_DATA.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => goToTestimonial(index)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`h-3 rounded-full transition-all duration-300 ${
                          index === activeIndex
                            ? "bg-cyan-400 w-10 shadow-lg shadow-cyan-400/50"
                            : "bg-white/20 w-3 hover:bg-white/40"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Arrows */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1, x: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prevTestimonial}
                      className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:text-cyan-400 hover:bg-white/20 transition-all border border-white/10"
                    >
                      <ChevronLeft size={24} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, x: 2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextTestimonial}
                      className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:text-cyan-400 hover:bg-white/20 transition-all border border-white/10"
                    >
                      <ChevronRight size={24} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Reviews Grid */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="review-section-header text-center mb-16">
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-blue-400 text-sm font-medium mb-4 border border-white/10">
                All Reviews
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
                More <span className="text-blue-400">Testimonials</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TESTIMONIALS_DATA.map((testimonial, index) => (
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

        {/* Stats Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]" />

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-cyan-400 text-sm font-medium mb-4 border border-white/10">
                <TrendingUp size={14} className="inline mr-2" />
                By The Numbers
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
                Client <span className="text-cyan-400">Satisfaction</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {STATS_DATA.map((stat, index) => (
                <StatCard key={index} stat={stat} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20" />
          <div className="absolute inset-0 backdrop-blur-3xl" />

          <div className="max-w-4xl mx-auto px-6 lg:px-8 relative text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Join My{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Happy Clients
                </span>
              </h2>
              <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                Let's work together and create something amazing. Your
                satisfaction is my top priority.
              </p>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(34, 211, 238, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-full bg-white text-gray-900 font-bold text-lg relative overflow-hidden group"
              >
                <span className="relative z-10 ">Start Your Project</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
};

export default Reviews;