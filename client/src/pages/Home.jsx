import { OutlineButton, PrimaryButton, THEME } from '@/components/UI';
import { getClientSatisfactionRate } from '@/Utils/Utils';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Star, Users, Zap } from 'lucide-react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Hero from '../sections/Hero';
import HeroSkeleton from '../sections/HeroSkeleton';
import Particles from '../sections/Particles';
import PricePlanSection from '../sections/PricePlanSection';
import ServicesSection from '../sections/ServicesSection';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const useHomeData = () => {
  const { data: about, isLoading: isAboutLoading } = useSelector((state) => state.about);
  const { projectCounts, isLoading: isProjectLoading } = useSelector((state) => state.projects);

  return {
    about,
    isLoading: isAboutLoading || isProjectLoading,
    projectCounts: projectCounts || {},
  };
};

const Home = memo(() => {
  const containerRef = useRef(null);
  const statsRef = useRef(null);
  const { testimonials } = useSelector((state) => state.testimonial);
  const { about, isLoading, projectCounts } = useHomeData();

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const satisfaction = getClientSatisfactionRate(testimonials);

  const stats = useMemo(
    () => [
      { icon: Users, value: projectCounts?.publishedProjects || '0', label: 'Projects Completed' },
      { icon: Star, value: testimonials?.length || '0', label: 'Happy Clients' },
      { icon: Award, value: about?.experience || '0', label: 'Years Experience' },
      { icon: Zap, value: `${satisfaction}%`, label: 'Satisfaction Rate' },
    ],
    [projectCounts?.publishedProjects, testimonials?.length, about?.experience, satisfaction]
  );

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      gsap.fromTo(
        '.stat-item',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );

      gsap.to('.gradient-orb', {
        scale: 1.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  const structuredData = useMemo(() => {
    if (!about) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `${about.fullName || 'Developer'} - Professional Portfolio`,
      description:
        about.shortDesc ||
        'Professional portfolio showcasing web development and UI/UX design services.',
      url: typeof window !== 'undefined' ? window.location.href : '',
      mainEntity: {
        '@type': 'Person',
        name: about.fullName || 'Developer',
        jobTitle: about.shortRole || 'Full Stack Developer',
        knowsAbout: ['Web Development', 'UI/UX Design', 'Full Stack Development'],
      },
    };
  }, [about]);

  return (
    <div
      ref={containerRef}
      className="relative  overflow-x-hidden"
      style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
      role="main"
      aria-label="Portfolio Home Page"
    >
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
        <div
          className="gradient-orb absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full blur-[100px] lg:blur-[120px] opacity-80"
          style={{ background: 'rgba(2, 211, 254, 0.12)', transform: 'translate(-50%, -50%)' }}
        />
        <div
          className="gradient-orb absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full blur-[100px] lg:blur-[120px] opacity-80"
          style={{
            animationDelay: '1s',
            background: 'rgba(78, 144, 225, 0.12)',
            transform: 'translate(50%, 50%)',
          }}
        />
        <div
          className="gradient-orb absolute top-1/2 left-1/2 w-48 h-48 sm:w-64 sm:h-64 lg:w-64 lg:h-64 rounded-full blur-[80px] lg:blur-[100px] opacity-60"
          style={{
            animationDelay: '2s',
            background: 'rgba(154, 92, 183, 0.1)',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <Particles />
      </div>

      <div className="relative z-0">
        {/* Hero Section */}
        <section className="relative z-10" aria-label="Hero">
          {isLoading ? <HeroSkeleton /> : <Hero about={{ ...about, projectCounts }} />}
        </section>

        {/* Services Section */}
        <section aria-label="Services">
          <ServicesSection containerRef={containerRef} />
        </section>

        {/* Stats Section */}
        <section
          ref={statsRef}
          className="relative z-10 py-12 sm:py-16 md:py-20"
          aria-label="Professional Statistics"
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={`stat-${stat.label}-${index}`}
                  className="stat-item flex flex-col items-center justify-center p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl h-full w-full"
                  style={{
                    background: THEME.bgCard,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${THEME.border}`,
                    transition: 'all 0.3s ease',
                  }}
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : {
                          y: -5,
                          borderColor: 'rgba(2, 211, 254, 0.3)',
                          boxShadow: '0 0 20px rgba(2, 211, 254, 0.1)',
                        }
                  }
                  transition={{ type: 'spring', stiffness: 300 }}
                  role="group"
                  aria-label={`${stat.value} ${stat.label}`}
                >
                  <div
                    className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl mb-3 sm:mb-4 flex-shrink-0"
                    style={{ background: 'rgba(2, 211, 254, 0.15)' }}
                  >
                    <stat.icon
                      size={20}
                      className="sm:w-6 sm:h-6 md:w-[24px] md:h-[24px]"
                      style={{ color: THEME.cyan }}
                      aria-hidden="true"
                    />
                  </div>
                  <div
                    className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 truncate w-full px-2 text-center"
                    style={{ color: THEME.cyan }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs sm:text-sm font-medium truncate w-full px-2 text-center"
                    style={{ color: THEME.textGrayDark }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section aria-label="Pricing Plans">
          <PricePlanSection />
        </section>

        {/* CTA Section */}
        <section className="relative z-10 pb-16 sm:pb-20 md:pb-24" aria-label="Call To Action">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
            <div
              className="rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(2, 211, 254, 0.15), rgba(154, 92, 183, 0.15))',
                border: '1px solid rgba(2, 211, 254, 0.2)',
                boxShadow: '0 0 40px rgba(2, 211, 254, 0.05)',
              }}
            >
              <motion.div
                initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
                whileInView={prefersReducedMotion ? undefined : { scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full mb-4 sm:mb-6 mx-auto"
                style={{ background: 'rgba(2, 211, 254, 0.15)' }}
              >
                <Zap
                  size={24}
                  className="sm:w-7 sm:h-7 md:w-8 md:h-8"
                  style={{ color: THEME.cyan }}
                  aria-hidden="true"
                />
              </motion.div>

              <motion.h2
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight"
                style={{ color: THEME.textWhite }}
              >
                Ready to Start Your <span style={{ color: THEME.cyan }}>Project?</span>
              </motion.h2>

              <motion.p
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed"
                style={{ color: THEME.textGray }}
              >
                Let's collaborate and bring your vision to life. I'm always excited to work on new
                and challenging projects.
              </motion.p>

              <motion.div
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full"
              >
                <Link to="/contact" className="w-full sm:w-auto">
                  <PrimaryButton icon={Zap} className="w-full sm:w-auto justify-center">
                    Get In Touch
                  </PrimaryButton>
                </Link>
                <Link to="/projects" className="w-full sm:w-auto">
                  <OutlineButton icon={Star} className="w-full sm:w-auto justify-center">
                    View Projects
                  </OutlineButton>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
});

Home.displayName = 'Home';
export default Home;
