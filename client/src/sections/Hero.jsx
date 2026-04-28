import { useRef, useMemo, useCallback, memo } from "react";
import { gsap } from "gsap";
import { motion } from "motion/react";
import { ArrowDown, Sparkles } from "lucide-react";
import heroImage from "../assets/images/hero-portrait.jpg";
import { useGSAP } from "@gsap/react";
import { useSelector, shallowEqual } from "react-redux";
import LazyImage from "../components/LazyImage";

gsap.registerPlugin(useGSAP);

// 🎯 Keywords for highlighting
const HIGHLIGHT_KEYWORDS = [
  { word: "Developer", className: "text-neon-blue" },
  { word: "Designer", className: "text-neon-purple" },
  { word: "Engineer", className: "text-neon-cyan" },
];

// 🎯 Stats fallback
const DEFAULT_STATS = [
  { value: "5", label: "Years Experience" },
  { value: "5+", label: "Projects Completed" },
  { value: "5", label: "Happy Clients" },
];

const Hero = memo(({ about }) => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const headingRef = useRef(null);
  const mouseTimeoutRef = useRef(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;

  const { testimonials } = useSelector(
    (state) => state.testimonial,
    shallowEqual,
  );

  // 🛡️ Safe image URL construction
  const imageUrl = useMemo(() => {
    if (!about?.aboutImage?.url) return null;

    const url = about.aboutImage.url.trim();
    // If already absolute URL, use as-is
    if (/^https?:\/\//i.test(url)) return url;
    // Otherwise prepend backend URL
    if (backendUrl) {
      const base = backendUrl.replace(/\/+$/, "");
      const path = url.replace(/^\/+/, "");
      return `${base}/${path}`;
    }
    return url;
  }, [about?.aboutImage?.url, backendUrl]);

  // 🎯 Heading text with safe fallback
  const headingText = useMemo(() => {
    const firstName =
      about?.fullName?.split(" ")[0]?.toUpperCase() || "DEVELOPER";
    return `HI, I'M ${firstName}`;
  }, [about?.fullName]);

  // 🎨 GSAP Animations
  useGSAP(
    () => {
      if (!about) return;

      const chars = headingRef.current?.querySelectorAll(".char");
      if (chars?.length) {
        gsap.fromTo(
          chars,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.05,
            ease: "power4.out",
            delay: 0.3,
          },
        );
      }

      gsap.fromTo(
        ".hero-subheading",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.6 },
      );

      gsap.fromTo(
        ".hero-description",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.8 },
      );

      gsap.fromTo(
        imageRef.current,
        { rotateY: 90, opacity: 0, scale: 0.8 },
        {
          rotateY: 0,
          opacity: 1,
          scale: 1,
          duration: 1.5,
          delay: 0.4,
          ease: "power3.out",
        },
      );

      // Ambient animations
      gsap.to(".gradient-orb", {
        scale: 1.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    {
      scope: heroRef,
      dependencies: [about],
    },
  );

  // 🎯 Text highlighting
  const highlightText = useCallback((text) => {
    if (!text) return text;

    let parts = [text];
    HIGHLIGHT_KEYWORDS.forEach(({ word, className }) => {
      parts = parts.flatMap((part) => {
        if (typeof part !== "string") return [part];
        return part.split(new RegExp(`(${word})`, "gi")).map((chunk, idx) => {
          if (chunk.toLowerCase() === word.toLowerCase()) {
            return (
              <span key={`${word}-${idx}`} className={className}>
                {chunk}
              </span>
            );
          }
          return chunk;
        });
      });
    });
    return parts;
  }, []);

  // 🖱️ Mouse move tilt effect with throttling
  const handleMouseMove = useCallback((e) => {
    if (!imageRef.current) return;

    if (mouseTimeoutRef.current) return;

    mouseTimeoutRef.current = requestAnimationFrame(() => {
      const rect = imageRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

      gsap.to(imageRef.current, {
        rotateY: x * 15,
        rotateX: -y * 15,
        duration: 0.5,
        ease: "power2.out",
      });

      mouseTimeoutRef.current = null;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (mouseTimeoutRef.current) {
      cancelAnimationFrame(mouseTimeoutRef.current);
      mouseTimeoutRef.current = null;
    }
    if (!imageRef.current) return;

    gsap.to(imageRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  }, []);

  // 🎯 Memoized stats
  const stats = useMemo(
    () => [
      {
        value: about?.experience || DEFAULT_STATS[0].value,
        label: DEFAULT_STATS[0].label,
      },
      {
        value:
          about?.projectCounts?.publishedProjects || DEFAULT_STATS[1].value,
        label: DEFAULT_STATS[1].label,
      },
      {
        value: testimonials?.length || DEFAULT_STATS[2].value,
        label: DEFAULT_STATS[2].label,
      },
    ],
    [
      about?.experience,
      about?.projectCounts?.publishedProjects,
      testimonials?.length,
    ],
  );

  // 🎯 Render heading characters
  const renderHeadingChars = useMemo(() => {
    return headingText.split("").map((char, index) => {
      const isHighlight = index > 6;
      return (
        <span
          key={`char-${index}`}
          className="char inline-block"
          style={{
            color:
              char === " "
                ? "transparent"
                : isHighlight
                  ? "#00d4ff"
                  : "#ffffff",
            textShadow: isHighlight
              ? "0 0 30px rgba(0, 212, 255, 0.5)"
              : "none",
            willChange: "transform, opacity",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      );
    });
  }, [headingText]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-mesh"
    >
      {/* 🌌 Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="gradient-orb absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/30 rounded-full blur-[100px]" />
        <div className="gradient-orb absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/30 rounded-full blur-[100px]" />
        <div className="gradient-orb absolute top-1/2 left-1/2 w-64 h-64 bg-neon-cyan/20 rounded-full blur-[80px]" />
      </div>

      {/* ✨ Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-neon-cyan rounded-full animate-float"
            style={{
              left: `${(i * 7.3) % 100}%`,
              top: `${(i * 13.7) % 100}%`,
              opacity: 0.2 + (i % 3) * 0.15,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 4)}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* 📝 Text Content */}
          <div className="text-center lg:text-left z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
            >
              <Sparkles size={16} className="text-neon-cyan" />
              <span className="text-sm text-gray-300">
                {about?.successNote || "Available for work"}
              </span>
            </motion.div>

            {/* Heading */}
            <h1
              ref={headingRef}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold mb-6 overflow-hidden"
            >
              {renderHeadingChars}
            </h1>

            {/* Subheading */}
            <p className="hero-subheading text-xl sm:text-2xl text-gray-400 mb-4 font-light">
              {highlightText(about?.shortRole) || "Full Stack Developer"}
            </p>

            {/* Description */}
            <p className="hero-description text-gray-500 max-w-lg mx-auto lg:mx-0 mb-10">
              {about?.shortDesc ||
                "I craft digital experiences that merge art with functionality. Specializing in modern web development and stunning UI/UX design."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Explore My Work
                  <ArrowDown
                    size={18}
                    className="group-hover:translate-y-1 transition-transform"
                  />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-cyan"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full glass text-white font-semibold border border-white/10 hover:border-neon-cyan/50 transition-colors"
              >
                Contact Me
              </motion.button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 justify-center lg:justify-start">
              {stats.map((stat, index) => (
                <div key={`stat-${index}`} className="text-center">
                  <div className="text-2xl sm:text-3xl font-display font-bold text-neon-cyan">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 🖼️ Image Section */}
          <div
            className="relative z-10 perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              ref={imageRef}
              className="relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan rounded-3xl opacity-30 blur-2xl pointer-events-none" />

              {/* Image Container */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10">
                <LazyImage
                  src={imageUrl}
                  alt={`${about?.fullName || "Developer"} Portrait`}
                  fallback={heroImage}
                  animation="flip"
                  duration={1.2}
                  delay={0.4}
                  eager={true}
                  crossOrigin={true}
                  className="relative rounded-3xl overflow-hidden"
                  objectFit="cover"
                  placeholderColor="#0a0a0f"
                  onLoad={() =>
                    console.log("✅ Hero image loaded successfully")
                  }
                  onError={(e) => {
                    console.error("❌ Hero image failed:", e);
                    // Force fallback on error
                    if (imageRef.current) {
                      gsap.to(imageRef.current, { opacity: 1, duration: 0.3 });
                    }
                  }}
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-void/50 to-transparent pointer-events-none" />
              </div>

              {/* Floating Card - Expert */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute -left-8 bottom-20 glass rounded-2xl p-4 border border-white/10 hidden lg:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-blue to-neon-cyan flex items-center justify-center">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Expert</div>
                    <div className="text-gray-400 text-sm">UI/UX Designer</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card - Satisfaction */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.4 }}
                className="absolute -right-4 top-20 glass rounded-2xl p-4 border border-white/10 hidden lg:block"
              >
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-neon-purple">
                    100%
                  </div>
                  <div className="text-gray-400 text-sm">Satisfaction</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-void to-transparent pointer-events-none" />

      {/* 💫 CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </section>
  );
});

Hero.displayName = "Hero";

export default Hero;
