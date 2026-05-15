import { GlassCard, GradientText, THEME } from '@/components/UI';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Award, Code, Coffee, Heart, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';
import { memo, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import aboutImage from '../assets/images/about-portrait.jpg';
import MarkUpTextRender from '../sections/MarkUpTextRender';
import gardientPool from '../Utils/gardientPool.js';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const sortByEndDate = (exps) => {
  return [...exps].sort((a, b) => b.currentlyWorking - a.currentlyWorking);
};

const About = memo(() => {
  const containerRef = useRef(null);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);

  const { data: about } = useSelector((state) => state.about);
  const { testimonials } = useSelector((state) => state.testimonial);
  const { projectCounts } = useSelector((state) => state.projects);
  const { skills: skillsDB } = useSelector((state) => state.skills);
  const { experiences: exp } = useSelector((state) => state.experience);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;

  const sortedByExpEndDate = sortByEndDate(exp || []);

  const generateSkillsColor = (skillsArray) => {
    return skillsArray?.map((_, idx) => gardientPool[idx % gardientPool.length]);
  };

  const skillColors = generateSkillsColor(skillsDB);

  const skills =
    skillsDB?.map((skill, idx) => ({
      ...skill,
      color: skillColors[idx],
    })) || [];

  console.log(skills);

  const values = [
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

  const scrollToDetails = useCallback(() => {
    document.getElementById('about-details')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // ── GSAP ──────────────────────────────────────────────────────
  useGSAP(
    () => {
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
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden"
      style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
    >
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🌌 BACKGROUND LAYERS                                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="gradient-orb absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse"
          style={{ background: 'rgba(2, 211, 254, 0.12)' }}
        />
        <div
          className="gradient-orb absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: '1s', background: 'rgba(78, 144, 225, 0.12)' }}
        />
        <div
          className="gradient-orb absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: '2s', background: 'rgba(154, 92, 183, 0.1)' }}
        />
      </div>

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

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🦸 HERO SECTION                                                    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[70vh] flex items-center justify-center pt-24 pb-12"
        style={{ zIndex: 2 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center"
          >
            <motion.span
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{
                background: 'rgba(2, 211, 254, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(2, 211, 254, 0.2)',
                color: THEME.cyan,
              }}
            >
              About Me
            </motion.span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Get To Know <GradientText>Me</GradientText>
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: THEME.textGray }}>
              I'm a passionate developer and designer dedicated to creating exceptional digital
              experiences.
            </p>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={scrollToDetails}
              className="mt-8 inline-flex items-center gap-2 cursor-pointer"
              style={{ color: THEME.textGrayDark }}
            >
              <span className="text-xs uppercase tracking-widest">Scroll</span>
              <ArrowDown size={16} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📋 ABOUT CONTENT                                                   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="about-details" ref={aboutRef} className="relative py-24" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="about-content">
              <h2
                className="text-3xl sm:text-4xl font-bold mb-6"
                style={{ color: THEME.textWhite }}
              >
                Crafting Digital <GradientText>Experiences</GradientText>
              </h2>

              <div
                className="prose prose-invert max-w-none mb-10"
                style={{ color: THEME.textGray }}
              >
                <MarkUpTextRender markedDesc={about?.longDesc}>
                  <p>
                    Hello! I'm <strong style={{ color: THEME.textWhite }}>Zain Ul Abbas</strong>, a
                    creative developer and designer with over 1 year of experience in building
                    modern web applications. I specialize in creating beautiful, functional, and
                    user-friendly digital experiences.
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
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: projectCounts?.publishedProjects || '0', label: 'Projects' },
                  { value: testimonials?.length || '0', label: 'Clients' },
                  { value: about?.experience || '0', label: 'Years' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="text-center p-4 rounded-xl"
                    style={{
                      background: THEME.bgCard,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${THEME.border}`,
                    }}
                  >
                    <div className="text-2xl font-bold mb-1" style={{ color: THEME.cyan }}>
                      {stat.value}
                    </div>
                    <div className="text-xs" style={{ color: THEME.textGrayDark }}>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="about-image relative hidden lg:block">
              <div className="relative group">
                <div
                  className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-50"
                  style={{ background: THEME.gradientPrimary }}
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
                    alt={about?.poseImage?.key || 'About Portrait'}
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(10,10,15,0.8), rgba(10,10,15,0.2), transparent)',
                    }}
                  />
                </div>

                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute -bottom-6 -left-6 p-4 rounded-2xl"
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
                      <Code size={20} style={{ color: '#ffffff' }} />
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: THEME.textWhite }}>
                        5+ Years
                      </div>
                      <div className="text-sm" style={{ color: THEME.textGray }}>
                        Experience
                      </div>
                    </div>
                  </div>
                </motion.div>

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
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 💻 SKILLS SECTION                                                  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section ref={skillsRef} className="relative py-24 overflow-hidden" style={{ zIndex: 2 }}>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{ background: 'rgba(2, 211, 254, 0.05)' }}
        />

        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{
                background: 'rgba(78, 144, 225, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(78, 144, 225, 0.2)',
                color: THEME.blue,
              }}
            >
              My Expertise
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6" style={{ color: THEME.textWhite }}>
              Skills & <GradientText>Technologies</GradientText>
            </h2>
          </motion.div>

          <GlassCard className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {skills?.map((skill, index) => (
                <div key={index} className="skill-item group">
                  <div className="flex justify-between items-center mb-3">
                    <span
                      className="font-medium transition-colors duration-300 group-hover:text-cyan-400"
                      style={{ color: THEME.textWhite }}
                    >
                      {skill.skillName}
                    </span>
                    <span className="font-semibold" style={{ color: THEME.cyan }}>
                      {skill.proficiency}%
                    </span>
                  </div>
                  <div
                    className="h-3 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
                      viewport={{ once: true }}
                      className={`h-full rounded-full relative `}
                      style={{ background: 'rgba(255,255,255,0.2)' }}
                    >
                      <div
                        className={`absolute inset-0 rounded-full animate-pulse bg-gradient-to-l ${skill.color}`}
                      />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📅 EXPERIENCE TIMELINE                                             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24" style={{ zIndex: 2 }}>
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{
                background: 'rgba(154, 92, 183, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(154, 92, 183, 0.2)',
                color: THEME.purple,
              }}
            >
              My Journey
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6" style={{ color: THEME.textWhite }}>
              Work <GradientText>Experience</GradientText>
            </h2>
          </motion.div>

          <div className="timeline relative">
            <div
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(to bottom, #4e90e1, #9a5cb7, #02d3fe)' }}
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
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`timeline-item relative flex items-start gap-8 mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div
                    className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 shadow-lg"
                    style={{
                      background: THEME.cyan,
                      borderColor: THEME.bg,
                      boxShadow: '0 0 10px rgba(2, 211, 254, 0.5)',
                    }}
                  />

                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}
                  >
                    <GlassCard className="p-6 cursor-default" hover={false}>
                      <span
                        className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-3"
                        style={{ background: 'rgba(2, 211, 254, 0.1)', color: THEME.cyan }}
                      >
                        {startYear} - {expItem?.currentlyWorking === 1 ? 'Present' : endDate}
                      </span>
                      <h3 className="text-xl font-semibold mb-1" style={{ color: THEME.textWhite }}>
                        {expItem.position}
                      </h3>
                      <p className="mb-3 font-medium" style={{ color: THEME.purple }}>
                        {expItem.company}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: THEME.textGray }}>
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
      <section className="relative py-24 overflow-hidden" style={{ zIndex: 2 }}>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[120px]"
          style={{ background: 'rgba(154, 92, 183, 0.1)' }}
        />

        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{
                background: 'rgba(2, 211, 254, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(2, 211, 254, 0.2)',
                color: THEME.cyan,
              }}
            >
              What Drives Me
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6" style={{ color: THEME.textWhite }}>
              My <span style={{ color: THEME.cyan }}>Values</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <GlassCard key={index} className="p-6 text-center">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                  style={{
                    background: index % 2 === 0 ? THEME.gradientCyanBlue : THEME.gradientBluePurple,
                  }}
                >
                  <value.icon size={24} style={{ color: '#ffffff' }} />
                </motion.div>
                <h3
                  className="text-lg font-semibold mb-2 transition-colors duration-300 hover:text-cyan-400"
                  style={{ color: THEME.textWhite }}
                >
                  {value.title}
                </h3>
                <p className="text-sm" style={{ color: THEME.textGray }}>
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
