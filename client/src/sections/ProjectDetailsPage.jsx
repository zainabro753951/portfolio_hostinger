import {
  GlassCard,
  GradientText,
  MetricBar,
  OutlineButton,
  PrimaryButton,
  TechBadge,
  THEME,
} from '@/components/UI';
import { techIcons } from '@/Utils/Utils.js';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DynamicMetaUpdater from '../components/DynamicMetaUpdater';
import { projectFindBySlug } from '../features/projectSlice';
import '../richText.css';
import { formatDuration } from '../Utils/Utils';
import Particles from './Particles';

// ── Register GSAP Plugins ──────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger, useGSAP);

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
// 🧩 RICH CONTENT SECTION CARD - OVERFLOW FIXED
// ═══════════════════════════════════════════════════════════════════════════
const RichContentCard = memo(({ section, index }) => {
  const icons = [Sparkles, Palette, Code2, Zap, Globe, Target, Layers, Award];
  const Icon = icons[index % icons.length];

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <GlassCard
      className="detail-card w-full min-w-0 
                 px-3 sm:px-4 md:px-6 lg:px-8 
                 py-4 sm:py-6 md:py-8 
                 mb-4 sm:mb-6 md:mb-8"
    >
      {/* ✅ Header - No Overflow */}
      <h3
        className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 
                     flex items-start gap-2 sm:gap-3 break-words"
      >
        <span
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'rgba(2, 211, 254, 0.15)' }}
        >
          <Icon
            size={18}
            className="sm:w-5 sm:h-5 flex-shrink-0"
            style={{ color: THEME.cyan }}
            aria-hidden="true"
          />
        </span>
        <span className="leading-tight break-words overflow-wrap-anywhere">{section.title}</span>
      </h3>

      {/* ✅ Rich Content - Overflow Protected */}
      <div
        className="rich-output prose prose-invert max-w-none w-full 
                   text-left break-words overflow-hidden
                   [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
        style={{
          // ✅ Critical overflow fixes
          overflowWrap: 'break-word',
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          maxWidth: '100%',
          minWidth: 0,
          position: 'relative',
        }}
        dangerouslySetInnerHTML={{ __html: section.content }}
      />

      {/* ✅ Mobile-First CSS Overrides */}
      <style>{`
        /* Container reset */
        .rich-output {
          overflow-wrap: break-word !important;
          word-wrap: break-word !important;
          word-break: break-word !important;
          max-width: 100% !important;
          min-width: 0 !important;
          overflow-x: hidden !important;
        }

        /* All direct children */
        .rich-output > * {
          max-width: 100% !important;
          overflow-wrap: break-word !important;
          word-wrap: break-word !important;
        }

        /* Paragraphs & Lists */
        .rich-output p,
        .rich-output li,
        .rich-output span,
        .rich-output div {
          max-width: 100% !important;
          overflow-wrap: break-word !important;
          word-wrap: break-word !important;
          word-break: break-word !important;
          white-space: normal !important;
          overflow-x: hidden !important;
        }

        /* Headings */
        .rich-output h1,
        .rich-output h2,
        .rich-output h3,
        .rich-output h4,
        .rich-output h5,
        .rich-output h6 {
          max-width: 100% !important;
          overflow-wrap: break-word !important;
          word-wrap: break-word !important;
          word-break: break-word !important;
          line-height: 1.3 !important;
        }

        /* Images */
        .rich-output img {
          max-width: 100% !important;
          width: 100% !important;
          height: auto !important;
          display: block !important;
          margin: 0.75rem 0 !important;
          border-radius: 0.5rem;
        }

        /* Code blocks */
        .rich-output pre {
          max-width: 100% !important;
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch !important;
          padding: 0.75rem !important;
          font-size: 0.75rem !important;
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
        }
        .rich-output pre code {
          white-space: pre-wrap !important;
          word-break: break-word !important;
        }
        .rich-output :not(pre) > code {
          word-break: break-word !important;
          overflow-wrap: break-word !important;
          font-size: 0.875rem !important;
        }

        /* Links - Break long URLs */
        .rich-output a {
          word-break: break-all !important;
          overflow-wrap: break-word !important;
          text-decoration: none !important;
          border-bottom: 1px dashed rgba(2, 211, 254, 0.5) !important;
        }

        /* Tables */
        .rich-output table {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch !important;
          font-size: 0.75rem !important;
        }
        .rich-output th,
        .rich-output td {
          max-width: 200px !important;
          overflow-wrap: break-word !important;
          word-wrap: break-word !important;
        }

        /* Blockquotes */
        .rich-output blockquote {
          margin: 0.75rem 0 !important;
          padding: 0.5rem 0.75rem !important;
          overflow-wrap: break-word !important;
          word-wrap: break-word !important;
        }

        /* Typography sizes */
        .rich-output p,
        .rich-output li,
        .rich-output a {
          font-size: 0.875rem !important;
          line-height: 1.6 !important;
        }
        .rich-output h1 { font-size: 1.25rem !important; }
        .rich-output h2 { font-size: 1.125rem !important; }
        .rich-output h3 { font-size: 1rem !important; }

        /* Desktop */
        @media (min-width: 640px) {
          .rich-output p,
          .rich-output li,
          .rich-output a { font-size: 0.95rem !important; }
          .rich-output h1 { font-size: 1.5rem !important; }
          .rich-output h2 { font-size: 1.25rem !important; }
          .rich-output h3 { font-size: 1.125rem !important; }
        }
      `}</style>
    </GlassCard>
  );
});
RichContentCard.displayName = 'RichContentCard';

