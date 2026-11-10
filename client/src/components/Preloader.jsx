import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMotionPrefs } from '@/lib/motion';

const PRELOADER_CONFIG = {
  minDisplayTime: 1800,
  colors: {
    bg: '#0A0A0F',
    cyan: '#02D3FE',
    blue: '#4E90E1',
    purple: '#9A5CB7',
  },
};

const Preloader = memo(({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const startTimeRef = useRef(Date.now());
  const completedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const { prefersReducedMotion } = useMotionPrefs();

  // Progress simulation
  useEffect(() => {
    if (prefersReducedMotion) {
      setProgress(100);
      return;
    }

    let isActive = true;
    const simulate = () => {
      if (!isActive) return;
      setProgress((prev) => {
        if (prev >= 100) return 100;
        const increment = prev < 65 ? Math.random() * 3 + 1 : Math.random() * 1.5 + 0.4;
        return Math.min(prev + increment, 100);
      });
      animationFrameRef.current = requestAnimationFrame(simulate);
    };

    animationFrameRef.current = requestAnimationFrame(simulate);
    return () => {
      isActive = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [prefersReducedMotion]);

  // Handle completion and trigger exit
  const handleExit = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    if (prefersReducedMotion) {
      if (onComplete) onComplete();
      return;
    }

    setIsExiting(true);
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 600);
    return () => clearTimeout(timer);
  }, [onComplete, prefersReducedMotion]);

  useEffect(() => {
    if (progress < 100 || completedRef.current) return;

    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, PRELOADER_CONFIG.minDisplayTime - elapsed);

    const timer = setTimeout(() => {
      handleExit();
    }, remaining);

    return () => clearTimeout(timer);
  }, [progress, handleExit]);

  const brandName = 'PORTFOLIO';

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-surface-base text-ink overflow-hidden"
          role="status"
          aria-label="Loading application"
          aria-live="polite"
        >
          {/* Ambient radial glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-brand-cyan/15 blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-brand-purple/15 blur-[120px]" />
          </div>

          {/* Main loader card */}
          <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-md text-center">
            {/* Logo Badge */}
            <motion.div
              initial={prefersReducedMotion ? false : { scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-brand-cyan to-brand-blue flex items-center justify-center text-surface-base font-heading font-extrabold text-2xl shadow-glow-cyan mb-6"
            >
              <span>P</span>
            </motion.div>

            {/* Brand Title */}
            <div className="flex items-center justify-center gap-1 mb-2">
              {brandName.split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.4 }}
                  className="font-heading font-extrabold text-2xl sm:text-3xl tracking-widest bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple bg-clip-text text-transparent"
                >
                  {char}
                </motion.span>
              ))}
            </div>

            <p className="text-xs font-mono tracking-widest text-ink-muted uppercase mb-8">
              Architecting Digital Experiences
            </p>

            {/* Percentage & Progress Bar */}
            <div className="w-full max-w-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-ink-secondary">
                <span className="text-brand-cyan">INITIALIZING</span>
                <span>{Math.round(progress)}%</span>
              </div>

              <div
                className="w-full h-1.5 rounded-full bg-surface-card border border-line-subtle overflow-hidden relative"
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple shadow-glow-cyan"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Preloader.displayName = 'Preloader';
export default Preloader;
