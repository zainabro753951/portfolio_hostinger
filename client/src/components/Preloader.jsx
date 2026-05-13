import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { memo, useEffect, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

// ─── Configuration ─────────────────────────────────────────────
const PRELOADER_CONFIG = {
  // How long to show the preloader minimum (ms)
  minDisplayTime: 2500,
  // Stagger between letter reveals
  letterStagger: 0.06,
  // Colors matching your portfolio theme
  colors: {
    bg: '#0a0a0f',
    neonBlue: '#00d4ff',
    neonPurple: '#a855f7',
    neonCyan: '#22d3ee',
    textPrimary: '#ffffff',
    textMuted: '#6b7280',
  },
};

// ─── Animated Counter Component ────────────────────────────────
const Counter = memo(({ progress }) => {
  const counterRef = useRef(null);

  useEffect(() => {
    if (counterRef.current) {
      counterRef.current.textContent = Math.round(progress);
    }
  }, [progress]);

  return (
    <span
      ref={counterRef}
      className="font-display font-bold tabular-nums"
      style={{
        fontSize: '72px',
        lineHeight: 1,
        background: `linear-gradient(135deg, ${PRELOADER_CONFIG.colors.neonBlue}, ${PRELOADER_CONFIG.colors.neonPurple})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      0
    </span>
  );
});

Counter.displayName = 'Counter';

// ─── Main Preloader Component ──────────────────────────────────
const Preloader = memo(({ onComplete }) => {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressFillRef = useRef(null);
  const logoRef = useRef(null);
  const lettersRef = useRef(null);
  const taglineRef = useRef(null);
  const orbsRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(Date.now());
  const isCompleteRef = useRef(false);

  // ─── Progress Simulation ─────────────────────────────────────
  useEffect(() => {
    let animationFrame;
    const simulateProgress = () => {
      setProgress((prev) => {
        if (prev >= 100) {
          isCompleteRef.current = true;
          return 100;
        }
        // Non-linear progress for realism
        const increment = prev < 70 ? Math.random() * 2 + 0.5 : Math.random() * 0.8 + 0.2;
        return Math.min(prev + increment, 100);
      });
      animationFrame = requestAnimationFrame(simulateProgress);
    };

    animationFrame = requestAnimationFrame(simulateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // ─── GSAP Entrance & Exit Animations ─────────────────────────
  useGSAP(
    () => {
      const tl = gsap.timeline();

      // ── Entrance Phase ──
      tl.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      )
        .fromTo(
          logoRef.current,
          { scale: 0.5, opacity: 0, rotateY: -90 },
          { scale: 1, opacity: 1, rotateY: 0, duration: 1, ease: 'back.out(1.7)' },
          '-=0.2'
        )
        .fromTo(
          lettersRef.current?.children || [],
          { y: 80, opacity: 0, rotateX: -90 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            stagger: PRELOADER_CONFIG.letterStagger,
            ease: 'power4.out',
          },
          '-=0.6'
        )
        .fromTo(
          progressBarRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo(
          taglineRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.3'
        );

      // ── Ambient Orb Animations ──
      gsap.to('.preloader-orb', {
        scale: 1.3,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.5,
      });

      // ── Progress Bar Fill Animation ──
      gsap.to(progressFillRef.current, {
        scaleX: 1,
        duration: PRELOADER_CONFIG.minDisplayTime / 1000,
        ease: 'power2.inOut',
      });
    },
    { scope: containerRef }
  );

  // ─── Exit Animation Handler ──────────────────────────────────
  useEffect(() => {
    if (progress >= 100 && !isCompleteRef.current) return;

    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, PRELOADER_CONFIG.minDisplayTime - elapsed);

    const exitTimeout = setTimeout(() => {
      const exitTl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });

      exitTl
        .to(lettersRef.current?.children || [], {
          y: -60,
          opacity: 0,
          rotateX: 90,
          duration: 0.5,
          stagger: 0.03,
          ease: 'power3.in',
        })
        .to(
          logoRef.current,
          { scale: 0.8, opacity: 0, duration: 0.4, ease: 'power2.in' },
          '-=0.3'
        )
        .to(
          contentRef.current,
          { opacity: 0, y: -30, duration: 0.4, ease: 'power2.in' },
          '-=0.2'
        )
        .to(
          overlayRef.current,
          {
            clipPath: 'circle(0% at 50% 50%)',
            duration: 1.2,
            ease: 'power4.inOut',
          },
          '-=0.2'
        )
        .to(
          containerRef.current,
          { opacity: 0, duration: 0.3, pointerEvents: 'none' },
          '-=0.3'
        );
    }, remaining);

    return () => clearTimeout(exitTimeout);
  }, [progress, onComplete]);

  // ─── Brand Name Letters ──────────────────────────────────────
  const brandName = 'PORTFOLIO';
  const renderLetters = brandName.split('').map((char, index) => (
    <span
      key={`letter-${index}`}
      className="inline-block"
      style={{
        fontSize: 'clamp(48px, 10vw, 96px)',
        fontWeight: 800,
        letterSpacing: '0.05em',
        color: index % 2 === 0 ? PRELOADER_CONFIG.colors.neonBlue : PRELOADER_CONFIG.colors.neonPurple,
        textShadow: `0 0 40px ${index % 2 === 0 ? 'rgba(0, 212, 255, 0.4)' : 'rgba(168, 85, 247, 0.4)'}`,
        willChange: 'transform, opacity',
        transformStyle: 'preserve-3d',
      }}
    >
      {char}
    </span>
  ));

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        backgroundColor: PRELOADER_CONFIG.colors.bg,
        perspective: '1000px',
      }}
    >
      {/* ── Animated Background Orbs ── */}
      <div ref={orbsRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="preloader-orb absolute top-1/4 left-1/4 rounded-full blur-[120px]"
          style={{
            width: '400px',
            height: '400px',
            background: `radial-gradient(circle, ${PRELOADER_CONFIG.colors.neonBlue}30, transparent)`,
          }}
        />
        <div
          className="preloader-orb absolute bottom-1/4 right-1/4 rounded-full blur-[120px]"
          style={{
            width: '350px',
            height: '350px',
            background: `radial-gradient(circle, ${PRELOADER_CONFIG.colors.neonPurple}25, transparent)`,
          }}
        />
        <div
          className="preloader-orb absolute top-1/2 left-1/2 rounded-full blur-[100px]"
          style={{
            width: '300px',
            height: '300px',
            background: `radial-gradient(circle, ${PRELOADER_CONFIG.colors.neonCyan}20, transparent)`,
          }}
        />
      </div>

      {/* ── Grid Pattern Overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(${PRELOADER_CONFIG.colors.neonBlue}20 1px, transparent 1px),
            linear-gradient(90deg, ${PRELOADER_CONFIG.colors.neonBlue}20 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* ── Main Content ── */}
      <div ref={contentRef} className="relative z-10 flex flex-col items-center">
        {/* Logo Icon */}
        <div
          ref={logoRef}
          className="mb-8 relative"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center relative"
            style={{
              background: `linear-gradient(135deg, ${PRELOADER_CONFIG.colors.neonBlue}, ${PRELOADER_CONFIG.colors.neonPurple})`,
              boxShadow: `0 0 60px ${PRELOADER_CONFIG.colors.neonBlue}40, inset 0 0 20px rgba(255,255,255,0.1)`,
            }}
          >
            <span
              className="text-white font-bold text-3xl"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
            >
              P
            </span>
            {/* Glow ring */}
            <div
              className="absolute -inset-2 rounded-2xl opacity-50"
              style={{
                background: `linear-gradient(135deg, ${PRELOADER_CONFIG.colors.neonBlue}, ${PRELOADER_CONFIG.colors.neonPurple})`,
                filter: 'blur(15px)',
                zIndex: -1,
              }}
            />
          </div>
        </div>

        {/* Brand Name */}
        <div
          ref={lettersRef}
          className="mb-6 flex"
          style={{ perspective: '800px' }}
        >
          {renderLetters}
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="text-sm tracking-[0.3em] uppercase mb-12"
          style={{ color: PRELOADER_CONFIG.colors.textMuted }}
        >
          Crafting Digital Experiences
        </p>

        {/* Progress Section */}
        <div className="flex flex-col items-center gap-4">
          {/* Counter */}
          <div className="flex items-baseline gap-1">
            <Counter progress={progress} />
            <span
              className="text-2xl font-light"
              style={{ color: PRELOADER_CONFIG.colors.textMuted }}
            >
              %
            </span>
          </div>

          {/* Progress Bar */}
          <div
            ref={progressBarRef}
            className="relative w-64 h-1 rounded-full overflow-hidden"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              transformOrigin: 'left center',
            }}
          >
            <div
              ref={progressFillRef}
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: '100%',
                background: `linear-gradient(90deg, ${PRELOADER_CONFIG.colors.neonBlue}, ${PRELOADER_CONFIG.colors.neonPurple}, ${PRELOADER_CONFIG.colors.neonCyan})`,
                boxShadow: `0 0 20px ${PRELOADER_CONFIG.colors.neonBlue}60`,
                transformOrigin: 'left center',
                transform: 'scaleX(0)',
              }}
            />
            {/* Shimmer effect */}
            <div
              className="absolute inset-y-0 w-20 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                animation: 'shimmer 1.5s infinite',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Exit Overlay (Circle Reveal) ── */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: PRELOADER_CONFIG.colors.bg,
          clipPath: 'circle(150% at 50% 50%)',
        }}
      />

      {/* ── CSS Animations ── */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
});

Preloader.displayName = 'Preloader';

export default Preloader;
