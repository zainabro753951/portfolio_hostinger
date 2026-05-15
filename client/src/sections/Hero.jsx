import { OutlineButton, PrimaryButton, THEME } from '@/components/UI';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowDown, Sparkles } from 'lucide-react';
import { memo, useCallback, useMemo, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import heroImage from '../assets/images/hero-portrait.jpg';
import LazyImage from '../components/LazyImage';

gsap.registerPlugin(useGSAP);

const DEFAULT_STATS = [
  { value: '5', label: 'Years Experience' },
  { value: '5+', label: 'Projects Completed' },
  { value: '5', label: 'Happy Clients' },
];

const Hero = memo(({ about }) => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const headingRef = useRef(null);
  const mouseTimeoutRef = useRef(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;
  const { testimonials } = useSelector((state) => state.testimonial, shallowEqual);

  const imageUrl = useMemo(() => {
    if (!about?.aboutImage?.url) return null;
    const url = about.aboutImage.url.trim();
    if (/^https?:\/\//i.test(url)) return url;
    if (backendUrl) {
      const base = backendUrl.replace(/\/+$/, '');
      const path = url.replace(/^\/+/, '');
      return `${base}/${path}`;
    }
    return url;
  }, [about?.aboutImage?.url, backendUrl]);

  const headingText = useMemo(() => {
    const firstName = about?.fullName?.split(' ')[0]?.toUpperCase() || 'DEVELOPER';
    return `HI, I'M ${firstName}`;
  }, [about?.fullName]);

  useGSAP(
    () => {
      if (!about) return;

      const chars = headingRef.current?.querySelectorAll('.char');
      if (chars?.length) {
        gsap.fromTo(
          chars,
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: 'power4.out', delay: 0.3 }
        );
      }

      gsap.fromTo(
        '.hero-subheading',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.6 }
      );
      gsap.fromTo(
        '.hero-description',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.8 }
      );

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { rotateY: 90, opacity: 0, scale: 0.8 },
          { rotateY: 0, opacity: 1, scale: 1, duration: 1.5, delay: 0.4, ease: 'power3.out' }
        );
      }
    },
    { scope: heroRef, dependencies: [about] }
  );

  const handleMouseMove = useCallback((e) => {
    if (!imageRef.current) return;
    if (mouseTimeoutRef.current) return;

    mouseTimeoutRef.current = requestAnimationFrame(() => {
      const rect = imageRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

      gsap.to(imageRef.current, {
        rotateY: x * 10,
        rotateX: -y * 10,
        duration: 0.5,
        ease: 'power2.out',
      });
      mouseTimeoutRef.current = null;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (mouseTimeoutRef.current) {
      cancelAnimationFrame(mouseTimeoutRef.current);
      mouseTimeoutRef.current = null;
    }
    if (!imageRef.current) return;
    gsap.to(imageRef.current, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' });
  }, []);

  const stats = useMemo(
    () => [
      { value: about?.experience || DEFAULT_STATS[0].value, label: DEFAULT_STATS[0].label },
      {
        value: about?.projectCounts?.publishedProjects || DEFAULT_STATS[1].value,
        label: DEFAULT_STATS[1].label,
      },
      { value: testimonials?.length || DEFAULT_STATS[2].value, label: DEFAULT_STATS[2].label },
    ],
    [about?.experience, about?.projectCounts?.publishedProjects, testimonials?.length]
  );

  const renderHeadingChars = useMemo(() => {
    return headingText.split('').map((char, index) => {
      const isHighlight = index > 6;
      return (
        <span
          key={`char-${index}`}
          className="char inline-block"
          style={{
            color: char === ' ' ? 'transparent' : isHighlight ? THEME.cyan : THEME.textWhite,
            textShadow: isHighlight ? '0 0 30px rgba(2, 211, 254, 0.5)' : 'none',
            willChange: 'transform, opacity',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  }, [headingText]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
    >
      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {[...Array(15)].map((_, i) => (
          <div
            key={`particle-${i}`}
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
      {/* 🦸 HERO CONTENT                                                    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative max-w-7xl mx-auto px-6 py-32" style={{ zIndex: 2 }}>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-15 items-center">
          {/* 📝 Text Content */}
          <div className="text-center lg:text-left z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{
                background: 'rgba(2, 211, 254, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(2, 211, 254, 0.2)',
              }}
            >
              <Sparkles size={16} style={{ color: THEME.cyan }} />
              <span className="text-sm" style={{ color: THEME.textGray }}>
                {about?.successNote || 'Available for work'}
              </span>
            </motion.div>

            {/* Heading */}
            <h1
              ref={headingRef}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 overflow-hidden"
              style={{ color: THEME.textWhite }}
            >
              {renderHeadingChars}
            </h1>

            {/* Subheading */}
            <p
              className="hero-subheading text-xl sm:text-2xl mb-4 font-light"
              style={{ color: THEME.textGray }}
            >
              {about?.shortRole || 'Full Stack Developer'}
            </p>

            {/* Description */}
            <p
              className="hero-description max-w-lg mx-auto lg:mx-0 mb-10"
              style={{ color: THEME.textGrayDark }}
            >
              {about?.shortDesc ||
                'I craft digital experiences that merge art with functionality. Specializing in modern web development and stunning UI/UX design.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <PrimaryButton
                onClick={() =>
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
                }
                icon={ArrowDown}
              >
                Explore My Work
              </PrimaryButton>
              <OutlineButton
                onClick={() =>
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Contact Me
              </OutlineButton>
            </div>

            {/* Stats */}
            <div className="flex gap-8 justify-center lg:justify-start">
              {stats.map((stat, index) => (
                <div key={`stat-${index}`} className="text-center">
                  <div
                    className="text-2xl sm:text-3xl font-bold mb-1"
                    style={{ color: THEME.cyan }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs" style={{ color: THEME.textGrayDark }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🖼️ Image Section */}
          <div
            className="relative z-10 hidden lg:block"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div ref={imageRef} className="relative" style={{ transformStyle: 'preserve-3d' }}>
              {/* Glow Effect */}
              <div
                className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl pointer-events-none"
                style={{ background: THEME.gradientPrimary }}
              />

              {/* Image Container */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                  border: `1px solid rgba(2, 211, 254, 0.1)`,
                }}
              >
                <LazyImage
                  src={imageUrl}
                  alt={`${about?.fullName || 'Developer'} Portrait`}
                  fallback={heroImage}
                  eager={true}
                  crossOrigin={true}
                  className="w-full h-auto object-cover"
                  objectFit="cover"
                  objectPosition="bottom"
                  placeholderColor={THEME.bg}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(10,10,15,0.5), transparent)' }}
                />
              </div>

              {/* Floating Card - Expert */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute -left-8 bottom-20 p-4 rounded-2xl"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${THEME.border}`,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: THEME.gradientCyanBlue }}
                  >
                    <Sparkles size={20} style={{ color: '#ffffff' }} />
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: THEME.textWhite }}>
                      Expert
                    </div>
                    <div className="text-sm" style={{ color: THEME.textGray }}>
                      UI/UX Designer
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card - Satisfaction */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.4 }}
                className="absolute -right-4 top-20 p-4 rounded-2xl text-center"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${THEME.border}`,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                }}
              >
                <div className="text-3xl font-bold mb-1" style={{ color: THEME.purple }}>
                  100%
                </div>
                <div className="text-sm" style={{ color: THEME.textGray }}>
                  Satisfaction
                </div>
              </motion.div>

              {/* Decorative Blobs */}
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
      </div>

      {/* Bottom Gradient Fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: `linear-gradient(to top, ${THEME.bg}, transparent)` }}
      />
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;
