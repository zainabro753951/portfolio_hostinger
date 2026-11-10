import LazyImage from '@/components/LazyImage';
import { OutlineButton, PrimaryButton } from '@/components/UI';
import useCreatedAtSorted from '@/hooks/useCreatedAtSorted';
import { fadeUp, staggerParent, useMotionPrefs, VIEWPORT_ONCE } from '@/lib/motion';
import {
  ArrowRight,
  Code,
  ExternalLink,
  Figma,
  FolderOpen,
  Layers,
  Play,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { memo, useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

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
const ProjectCard = memo(({ project, index }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE || '';
  const { reduced, isMobile } = useMotionPrefs();

  const imageUrl = useMemo(() => {
    if (project?.heroImage?.url) {
      const cleanBase = backendUrl.replace(/\/+$/, '');
      const cleanPath = project.heroImage.url.replace(/^\/+/, '');
      return `${cleanBase}/${cleanPath}`;
    }
    return '';
  }, [project?.heroImage?.url, backendUrl]);

  const techTags = useMemo(() => {
    return project?.techStack?.slice(0, 3).map(({ name }) => name) || [];
  }, [project?.techStack]);

  const cardVariants = useMemo(() => {
    if (reduced) return { hidden: { opacity: 1 }, visible: { opacity: 1 } };
    return {
      hidden: { opacity: 0, y: isMobile ? 12 : 24 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] },
      },
    };
  }, [reduced, isMobile, index]);

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      whileHover={reduced || isMobile ? undefined : { y: -6, transition: { duration: 0.25 } }}
      className="group relative flex flex-col h-full rounded-2xl border border-line-subtle bg-surface-card/60 backdrop-blur-sm overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-brand-cyan/40 hover:shadow-glow-cyan"
      aria-labelledby={`project-title-${project.id || index}`}
    >
      <Link to={`/projects/${project?.slug}`} className="flex flex-col h-full">
        {/* Project Thumbnail Image with LazyImage */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-soft border-b border-line-subtle flex-shrink-0">
          <LazyImage
            src={imageUrl}
            alt={project?.title || 'Project thumbnail'}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:group-hover:scale-100"
            objectFit="cover"
            objectPosition="center"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-base/80 via-transparent to-transparent opacity-80"
          />

          {/* Featured pill if marked featured */}
          {project?.featured && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-brand-cyan bg-surface-void/90 border border-brand-cyan/30 backdrop-blur-md">
                <Sparkles size={11} className="text-brand-cyan" />
                Featured
              </span>
            </div>
          )}

          {/* Category Tag */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider text-ink-secondary bg-surface-void/80 border border-line-subtle backdrop-blur-md">
              {project.category || 'Project'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3
              id={`project-title-${project.id || index}`}
              className="text-lg sm:text-xl font-bold text-ink mb-2 leading-snug group-hover:text-brand-cyan transition-colors duration-200 line-clamp-1"
            >
              {project.title}
            </h3>

            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed mb-4 line-clamp-2">
              {project.shortDesc || project.description || 'Modern digital application engineered for performance and scalability.'}
            </p>

            {/* Tech Stack Pills */}
            {techTags.length > 0 && (
              <div
                className="flex flex-wrap gap-1.5 mb-5"
                role="list"
                aria-label="Project technologies"
              >
                {techTags.map((tag, tIndex) => (
                  <span
                    key={tIndex}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium text-ink-muted bg-surface-soft border border-line-subtle"
                    role="listitem"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs sm:text-sm font-semibold text-brand-cyan group-hover:text-brand-cyan">
            <span className="flex items-center gap-1.5">
              <span>View Case Study</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
            {project?.liveDemo && (
              <span className="text-ink-muted group-hover:text-ink-secondary">
                <ExternalLink size={14} aria-hidden="true" />
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
});

ProjectCard.displayName = 'ProjectCard';

// ═══════════════════════════════════════════════════════════════
// 🏗️ MAIN PROJECTS PAGE
// ═══════════════════════════════════════════════════════════════
const Projects = memo(() => {
  const [filter, setFilter] = useState('all');
  const [isFiltering, setIsFiltering] = useState(false);

  const { reduced, isMobile } = useMotionPrefs();
  const prefs = useMemo(() => ({ reduced, isMobile }), [reduced, isMobile]);

  const parentVariants = useMemo(() => staggerParent(0.08, 0.05), []);
  const headerVariants = useMemo(() => fadeUp(prefs, 0), [prefs]);

  const { projects: projectsDB, isLoading } = useSelector((state) => state.projects);
  const { sortedData: sortedProjects } = useCreatedAtSorted(projectsDB);

  const filteredProjects = useMemo(() => {
    return sortedProjects || [];
  }, [sortedProjects]);

  const displayProjects = useMemo(() => {
    if (filter === 'all') return filteredProjects;
    const filterKey = filter.toLowerCase().replace(/[\s-]+/g, '');
    return filteredProjects.filter((p) => {
      const cat = (p.category || '').toLowerCase().replace(/[\s-]+/g, '');
      return cat === filterKey || cat.includes(filterKey);
    });
  }, [filteredProjects, filter]);

  const handleFilterChange = useCallback(
    (newFilter) => {
      if (newFilter === filter) return;
      setIsFiltering(true);
      setFilter(newFilter);
      setTimeout(() => setIsFiltering(false), 180);
    },
    [filter]
  );

  // SEO Structured Data
  const structuredData = useMemo(() => {
    if (!filteredProjects.length || typeof window === 'undefined') return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Portfolio Projects & Case Studies',
      description:
        'A curated collection of full-stack engineering, web applications, UI/UX design, and realtime architectures.',
      url: window.location.href,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: filteredProjects.slice(0, 16).map((p, i) => ({
          '@type': 'CreativeWork',
          position: i + 1,
          name: p.title,
          description: p.shortDesc || p.description,
          url: `${window.location.origin}/projects/${p.slug}`,
        })),
      },
    };
  }, [filteredProjects]);

  return (
    <div className="relative isolate overflow-x-clip bg-surface-base text-ink" id="projects-page">
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
      <header className="relative pt-28 pb-10 sm:pt-36 sm:pb-14 lg:pt-40 lg:pb-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="mb-4 inline-block"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-cyan border border-brand-cyan/20 bg-brand-cyan/10">
              <Sparkles size={12} className="text-brand-cyan" aria-hidden="true" />
              Featured Portfolio
            </span>
          </motion.div>

          <motion.h1
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink mb-4 sm:mb-6 leading-tight"
          >
            Selected Works &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">
              Case Studies
            </span>
          </motion.h1>

          <motion.p
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="text-sm sm:text-base md:text-lg leading-relaxed text-ink-secondary max-w-2xl mx-auto"
          >
            A curated showcase of scalable full-stack applications, interactive user interfaces,
            and high-impact technical solutions.
          </motion.p>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📋 PROJECTS GALLERY                                                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative pb-16 sm:pb-20 lg:pb-24" aria-label="Project Gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Tabs */}
          <nav aria-label="Filter projects by category" className="mb-10 sm:mb-14">
            <motion.div
              variants={headerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
            >
              {FILTERS.map((f) => {
                const Icon = f.icon;
                const isActive = filter === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => handleFilterChange(f.key)}
                    className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-cyan to-brand-blue text-surface-void font-semibold shadow-glow-cyan'
                        : 'border border-line-subtle bg-surface-card/60 text-ink-secondary hover:text-ink hover:border-line-strong hover:bg-surface-card'
                    }`}
                    aria-pressed={isActive}
                  >
                    <Icon size={14} className={isActive ? 'text-surface-void' : 'text-brand-cyan'} aria-hidden="true" />
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </motion.div>
          </nav>

          {/* Loading Skeleton Grid */}
          {(isLoading || isFiltering) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={`proj-skeleton-${i}`}
                  className="rounded-2xl border border-line-subtle bg-surface-card/60 overflow-hidden"
                  aria-hidden="true"
                >
                  <div className="aspect-[16/10] w-full bg-surface-soft animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 w-3/4 rounded-md bg-surface-soft animate-pulse" />
                    <div className="h-4 w-full rounded-md bg-surface-soft/60 animate-pulse" />
                    <div className="h-4 w-2/3 rounded-md bg-surface-soft/60 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects Grid */}
          {!isLoading && !isFiltering && displayProjects.length > 0 && (
            <motion.div
              layout
              variants={parentVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch"
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

          {/* Empty State */}
          {!isLoading && !isFiltering && displayProjects.length === 0 && (
            <div className="text-center py-16 sm:py-20 px-4 rounded-3xl border border-line-subtle bg-surface-card/40 max-w-xl mx-auto">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan mx-auto mb-4">
                <FolderOpen size={26} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-ink mb-2">No projects found</h3>
              <p className="text-sm text-ink-secondary mb-6 max-w-md mx-auto">
                No active projects match the "{filter}" category filter at this time.
              </p>
              <button
                type="button"
                onClick={() => handleFilterChange('all')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-surface-soft border border-line-subtle text-ink hover:border-line-strong transition-colors"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 💡 CALL TO ACTION SECTION                                          */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20 lg:py-24" aria-label="Start a project call to action">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-line-strong bg-gradient-to-b from-surface-card via-surface-elevated to-surface-card p-6 sm:p-10 md:p-14 lg:p-16 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px rounded-3xl bg-[radial-gradient(ellipse_at_top,rgb(var(--brand-cyan)/0.14),transparent_65%)]"
            />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan mb-5 sm:mb-6 mx-auto">
                <Sparkles size={22} className="sm:w-6 sm:h-6" aria-hidden="true" />
              </div>

              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink mb-4 sm:mb-5 leading-tight">
                Have a Project in{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">
                  Mind?
                </span>
              </h2>

              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-ink-secondary mb-8 sm:mb-10 max-w-2xl mx-auto">
                Let's discuss requirements, architecture, and timeline. I'm ready to turn your concept into a reliable digital product.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 w-full">
                <PrimaryButton to="/contact" icon={ArrowRight} className="w-full sm:w-auto justify-center">
                  Start a Project
                </PrimaryButton>
                <OutlineButton to="/services" className="w-full sm:w-auto justify-center">
                  Explore Services
                </OutlineButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

Projects.displayName = 'Projects';
export default Projects;
