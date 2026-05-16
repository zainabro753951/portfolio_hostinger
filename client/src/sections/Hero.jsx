import heroImage from '@/assets/images/hero-portrait.jpg';
import LazyImage from '@/components/LazyImage';
import {
  FloatingCard,
  HeroBadge,
  HeroHeading,
  HeroStats,
  OutlineButton,
  prefersReducedMotion,
  PrimaryButton,
  THEME,
} from '@/components/UI';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ArrowDown, Sparkles } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { getClientSatisfactionRate } from '../Utils/Utils';

gsap.registerPlugin(useGSAP);

export const DEFAULT_STATS = [
  { value: '5', label: 'Years Experience' },
  { value: '5+', label: 'Projects Completed' },
  { value: '5', label: 'Happy Clients' },
];

export const HeroImageSection = memo(
  ({ imageRef, imageUrl, about, satisfaction, handleMouseMove, handleMouseLeave }) => (
    <div
      className="relative z-10 hidden lg:block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-hidden="true"
    >
      <div ref={imageRef} className="relative" style={{ transformStyle: 'preserve-3d' }}>
        <div
          className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl pointer-events-none"
          style={{ background: THEME.gradientPrimary }}
          aria-hidden="true"
        />

        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            border: `1px solid rgba(2, 211, 254, 0.1)`,
          }}
        >
          <LazyImage
            src={imageUrl}
            alt={`${about?.fullName || 'Developer'} - Professional Portrait`}
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
            aria-hidden="true"
          />
        </div>

        <FloatingCard delay={1.2} position="left" label="Expert UI/UX Designer badge">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: THEME.gradientCyanBlue }}
            >
              <Sparkles size={20} style={{ color: '#ffffff' }} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div
                className="font-semibold text-sm sm:text-base"
                style={{ color: THEME.textWhite }}
              >
                Expert
              </div>
              <div className="text-xs sm:text-sm" style={{ color: THEME.textGray }}>
                UI/UX Designer
              </div>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard delay={1.4} position="right" label="Client satisfaction rate">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold mb-0.5" style={{ color: THEME.purple }}>
              {satisfaction}%
            </div>
            <div className="text-xs sm:text-sm" style={{ color: THEME.textGray }}>
              Satisfaction
            </div>
          </div>
        </FloatingCard>

        <div
          className="absolute -top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 rounded-full blur-xl animate-pulse"
          style={{ background: 'rgba(2, 211, 254, 0.2)' }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-4 -left-4 w-28 h-28 sm:w-32 sm:h-32 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: '1s', background: 'rgba(78, 144, 225, 0.2)' }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
);
HeroImageSection.displayName = 'HeroImageSection';

/* ═══════════════════════════════════════════════════════════════════ */
/* 🦸 MAIN HERO COMPONENT                                            */
/* ═══════════════════════════════════════════════════════════════════ */

const Hero = memo(({ about }) => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const headingRef = useRef(null);
  const mouseTimeoutRef = useRef(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;
  const { testimonials } = useSelector((state) => state.testimonial, shallowEqual);

  const satisfaction = getClientSatisfactionRate(testimonials);

  /* ── Memoized Values ── */
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

  /* ── Structured Data for On-Page SEO ── */
  const structuredData = useMemo(() => {
    if (!about) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: about.fullName || 'Developer',
      jobTitle: about.shortRole || 'Full Stack Developer',
      description:
        about.shortDesc ||
        'Full Stack Developer specializing in modern web development and UI/UX design.',
      image: imageUrl || undefined,
      knowsAbout: ['Web Development', 'UI/UX Design', 'Full Stack Development'],
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };
  }, [about, imageUrl]);

  const headingText = useMemo(() => {
    const firstName = about?.fullName?.split(' ')[0]?.toUpperCase() || 'DEVELOPER';
    return `HI, I'M ${firstName}`;
  }, [about?.fullName]);

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

  const firstName = useMemo(() => about?.fullName?.split(' ')[0] || 'Developer', [about?.fullName]);

  /* ── GSAP Animations ── */
  useGSAP(
    () => {
      if (!about || prefersReducedMotion()) return;

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

  /* ── Mouse Parallax ── */
  const handleMouseMove = useCallback((e) => {
    if (!imageRef.current || prefersReducedMotion()) return;
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

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      if (mouseTimeoutRef.current) {
        cancelAnimationFrame(mouseTimeoutRef.current);
      }
    };
  }, []);

  /* ── Scroll Handlers ── */
  const scrollToProjects = useCallback(() => {
    document
      .getElementById('projects')
      ?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, []);

  const scrollToContact = useCallback(() => {
    document
      .getElementById('contact')
      ?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
      aria-label="Hero section"
      role="region"
    >
      {/* Structured Data for SEO */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* ─── HERO CONTENT ─── */}
      <div
        className="relative w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-12 sm:py-16 md:py-24 lg:py-32"
        style={{ zIndex: 2 }}
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-15 items-center">
          {/* ─── Text Content ─── */}
          <div className="text-center lg:text-left z-10 order-2 lg:order-1 w-full">
            <HeroBadge successNote={about?.successNote} />

            <HeroHeading headingText={headingText} headingRef={headingRef} />

            <p
              className="hero-subheading text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 font-light"
              style={{ color: THEME.textGray }}
              aria-label={`Role: ${about?.shortRole || 'Full Stack Developer'}`}
            >
              {about?.shortRole || 'Full Stack Developer'}
            </p>

            <p
              className="hero-description max-w-lg mx-auto lg:mx-0 mb-8 sm:mb-10 text-sm sm:text-base leading-relaxed"
              style={{ color: THEME.textGrayDark }}
            >
              {about?.shortDesc ||
                'I craft digital experiences that merge art with functionality. Specializing in modern web development and stunning UI/UX design.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-8 md:mb-12 w-full sm:w-auto">
              <PrimaryButton
                onClick={scrollToProjects}
                icon={ArrowDown}
                to={'/projects'}
                aria-label="Explore my projects and portfolio work"
              >
                Explore My Work
              </PrimaryButton>
              <OutlineButton
                to={'/contact'}
                onClick={scrollToContact}
                aria-label="Get in touch and contact me"
              >
                Contact Me
              </OutlineButton>
            </div>

            {/* Stats */}
            <HeroStats stats={stats} />
          </div>

          {/* ─── Image Section ─── */}
          <div className="order-1 lg:order-2">
            <HeroImageSection
              imageRef={imageRef}
              imageUrl={imageUrl}
              about={about}
              satisfaction={satisfaction}
              handleMouseMove={handleMouseMove}
              handleMouseLeave={handleMouseLeave}
            />
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 md:h-32 pointer-events-none"
        style={{ background: `linear-gradient(to top, ${THEME.bg}, transparent)` }}
        aria-hidden="true"
      />
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;
