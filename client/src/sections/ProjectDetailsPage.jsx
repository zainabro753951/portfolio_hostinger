// ============================================================================
// ProjectDetailsPage.jsx
// ============================================================================
// Professional project details page matching the portfolio's exact color scheme:
// Primary: #02d3fe (Cyan) | Secondary: #4e90e1 (Blue) | Accent: #9a5cb7 (Purple)
// Background: #0a0a0f | Glass morphism | GSAP + Framer Motion animations
// ============================================================================

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
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { projectFindBySlug } from '../features/projectSlice';

// ── Register GSAP Plugins ──────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger, useGSAP);

// ═══════════════════════════════════════════════════════════════════════════
// 📦 RICH CONTENT PARSER
// Parses backend richText and splits it into cards based on <h2> tags
// ═══════════════════════════════════════════════════════════════════════════
const parseRichContent = (html) => {
  if (!html) return [];

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
};

// ═══════════════════════════════════════════════════════════════════════════
// 🧩 RICH CONTENT SECTION CARD
// ═══════════════════════════════════════════════════════════════════════════
const RichContentCard = ({ section, index }) => {
  const icons = [Sparkles, Palette, Code2, Zap, Globe, Target, Layers, Award];
  const Icon = icons[index % icons.length];

  return (
    <GlassCard className="detail-card p-8">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(2, 211, 254, 0.15)' }}
        >
          <Icon size={20} style={{ color: THEME.cyan }} />
        </span>
        {section.title}
      </h3>
      <div
        className="rich-output prose prose-invert max-w-none text-left"
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    </GlassCard>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 🏗️ MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const ProjectDetailsPage = memo(() => {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const heroImageRef = useRef(null);
  const mouseTimeoutRef = useRef(null);

  const [project, setProject] = useState({});
  const [projectData, setProjectData] = useState({ name: '', suffix: '', title: '' });

  const dispatch = useDispatch();
  const { project: projectDB, isLoading } = useSelector((state) => state.projects);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;

  const { slug } = useParams();

  useEffect(() => {
    if (slug && !isLoading) {
      dispatch(projectFindBySlug(slug));
    }
  }, [slug, dispatch]);

  useEffect(() => {
    if (!projectDB) return;

    const updatedProject = {
      ...projectDB,
      techStack: projectDB?.techStack?.map((tech) => {
        const matchedTech = techIcons.find(
          (item) => item.type.toLowerCase() === tech.name.toLowerCase().replace(/\s+/g, '-')
        );
        return { ...tech, icon: matchedTech?.icon || Code2 };
      }),
    };

    setProject(updatedProject);

    // Parse title for Hero
    const [projectName, projectTitle] = projectDB?.title?.split('–') || [];
    setProjectData({
      name: projectName?.trim() || projectName?.trim(),
      suffix: projectName?.split('.')[1] || '',
      title: projectTitle?.trim() || '',
    });
  }, [projectDB, techIcons]);

  // ── GSAP Animations ──────────────────────────────────────────────────────
  useGSAP(
    () => {
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
    { scope: pageRef }
  );

  // ── Mouse Move Tilt Effect ───────────────────────────────────────────────
  const handleMouseMove = useCallback((e) => {
    if (!heroImageRef.current) return;
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
  }, []);

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
    document.getElementById('details')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Parse content into sections
  const contentSections = parseRichContent(project?.content);

  return (
    <div
      ref={pageRef}
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
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center pt-24 pb-12"
        style={{ zIndex: 2 }}
      >
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <motion.a
            href="/projects"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8 group transition-colors duration-300 hover:text-white cursor-pointer"
            style={{ color: THEME.textGray }}
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span className="text-sm font-medium">Back to Projects</span>
          </motion.a>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="hero-content">
              {project?.featured && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                  style={{
                    background: 'rgba(2, 211, 254, 0.1)',
                    border: '1px solid rgba(2, 211, 254, 0.2)',
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: THEME.cyan }}
                  />
                  <span className="text-sm font-medium" style={{ color: THEME.cyan }}>
                    Featured Project
                  </span>
                </motion.div>
              )}

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span style={{ color: THEME.textWhite }}>{projectData.name}</span>
                <GradientText>{projectData.suffix}</GradientText>
              </h1>

              <p className="text-xl mb-4 font-light" style={{ color: THEME.textGray }}>
                {projectData.title}
              </p>
              <p className="max-w-lg leading-relaxed mb-8" style={{ color: THEME.textGrayDark }}>
                {project?.shortDesc}
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {project?.techStack?.slice(0, 4).map((t) => (
                  <TechBadge key={t.name} name={t.name} icon={t.icon} />
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <PrimaryButton href={project.liveDemo} icon={ExternalLink}>
                  Live Preview
                </PrimaryButton>
                <OutlineButton onClick={scrollToDetails} icon={ArrowDown}>
                  View Details
                </OutlineButton>
              </div>
            </div>

            <div
              className="relative perspective-1000 hidden lg:block"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div ref={heroImageRef} className="relative preserve-3d">
                <div
                  className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl pointer-events-none"
                  style={{ background: THEME.gradientPrimary }}
                />
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                    border: `1px solid rgba(2, 211, 254, 0.1)`,
                  }}
                >
                  <div
                    className="w-full aspect-video flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #0a0a1a, #0d1b2a, #1a0a2e)' }}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={`${backendUrl}${project?.heroImage?.url}`}
                      alt={project?.title}
                    />
                  </div>
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(2, 211, 254, 0.05), transparent)',
                    }}
                  />
                </div>
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          onClick={scrollToDetails}
        >
          <span className="text-xs uppercase tracking-widest" style={{ color: THEME.textGrayDark }}>
            Scroll
          </span>
          <div
            className="w-6 h-10 border-2 rounded-full flex justify-center pt-2"
            style={{ borderColor: '#4b5563' }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 rounded-full"
              style={{ background: THEME.cyan }}
            />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📋 PROJECT DETAILS SECTION                                         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="details" className="relative py-24" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-sm font-medium uppercase tracking-widest"
              style={{ color: THEME.cyan }}
            >
              Project Details
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mt-4 mb-6"
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
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Dynamic Sections */}
            <div className="lg:col-span-2 space-y-8">
              {contentSections.map((section, index) => (
                <RichContentCard key={index} section={section} index={index} />
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="detail-card lg:sticky lg:top-24">
                <GlassCard className="p-6" hover={false}>
                  <h4 className="text-lg font-bold mb-4" style={{ color: THEME.textWhite }}>
                    Project Info
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Client', value: project.client },
                      { label: 'Role', value: project.role },
                      { label: 'Duration', value: project.duration },
                      {
                        label: 'Status',
                        value: (
                          <span
                            className="inline-flex items-center gap-2"
                            style={{ color: THEME.cyan }}
                          >
                            <span
                              className="w-2 h-2 rounded-full animate-pulse"
                              style={{ background: THEME.cyan }}
                            />
                            {project.status}
                          </span>
                        ),
                      },
                      {
                        label: 'Website',
                        value: (
                          <a
                            href={project.liveDemo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors duration-300 hover:text-white"
                            style={{ color: THEME.cyan }}
                          >
                            {project.liveDemo ? 'Visit Site ↗' : 'N/A'}
                          </a>
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
                        <span className="text-sm" style={{ color: THEME.textGrayDark }}>
                          {info.label}
                        </span>
                        <span className="text-sm font-medium" style={{ color: THEME.textWhite }}>
                          {info.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>

              <GlassCard className="detail-card p-6">
                <h4 className="text-lg font-bold mb-4" style={{ color: THEME.textWhite }}>
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project?.techStack?.map((t) => (
                    <TechBadge key={t.name} name={t.name} icon={t.icon} />
                  ))}
                </div>
              </GlassCard>

              {/* Performance & Impact (Conditional) */}
              {project?.performance?.length > 0 && (
                <GlassCard className="detail-card p-6">
                  <h4 className="text-lg font-bold mb-4" style={{ color: THEME.textWhite }}>
                    Performance
                  </h4>
                  <div className="space-y-4">
                    {project.performance.map((m, idx) => (
                      <MetricBar key={idx} label={m.label} value={m.value} width={m.width} />
                    ))}
                  </div>
                </GlassCard>
              )}

              <div
                className="rounded-2xl p-6 detail-card"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(2, 211, 254, 0.15), rgba(154, 92, 183, 0.15))',
                  border: '1px solid rgba(2, 211, 254, 0.2)',
                }}
              >
                <h4 className="text-lg font-bold mb-2" style={{ color: THEME.textWhite }}>
                  Interested in this project?
                </h4>
                <p className="text-sm mb-4" style={{ color: THEME.textGray }}>
                  Let's discuss how I can bring similar results to your next project.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: THEME.gradientPrimary }}
                >
                  Get in Touch
                  <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

ProjectDetailsPage.displayName = 'ProjectDetailsPage';
export default ProjectDetailsPage;
