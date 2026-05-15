import { GlassCard, THEME } from '@/components/UI';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

// ✅ Optimized: Stats counter component with animation
const StatCard = ({ stat, index }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const target = parseFloat(stat.value) || 0;
          const isPercent = stat.label.includes('Rate');
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current * 10) / 10); // Keep decimals for 5.0
            }
          }, duration / steps);

          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => observer.disconnect();
  }, [stat.value, stat.label]);

  const displayValue = stat.label.includes('Rate')
    ? `${Math.round(count)}%`
    : stat.value.includes('.')
      ? `${count}`
      : `${Math.round(count)}+`;

  return (
    <motion.div
      ref={nodeRef}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="relative group"
    >
      <GlassCard className="p-6 text-center" hover={false}>
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          style={{ background: stat.gradient }}
        >
          <stat.icon size={20} className="text-white" />
        </motion.div>

        <div className="text-3xl font-bold mb-2" style={{ color: THEME.textWhite }}>
          {displayValue}
        </div>
        <div className="text-xs font-medium" style={{ color: THEME.textGray }}>
          {stat.label}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default StatCard;
