import { useRef, useState, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "motion/react";
import {
  ExternalLink,
  Github,
  ArrowRight,
  X,
  Code,
  Palette,
  Zap,
  Layers,
  Figma,
  Play,
} from "lucide-react";

import project1 from "../assets/images/project-1.jpg";
import project2 from "../assets/images/project-2.jpg";
import project3 from "../assets/images/project-3.jpg";
import project4 from "../assets/images/project-4.jpg";

gsap.registerPlugin(ScrollTrigger);

// ✅ Optimized: Static data moved outside component
const PROJECTS_DATA = [
  {
    id: 1,
    title: "Ethereal Visions",
    category: "web",
    description:
      "A stunning 3D visualization platform showcasing abstract art with immersive interactions and WebGL effects.",
    longDescription:
      "Ethereal Visions is a cutting-edge 3D art platform that pushes the boundaries of web-based visualization. Built with React Three Fiber and custom shaders, it delivers an immersive gallery experience.",
    image: project1,
    tags: ["React", "Three.js", "GSAP", "WebGL"],
    link: "#",
    github: "#",
    icon: Code,
    color: "from-blue-500 to-cyan-400",
    stats: { views: "12K+", likes: "850" },
  },
  {
    id: 2,
    title: "Neon Dreams",
    category: "design",
    description:
      "Complete brand identity and visual design system for a futuristic AI startup.",
    longDescription:
      "A comprehensive brand identity project including logo design, color systems, typography, and motion guidelines for an emerging AI technology company.",
    image: project2,
    tags: ["Figma", "Illustrator", "After Effects", "Brand Strategy"],
    link: "#",
    github: "#",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    stats: { views: "8K+", likes: "620" },
  },
  {
    id: 3,
    title: "Cyber Portal",
    category: "web",
    description:
      "High-performance analytics dashboard with real-time data visualization.",
    longDescription:
      "Enterprise-grade dashboard handling millions of data points with sub-second latency. Features custom D3.js visualizations and WebSocket real-time updates.",
    image: project3,
    tags: ["Next.js", "TypeScript", "D3.js", "PostgreSQL"],
    link: "#",
    github: "#",
    icon: Layers,
    color: "from-cyan-400 to-blue-500",
    stats: { views: "15K+", likes: "920" },
  },
  {
    id: 4,
    title: "Crystal Flow",
    category: "motion",
    description:
      "Premium motion graphics package for luxury product launch campaign.",
    longDescription:
      "Award-winning motion graphics campaign featuring fluid simulations, particle effects, and cinematic color grading for a flagship product launch.",
    image: project4,
    tags: ["After Effects", "Cinema 4D", "Lottie", "Houdini"],
    link: "#",
    github: "#",
    icon: Play,
    color: "from-orange-400 to-pink-500",
    stats: { views: "25K+", likes: "1.2K" },
  },
];

const FILTERS = [
  { key: "all", label: "All Projects", icon: Layers },
  { key: "web", label: "Web Dev", icon: Code },
  { key: "design", label: "Design", icon: Figma },
  { key: "motion", label: "Motion", icon: Play },
];

// ✅ Optimized: Separate component for project card to prevent re-renders
const ProjectCard = ({ project, index, onSelect }) => {
  const cardRef = useRef(null);

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -12, transition: { duration: 0.3 } }}
      onClick={() => onSelect(project)}
      className="group relative cursor-pointer"
    >
      <div className="relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10">
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-80" />
          
          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-purple-500/20 backdrop-blur-[2px]"
          />

          {/* Stats Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10"
          >
            <span className="text-xs text-white font-medium">{project.stats.views} views</span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className={`w-10 h-10 rounded-xl bg-gradient-to-r ${project.color} flex items-center justify-center shadow-lg`}
            >
              <project.icon size={20} className="text-white" />
            </motion.div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {project.category}
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
            {project.title}
          </h3>
          
          <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag, tIndex) => (
              <motion.span
                key={tIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + tIndex * 0.05 }}
                className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-sm text-xs text-gray-300 border border-white/5"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-cyan-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <span>Explore Project</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight size={16} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// ✅ Optimized: Modal component separated
const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        className="absolute inset-0 bg-gray-950/90"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-gray-900/80 border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/10"
        >
          <X size={24} />
        </motion.button>

        {/* Hero Image */}
        <div className="relative aspect-video">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          
          {/* Floating Stats */}
          <div className="absolute bottom-4 left-8 flex gap-4">
            <div className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <span className="text-white font-semibold">{project.stats.views}</span>
              <span className="text-gray-400 text-sm ml-1">views</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <span className="text-white font-semibold">{project.stats.likes}</span>
              <span className="text-gray-400 text-sm ml-1">likes</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${project.color} flex items-center justify-center shadow-lg`}>
              <project.icon size={32} className="text-white" />
            </div>
            <div>
              <span className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                {project.category}
              </span>
              <h2 className="text-3xl font-bold text-white">{project.title}</h2>
            </div>
          </div>

          <p className="text-gray-300 mb-6 leading-relaxed text-lg">
            {project.longDescription}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="px-4 py-2 rounded-full bg-white/10 text-sm text-gray-300 border border-white/10"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <motion.a
              href={project.link}
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg"
            >
              <ExternalLink size={20} />
              <span>Live Demo</span>
            </motion.a>

            <motion.a
              href={project.github}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 text-white font-semibold border border-white/20 backdrop-blur-sm"
            >
              <Github size={20} />
              <span>Source Code</span>
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Projects = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Optimized: useMemo for filtered projects
  const filteredProjects = useMemo(() => {
    if (filter === "all") return PROJECTS_DATA;
    return PROJECTS_DATA.filter((p) => p.category === filter);
  }, [filter]);

  // ✅ Optimized: GSAP with proper cleanup
  useRef(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ✅ Optimized: Filter change handler with loading state
  const handleFilterChange = useCallback((newFilter) => {
    if (newFilter === filter) return;
    setIsLoading(true);
    setFilter(newFilter);
    setTimeout(() => setIsLoading(false), 300);
  }, [filter]);

  return (
    <LazyMotion features={domAnimation}>
      <div ref={containerRef} className="bg-gray-900 min-h-screen pt-24">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <motion.span
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-cyan-400 text-sm font-medium mb-6 border border-white/10"
              >
                Portfolio
              </motion.span>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white">
                Featured{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Projects
                </span>
              </h1>
              
              <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                A curated collection of my recent work showcasing web development, 
                UI/UX design, and motion graphics projects.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section ref={headerRef} className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                        : "bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20 backdrop-blur-sm"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{f.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activeFilter"
                        className="ml-1 w-2 h-2 rounded-full bg-white"
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Loading State */}
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
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Projects Grid */}
            <AnimatePresence mode="popLayout">
              {!isLoading && (
                <motion.div
                  layout
                  className="grid md:grid-cols-2 gap-8"
                >
                  {filteredProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                      onSelect={setSelectedProject}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            <AnimatePresence>
              {!isLoading && filteredProjects.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20"
                >
                  <p className="text-gray-400 text-lg">No projects found in this category.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20" />
          <div className="absolute inset-0 backdrop-blur-3xl" />

          <div className="max-w-4xl mx-auto px-6 lg:px-8 relative text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Have a Project in{" "}
                <span className="text-cyan-400">Mind?</span>
              </h2>
              <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                Let's collaborate and create something amazing together. I'm
                always excited to work on new challenges.
              </p>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(34, 211, 238, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-full bg-white text-gray-900 font-bold text-lg relative overflow-hidden group"
              >
                <span className="relative z-10">Start a Project</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
};

export default Projects;