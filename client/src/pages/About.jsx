import { GlassCard, GradientText, THEME } from '@/components/UI';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Award, Code, Coffee, Heart, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import aboutImage from '../assets/images/about-portrait.jpg';
import MarkUpTextRender from '../sections/MarkUpTextRender';
import Particles from '../sections/Particles.jsx';
import gardientPool from '../Utils/gardientPool.js';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const sortByEndDate = (exps) => {
  return [...exps].sort((a, b) => (b.currentlyWorking || 0) - (a.currentlyWorking || 0));
};

const VALUES = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Always exploring new technologies and creative solutions.',
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'Loving what I do and putting my heart into every project.',
  },
  {
    icon: Award,
    title: 'Quality',
    description: 'Delivering high-quality work that exceeds expectations.',
  },
  {
    icon: Coffee,
    title: 'Dedication',
    description: 'Committed to meeting deadlines and achieving goals.',
  },
];

const About = memo(() => {
  const containerRef = useRef(null);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const { data: about } = useSelector((state) => state.about);
  const { testimonials } = useSelector((state) => state.testimonial);
  const { projectCounts } = useSelector((state) => state.projects);
  const { skills: skillsDB } = useSelector((state) => state.skills);
  const { experiences: exp } = useSelector((state) => state.experience);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;

  const sortedByExpEndDate = useMemo(() => sortByEndDate(exp || []), [exp]);

  const skills = useMemo(() => {
    if (!skillsDB?.length) return [];
    return skillsDB.map((skill, idx) => ({
      ...skill,
      color: gardientPool[idx % gardientPool.length],
    }));
  }, [skillsDB]);

  const scrollToDetails = useCallback(() => {
    document
      .getElementById('about-details')
      ?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [prefersReducedMotion]);

  // ── GSAP ──────────────────────────────────────────────────────
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const aboutTL = gsap.timeline({
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
        },
      });
      aboutTL
        .from('.about-content', { x: -60, opacity: 0, duration: 0.8, ease: 'power3.out' })
        .from(
          '.about-image',
          { x: 60, opacity: 0, scale: 0.9, duration: 0.8, ease: 'power3.out' },
          '-=0.6'
        );

      gsap.from('.skill-item', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: skillsRef.current,
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
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  // SEO Structured Data
  const structuredData = useMemo(() => {
    if (!about) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: about.fullName || about.name || 'Developer',
      description: about.shortDesc || about.longDesc || 'About Me',
      jobTitle: about.shortRole || 'Developer',
      knowsAbout: skills.map((s) => s.skillName),
      image: about.aboutImage?.url || undefined,
      worksFor: {
        '@type': 'Organization',
        name: 'Self Employed',
      },
    };
  }, [about, skills]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen min-h-[100dvh] overflow-x-hidden"
      style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
      role="main"
      aria-label="About Me Page"
    >
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🌌 BACKGROUND LAYERS                                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
        <div
          className="gradient-orb absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full blur-[100px] md:blur-[120px] animate-pulse"
          style={{ background: 'rgba(2, 211, 254, 0.12)' }}
        />
        <div
          className="gradient-orb absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full blur-[100px] md:blur-[120px] animate-pulse"
          style={{ animationDelay: '1s', background: 'rgba(78, 144, 225, 0.12)' }}
        />
        <div
          className="gradient-orb absolute top-1/2 left-1/2 w-48 h-48 sm:w-64 sm:h-64 rounded-full blur-[80px] sm:blur-[100px] animate-pulse"
          style={{ animationDelay: '2s', background: 'rgba(154, 92, 183, 0.1)' }}
        />
      </div>

      <Particles />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🦸 HERO SECTION                                                    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center pt-20 sm:pt-24 pb-8 sm:pb-12"
        style={{ zIndex: 2 }}
        aria-label="About Page Header"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-12 sm:py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: 'easeOut' }}
            className="text-center"
          >
            <motion.span
              initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
              animate={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
              transition={prefersReducedMotion ? {} : { delay: 0.2 }}
              className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6"
              style={{
                background: 'rgba(2, 211, 254, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(2, 211, 254, 0.2)',
                color: THEME.cyan,
              }}
            >
              About Me
            </motion.span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
              Get To Know <GradientText>Me</GradientText>
            </h1>
            <p
              className="text-base sm:text-lg max-w-2xl mx-auto px-4"
              style={{ color: THEME.textGray }}
            >
              I'm a passionate developer and designer dedicated to creating exceptional digital
              experiences.
            </p>
            <motion.button
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? {} : { delay: 0.4 }}
              onClick={scrollToDetails}
              className="mt-6 sm:mt-8 inline-flex items-center gap-2 cursor-pointer py-2"
              style={{ color: THEME.textGrayDark }}
              aria-label="Scroll to details"
            >
              <span className="text-xs uppercase tracking-widest">Scroll</span>
              <ArrowDown size={16} aria-hidden="true" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📋 ABOUT CONTENT                                                   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="about-details"
        ref={aboutRef}
        className="relative py-12 sm:py-16 md:py-24"
        style={{ zIndex: 2 }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 items-center">
            {/* Text Content */}
            <article className="about-content">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight"
                style={{ color: THEME.textWhite }}
              >
                Crafting Digital <GradientText>Experiences</GradientText>
              </h2>

              <div
                className="prose prose-invert max-w-none mb-8 sm:mb-10 text-sm sm:text-base"
                style={{ color: THEME.textGray }}
              >
                <MarkUpTextRender markedDesc={about?.longDesc}>
                  <p>
                    Hello! I'm{' '}
                    <strong style={{ color: THEME.textWhite }}>
                      {about?.fullName || 'Zain Ul Abbas'}
                    </strong>
                    , a creative developer and designer with over {about?.experience || '1'} years
                    of experience in building modern web applications. I specialize in creating
                    beautiful, functional, and user-friendly digital experiences.
                  </p>
                  <p>
                    My journey in web development started with a curiosity for how things work on
                    the internet. That curiosity quickly turned into a passion, and I've been honing
                    my skills ever since.
                  </p>
                  <p>
                    I believe in the power of clean code, thoughtful design, and smooth animations
                    to create memorable user experiences. Every project I work on is an opportunity
                    to push boundaries and create something unique.
                  </p>
                </MarkUpTextRender>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {[
                  { value: projectCounts?.publishedProjects || '0', label: 'Projects' },
                  { value: testimonials?.length || '0', label: 'Clients' },
                  { value: about?.experience || '0', label: 'Years' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={prefersReducedMotion ? undefined : { y: -5 }}
                    className="text-center p-3 sm:p-4 rounded-xl w-full"
                    style={{
                      background: THEME.bgCard,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${THEME.border}`,
                    }}
                    aria-label={`${stat.value} ${stat.label}`}
                  >
                    <div
                      className="text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1 truncate"
                      style={{ color: THEME.cyan }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-[10px] sm:text-xs truncate"
                      style={{ color: THEME.textGrayDark }}
                    >
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </article>

            {/* Image */}
            <div className="about-image relative hidden lg:block">
              <div className="relative group">
                <div
                  className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-50"
                  style={{ background: THEME.gradientPrimary }}
                  aria-hidden="true"
                />
                <div
                  className="relative rounded-2xl overflow-hidden border"
                  style={{
                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                    borderColor: 'rgba(2, 211, 254, 0.1)',
                  }}
                >
                  <img
                    src={about?.poseImage ? `${backendUrl}${about?.poseImage?.url}` : aboutImage}
                    alt={`${about?.fullName || 'Developer'} Pose Portrait`}
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    width="600"
                    height="800"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(10,10,15,0.8), rgba(10,10,15,0.2), transparent)',
                    }}
                    aria-hidden="true"
                  />
                </div>

                {/* Floating Badge */}
                <motion.div
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1, scale: 1, y: 0 }
                      : { opacity: 0, scale: 0.8, y: 20 }
                  }
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
                  transition={
                    prefersReducedMotion ? {} : { delay: 0.5, type: 'spring', stiffness: 200 }
                  }
                  viewport={{ once: true }}
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                  className="absolute -bottom-6 -left-6 p-3 sm:p-4 rounded-2xl"
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${THEME.border}`,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: THEME.gradientCyanBlue }}
                    >
                      <Code
                        size={18}
                        className="sm:w-5 sm:h-5"
                        style={{ color: '#ffffff' }}
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <div
                        className="font-semibold text-sm sm:text-base"
                        style={{ color: THEME.textWhite }}
                      >
                        {about?.experience || '5+'}+ Years
                      </div>
                      <div className="text-xs sm:text-sm" style={{ color: THEME.textGray }}>
                        Experience
                      </div>
                    </div>
                  </div>
                </motion.div>

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
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 💻 SKILLS SECTION                                                  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={skillsRef}
        className="relative py-12 sm:py-16 md:py-24 overflow-hidden"
        style={{ zIndex: 2 }}
        aria-label="Skills and Technologies"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] rounded-full blur-[120px] md:blur-[150px]"
          style={{ background: 'rgba(2, 211, 254, 0.05)' }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 relative">
          <header className="text-center mb-10 sm:mb-12 md:mb-16">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span
                className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4"
                style={{
                  background: 'rgba(78, 144, 225, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(78, 144, 225, 0.2)',
                  color: THEME.blue,
                }}
              >
                My Expertise
              </span>
              <h2
                className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2 leading-tight"
                style={{ color: THEME.textWhite }}
              >
                Skills & <GradientText>Technologies</GradientText>
              </h2>
            </motion.div>
          </header>

          <GlassCard className="p-4 sm:p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {skills?.map((skill, index) => {
                const gradientClass = skill?.color || 'from-cyan-500 to-blue-500';

                // ✅ Mobile-safe viewport config
                const viewportConfig = {
                  once: true,
                  margin:
                    typeof window !== 'undefined' && window.innerWidth < 768 ? '-50px' : '-100px',
                  amount: 'some', // ✅ "some" = thoda sa dikhte hi trigger karega
                };

                return (
                  <div key={skill.id || index} className="skill-item group">
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <span
                        className="font-medium text-sm sm:text-base transition-colors duration-300 group-hover:text-cyan-400 truncate mr-2"
                        style={{ color: THEME.textWhite }}
                      >
                        {skill.skillName}
                      </span>
                      <span
                        className="font-semibold text-sm sm:text-base flex-shrink-0"
                        style={{ color: THEME.cyan }}
                      >
                        {skill.proficiency}%
                      </span>
                    </div>

                    {/* Track Background */}
                    <div className="h-2.5 sm:h-3 rounded-full overflow-hidden bg-white/5">
                      {/* ✅ Animated Progress Bar */}
                      <motion.div
                        className={`h-full rounded-full relative overflow-hidden bg-gradient-to-r ${gradientClass}`}
                        // ✅ Animation Props
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={viewportConfig} // ✅ Mobile-optimized viewport
                        transition={{
                          duration: 1.2,
                          delay: index * 0.1, // ✅ Mobile par bhi stagger kaam karega
                          ease: 'easeOut',
                          // ✅ Mobile performance ke liye
                          type: 'tween',
                        }}
                        // ✅ Fallback: Agar whileInView fail ho to direct style lag jaye
                        style={{
                          width: prefersReducedMotion ? `${skill.proficiency}%` : undefined,
                          willChange: 'width', // ✅ Mobile GPU acceleration ke liye
                        }}
                      >
                        {/* Shine Effect */}
                        <div
                          className="absolute inset-0 opacity-30"
                          style={{
                            background:
                              'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                            animation: prefersReducedMotion ? 'none' : 'shine 2s infinite',
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📅 EXPERIENCE TIMELINE                                             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative py-12 sm:py-16 md:py-24"
        style={{ zIndex: 2 }}
        aria-label="Work Experience"
      >
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
          <header className="text-center mb-10 sm:mb-12 md:mb-16">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span
                className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4"
                style={{
                  background: 'rgba(154, 92, 183, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(154, 92, 183, 0.2)',
                  color: THEME.purple,
                }}
              >
                My Journey
              </span>
              <h2
                className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2 leading-tight"
                style={{ color: THEME.textWhite }}
              >
                Work <GradientText>Experience</GradientText>
              </h2>
            </motion.div>
          </header>

          <div className="timeline relative">
            <div
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(to bottom, #4e90e1, #9a5cb7, #02d3fe)' }}
              aria-hidden="true"
            />

            {sortedByExpEndDate.map((expItem, index) => {
              const startYear = expItem?.startedAt
                ? new Date(expItem.startedAt).getFullYear()
                : 'N/A';
              const endDate = expItem?.endDate
                ? new Date(expItem.endDate).getFullYear()
                : 'Present';

              return (
                <motion.div
                  key={expItem.id || `exp-${index}`}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }
                  }
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={prefersReducedMotion ? {} : { duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true, margin: '-50px' }}
                  className="timeline-item relative flex items-start mb-8 sm:mb-12 pl-10 md:pl-0"
                >
                  {/* Dot */}
                  <div
                    className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 w-4 h-4 rounded-full border-4 shadow-lg z-10"
                    style={{
                      background: THEME.cyan,
                      borderColor: THEME.bg,
                      boxShadow: '0 0 10px rgba(2, 211, 254, 0.5)',
                    }}
                    aria-hidden="true"
                  />

                  {/* Content */}
                  <div
                    className={`w-full ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12 md:ml-auto'} md:w-1/2`}
                  >
                    <GlassCard className="p-4 sm:p-6 cursor-default w-full" hover={false}>
                      <span
                        className="inline-block px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-2 sm:mb-3"
                        style={{ background: 'rgba(2, 211, 254, 0.1)', color: THEME.cyan }}
                      >
                        {startYear} - {expItem?.currentlyWorking === 1 ? 'Present' : endDate}
                      </span>
                      <h3
                        className="text-lg sm:text-xl font-semibold mb-1 leading-tight"
                        style={{ color: THEME.textWhite }}
                      >
                        {expItem.position}
                      </h3>
                      <p
                        className="mb-2 sm:mb-3 font-medium text-sm sm:text-base"
                        style={{ color: THEME.purple }}
                      >
                        {expItem.company}
                      </p>
                      <p
                        className="text-xs sm:text-sm leading-relaxed"
                        style={{ color: THEME.textGray }}
                      >
                        {expItem.description}
                      </p>
                    </GlassCard>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 💡 VALUES SECTION                                                  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative py-12 sm:py-16 md:py-24 overflow-hidden"
        style={{ zIndex: 2 }}
        aria-label="Core Values"
      >
        <div
          className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full blur-[100px] md:blur-[120px]"
          style={{ background: 'rgba(154, 92, 183, 0.1)' }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 relative">
          <header className="text-center mb-10 sm:mb-12 md:mb-16">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span
                className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4"
                style={{
                  background: 'rgba(2, 211, 254, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(2, 211, 254, 0.2)',
                  color: THEME.cyan,
                }}
              >
                What Drives Me
              </span>
              <h2
                className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2 leading-tight"
                style={{ color: THEME.textWhite }}
              >
                My <span style={{ color: THEME.cyan }}>Values</span>
              </h2>
            </motion.div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {VALUES.map((value, index) => (
              <GlassCard key={value.title} className="p-4 sm:p-6 text-center h-full">
                <motion.div
                  whileHover={prefersReducedMotion ? undefined : { rotate: 360, scale: 1.1 }}
                  transition={prefersReducedMotion ? {} : { duration: 0.6 }}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg"
                  style={{
                    background: index % 2 === 0 ? THEME.gradientCyanBlue : THEME.gradientBluePurple,
                  }}
                >
                  <value.icon
                    size={20}
                    className="sm:w-6 sm:h-6"
                    style={{ color: '#ffffff' }}
                    aria-hidden="true"
                  />
                </motion.div>
                <h3
                  className="text-base sm:text-lg font-semibold mb-2 transition-colors duration-300 hover:text-cyan-400"
                  style={{ color: THEME.textWhite }}
                >
                  {value.title}
                </h3>
                <p className="text-xs sm:text-sm" style={{ color: THEME.textGray }}>
                  {value.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
});

export default About;
