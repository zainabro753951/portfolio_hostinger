import aboutImage from '@/assets/images/about-portrait.jpg';
import LazyImage from '@/components/LazyImage';
import { fadeUp, staggerParent, useMotionPrefs, VIEWPORT_ONCE } from '@/lib/motion';
import { ArrowDown, Award, Briefcase, Code, Coffee, Heart, Lightbulb, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { memo, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import MarkUpTextRender from '../sections/MarkUpTextRender';

const sortByEndDate = (exps) => {
  if (!Array.isArray(exps)) return [];
  return [...exps].sort((a, b) => (b.currentlyWorking || 0) - (a.currentlyWorking || 0));
};

const getYear = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  return isNaN(year) ? dateStr : year;
};

const VALUES = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Always exploring modern technologies, clean architectures, and creative solutions.',
  },
  {
    icon: Heart,
    title: 'Craftsmanship',
    description: 'Deep attention to detail, micro-interactions, and refined user experience design.',
  },
  {
    icon: Award,
    title: 'Quality First',
    description: 'Production-ready code built for performance, accessibility, and high scalability.',
  },
  {
    icon: Coffee,
    title: 'Dedication',
    description: 'Reliable execution with clear communication, transparency, and timely delivery.',
  },
];

const BRAND_SKILL_GRADIENTS = [
  'from-brand-cyan to-brand-blue',
  'from-brand-blue to-brand-purple',
  'from-brand-cyan via-brand-blue to-brand-purple',
  'from-brand-purple to-brand-cyan',
];

