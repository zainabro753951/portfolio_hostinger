import { OutlineButton, PrimaryButton } from '@/components/UI';
import { fadeUp, staggerParent, useMotionPrefs, VIEWPORT_ONCE } from '@/lib/motion';
import { getClientSatisfactionRate } from '@/Utils/Utils';
import { ArrowRight, Award, Star, Users, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Hero from '../sections/Hero';
import HeroSkeleton from '../sections/HeroSkeleton';
import Particles from '../sections/Particles';
import PricePlanSection from '../sections/PricePlanSection';
import ServicesSection from '../sections/ServicesSection';

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
  const { testimonials } = useSelector((state) => state.testimonial);
  const { about, isLoading, projectCounts } = useHomeData();
  const { reduced, isMobile } = useMotionPrefs();

  const prefs = useMemo(() => ({ reduced, isMobile }), [reduced, isMobile]);
  const parentVariants = useMemo(() => staggerParent(0.1, 0.05), []);
  const itemVariants = useMemo(() => fadeUp(prefs, 0), [prefs]);

  // Compute satisfaction safely (avoid NaN when empty)
  const satisfaction = useMemo(() => {
    if (!testimonials?.length) return null;
    const rate = getClientSatisfactionRate(testimonials);
    return Number.isFinite(rate) ? rate : null;
  }, [testimonials]);

  // Real stats only — filter out undefined/zero values
  const stats = useMemo(() => {
    const list = [
      {
        icon: Users,
        value: projectCounts?.publishedProjects,
        suffix: '+',
        label: 'Projects Delivered',
      },
      {
        icon: Star,
        value: testimonials?.length,
        suffix: '+',
        label: 'Satisfied Clients',
      },
      {
        icon: Award,
        value: about?.experience,
        suffix: '+',
        label: 'Years Experience',
      },
      {
        icon: Zap,
        value: satisfaction,
        suffix: '%',
        label: 'Client Satisfaction',
      },
    ].filter(
      (s) =>
        s.value !== undefined &&
        s.value !== null &&
        s.value !== '' &&
        String(s.value) !== '0' &&
        String(s.value) !== 'NaN'
    );
    return list;
  }, [projectCounts?.publishedProjects, testimonials?.length, about?.experience, satisfaction]);

  const structuredData = useMemo(() => {
    if (!about) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `${about.fullName || 'Developer'} - Professional Portfolio`,
      description:
        about.shortDesc ||
        'Professional portfolio showcasing modern web engineering, full stack development, and UI/UX design.',
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
    <div className="relative isolate overflow-x-clip bg-surface-base text-ink" id="home-page">
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Subtle fixed background gradient and ambient particles */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-[120px] opacity-60"
          style={{ background: 'rgba(2, 211, 254, 0.08)' }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-[120px] opacity-60"
          style={{ background: 'rgba(154, 92, 183, 0.08)' }}
        />
        <Particles />
      </div>

      {/* 🦸 HERO SECTION */}
      <section aria-label="Hero" className="relative z-10">
        {isLoading ? <HeroSkeleton /> : <Hero about={{ ...about, projectCounts }} />}
      </section>

      {/* 🛠️ SERVICES OVERVIEW SECTION */}
      <section aria-label="Services Overview" className="relative z-10">
        <ServicesSection />
      </section>

      {/* 📊 STATS COUNTER SECTION (renders only when real data exists) */}
      {stats.length > 0 && (
        <section
          className="relative z-10 py-12 sm:py-16 lg:py-20 overflow-hidden"
          aria-label="Professional Metrics"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={parentVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={`stat-${stat.label}-${index}`}
                  variants={itemVariants}
                  whileHover={
                    reduced || isMobile
                      ? undefined
                      : { y: -4, transition: { duration: 0.2 } }
                  }
                  className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 rounded-2xl border border-line-subtle bg-surface-card/60 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-brand-cyan/30 hover:shadow-glow-cyan h-full text-center"
                  role="group"
                  aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
                >
                  <div
                    className="grid h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 place-items-center rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan mb-3 sm:mb-4 shrink-0"
                    aria-hidden="true"
                  >
                    <stat.icon size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink mb-1 sm:mb-2">
                    <span>{stat.value}</span>
                    <span className="text-brand-cyan text-xl sm:text-2xl md:text-3xl ml-0.5">
                      {stat.suffix}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-ink-secondary line-clamp-2 px-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* 💳 PRICING SECTION */}
      <section aria-label="Pricing Packages" className="relative z-10">
        <PricePlanSection />
      </section>

      {/* 🚀 CALL TO ACTION SECTION */}
      <section className="relative z-10 py-16 sm:py-20 lg:py-24" aria-label="Call To Action">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="relative overflow-hidden rounded-3xl border border-line-strong bg-gradient-to-b from-surface-card via-surface-elevated to-surface-card p-6 sm:p-10 md:p-14 lg:p-16 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Ambient top light */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px rounded-3xl bg-[radial-gradient(ellipse_at_top,rgb(var(--brand-cyan)/0.14),transparent_65%)]"
            />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan mb-5 sm:mb-6 mx-auto">
                <Zap size={22} className="sm:w-6 sm:h-6" aria-hidden="true" />
              </div>

              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink mb-4 sm:mb-5 leading-tight">
                Ready to Build Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">
                  Next Project?
                </span>
              </h2>

              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-ink-secondary mb-8 sm:mb-10 max-w-2xl mx-auto">
                Let's collaborate to bring your vision into reality. Open for select full-stack
                engineering contracts, performance overhauls, and design systems.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 w-full">
                <PrimaryButton to="/contact" icon={Zap} className="w-full sm:w-auto justify-center">
                  Get In Touch
                </PrimaryButton>
                <OutlineButton
                  to="/projects"
                  icon={ArrowRight}
                  className="w-full sm:w-auto justify-center"
                >
                  Explore Work
                </OutlineButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
});

Home.displayName = 'Home';
export default Home;
