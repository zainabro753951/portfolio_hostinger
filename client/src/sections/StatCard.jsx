import { GlassCard, THEME } from '@/components/UI';
import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

const StatCard = ({ stat, index }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const targetStr = String(stat.value || '0');
          const target = parseFloat(targetStr) || 0;
          const hasDecimal = targetStr.includes('.');
          const duration = 2000; // 2 seconds duration

          let startTime = null;

          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease out cubic for smooth deceleration
            const ease = 1 - Math.pow(1 - progress, 3);
            const currentValue = target * ease;

            if (isMountedRef.current) {
              if (hasDecimal) {
                setCount(parseFloat(currentValue.toFixed(1)));
              } else {
                setCount(Math.floor(currentValue));
              }
            }

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              if (isMountedRef.current) setCount(target);
            }
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [stat.value]);

  const displayValue = useMemo(() => {
    const isRate = stat.label?.includes('Rate');
    const targetStr = String(stat.value || '0');
    const hasDecimal = targetStr.includes('.');

    if (isRate) return `${Math.round(count)}%`;
    if (hasDecimal) return count;
    return `${Math.round(count)}+`;
  }, [count, stat.value, stat.label]);

  // Accessibility: Reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      ref={nodeRef}
      initial={
        prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }
      }
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: prefersReducedMotion ? 0 : index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={prefersReducedMotion ? undefined : { y: -5 }}
      className="relative group h-full"
      role="group"
      aria-labelledby={`stat-label-${index}`}
      aria-describedby={`stat-value-${index}`}
    >
      <GlassCard
        className="p-4 sm:p-6 text-center h-full flex flex-col items-center justify-center"
        hover={false}
      >
        <motion.div
          whileHover={prefersReducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg"
          style={{ background: stat.gradient || THEME.gradientPrimary }}
          aria-hidden="true"
        >
          {stat.icon && <stat.icon size={18} className="sm:w-5 sm:h-5 text-white" />}
        </motion.div>

        <div
          id={`stat-value-${index}`}
          className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 truncate w-full"
          style={{ color: THEME.textWhite }}
        >
          {displayValue}
        </div>
        <div
          id={`stat-label-${index}`}
          className="text-[10px] sm:text-xs font-medium leading-tight px-1 truncate w-full"
          style={{ color: THEME.textGray }}
        >
          {stat.label}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default StatCard;