const About = memo(() => {
  const { data: about } = useSelector((state) => state.about);
  const { testimonials } = useSelector((state) => state.testimonial);
  const { projectCounts } = useSelector((state) => state.projects);
  const { skills: skillsDB } = useSelector((state) => state.skills);
  const { experiences: exp } = useSelector((state) => state.experience);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;

  const { reduced, isMobile } = useMotionPrefs();
  const prefs = useMemo(() => ({ reduced, isMobile }), [reduced, isMobile]);

  const parentVariants = useMemo(() => staggerParent(0.1, 0.05), []);
  const itemVariants = useMemo(() => fadeUp(prefs, 0), [prefs]);

  const sortedByExpEndDate = useMemo(() => sortByEndDate(exp || []), [exp]);

  const skills = useMemo(() => {
    if (!skillsDB?.length) return [];
    return skillsDB.map((skill, idx) => ({
      ...skill,
      gradientClass: BRAND_SKILL_GRADIENTS[idx % BRAND_SKILL_GRADIENTS.length],
    }));
  }, [skillsDB]);

  const imageUrl = useMemo(() => {
    if (!about?.poseImage?.url) return null;
    const url = about.poseImage.url.trim();
    if (/^https?:\/\//i.test(url)) return url;
    if (backendUrl) {
      return `${backendUrl.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`;
    }
    return url;
  }, [about?.poseImage?.url, backendUrl]);

  const scrollToDetails = useCallback(() => {
    document
      .getElementById('about-details')
      ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }, [reduced]);

  // SEO Structured Data
  const structuredData = useMemo(() => {
    if (!about) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: about.fullName || about.name || 'Developer',
      description: about.shortDesc || about.longDesc || 'About Me',
      jobTitle: about.shortRole || 'Full Stack Developer',
      knowsAbout: skills.map((s) => s.skillName),
      image: imageUrl || undefined,
      worksFor: {
        '@type': 'Organization',
        name: 'Self Employed',
      },
    };
  }, [about, skills, imageUrl]);

  return (
    <div className="relative isolate overflow-x-clip bg-surface-base text-ink" id="about-page">
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Subtle ambient lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-[120px] opacity-60"
          style={{ background: 'rgba(2, 211, 254, 0.08)' }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-[120px] opacity-60"
          style={{ background: 'rgba(154, 92, 183, 0.08)' }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🦸 HERO SECTION                                                    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-20 text-center"
        aria-label="About Page Header"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="mb-4 inline-block"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-cyan border border-brand-cyan/20 bg-brand-cyan/10">
              <Sparkles size={12} className="text-brand-cyan" aria-hidden="true" />
              About Me
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink mb-4 sm:mb-6 leading-tight"
          >
            Get To Know{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">
              My Story
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-sm sm:text-base md:text-lg leading-relaxed text-ink-secondary max-w-2xl mx-auto mb-8 sm:mb-10"
          >
            {about?.shortDesc ||
              'A passionate software engineer and digital designer dedicated to creating scalable applications and exceptional user experiences.'}
          </motion.p>

          <motion.button
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            onClick={scrollToDetails}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink-muted hover:text-brand-cyan transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded-lg p-2"
            aria-label="Scroll to detailed biography"
          >
            <span>Scroll Down</span>
            <ArrowDown size={14} className="animate-bounce motion-reduce:animate-none" aria-hidden="true" />
          </motion.button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📋 EDITORIAL BIOGRAPHY & PORTRAIT                                  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="about-details"
        className="relative py-12 sm:py-16 lg:py-24"
        aria-label="Biography and Background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-16 items-center">
            {/* Column 1: Editorial Content */}
            <article className="order-2 lg:order-1">
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-blue border border-brand-blue/20 bg-brand-blue/10">
                  Engineering &amp; Design
                </span>
              </div>

              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-6 leading-tight">
                Crafting High-Performance{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">
                  Digital Products
                </span>
              </h2>

              <div className="text-sm sm:text-base leading-relaxed text-ink-secondary mb-8 sm:mb-10">
                <MarkUpTextRender markedDesc={about?.longDesc}>
                  <p className="mb-4">
                    Hello! I'm <strong className="text-ink font-semibold">{about?.fullName || 'Zain Ul Abbas'}</strong>
                    , a full-stack engineer and UI/UX specialist with over{' '}
                    <span className="text-brand-cyan font-medium">{about?.experience || '2'}+ years</span> of experience
                    architecting modern web applications, scalable APIs, and pixel-perfect design systems.
                  </p>
                  <p className="mb-4">
                    My approach balances clean, maintainable code with thoughtful user empathy. I believe
                    in engineering solutions that are as robust under the hood as they are delightful on screen.
                  </p>
                  <p>
                    Every collaboration is an opportunity to solve intricate engineering challenges, streamline
                    workflows, and build lasting technological value.
                  </p>
                </MarkUpTextRender>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-line-subtle">
                {[
                  {
                    value: projectCounts?.publishedProjects ? `${projectCounts.publishedProjects}+` : '10+',
                    label: 'Projects',
                  },
                  {
                    value: testimonials?.length ? `${testimonials.length}+` : '100%',
                    label: testimonials?.length ? 'Clients' : 'Satisfaction',
                  },
                  {
                    value: about?.experience ? `${about.experience}+` : '2+',
                    label: 'Years Exp',
                  },
                ].map((stat, index) => (
                  <div
                    key={`about-stat-${index}`}
                    className="p-3 sm:p-4 rounded-xl border border-line-subtle bg-surface-card/60 text-center"
                  >
                    <div className="text-xl sm:text-2xl font-extrabold text-brand-cyan mb-0.5">
                      {stat.value}
                    </div>
                    <div className="text-xs text-ink-muted font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </article>

            {/* Column 2: Portrait */}
            <div className="order-1 lg:order-2">
              <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
                {/* Glow behind frame */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 sm:-inset-6 rounded-3xl bg-[radial-gradient(closest-side,rgb(var(--brand-cyan)/0.15),rgb(var(--brand-purple)/0.10)_60%,transparent)]"
                />

                {/* Frame with LazyImage */}
                <div className="relative overflow-hidden rounded-2xl border border-line-strong bg-surface-card shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]">
                  <LazyImage
                    src={imageUrl}
                    alt={`${about?.fullName || 'Developer'} Portrait`}
                    fallback={aboutImage}
                    className="aspect-[4/5] w-full object-cover"
                    objectFit="cover"
                    objectPosition="center"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-base/60 via-transparent to-transparent"
                  />
                </div>

                {/* Floating Experience Pill (Desktop & Tablet) */}
                <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 p-3 sm:p-4 rounded-2xl border border-line-strong bg-surface-card/90 backdrop-blur-md shadow-lg hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan">
                      <Code size={20} aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-bold text-ink">
                        {about?.experience || '2'}+ Years
                      </div>
                      <div className="text-xs text-ink-secondary">Professional Experience</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 💻 SKILLS & TECHNOLOGIES SECTION                                   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {skills.length > 0 && (
        <section
          className="relative py-16 sm:py-20 lg:py-24 overflow-hidden isolate"
          aria-label="Skills and Technical Proficiencies"
        >
          {/* Subtle background glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(40%_50%_at_50%_50%,rgb(var(--brand-cyan)/0.05),transparent)]"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
                className="mb-4 inline-block"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-cyan border border-brand-cyan/20 bg-brand-cyan/10">
                  Technical Stack
                </span>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink mb-4"
              >
                Skills &amp;{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">
                  Technologies
                </span>
              </motion.h2>

              <motion.p
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
                className="text-sm sm:text-base leading-relaxed text-ink-secondary"
              >
                Core competencies developed across front-end engineering, back-end infrastructure, and database systems.
              </motion.p>
            </div>

            <motion.div
              variants={parentVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              className="rounded-2xl border border-line-subtle bg-surface-card/60 p-5 sm:p-8 lg:p-10 backdrop-blur-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                {skills.map((skill, index) => {
                  const proficiency = Math.min(100, Math.max(0, Number(skill.proficiency) || 0));

                  return (
                    <div key={skill.id || `skill-${index}`} className="group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm sm:text-base text-ink group-hover:text-brand-cyan transition-colors duration-200">
                          {skill.skillName}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-brand-cyan">
                          {proficiency}%
                        </span>
                      </div>

                      {/* Track */}
                      <div className="h-2 sm:h-2.5 rounded-full overflow-hidden bg-surface-soft border border-white/8">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${proficiency}%` }}
                          viewport={VIEWPORT_ONCE}
                          transition={{
                            duration: reduced ? 0.01 : 1.0,
                            delay: reduced ? 0 : index * 0.04,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className={`h-full rounded-full bg-gradient-to-r ${skill.gradientClass}`}
                          style={{
                            width: reduced ? `${proficiency}%` : undefined,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📅 WORK EXPERIENCE TIMELINE                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {sortedByExpEndDate.length > 0 && (
        <section
          className="relative py-16 sm:py-20 lg:py-24"
          aria-label="Work Experience and History"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
                className="mb-4 inline-block"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-purple border border-brand-purple/20 bg-brand-purple/10">
                  Career Trajectory
                </span>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink mb-4"
              >
                Work{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">
                  Experience
                </span>
              </motion.h2>
            </div>

            <div className="relative pl-6 sm:pl-8 md:pl-0">
              {/* Timeline Center/Left Line */}
              <div
                className="absolute left-6 md:left-1/2 -translate-x-1/2 top-3 bottom-3 w-px bg-gradient-to-b from-brand-cyan via-brand-blue to-brand-purple opacity-40"
                aria-hidden="true"
              />

              <div className="space-y-8 sm:space-y-12">
                {sortedByExpEndDate.map((expItem, index) => {
                  const startYear = getYear(expItem?.startedAt) || 'N/A';
                  const isCurrent = expItem?.currentlyWorking === 1 || expItem?.currentlyWorking === true;
                  const endYear = isCurrent ? 'Present' : getYear(expItem?.endDate) || 'N/A';
                  const isEven = index % 2 === 0;

                  return (
                    <motion.div
                      key={expItem.id || `exp-${index}`}
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={VIEWPORT_ONCE}
                      className="relative flex items-start md:items-center"
                    >
                      {/* Timeline Glowing Node */}
                      <div
                        className="absolute -left-6 md:left-1/2 -translate-x-1/2 top-4 md:top-auto z-10 grid h-5 w-5 place-items-center rounded-full border-2 border-surface-base bg-brand-cyan shadow-[0_0_12px_rgba(2,211,254,0.6)]"
                        aria-hidden="true"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-surface-base" />
                      </div>

                      {/* Card Content */}
                      <div
                        className={`w-full md:w-[calc(50%-2rem)] ${
                          isEven ? 'md:mr-auto md:text-right' : 'md:ml-auto md:text-left'
                        }`}
                      >
                        <div className="rounded-2xl border border-line-subtle bg-surface-card/70 p-5 sm:p-6 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-glow-cyan text-left">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20">
                              {startYear} – {endYear}
                            </span>
                            {isCurrent && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Current
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg sm:text-xl font-bold text-ink mb-1">
                            {expItem.position}
                          </h3>
                          <p className="text-sm font-semibold text-brand-purple mb-3">
                            {expItem.company}
                          </p>
                          <p className="text-xs sm:text-sm leading-relaxed text-ink-secondary">
                            {expItem.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 💡 CORE VALUES SECTION                                             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative py-16 sm:py-20 lg:py-24 overflow-hidden isolate"
        aria-label="Core Engineering Values"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              className="mb-4 inline-block"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-cyan border border-brand-cyan/20 bg-brand-cyan/10">
                Guiding Principles
              </span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink mb-4"
            >
              Core{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">
                Values
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              className="text-sm sm:text-base leading-relaxed text-ink-secondary"
            >
              The foundational pillars that direct my architectural choices, design thinking, and code execution.
            </motion.p>
          </div>

          <motion.div
            variants={parentVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {VALUES.map((value, index) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                whileHover={
                  reduced || isMobile
                    ? undefined
                    : { y: -4, transition: { duration: 0.2 } }
                }
                className="rounded-2xl border border-line-subtle bg-surface-card/60 p-6 sm:p-8 text-center backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-brand-cyan/30 hover:shadow-glow-cyan h-full flex flex-col items-center"
              >
                <div
                  className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan mb-5 shrink-0"
                  aria-hidden="true"
                >
                  <value.icon size={22} className="sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-ink mb-2">
                  {value.title}
                </h3>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
});

About.displayName = 'About';
export default About;
