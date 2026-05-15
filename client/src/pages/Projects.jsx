// ============================================================================
// 📁 ui.jsx (Shared UI Components - Extract to separate file)
// ============================================================================
// Export these components to reuse across all pages
import { GradientText, THEME } from '@/components/UI';
// ============================================================================

import useCreatedAtSorted from '@/hooks/useCreatedAtSorted';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  ChevronRight,
  Code,
  Figma,
  Layers,
  Palette,
  Play,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, LazyMotion, domAnimation, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// 📁 ProjectsPage.jsx (Main Page - Uses shared components above)
// ============================================================================

const PROJECTS_DATA = [
  {
    id: 1,
    title: 'Ethereal Visions',
    category: 'web',
    description:
      'A stunning 3D visualization platform showcasing abstract art with immersive interactions and WebGL effects.',
    longDescription:
      'Ethereal Visions is a cutting-edge 3D art platform that pushes the boundaries of web-based visualization. Built with React Three Fiber and custom shaders, it delivers an immersive gallery experience.',
    image: '/api/placeholder/800/500',
    tags: ['React', 'Three.js', 'GSAP', 'WebGL'],
    link: '#',
    github: '#',
    icon: Code,
    gradient: 'linear-gradient(135deg, #4e90e1, #02d3fe)',
    stats: { views: '12K+', likes: '850' },
  },
  {
    id: 2,
    title: 'Neon Dreams',
    category: 'design',
    description: 'Complete brand identity and visual design system for a futuristic AI startup.',
    longDescription:
      'A comprehensive brand identity project including logo design, color systems, typography, and motion guidelines for an emerging AI technology company.',
    image: '/api/placeholder/800/500',
    tags: ['Figma', 'Illustrator', 'After Effects', 'Brand Strategy'],
    link: '#',
    github: '#',
    icon: Palette,
    gradient: 'linear-gradient(135deg, #9a5cb7, #ec4899)',
    stats: { views: '8K+', likes: '620' },
  },
  {
    id: 3,
    title: 'Cyber Portal',
    category: 'web',
    description: 'High-performance analytics dashboard with real-time data visualization.',
    longDescription:
      'Enterprise-grade dashboard handling millions of data points with sub-second latency. Features custom D3.js visualizations and WebSocket real-time updates.',
    image: '/api/placeholder/800/500',
    tags: ['Next.js', 'TypeScript', 'D3.js', 'PostgreSQL'],
    link: '#',
    github: '#',
    icon: Layers,
    gradient: 'linear-gradient(135deg, #02d3fe, #4e90e1)',
    stats: { views: '15K+', likes: '920' },
  },
  {
    id: 4,
    title: 'Crystal Flow',
    category: 'motion',
    description: 'Premium motion graphics package for luxury product launch campaign.',
    longDescription:
      'Award-winning motion graphics campaign featuring fluid simulations, particle effects, and cinematic color grading for a flagship product launch.',
    image: '/api/placeholder/800/500',
    tags: ['After Effects', 'Cinema 4D', 'Lottie', 'Houdini'],
    link: '#',
    github: '#',
    icon: Play,
    gradient: 'linear-gradient(135deg, #f59e0b, #ec4899)',
    stats: { views: '25K+', likes: '1.2K' },
  },
];

const FILTERS = [
  { key: 'all', label: 'All Projects', icon: Layers },
  { key: 'full-stack', label: 'Full Stack', icon: Code },
  { key: 'frontend', label: 'Frontend', icon: Figma },
  { key: 'backend', label: 'Backend', icon: Play },
  { key: 'realtime', label: 'Realtime', icon: Play },
];

