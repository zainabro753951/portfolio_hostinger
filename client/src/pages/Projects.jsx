import { GradientText, THEME } from '@/components/UI';
import useCreatedAtSorted from '@/hooks/useCreatedAtSorted';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronRight, Code, Figma, Layers, Play, Sparkles } from 'lucide-react';
import { AnimatePresence, LazyMotion, domAnimation, motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const FILTERS = [
  { key: 'all', label: 'All Projects', icon: Layers },
  { key: 'full-stack', label: 'Full Stack', icon: Code },
  { key: 'frontend', label: 'Frontend', icon: Figma },
  { key: 'backend', label: 'Backend', icon: Code },
  { key: 'realtime', label: 'Realtime', icon: Play },
];

// ═══════════════════════════════════════════════════════════════
// 🧩 PROJECT CARD
// ═══════════════════════════════════════════════════════════════
const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE || '';
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const imageUrl = useMemo(() => {
    if (project.heroImage?.url) {
      const cleanBase = backendUrl.replace(/\/+$/, '');
      const cleanPath = project.heroImage.url.replace(/^\/+/, '');
      return `${cleanBase}/${cleanPath}`;
    }
    return '/default-project.jpg';
  }, [project.heroImage?.url, backendUrl]);

  const techTags = useMemo(() => {
    return project?.techStack?.slice(0, 3).map(({ name }) => name) || [];
  }, [project.techStack]);

  return (
    <motion.div
      ref={cardRef}
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -20, scale: 0.95 }}
      transition={
        prefersReducedMotion
          ? {}
          : { duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
      }
      whileHover={prefersReducedMotion ? undefined : { y: -8, transition: { duration: 0.3 } }}
      className="group relative cursor-pointer h-full"
      role="article"
      aria-labelledby={`project-title-${project.id || index}`}
    >
      <Link to={`/projects/${project?.slug}`} className="block h-full">
        <div
          className="relative rounded-xl sm:rounded-2xl overflow-hidden h-full flex flex-col"
          style={{
            background: THEME.bgCard,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${THEME.border}`,
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(2, 211, 254, 0.3)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(2, 211, 254, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = THEME.border;
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
          }}
        >
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
            <img
              src={imageUrl}
              alt={project.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
              decoding="async"
              width="800"
              height="500"
            />
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(10,10,15,0.95), rgba(10,10,15,0.4), transparent)',
              }}
              aria-hidden="true"
            />
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background:
                  'linear-gradient(to top, rgba(2, 211, 254, 0.15), rgba(154, 92, 183, 0.1))',
              }}
              aria-hidden="true"
            />
          </div>

          {/* Content */}
          <div className="relative p-4 sm:p-5 md:p-6 flex-grow flex flex-col justify-between">
            <div>
              <span
                className="inline-block text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-2 sm:mb-3"
                style={{ color: THEME.textGray }}
              >
                {project.category || 'Project'}
              </span>

              <h3
                id={`project-title-${project.id || index}`}
                className="text-lg sm:text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors duration-300 leading-tight"
                style={{ color: THEME.textWhite }}
              >
                {project.title}
              </h3>

              <p
                className="text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed"
                style={{ color: THEME.textGray }}
              >
                {project.shortDesc || project.description}
              </p>

              {/* Tags */}
              {techTags.length > 0 && (
                <div
                  className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4"
                  role="list"
                  aria-label="Project technologies"
                >
                  {techTags.map((tag, tIndex) => (
                    <span
                      key={tIndex}
                      className="px-2 sm:px-2.5 py-1 rounded-md text-[10px] sm:text-xs border"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(4px)',
                        borderColor: 'rgba(255,255,255,0.08)',
                        color: THEME.textGray,
                      }}
                      role="listitem"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  key="cta"
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1, x: 0, y: 0 }
                      : { opacity: 0, x: -10, y: 10 }
                  }
                  animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, x: -10, y: 10 }}
                  transition={prefersReducedMotion ? {} : { duration: 0.25, ease: 'easeOut' }}
                  className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold"
                  style={{ color: THEME.cyan }}
                  aria-hidden="true"
                >
                  <span>Explore Project</span>
                  <motion.div
                    animate={prefersReducedMotion ? undefined : { x: [0, 5, 0] }}
                    transition={
                      prefersReducedMotion
                        ? {}
                        : { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
                    }
                  >
                    <ArrowRight size={14} className="sm:w-4 sm:h-4" aria-hidden="true" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 🏗️ MAIN PROJECTS PAGE
// ═══════════════════════════════════════════════════════════════
const Projects = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const { projects: projectsDB } = useSelector((state) => state.projects);
  const { sortedData: sortedProjects } = useCreatedAtSorted(projectsDB);

  // Fixed filter logic
  const filteredProjects = useMemo(() => {
    return sortedProjects || [];
  }, [sortedProjects]);

  const displayProjects = useMemo(() => {
    if (filter === 'all') return filteredProjects;
    return filteredProjects.filter((p) => p.category === filter);
  }, [filteredProjects, filter]);

  const handleFilterChange = useCallback(
    (newFilter) => {
      if (newFilter === filter) return;
      setIsLoading(true);
      setFilter(newFilter);
      setTimeout(() => setIsLoading(false), 300);
    },
    [filter]
  );

  // GSAP Header Animation
  useEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true },
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // SEO Structured Data
  const structuredData = useMemo(() => {
    if (!filteredProjects.length) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Portfolio Projects',
      description:
        'A curated collection of recent web development, UI/UX design, and motion graphics projects.',
      url: window.location.href,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: filteredProjects.slice(0, 12).map((p, i) => ({
          '@type': 'CreativeWork',
          position: i + 1,
          name: p.title,
          description: p.shortDesc,
          url: `${window.location.origin}/projects/${p.slug}`,
        })),
      },
    };
  }, [filteredProjects]);

  return (
    <LazyMotion features={domAnimation}>
      <main
        ref={containerRef}
        className="relative min-h-screen min-h-[100dvh] overflow-x-hidden"
        style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
        aria-label="Projects Portfolio"
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
        <div
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 0 }}
          aria-hidden="true"
        >
          <div
            className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full blur-[80px] md:blur-[120px] animate-pulse"
            style={{ background: 'rgba(2, 211, 254, 0.12)' }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full blur-[80px] md:blur-[120px] animate-pulse"
            style={{ animationDelay: '1s', background: 'rgba(78, 144, 225, 0.12)' }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full blur-[60px] md:blur-[100px] animate-pulse"
            style={{ animationDelay: '2s', background: 'rgba(154, 92, 183, 0.1)' }}
          />
        </div>

        {/* Particles */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} aria-hidden="true">
          {[...Array(10)].map((_, i) => (
            <div
              key={`p-${i}`}
              className="absolute w-1 h-1 rounded-full animate-pulse"
              style={{
                left: `${(i * 11.3) % 100}%`,
                top: `${(i * 17.7) % 100}%`,
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
        <header className="relative pt-20 sm:pt-24 pb-8 sm:pb-12" style={{ zIndex: 2 }}>
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-10 sm:py-16 md:py-20">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? {} : { duration: 0.8, ease: 'easeOut' }}
              className="text-center"
            >
              <motion.span
                initial={
                  prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }
                }
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
                Portfolio
              </motion.span>

              <h1
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 px-2 leading-tight"
                style={{ color: THEME.textWhite }}
              >
                Featured <GradientText>Projects</GradientText>
              </h1>

              <p
                className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-4"
                style={{ color: THEME.textGray }}
              >
                A curated collection of my recent work showcasing web development, UI/UX design, and
                motion graphics projects.
              </p>
            </motion.div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 📋 PROJECTS GRID                                                   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section
          ref={headerRef}
          className="relative py-12 sm:py-16 md:py-24"
          style={{ zIndex: 2 }}
          aria-label="Project Gallery"
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
            {/* Filter Buttons */}
            <nav aria-label="Filter projects by category">
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={prefersReducedMotion ? undefined : { once: true }}
                transition={prefersReducedMotion ? {} : { duration: 0.6 }}
                className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 md:mb-16"
              >
                {FILTERS.map((f) => {
                  const Icon = f.icon;
                  const isActive = filter === f.key;
                  return (
                    <motion.button
                      key={f.key}
                      onClick={() => handleFilterChange(f.key)}
                      whileHover={prefersReducedMotion ? undefined : { scale: 1.05, y: -2 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                      className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm"
                      style={{
                        background: isActive ? THEME.gradientPrimary : 'rgba(255,255,255,0.05)',
                        color: isActive ? '#ffffff' : THEME.textGray,
                        border: isActive ? 'none' : `1px solid ${THEME.border}`,
                        backdropFilter: 'blur(4px)',
                        boxShadow: isActive ? '0 0 15px rgba(2, 211, 254, 0.2)' : 'none',
                      }}
                      aria-pressed={isActive}
                    >
                      <Icon
                        size={14}
                        className="sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px]"
                        aria-hidden="true"
                      />
                      <span>{f.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            </nav>

            {/* Loading */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center py-8 sm:py-12"
                  role="status"
                  aria-label="Loading projects"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-6 h-6 sm:w-8 sm:h-8 border-2 rounded-full"
                    style={{ borderColor: THEME.cyan, borderTopColor: 'transparent' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grid */}
            <AnimatePresence mode="popLayout">
              {!isLoading && (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8"
                >
                  {displayProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id || `project-${index}`}
                      project={project}
                      index={index}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty */}
            <AnimatePresence>
              {!isLoading && displayProjects.length === 0 && (
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                  className="text-center py-12 sm:py-16 md:py-20"
                >
                  <p className="text-sm sm:text-lg px-4" style={{ color: THEME.textGray }}>
                    No projects found in this category.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 💡 CTA SECTION                                                     */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="relative py-12 sm:py-16 md:py-24"
          style={{ zIndex: 2 }}
          aria-label="Start a project call to action"
        >
          <div
            className="absolute inset-0 opacity-20 sm:opacity-30 pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, rgba(2, 211, 254, 0.1), rgba(154, 92, 183, 0.1))',
            }}
            aria-hidden="true"
          />
          <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 relative">
            <div
              className="rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center"
              style={{
                background: THEME.bgCard,
                backdropFilter: 'blur(10px)',
                border: `1px solid rgba(2, 211, 254, 0.2)`,
                boxShadow: '0 0 40px rgba(2, 211, 254, 0.05)',
              }}
            >
              <motion.div
                initial={
                  prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
                }
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                viewport={prefersReducedMotion ? undefined : { once: true }}
                transition={prefersReducedMotion ? {} : { duration: 0.6 }}
                className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-4 sm:mb-6 mx-auto"
                style={{ background: 'rgba(2, 211, 254, 0.15)' }}
              >
                <Sparkles
                  size={24}
                  className="sm:w-8 sm:h-8"
                  style={{ color: THEME.cyan }}
                  aria-hidden="true"
                />
              </motion.div>

              <motion.h2
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={prefersReducedMotion ? undefined : { once: true }}
                transition={prefersReducedMotion ? {} : { duration: 0.6, delay: 0.1 }}
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-2 leading-tight"
                style={{ color: THEME.textWhite }}
              >
                Have a Project in <span style={{ color: THEME.cyan }}>Mind?</span>
              </motion.h2>

              <motion.p
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={prefersReducedMotion ? undefined : { once: true }}
                transition={prefersReducedMotion ? {} : { duration: 0.6, delay: 0.2 }}
                className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4"
                style={{ color: THEME.textGray }}
              >
                Let's collaborate and create something amazing together. I'm always excited to work
                on new challenges.
              </motion.p>

              <motion.button
                whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                className="relative inline-flex items-center justify-center gap-1.5 sm:gap-2 px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
                style={{
                  background: THEME.gradientPrimary,
                  color: '#ffffff',
                  transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(2, 211, 254, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                aria-label="Start a new project with me"
              >
                <span
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  }}
                  aria-hidden="true"
                />
                <span className="relative z-10">Start a Project</span>
                <ChevronRight
                  size={18}
                  className="sm:w-5 sm:h-5 relative z-10"
                  aria-hidden="true"
                />
              </motion.button>
            </div>
          </div>
        </section>
      </main>
    </LazyMotion>
  );
};

export default Projects;