// ═══════════════════════════════════════════════════════════════════════════
// 🏗️ MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const ProjectDetailsPage = memo(() => {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const heroImageRef = useRef(null);
  const mouseTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const [project, setProject] = useState({});
  const [projectData, setProjectData] = useState({ name: '', suffix: '', title: '' });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const dispatch = useDispatch();
  const { project: projectDB, isLoading } = useSelector((state) => state.projects);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE || '';

  const { slug } = useParams();

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

  // ── GSAP Animations ──────────────────────────────────────────────────────
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const heroContent = heroRef.current?.querySelector('.hero-content');
      if (heroContent) {
        gsap.from(heroContent.children, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        });
      }

      if (heroImageRef.current) {
        gsap.from(heroImageRef.current, {
          x: 50,
          opacity: 0,
          duration: 1,
          delay: 0.3,
          ease: 'power3.out',
        });
      }

      const detailCards = document.querySelectorAll('.detail-card');
      detailCards.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
          y: 40,
          opacity: 0,
          duration: 0.6,
          delay: (index % 3) * 0.1,
          ease: 'power3.out',
        });
      });

      gsap.to('.gradient-orb', {
        scale: 1.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    },
    { scope: pageRef, dependencies: [prefersReducedMotion] }
  );

  // ── Mouse Move Tilt Effect ───────────────────────────────────────────────
  const handleMouseMove = useCallback(
    (e) => {
      if (!heroImageRef.current || prefersReducedMotion) return;
      if (mouseTimeoutRef.current) return;

      mouseTimeoutRef.current = requestAnimationFrame(() => {
        const rect = heroImageRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

        gsap.to(heroImageRef.current, {
          rotateY: x * 10,
          rotateX: -y * 10,
          duration: 0.5,
          ease: 'power2.out',
        });

        mouseTimeoutRef.current = null;
      });
    },
    [prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    if (mouseTimeoutRef.current) {
      cancelAnimationFrame(mouseTimeoutRef.current);
      mouseTimeoutRef.current = null;
    }
    if (!heroImageRef.current) return;
    gsap.to(heroImageRef.current, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' });
  }, []);

  // ── Smooth Scroll ────────────────────────────────────────────────────────
  const scrollToDetails = useCallback(() => {
    document
      .getElementById('details')
      ?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  }, [prefersReducedMotion]);

  // Parse content into sections
  const contentSections = useMemo(() => parseRichContent(project?.content), [project?.content]);

  // Structured Data for SEO
  const structuredData = useMemo(() => {
    if (!project?.title) return null;
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

  return (
    <main
      ref={pageRef}
      className="relative overflow-x-hidden"
      style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
      aria-label={`Project Details: ${projectData.name}`}
    >
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* ✅ Reusable Meta Data Updater */}
      <DynamicMetaUpdater
        title={project.seoTitle || project.title || 'Project Details'}
        description={project.metaDesc || project.shortDesc || ''}
        schemaId="project-jsonld"
        schema={structuredData}
      />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🌌 BACKGROUND LAYERS                                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <div
          className="gradient-orb absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full blur-[80px] md:blur-[120px] animate-pulse"
          style={{ background: 'rgba(2, 211, 254, 0.12)' }}
        />
        <div
          className="gradient-orb absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full blur-[80px] md:blur-[120px] animate-pulse"
          style={{ animationDelay: '1s', background: 'rgba(78, 144, 225, 0.12)' }}
        />
        <div
          className="gradient-orb absolute top-1/2 left-1/2 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full blur-[60px] md:blur-[100px] animate-pulse"
          style={{ animationDelay: '2s', background: 'rgba(154, 92, 183, 0.1)' }}
        />
      </div>

      {/* Particles */}
      <Particles />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🦸 HERO SECTION                                                    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8 md:pb-12"
        style={{ zIndex: 2 }}
      >
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 w-full">
          <motion.button
            onClick={() => navigate('/projects')}
            initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={prefersReducedMotion ? {} : { duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-4 sm:mb-8 group transition-colors duration-300 hover:text-white cursor-pointer focus:outline-none rounded p-1 -ml-1"
            style={{ color: THEME.textGray }}
            aria-label="Go back to projects"
          >
            <ArrowLeft
              size={16}
              className="sm:w-[18px] sm:h-[18px] transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden="true"
            />
            <span className="text-xs sm:text-sm font-medium">Back to Projects</span>
          </motion.button>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
            <article className="hero-content order-2 md:order-1">
              {!!project?.featured && (
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={prefersReducedMotion ? {} : { duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6"
                  style={{
                    background: 'rgba(2, 211, 254, 0.1)',
                    border: '1px solid rgba(2, 211, 254, 0.2)',
                  }}
                  role="status"
                >
                  <div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse"
                    style={{ background: THEME.cyan }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-[10px] sm:text-xs font-medium"
                    style={{ color: THEME.cyan }}
                  >
                    Featured Project
                  </span>
                </motion.div>
              )}

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 leading-[1.1] sm:leading-tight">
                <span style={{ color: THEME.textWhite }}>{projectData.name}.</span>
                <GradientText>{projectData.suffix}</GradientText>
              </h1>

              <p
                className="text-base sm:text-xl mb-2 sm:mb-4 font-light max-w-lg"
                style={{ color: THEME.textGray }}
              >
                {projectData.title}
              </p>
              <p
                className="max-w-lg leading-relaxed mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base"
                style={{ color: THEME.textGrayDark }}
              >
                {project?.shortDesc}
              </p>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 mb-4 sm:mb-6 md:mb-8">
                {techStack.slice(0, 4).map((t) => (
                  <TechBadge key={t.name} name={t.name} icon={t.icon} />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 w-full sm:w-auto">
                {project.liveDemo && (
                  <PrimaryButton
                    href={project.liveDemo}
                    icon={ExternalLink}
                    className="w-full sm:w-auto justify-center text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3"
                  >
                    Live Preview
                  </PrimaryButton>
                )}
                <OutlineButton
                  onClick={scrollToDetails}
                  icon={ArrowDown}
                  className="w-full sm:w-auto justify-center text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3"
                >
                  View Details
                </OutlineButton>
              </div>
            </article>

            <figure
              className="relative perspective-1000 hidden md:block order-1 md:order-2"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div ref={heroImageRef} className="relative preserve-3d">
                <div
                  className="absolute -inset-3 sm:-inset-4 rounded-2xl sm:rounded-3xl opacity-30 blur-2xl pointer-events-none"
                  style={{ background: THEME.gradientPrimary }}
                  aria-hidden="true"
                />
                <div
                  className="relative rounded-xl sm:rounded-2xl overflow-hidden"
                  style={{
                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                    border: `1px solid rgba(2, 211, 254, 0.1)`,
                  }}
                >
                  <div
                    className="w-full aspect-video flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #0a0a1a, #0d1b2a, #1a0a2e)' }}
                  >
                    {heroImageUrl ? (
                      <img
                        className="w-full h-full object-cover"
                        src={heroImageUrl}
                        alt={`${projectData.name} project hero image`}
                        loading="eager"
                        width="800"
                        height="450"
                      />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </div>
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(2, 211, 254, 0.05), transparent)',
                    }}
                    aria-hidden="true"
                  />
                </div>
                <div
                  className="absolute -top-3 sm:-top-4 -right-3 sm:-right-4 w-16 h-16 sm:w-24 sm:h-24 rounded-full blur-xl animate-pulse"
                  style={{ background: 'rgba(2, 211, 254, 0.2)' }}
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-3 sm:-bottom-4 -left-3 sm:-left-4 w-20 h-20 sm:w-32 sm:h-32 rounded-full blur-xl animate-pulse"
                  style={{ animationDelay: '1s', background: 'rgba(78, 144, 225, 0.2)' }}
                  aria-hidden="true"
                />
              </div>
            </figure>
          </div>
        </div>

        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1 }}
          transition={prefersReducedMotion ? {} : { delay: 1.5 }}
          className="absolute -bottom-6 sm:-bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 sm:gap-2 cursor-pointer py-2"
          onClick={scrollToDetails}
          role="button"
          aria-label="Scroll to details"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') scrollToDetails();
          }}
        >
          <span
            className="text-[10px] sm:text-xs uppercase tracking-widest"
            style={{ color: THEME.textGrayDark }}
          >
            Scroll
          </span>
          <div
            className="w-5 h-8 sm:w-6 sm:h-10 border-2 rounded-full flex justify-center pt-1 sm:pt-2"
            style={{ borderColor: '#4b5563' }}
            aria-hidden="true"
          >
            <motion.div
              animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
              transition={prefersReducedMotion ? {} : { duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 sm:w-1.5 sm:h-3 rounded-full"
              style={{ background: THEME.cyan }}
            />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📋 PROJECT DETAILS SECTION                                         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="details" className="relative py-12 sm:py-16 md:py-24" style={{ zIndex: 2 }}>
        <header className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 mb-8 sm:mb-10 md:mb-16">
          <div className="text-center">
            <motion.span
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={prefersReducedMotion ? undefined : { once: true }}
              transition={prefersReducedMotion ? {} : { duration: 0.6 }}
              className="text-xs sm:text-sm font-medium uppercase tracking-widest"
              style={{ color: THEME.cyan }}
            >
              Project Details
            </motion.span>
            <motion.h2
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={prefersReducedMotion ? undefined : { once: true }}
              transition={prefersReducedMotion ? {} : { duration: 0.6, delay: 0.1 }}
              className="text-2xl sm:text-4xl md:text-5xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6 px-2"
              style={{ color: THEME.textWhite }}
            >
              In-Depth <GradientText>Overview</GradientText>
            </motion.h2>
            <div
              className="max-w-xs mx-auto h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(2, 211, 254, 0.3), transparent)',
              }}
              aria-hidden="true"
            />
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {/* Main Content - Dynamic Sections */}
            <div className="md:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
              {contentSections.length > 0 ? (
                contentSections.map((section, index) => (
                  <RichContentCard key={index} section={section} index={index} />
                ))
              ) : (
                <GlassCard className="detail-card p-6 sm:p-8 text-center">
                  <p className="text-sm sm:text-base" style={{ color: THEME.textGray }}>
                    No detailed content available for this project.
                  </p>
                </GlassCard>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 sm:space-y-8">
              <div className="detail-card md:sticky md:top-24">
                <GlassCard className="p-4 sm:p-6" hover={false}>
                  <h4
                    className="text-base sm:text-lg font-bold mb-3 sm:mb-4"
                    style={{ color: THEME.textWhite }}
                  >
                    Project Info
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    {[
                      { label: 'Client', value: projectData?.name },
                      { label: 'Role', value: project?.category },
                      { label: 'Duration', value: formatDuration(project?.estTime) },
                      {
                        label: 'Status',
                        value: (
                          <span
                            className="inline-flex items-center gap-1.5 sm:gap-2 "
                            style={{ color: THEME.cyan }}
                          >
                            <span
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse"
                              style={{ background: THEME.cyan }}
                              aria-hidden="true"
                            />
                            {project.status || 'N/A'}
                          </span>
                        ),
                      },
                      {
                        label: 'Website',
                        value: project.liveDemo ? (
                          <a
                            href={project.liveDemo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors duration-300 hover:text-white text-xs sm:text-sm break-all lowercase"
                            style={{ color: THEME.cyan }}
                          >
                            {projectData?.name}.{projectData?.suffix}
                          </a>
                        ) : (
                          'N/A'
                        ),
                      },
                    ].map((info, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2"
                        style={{
                          borderBottom: idx < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        }}
                      >
                        <span
                          className="text-[10px] sm:text-xs "
                          style={{ color: THEME.textGrayDark }}
                        >
                          {info.label}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-right max-w-[60%] truncate capitalize">
                          {info.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>

              {techStack.length > 0 && (
                <GlassCard className="detail-card p-4 sm:p-6">
                  <h4
                    className="text-base sm:text-lg font-bold mb-3 sm:mb-4"
                    style={{ color: THEME.textWhite }}
                  >
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {techStack.map((t) => (
                      <TechBadge key={t.name} name={t.name} icon={t.icon} />
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Performance & Impact (Conditional) */}
              {project?.performance?.length > 0 && (
                <GlassCard className="detail-card p-4 sm:p-6">
                  <h4
                    className="text-base sm:text-lg font-bold mb-3 sm:mb-4"
                    style={{ color: THEME.textWhite }}
                  >
                    Performance
                  </h4>
                  <div className="space-y-3 sm:space-y-4">
                    {project.performance.map((m, idx) => (
                      <MetricBar key={idx} label={m.label} value={m.value} width={m.width} />
                    ))}
                  </div>
                </GlassCard>
              )}

              <div
                className="rounded-xl sm:rounded-2xl p-4 sm:p-6 detail-card"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(2, 211, 254, 0.15), rgba(154, 92, 183, 0.15))',
                  border: '1px solid rgba(2, 211, 254, 0.2)',
                }}
              >
                <h4
                  className="text-sm sm:text-lg font-bold mb-1 sm:mb-2"
                  style={{ color: THEME.textWhite }}
                >
                  Interested in this project?
                </h4>
                <p className="text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: THEME.textGray }}>
                  Let's discuss how I can bring similar results to your next project.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-white text-xs sm:text-base transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: THEME.gradientPrimary }}
                  aria-label="Contact me about this project"
                >
                  Get in Touch
                  <ChevronRight size={14} className="sm:w-4 sm:h-4" aria-hidden="true" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
});

ProjectDetailsPage.displayName = 'ProjectDetailsPage';
export default ProjectDetailsPage;