const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -12, transition: { duration: 0.3 } }}
      className="group relative cursor-pointer"
    >
      <Link to={`/projects/${project?.slug}`}>
        <div
          className="relative rounded-2xl overflow-hidden h-full"
          style={{
            background: THEME.bgCard,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${THEME.border}`,
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
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
          <div className="relative aspect-[16/10] overflow-hidden">
            <motion.img
              src={`${backendUrl}${project.heroImage?.url}`}
              alt={project.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(10,10,15,0.95), rgba(10,10,15,0.4), transparent)',
              }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(2, 211, 254, 0.15), rgba(154, 92, 183, 0.1))',
              }}
            />
          </div>

          <div className="w-full absolute bottom-0 left-0 h-full  bg-black/20 pointer-events-none">
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-3 mb-3">
                {/* <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: project.gradient }}
            >
              <project.icon size={20} style={{ color: '#ffffff' }} />
            </motion.div> */}
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: THEME.textGray }}
                >
                  {project.category}
                </span>
              </div>

              <h3
                className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors duration-300"
                style={{ color: THEME.textWhite }}
              >
                {project.title}
              </h3>

              <p
                className="text-sm mb-4 line-clamp-2 leading-relaxed"
                style={{ color: THEME.textGray }}
              >
                {project.shortDesc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project?.techStack?.slice(0, 3).map(({ name }, tIndex) => {
                  return (
                    <motion.span
                      key={tIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + tIndex * 0.05 }}
                      className="px-2.5 py-1 rounded-md text-xs border"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(4px)',
                        borderColor: 'rgba(255,255,255,0.05)',
                        color: THEME.textGray,
                      }}
                    >
                      {name}
                    </motion.span>
                  );
                })}
              </div>

              {/* CTA Section - Replace existing wale ko is se */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    key="cta"
                    initial={{ opacity: 0, x: -20, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: -20, y: 10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="flex items-center gap-2 text-sm font-semibold"
                    style={{ color: THEME.cyan }}
                  >
                    <span>Explore Project</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    >
                      <ArrowRight size={16} />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const Projects = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const { projects: projectsDB } = useSelector((state) => state.projects);
  const { sortedData: projects } = useCreatedAtSorted(projectsDB);

  const filteredProjects = useState(() => projects)[0];
  const displayProjects =
    filter === 'all' ? filteredProjects : filteredProjects.filter((p) => p.category === filter);

  const handleFilterChange = useCallback(
    (newFilter) => {
      if (newFilter === filter) return;
      setIsLoading(true);
      setFilter(newFilter);
      setTimeout(() => setIsLoading(false), 300);
    },
    [filter]
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <div
        ref={containerRef}
        className="relative min-h-screen overflow-x-hidden"
        style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
      >
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 🌌 BACKGROUND LAYERS (Matches ProjectDetailsPage EXACTLY)         */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse"
            style={{ background: 'rgba(2, 211, 254, 0.12)' }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse"
            style={{ animationDelay: '1s', background: 'rgba(78, 144, 225, 0.12)' }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-[100px] animate-pulse"
            style={{ animationDelay: '2s', background: 'rgba(154, 92, 183, 0.1)' }}
          />
        </div>

        {/* Particles */}
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
        <section className="relative pt-24 pb-12" style={{ zIndex: 2 }}>
          <div className="max-w-7xl mx-auto px-6 py-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
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
                Portfolio
              </motion.span>

              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
                style={{ color: THEME.textWhite }}
              >
                Featured <GradientText>Projects</GradientText>
              </h1>

              <p
                className="text-lg max-w-2xl mx-auto leading-relaxed"
                style={{ color: THEME.textGray }}
              >
                A curated collection of my recent work showcasing web development, UI/UX design, and
                motion graphics projects.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 📋 PROJECTS GRID                                                   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section ref={headerRef} className="relative py-24" style={{ zIndex: 2 }}>
          <div className="max-w-7xl mx-auto px-6">
            {/* Filter Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-3 mb-16"
            >
              {FILTERS.map((f) => {
                const Icon = f.icon;
                const isActive = filter === f.key;
                return (
                  <motion.button
                    key={f.key}
                    onClick={() => handleFilterChange(f.key)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300"
                    style={{
                      background: isActive ? THEME.gradientPrimary : 'rgba(255,255,255,0.05)',
                      color: isActive ? '#ffffff' : THEME.textGray,
                      border: isActive ? 'none' : `1px solid ${THEME.border}`,
                      backdropFilter: 'blur(4px)',
                      boxShadow: isActive ? '0 0 20px rgba(2, 211, 254, 0.2)' : 'none',
                    }}
                  >
                    <Icon size={18} />
                    <span>{f.label}</span>
                    {isActive && <span className="ml-1 w-2 h-2 rounded-full bg-white" />}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Loading */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center py-12"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-8 h-8 border-2 rounded-full"
                    style={{ borderColor: THEME.cyan, borderTopColor: 'transparent' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grid */}
            <AnimatePresence mode="popLayout">
              {!isLoading && (
                <motion.div layout className="grid md:grid-cols-2 gap-8">
                  {displayProjects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty */}
            <AnimatePresence>
              {!isLoading && displayProjects.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20"
                >
                  <p className="text-lg" style={{ color: THEME.textGray }}>
                    No projects found in this category.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 💡 CTA SECTION (Matches ProjectDetailsPage CTA style)              */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative py-24" style={{ zIndex: 2 }}>
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                'linear-gradient(to right, rgba(2, 211, 254, 0.1), rgba(154, 92, 183, 0.1))',
            }}
          />
          <div
            className="max-w-4xl mx-auto px-6 relative text-center rounded-2xl p-8 md:p-12"
            style={{
              background: THEME.bgCard,
              backdropFilter: 'blur(10px)',
              border: `1px solid rgba(2, 211, 254, 0.2)`,
              boxShadow: '0 0 40px rgba(2, 211, 254, 0.05)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
              style={{ background: 'rgba(2, 211, 254, 0.15)' }}
            >
              <Sparkles size={32} style={{ color: THEME.cyan }} />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              style={{ color: THEME.textWhite }}
            >
              Have a Project in <span style={{ color: THEME.cyan }}>Mind?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
              style={{ color: THEME.textGray }}
            >
              Let's collaborate and create something amazing together. I'm always excited to work on
              new challenges.
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-lg overflow-hidden group"
              style={{
                background: THEME.gradientPrimary,
                color: '#ffffff',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 40px rgba(2, 211, 254, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                }}
              />
              <span className="relative z-10">Start a Project</span>
              <ChevronRight size={20} className="relative z-10" />
            </motion.button>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
};

export default Projects;
