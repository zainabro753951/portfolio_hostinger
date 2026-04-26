import React, { useState, useEffect, useMemo, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Blue/Cyan Color Palette
const COLORS = {
  primary: "#00d4ff", // Bright Cyan
  secondary: "#0099cc", // Deep Blue-Cyan
  accent: "#00f5ff", // Neon Cyan
  dark: "#0a0e27", // Deep Navy
  darker: "#050817", // Almost Black
  glow: "rgba(0, 212, 255, 0.5)",
  glowSoft: "rgba(0, 212, 255, 0.2)",
};

const MESSAGES = [
  "Initializing System...",
  "Loading Modules...",
  "Optimizing Performance...",
  "Fetching Resources...",
  "Almost Ready...",
  "Launching Experience...",
];

// SVG Animated Loader Component
const FuturisticLoader = memo(() => {
  return (
    <div className="relative w-[200px] h-[200px]">
      {/* Outer Ring */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 200 200"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke={COLORS.glowSoft}
          strokeWidth="2"
          strokeDasharray="10 5"
        />
      </motion.svg>

      {/* Middle Ring - Counter Rotate */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 200 200"
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke={COLORS.primary}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="60 40"
          filter="url(#glow)"
        />
      </motion.svg>

      {/* Inner Ring */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 200 200"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx="100"
          cy="100"
          r="50"
          fill="none"
          stroke={COLORS.accent}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="30 20"
          filter="url(#glow)"
        />
      </motion.svg>

      {/* Center Core */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="w-16 h-16 rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.primary} 0%, ${COLORS.secondary} 50%, transparent 70%)`,
            boxShadow: `0 0 30px ${COLORS.glow}, 0 0 60px ${COLORS.glowSoft}`,
          }}
        />
      </motion.div>

      {/* Glow Filter Definition */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
});

FuturisticLoader.displayName = "FuturisticLoader";

// Animated Progress Bar
const ProgressBar = memo(({ progress }) => (
  <div className="w-full max-w-md mx-auto mt-8">
    <div
      className="flex justify-between text-xs mb-2 font-mono"
      style={{ color: COLORS.primary }}
    >
      <span>SYSTEM LOAD</span>
      <span>{progress}%</span>
    </div>
    <div
      className="h-1 rounded-full overflow-hidden"
      style={{ backgroundColor: "rgba(0, 212, 255, 0.1)" }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${COLORS.secondary} 0%, ${COLORS.primary} 50%, ${COLORS.accent} 100%)`,
          boxShadow: `0 0 10px ${COLORS.glow}`,
        }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  </div>
));

ProgressBar.displayName = "ProgressBar";

// Text Animation Variants
const textVariants = {
  initial: {
    opacity: 0,
    y: 20,
    filter: "blur(10px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(10px)",
    transition: {
      duration: 0.4,
      ease: "easeIn",
    },
  },
};

const ThemeReloader = memo(() => {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Message rotation timer
  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isVisible]);

  // Progress bar animation
  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(progressTimer);
  }, []);

  // Page visibility handling
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const currentMessage = useMemo(() => MESSAGES[index], [index]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at center, ${COLORS.dark} 0%, ${COLORS.darker} 100%)`,
      }}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div
          className="absolute w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(${COLORS.primary} 1px, transparent 1px),
              linear-gradient(90deg, ${COLORS.primary} 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            transform: "perspective(500px) rotateX(60deg)",
            transformOrigin: "center top",
            animation: "gridMove 20s linear infinite",
          }}
        />
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2 + "px",
            height: Math.random() * 4 + 2 + "px",
            backgroundColor: COLORS.primary,
            boxShadow: `0 0 10px ${COLORS.glow}`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        {/* Logo/Loader */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <FuturisticLoader />
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          className="text-3xl md:text-5xl font-bold mb-8 tracking-widest text-center"
          style={{
            color: COLORS.primary,
            textShadow: `0 0 20px ${COLORS.glow}, 0 0 40px ${COLORS.glowSoft}`,
            fontFamily: "monospace",
            letterSpacing: "0.2em",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          SYSTEM<span style={{ color: COLORS.accent }}>LOAD</span>
        </motion.h1>

        {/* Animated Text Messages */}
        <div
          className="relative flex items-center justify-center h-16 mb-4"
          style={{ minWidth: "300px" }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute text-center font-mono text-sm md:text-base"
              style={{
                color: COLORS.accent,
                textShadow: `0 0 10px ${COLORS.glow}`,
                letterSpacing: "0.1em",
              }}
            >
              {currentMessage}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <ProgressBar progress={progress} />

        {/* Status Indicators */}
        <div className="flex gap-4 mt-8">
          {MESSAGES.map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  i === index ? COLORS.accent : "rgba(0, 212, 255, 0.3)",
                boxShadow: i === index ? `0 0 10px ${COLORS.glow}` : "none",
              }}
              animate={{
                scale: i === index ? 1.5 : 1,
                opacity: i === index ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Technical Details */}
        <motion.div
          className="mt-12 text-xs font-mono text-center"
          style={{ color: "rgba(0, 212, 255, 0.6)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="flex gap-8 justify-center">
            <span>v2.0.4</span>
            <span>BUILD 2024</span>
            <span>SECURE</span>
          </div>
        </motion.div>
      </div>

      {/* Corner Decorations */}
      <div
        className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 opacity-50"
        style={{ borderColor: COLORS.primary }}
      />
      <div
        className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 opacity-50"
        style={{ borderColor: COLORS.primary }}
      />
      <div
        className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 opacity-50"
        style={{ borderColor: COLORS.primary }}
      />
      <div
        className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 opacity-50"
        style={{ borderColor: COLORS.primary }}
      />

      {/* Global Styles */}
      <style>{`
        @keyframes gridMove {
          0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
        }
      `}</style>
    </div>
  );
});

ThemeReloader.displayName = "ThemeReloader";

export default ThemeReloader;
