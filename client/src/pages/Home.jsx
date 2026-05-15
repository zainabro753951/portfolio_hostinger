import { OutlineButton, PrimaryButton, THEME } from '@/components/UI';
import { getClientSatisfactionRate } from '@/Utils/Utils';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Star, Users, Zap } from 'lucide-react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Hero from '../sections/Hero';
import HeroSkeleton from '../sections/HeroSkeleton';
import PricePlanSection from '../sections/PricePlanSection';
import ServicesSection from '../sections/ServicesSection';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const useHomeData = () => {
  const { data: about, isLoading: isAboutLoading } = useSelector((state) => state.about);
  const { projectCounts, isLoading: isProjectLoading } = useSelector((state) => state.projects);

  return {
    about,
    isLoading: isAboutLoading || isProjectLoading,
    projectCounts,
  };
};

const Home = () => {
  const containerRef = useRef(null);
  const statsRef = useRef(null);
  const { testimonials } = useSelector((state) => state.testimonial);
  const satisfaction = getClientSatisfactionRate(testimonials);
  const { about, isLoading, projectCounts } = useHomeData();

  useGSAP(
    () => {
      // Stats Animation
      gsap.from(statsRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
      });
      gsap.to('.gradient-orb', {
        scale: 1.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    },
    { scope: containerRef }
  );

  const stats = [
    {
      icon: Users,
      value: projectCounts?.publishedProjects || '0',
      label: 'Projects Completed',
    },
    {
      icon: Star,
      value: testimonials?.length || '0',
      label: 'Happy Clients',
    },
    {
      icon: Award,
      value: about?.experience || '0',
      label: 'Years Experience',
    },
    {
      icon: Zap,
      value: `${satisfaction}%`,
      label: 'Satisfaction Rate',
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden"
      style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
    >
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 20 }}>
          <div
            className="gradient-orb  absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse"
            style={{ background: 'rgba(2, 211, 254, 0.12)' }}
          />
          <div
            className="gradient-orb  absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse"
            style={{ animationDelay: '1s', background: 'rgba(78, 144, 225, 0.12)' }}
          />
          <div
            className="gradient-orb  absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-[100px] animate-pulse"
            style={{ animationDelay: '2s', background: 'rgba(154, 92, 183, 0.1)' }}
          />
        </div>
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

      <div className="relative z-0">
        <section className="relative z-10">
          {isLoading ? <HeroSkeleton /> : <Hero about={{ ...about, projectCounts }} />}
        </section>

        <section className="relative z-10 py-24">
          <ServicesSection containerRef={containerRef} />
        </section>

        <section ref={statsRef} className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="stat-item text-center p-6 rounded-2xl"
                  style={{
                    background: THEME.bgCard,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${THEME.border}`,
                    transition: 'all 0.3s ease',
                  }}
                  whileHover={{
                    y: -5,
                    borderColor: 'rgba(2, 211, 254, 0.3)',
                    boxShadow: '0 0 20px rgba(2, 211, 254, 0.1)',
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4"
                    style={{ background: 'rgba(2, 211, 254, 0.15)' }}
                  >
                    <stat.icon size={24} style={{ color: THEME.cyan }} />
                  </div>
                  <div
                    className="text-3xl lg:text-4xl font-bold mb-2"
                    style={{ color: THEME.cyan }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium" style={{ color: THEME.textGrayDark }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 py-24">
          <PricePlanSection />
        </section>
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 💡 CTA SECTION                                                     */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative z-10 py-24">
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
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                style={{ background: 'rgba(2, 211, 254, 0.15)' }}
              >
                <Zap size={32} style={{ color: THEME.cyan }} />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl font-bold mb-6"
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
                Let's collaborate and bring your vision to life. I'm always excited to work on new
                and challenging projects.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Link to="/contact">
                  <PrimaryButton icon={Zap}>Get In Touch</PrimaryButton>
                </Link>
                <Link to="/projects">
                  <OutlineButton icon={Star}>View Projects</OutlineButton>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
