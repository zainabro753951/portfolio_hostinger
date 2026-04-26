import React, { memo, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Code2,
  Layers,
  Zap,
  Globe,
  Star,
  ChevronRight,
  Sparkles,
  Download,
  ExternalLink,
  Calendar,
  Shield,
  Cpu,
  FileText,
  Search,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { marked } from "marked";
import { safeParse } from "@/Utils/Utils";
import DOMPurify from "dompurify";

gsap.registerPlugin(useGSAP);

marked.setOptions({
  gfm: true, // GitHub flavored markdown (lists, tables, etc)
  breaks: true, // \n ko <br> banata hai
  headerIds: true, // headings ko id deta hai
  mangle: false, // emails ko encode nahi karta
});

// ── Reusable Glass Card ────────────────────────────────────────────
const GlassCard = memo(({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={`glass rounded-2xl border border-white/10 backdrop-blur-xl ${className}`}
  >
    {children}
  </motion.div>
));

// ── Animated Section Heading ─────────────────────────────────────
const SectionHeading = memo(({ icon: Icon, title, subtitle }) => (
  <div className="mb-8">
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-3 mb-3"
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/20">
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
        {title}
      </h2>
    </motion.div>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-slate-400 ml-13 pl-13"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
));

// ── Tech Stack Chip ──────────────────────────────────────────────
const TechChip = memo(({ tech, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    whileHover={{ scale: 1.05, y: -2 }}
    className="group relative px-4 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
  >
    <span className="text-sm font-medium text-slate-300 group-hover:text-cyan-400 transition-colors">
      {tech}
    </span>
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
  </motion.div>
));

// ── Feature Card ─────────────────────────────────────────────────
const FeatureCard = memo(({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group relative p-5 rounded-xl bg-slate-800/30 border border-white/5 hover:border-cyan-500/20 hover:bg-slate-800/50 transition-all duration-300"
  >
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-all">
        <CheckCircle2 className="w-5 h-5 text-cyan-400" />
      </div>
      <div>
        <h3 className="text-white font-semibold mb-1 group-hover:text-cyan-400 transition-colors">
          {feature}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          Professionally implemented with industry best practices and modern
          standards.
        </p>
      </div>
    </div>
  </motion.div>
));

// ── Process Step ───────────────────────────────────────────────────
const ProcessStep = memo(({ number, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="relative flex  gap-6"
  >
    {/* Timeline Line */}
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">
        {number}
      </div>
      <div className="w-0.5 flex-1 bg-gradient-to-b from-cyan-500/50 to-transparent mt-2" />
    </div>

    <div className="pb-12 w-full">
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  </motion.div>
));

// ── Main Service Detail Page ─────────────────────────────────────
const ServiceDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const { services } = useSelector((state) => state.service);

  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;

  // Scroll progress for parallax
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Find service from Redux or fetch
  useEffect(() => {
    const found = services?.find((s) => s.slug === slug);
    if (found) {
      setService(found);
      setLoading(false);
    } else {
      // Fetch from API if not in Redux
      fetchService();
    }
  }, [slug, services]);

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/services/${slug}`);
      const data = await res.json();
      if (data.success) {
        setService(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch service:", err);
    } finally {
      setLoading(false);
    }
  };

  const techStack = safeParse(service?.techStack);
  const features = safeParse(service?.features);
  const seoKeywords = safeParse(service?.seoKeywords);
  const serviceImage = safeParse(service?.serviceImage);
  // render function
  const renderMarkdown = (text) => {
    const raw = (text || "").replace(/\\n/g, "\n"); // 👈 FIX
    const html = marked(raw);
    return DOMPurify.sanitize(html);
  };

  // GSAP Animations
  useGSAP(
    () => {
      if (!service || loading) return;

      // Hero text reveal
      const chars = heroRef.current?.querySelectorAll(".hero-char");
      if (chars?.length) {
        gsap.fromTo(
          chars,
          { y: 100, opacity: 0, rotateX: -40 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.2,
            stagger: 0.03,
            ease: "power4.out",
            delay: 0.2,
          },
        );
      }

      // Floating elements
      gsap.to(".float-orb", {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5,
      });
    },
    { scope: pageRef, dependencies: [service, loading] },
  );

  const handleGetStarted = () => {
    // Service data ko URL params mein encode karke bhejo
    const params = new URLSearchParams({
      service: slug,
      subject: `Interested in ${service.title} Service`,
      message: `Hi, I'm interested in your "${service.title}" service.

I came across this service on your website and would like to discuss my project requirements with you.

Here are some details about what I'm looking for:
• Project Type: ${service.category}
• Preferred Tech Stack: ${techStack?.slice(0, 3).join(", ") || "Open to suggestions"}
• Expected Timeline: ${service.deliveryTime || "Flexible"}

Please let me know the next steps to get started. I'm looking forward to hearing from you!

Best regards,`,
    });
    navigate(`/contact?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-mesh">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent"
        />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-mesh">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Service Not Found</h2>
          <button
            onClick={() => navigate("/services")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const headingText = service.title.toUpperCase();

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen gradient-mesh overflow-x-hidden"
    >
      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════ */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[85vh] flex items-center justify-center pt-20"
      >
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="float-orb absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px]" />
          <div className="float-orb absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px]" />
          <div className="float-orb absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-purple-500/15 rounded-full blur-[80px]" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate("/services")}
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">All Services</span>
          </motion.button>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text Content */}
            <div ref={heroRef} className="relative z-10">
              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 border border-cyan-500/20"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-cyan-400 font-medium">
                  {service.category}
                </span>
              </motion.div>

              {/* Main Heading with Char Animation */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold mb-6 overflow-hidden leading-tight">
                {headingText.split("").map((char, index) => (
                  <span
                    key={index}
                    className="hero-char inline-block"
                    style={{
                      color: char === " " ? "transparent" : "#ffffff",
                      textShadow: "0 0 40px rgba(0, 212, 255, 0.3)",
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </h1>

              {/* Short Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg sm:text-xl text-slate-400 mb-8 leading-relaxed max-w-xl"
              >
                {service.shortDescription}
              </motion.p>

              {/* Meta Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4 mb-10"
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-white/10">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-slate-300">
                    {service.deliveryTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-white/10">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-slate-300">
                    Premium Quality
                  </span>
                </div>
                {service.isFeatured && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm text-amber-400 font-medium">
                      Featured
                    </span>
                  </div>
                )}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGetStarted}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Get Started
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-xl glass text-white font-semibold border border-white/10 hover:border-cyan-500/30 transition-colors flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Call
                </motion.button>
              </motion.div>
            </div>

            {/* Right: Service Image with 3D Tilt */}
            <motion.div
              initial={{ opacity: 0, rotateY: 30 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "power3.out" }}
              className="relative perspective-1000 hidden lg:block"
            >
              {/* Glow Behind Image */}
              <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl opacity-60" />

              {/* Image Container */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src={
                    serviceImage?.url
                      ? `${backendUrl}${serviceImage.url}`
                      : "/default-service.jpg"
                  }
                  alt={service.title}
                  className="w-full h-[500px] object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                {/* Floating Stats Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute bottom-6 left-6 right-6 glass rounded-xl p-4 border border-white/10"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">
                        Starting from
                      </div>
                      <div className="text-2xl font-bold text-white">
                        Custom Quote
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-cyan-400">
                      <Sparkles className="w-5 h-5" />
                      <span className="text-sm font-medium">Best Value</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-6 -right-6 w-24 h-24 border border-cyan-500/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-8 -left-8 w-32 h-32 border border-purple-500/20 rounded-full"
              />
            </motion.div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════
          CONTENT SECTIONS
          ═══════════════════════════════════════════════════════════ */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 space-y-24">
        {/* ── Full Description ───────────────────────────────────── */}
        <section>
          <SectionHeading
            icon={FileText}
            title="Service Overview"
            subtitle="Detailed breakdown of what you get"
          />
          <GlassCard>
            <div className="p-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(service?.fullDescription),
                }}
                className="text-slate-300 leading-[1.8] text-lg"
              ></div>
            </div>
          </GlassCard>
        </section>

        {/* ── Tech Stack ─────────────────────────────────────────── */}
        <section>
          <SectionHeading
            icon={Code2}
            title="Technology Stack"
            subtitle="Tools and frameworks we use"
          />
          <div className="flex flex-wrap gap-3">
            {techStack?.map((tech, index) => (
              <TechChip key={index} tech={tech} index={index} />
            ))}
          </div>
        </section>

        {/* ── Features Grid ──────────────────────────────────────── */}
        <section>
          <SectionHeading
            icon={CheckCircle2}
            title="Key Features"
            subtitle="What makes this service stand out"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features?.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </section>

        {/* ── Process Timeline ─────────────────────────────────── */}
        <section>
          <SectionHeading
            icon={Cpu}
            title="Development Process"
            subtitle="How we deliver your project"
          />
          <GlassCard className="p-8">
            <div className="space-y-2">
              <ProcessStep
                number="1"
                title="Discovery & Planning"
                description="We analyze your requirements, define project scope, and create a detailed roadmap with milestones and deliverables."
                delay={0}
              />
              <ProcessStep
                number="2"
                title="Design & Prototyping"
                description="Wireframe and interactive prototypes are created for your approval before development begins."
                delay={0.1}
              />
              <ProcessStep
                number="3"
                title="Development"
                description="Agile sprints with weekly demos. Clean, documented code with version control and CI/CD integration."
                delay={0.2}
              />
              <ProcessStep
                number="4"
                title="Testing & QA"
                description="Comprehensive testing including unit tests, integration tests, and user acceptance testing."
                delay={0.3}
              />
              <ProcessStep
                number="5"
                title="Deployment & Support"
                description="Production deployment with monitoring setup and 30 days of free support and bug fixes."
                delay={0.4}
              />
            </div>
          </GlassCard>
        </section>

        {/* ── CTA Section ────────────────────────────────────────── */}
        <section className="relative">
          <GlassCard className="overflow-hidden">
            <div className="relative p-8 sm:p-12 text-center">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10" />

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/25"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>

                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display">
                  Ready to Get Started?
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto mb-8 text-lg">
                  Let's discuss your project requirements and create something
                  amazing together.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow flex items-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Start Project
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-xl glass text-white font-semibold border border-white/10 hover:border-cyan-500/30 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Proposal
                  </motion.button>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER SPACING
          ═══════════════════════════════════════════════════════════ */}
      <div className="h-20" />
    </div>
  );
};

export default memo(ServiceDetailPage);
