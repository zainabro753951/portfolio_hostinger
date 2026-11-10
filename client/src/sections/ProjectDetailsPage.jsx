import DynamicMetaUpdater from '@/components/DynamicMetaUpdater';
import LazyImage from '@/components/LazyImage';
import {
  MetricBar,
  OutlineButton,
  PrimaryButton,
  TechBadge,
} from '@/components/UI';
import { projectFindBySlug } from '@/features/projectSlice';
import { fadeUp, staggerParent, useMotionPrefs, VIEWPORT_ONCE } from '@/lib/motion';
import { formatDuration, techIcons } from '@/Utils/Utils';
import {
  ArrowDown,
  ArrowLeft,
  Award,
  ChevronRight,
  Code2,
  ExternalLink,
  Globe,
  Layers,
  Palette,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../richText.css';

// ═══════════════════════════════════════════════════════════════════════════
// 📦 RICH CONTENT PARSER
// Parses backend richText and splits it into cards based on <h2> tags
// ═══════════════════════════════════════════════════════════════════════════
const parseRichContent = (html) => {
  if (!html || typeof window === 'undefined') return [];

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const h2s = doc.querySelectorAll('h2');

    if (h2s.length === 0) {
      return [{ title: 'Project Details', content: html, icon: Code2 }];
    }

    const sections = [];
    const nodes = Array.from(doc.body.childNodes);
    const h2Indices = nodes
      .map((node, index) => ({ node, index }))
      .filter(({ node }) => node.nodeType === 1 && node.tagName.toLowerCase() === 'h2')
      .map(({ index }) => index);

    h2Indices.forEach((h2Index, i) => {
      const title = nodes[h2Index].textContent.trim();
      const contentNodes = nodes.slice(h2Index + 1, h2Indices[i + 1] || nodes.length);

      const div = document.createElement('div');
      contentNodes.forEach((n) => div.appendChild(n));

      sections.push({ title, content: div.innerHTML });
    });

    return sections;
  } catch (error) {
    console.error('Failed to parse rich content:', error);
    return [];
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// 🧩 RICH CONTENT SECTION CARD
// ═══════════════════════════════════════════════════════════════════════════
const RichContentCard = memo(({ section, index }) => {
  const icons = [Sparkles, Palette, Code2, Zap, Globe, Target, Layers, Award];
  const Icon = icons[index % icons.length];
  const { reduced, isMobile } = useMotionPrefs();
  const prefs = useMemo(() => ({ reduced, isMobile }), [reduced, isMobile]);
  const cardVariants = useMemo(() => fadeUp(prefs, index * 0.05), [prefs, index]);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      className="w-full min-w-0 rounded-2xl border border-line-subtle bg-surface-card/60 p-5 sm:p-6 lg:p-8 backdrop-blur-sm mb-6 transition-[border-color,box-shadow] duration-300 hover:border-line-strong"
    >
      {/* Header */}
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-ink mb-4 sm:mb-6 flex items-start gap-3 break-words">
        <span className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan shrink-0 mt-0.5">
          <Icon size={18} aria-hidden="true" />
        </span>
        <span className="leading-tight break-words">{section.title}</span>
      </h3>

      {/* Rich Content Area */}
      <div
        className="rich-output prose prose-invert max-w-none w-full text-left break-words text-ink-secondary text-sm sm:text-base leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    </motion.div>
  );
});
RichContentCard.displayName = 'RichContentCard';

// ═══════════════════════════════════════════════════════════════════════════
// 🏗️ MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const ProjectDetailsPage = memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { reduced, isMobile } = useMotionPrefs();
  const prefs = useMemo(() => ({ reduced, isMobile }), [reduced, isMobile]);

  const [project, setProject] = useState({});
  const [projectData, setProjectData] = useState({ name: '', suffix: '', title: '' });

  const { project: projectDB, isLoading } = useSelector((state) => state.projects);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE || '';

  // Spring tilt on preview image for desktop
  const canTilt = !reduced && !isMobile;
  const rotateX = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });

  const handlePointerMove = useCallback(
    (e) => {
      if (!canTilt || e.pointerType !== 'mouse') return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rotateY.set(x * 12);
      rotateX.set(-y * 12);
    },
    [canTilt, rotateX, rotateY]
  );

  const handlePointerLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  useEffect(() => {
    if (slug && !isLoading) {
      dispatch(projectFindBySlug(slug));
    }
  }, [slug, dispatch, isLoading]);

  useEffect(() => {
    if (!projectDB) return;

    const updatedProject = {
      ...projectDB,
      techStack: (projectDB?.techStack || []).map((tech) => {
        const matchedTech = techIcons.find(
          (item) => item.type.toLowerCase() === (tech.name || '').toLowerCase().replace(/\s+/g, '-')
        );
        return { ...tech, icon: matchedTech?.icon || Code2 };
      }),
    };

    setProject(updatedProject);

    // Parse title for Hero
    const titleParts = projectDB?.title?.split('–') || [];
    setProjectData({
      name: (titleParts[0]?.split('.')[0] || '').trim(),
      suffix: titleParts[0]?.split('.')[1] || '',
      title: (titleParts[1] || '').trim(),
    });
  }, [projectDB]);

  const scrollToDetails = useCallback(() => {
    document
      .getElementById('details')
      ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, [reduced]);

  // Parse content into sections
  const contentSections = useMemo(() => parseRichContent(project?.content), [project?.content]);

  // Structured Data for SEO
  const structuredData = useMemo(() => {
    if (!project?.title || typeof window === 'undefined') return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.shortDesc || project.content,
      url: window.location.href,
      image: project.heroImage?.url ? `${backendUrl}${project.heroImage.url}` : undefined,
      creator: {
        '@type': 'Person',
        name: project.author || project.role || 'Zain Abro',
      },
      datePublished: project.createdAt,
      keywords: (project?.metaKeywords || []).map((t) => t.name).join(', '),
    };
  }, [project, backendUrl]);

  const techStack = useMemo(() => project?.techStack || [], [project?.techStack]);
  const heroImageUrl = useMemo(() => {
    if (!project?.heroImage?.url) return '';
    return `${backendUrl.replace(/\/+$/, '')}/${project.heroImage.url.replace(/^\/+/, '')}`;
  }, [project?.heroImage?.url, backendUrl]);

  const heroVariants = useMemo(() => fadeUp(prefs, 0), [prefs]);

  return (
    <div
      className="relative isolate overflow-x-clip bg-surface-base text-ink"
      id="project-details-page"
      aria-label={`Project Details: ${projectData.name || project?.title || 'Project'}`}
    >
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Dynamic Meta Updater */}
      <DynamicMetaUpdater
        title={project.seoTitle || project.title || 'Project Details'}
        description={project.metaDesc || project.shortDesc || ''}
        schemaId="project-jsonld"
        schema={structuredData}
      />

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
      <header className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-2 mb-6 sm:mb-8 text-xs sm:text-sm font-medium text-ink-secondary hover:text-brand-cyan transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded-lg p-1.5 -ml-1.5"
            aria-label="Back to projects"
          >
            <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
            <span>Back to Projects</span>
          </button>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
            {/* Left Content */}
            <article className="order-2 md:order-1">
              {!!project?.featured && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4 text-xs font-semibold uppercase tracking-wider text-brand-cyan border border-brand-cyan/20 bg-brand-cyan/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" aria-hidden="true" />
                  Featured Project
                </div>
              )}

              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink mb-3 sm:mb-4 leading-tight">
                <span>{projectData.name || project?.title}</span>
                {projectData.suffix && (
                  <>
                    .<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">{projectData.suffix}</span>
                  </>
                )}
              </h1>

              {projectData.title && (
                <p className="text-lg sm:text-xl font-light text-brand-cyan mb-3">
                  {projectData.title}
                </p>
              )}

              <p className="text-sm sm:text-base leading-relaxed text-ink-secondary mb-6 sm:mb-8 max-w-xl">
                {project?.shortDesc || project?.description}
              </p>

              {/* Tech stack badges */}
              {techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {techStack.slice(0, 5).map((t) => (
                    <TechBadge key={t.name} name={t.name} icon={t.icon} />
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                {project?.liveDemo && (
                  <PrimaryButton
                    href={project.liveDemo}
                    icon={ExternalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto justify-center"
                  >
                    Live Preview
                  </PrimaryButton>
                )}
                <OutlineButton
                  onClick={scrollToDetails}
                  icon={ArrowDown}
                  className="w-full sm:w-auto justify-center"
                >
                  View Details
                </OutlineButton>
              </div>
            </article>

            {/* Right Preview with spring tilt */}
            <div
              className="relative order-1 md:order-2"
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
            >
              <motion.div
                style={{ rotateX, rotateY, transformPerspective: 1000 }}
                className="relative"
              >
                {/* Ambient glow behind preview */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 sm:-inset-6 rounded-3xl bg-[radial-gradient(closest-side,rgb(var(--brand-cyan)/0.15),rgb(var(--brand-purple)/0.10)_60%,transparent)]"
                />

                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line-strong bg-surface-card shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]">
                  <LazyImage
                    src={heroImageUrl}
                    alt={`${projectData.name || project?.title} preview`}
                    className="h-full w-full object-cover"
                    objectFit="cover"
                    objectPosition="center"
                    eager={true}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-base/40 via-transparent to-transparent"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📋 DETAILS SECTION: CONTENT & SIDEBAR                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="details" className="relative py-12 sm:py-16 lg:py-24" aria-label="Project Detailed Information">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            {/* Main Content (2 Columns) */}
            <div className="lg:col-span-2 space-y-6">
              {contentSections.length > 0 ? (
                contentSections.map((section, index) => (
                  <RichContentCard key={index} section={section} index={index} />
                ))
              ) : (
                <div className="rounded-2xl border border-line-subtle bg-surface-card/60 p-8 text-center text-ink-secondary text-sm">
                  Detailed documentation is being updated for this case study.
                </div>
              )}
            </div>

            {/* Sidebar (1 Column) */}
            <aside className="space-y-6 lg:sticky lg:top-28">
              {/* Project Metadata Card */}
              <div className="rounded-2xl border border-line-subtle bg-surface-card/70 p-5 sm:p-6 backdrop-blur-sm">
                <h4 className="text-base sm:text-lg font-bold text-ink mb-4 pb-3 border-b border-line-subtle">
                  Project Metadata
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Client / Product', value: projectData?.name || project?.title },
                    { label: 'Category', value: project?.category || 'Full Stack' },
                    { label: 'Duration', value: formatDuration(project?.estTime) || '2-4 weeks' },
                    {
                      label: 'Status',
                      value: (
                        <span className="inline-flex items-center gap-1.5 text-brand-cyan font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" aria-hidden="true" />
                          {project.status || 'Active'}
                        </span>
                      ),
                    },
                    {
                      label: 'Live URL',
                      value: project.liveDemo ? (
                        <a
                          href={project.liveDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-cyan hover:underline break-all"
                        >
                          Visit Live App
                        </a>
                      ) : (
                        'Private Deployment'
                      ),
                    },
                  ].map((info, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-white/8 last:border-b-0 text-xs sm:text-sm"
                    >
                      <span className="text-ink-muted">{info.label}</span>
                      <span className="font-medium text-ink text-right max-w-[60%] truncate">
                        {info.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies Applied */}
              {techStack.length > 0 && (
                <div className="rounded-2xl border border-line-subtle bg-surface-card/70 p-5 sm:p-6 backdrop-blur-sm">
                  <h4 className="text-base sm:text-lg font-bold text-ink mb-3 pb-3 border-b border-line-subtle">
                    Technologies Applied
                  </h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {techStack.map((t) => (
                      <TechBadge key={t.name} name={t.name} icon={t.icon} />
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Metrics (if provided) */}
              {project?.performance?.length > 0 && (
                <div className="rounded-2xl border border-line-subtle bg-surface-card/70 p-5 sm:p-6 backdrop-blur-sm">
                  <h4 className="text-base sm:text-lg font-bold text-ink mb-3 pb-3 border-b border-line-subtle">
                    Impact &amp; Benchmarks
                  </h4>
                  <div className="space-y-3 sm:space-y-4">
                    {project.performance.map((m, idx) => (
                      <MetricBar key={idx} label={m.label} value={m.value} width={m.width} />
                    ))}
                  </div>
                </div>
              )}

              {/* Conversion CTA Card */}
              <div className="rounded-2xl border border-line-strong bg-gradient-to-b from-surface-card via-surface-elevated to-surface-card p-6 text-center shadow-lg">
                <h4 className="text-base sm:text-lg font-bold text-ink mb-2">
                  Interested in Similar Architecture?
                </h4>
                <p className="text-xs sm:text-sm text-ink-secondary mb-5 leading-relaxed">
                  Let's discuss how we can build a scalable, high-performance solution tailored to your goals.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-brand-cyan to-brand-blue text-surface-void hover:opacity-95 shadow-glow-cyan transition-all"
                  aria-label="Contact me about this project"
                >
                  <span>Start Discussion</span>
                  <ChevronRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
});

ProjectDetailsPage.displayName = 'ProjectDetailsPage';
export default ProjectDetailsPage;
