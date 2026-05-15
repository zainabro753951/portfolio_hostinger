// ============================================================================
// 📁 PricePlanSection.jsx
// ============================================================================
import { GradientText, THEME } from '@/components/UI';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import PricingCard from './PricingCard';

const PricePlanSection = () => {
  const containerRef = useRef(null);
  const { plans, isLoading } = useSelector((state) => state.plan);

  if (isLoading) {
    return (
      <section
        className="relative py-24 overflow-hidden flex items-center justify-center min-h-[50vh]"
        style={{ backgroundColor: THEME.bg }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-2 border-t-transparent"
          style={{ borderColor: THEME.cyan }}
        />
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative py-24 overflow-hidden"
      style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
    >
      {/* ✨ Particles */}
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

      <div className="max-w-7xl mx-auto px-6 relative" style={{ zIndex: 2 }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{
              background: 'rgba(154, 92, 183, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(154, 92, 183, 0.2)',
              color: THEME.purple,
            }}
          >
            Pricing Plans
          </span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            style={{ color: THEME.textWhite }}
          >
            Choose Your <GradientText>Plan</GradientText>
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: THEME.textGray }}>
            Flexible pricing options designed to fit your needs and budget. Get started today!
          </p>
        </motion.div>

        <PricingCard plans={plans} />
      </div>
    </section>
  );
};

export default PricePlanSection;
