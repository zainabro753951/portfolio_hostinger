import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMotionPrefs } from '@/lib/motion';

const StatCard = ({ stat, index = 0 }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const isMountedRef = useRef(true);
  const { prefersReducedMotion } = useMotionPrefs();

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
          const targetStr = String(stat?.value || '0');
          const target = parseFloat(targetStr) || 0;
          const hasDecimal = targetStr.includes('.');
          const duration = 1800;

          if (prefersReducedMotion) {
            if (isMountedRef.current) setCount(target);
            observer.disconnect();
            return;
          }

          let startTime = null;
          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
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
            } else if (isMountedRef.current) {
              setCount(target);
            }
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stat?.value, prefersReducedMotion]);

  const displayValue = useMemo(() => {
    const targetStr = String(stat?.value || '0');
    const isRate = stat?.label?.toLowerCase().includes('rate') || targetStr.includes('%');
    const hasDecimal = targetStr.includes('.');

    if (isRate) return `${Math.round(count)}%`;
    if (hasDecimal) return count;
    return `${Math.round(count)}+`;
  }, [count, stat?.value, stat?.label]);

  const Icon = stat?.icon;

  return (
    <motion.div
      ref={nodeRef}
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ delay: prefersReducedMotion ? 0 : index * 0.08, duration: 0.45 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      className="relative group h-full"
      role="group"
      aria-labelledby={`stat-label-${index}`}
      aria-describedby={`stat-value-${index}`}
    >
      <div className="relative h-full flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-surface-card/90 backdrop-blur-md border border-line-subtle transition-all duration-300 group-hover:border-brand-cyan/40 group-hover:shadow-glow-cyan overflow-hidden text-center">
        {/* Subtle accent highlight on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-b from-brand-cyan/5 via-transparent to-transparent"
          aria-hidden="true"
        />

        {/* Icon */}
        <div
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg relative z-10 transition-transform duration-300 group-hover:scale-110 border"
          style={{
            background:
              stat?.gradient ||
              'linear-gradient(135deg, rgba(2,211,254,0.15), rgba(78,144,225,0.15))',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
          aria-hidden="true"
        >
          {Icon && <Icon size={20} className="text-white drop-shadow" />}
        </div>

        {/* Value */}
        <div
          id={`stat-value-${index}`}
          className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-1 truncate w-full relative z-10"
        >
          {displayValue}
        </div>

        {/* Label */}
        <div
          id={`stat-label-${index}`}
          className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-ink-secondary px-1 truncate w-full relative z-10"
        >
          {stat?.label}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
