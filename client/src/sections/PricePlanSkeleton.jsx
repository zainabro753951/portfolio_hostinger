import { THEME } from '@/components/UI';
import { motion } from 'framer-motion';
import { useRef } from 'react';

// Reusable Shimmer Block
const Shimmer = ({ className = '' }) => (
  <div className={`relative overflow-hidden rounded ${className}`}>
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.5s infinite linear',
      }}
    />
  </div>
);

const PricePlanSkeleton = () => {
  const pricingRef = useRef(null);

  return (
    <section
      ref={pricingRef}
      className="relative py-24 overflow-hidden"
      style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
    >
      {/* 🌌 BACKGROUND LAYERS */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse"
          style={{ background: 'rgba(2, 211, 254, 0.12)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: '1s', background: 'rgba(78, 144, 225, 0.12)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: '2s', background: 'rgba(154, 92, 183, 0.1)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative" style={{ zIndex: 2 }}>
        {/* Section Header Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Badge Skeleton */}
          <div
            className="inline-block px-4 py-2 rounded-full mb-4"
            style={{
              background: THEME.bgCard,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${THEME.border}`,
            }}
          >
            <Shimmer className="w-24 h-4 bg-white/5" />
          </div>

          {/* Title Skeleton */}
          <div className="flex justify-center mb-6">
            <Shimmer className="w-64 sm:w-80 lg:w-96 h-12 rounded-lg bg-white/10" />
          </div>

          {/* Description Skeleton */}
          <div className="max-w-2xl mx-auto space-y-2">
            <Shimmer className="w-full h-4 bg-white/5" />
            <Shimmer className="w-4/5 h-4 bg-white/5 mx-auto" />
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {[0, 1, 2].map((index) => (
            <div key={index} className={`relative ${index === 1 ? 'md:-mt-4 md:mb-4' : ''}`}>
              <div
                className="relative p-8 rounded-2xl h-full overflow-hidden"
                style={{
                  background: THEME.bgCard,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${THEME.border}`,
                  boxShadow:
                    index === 1 ? '0 0 40px rgba(2, 211, 254, 0.1)' : '0 10px 30px rgba(0,0,0,0.3)',
                }}
              >
                {/* Popular Badge Skeleton */}
                {index === 1 && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full"
                    style={{ background: THEME.gradientCyanBlue }}
                  >
                    <Shimmer className="w-20 h-4 bg-white/10 rounded" />
                  </div>
                )}

                {/* Plan Name Skeleton */}
                <Shimmer className="w-32 h-6 bg-white/10 mb-2" />

                {/* Description Skeleton */}
                <Shimmer className="w-full h-4 bg-white/5 mb-6" />

                {/* Price Skeleton */}
                <div className="flex items-baseline gap-2 mb-8">
                  <Shimmer className="w-12 h-12 bg-white/10" />
                  <Shimmer className="w-24 h-12 bg-white/10" />
                  <Shimmer className="w-12 h-4 bg-white/5 mt-2" />
                </div>

                {/* Divider Skeleton */}
                <div className="w-full h-px mb-8" style={{ background: THEME.border }} />

                {/* Features List Skeleton */}
                <ul className="space-y-4 mb-8">
                  {[0, 1, 2, 3, 4].map((fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded flex-shrink-0"
                        style={{
                          background:
                            index === 1 ? 'rgba(2, 211, 254, 0.15)' : 'rgba(78, 144, 225, 0.15)',
                        }}
                      />
                      <Shimmer className="flex-1 h-4 bg-white/5" />
                    </li>
                  ))}
                </ul>

                {/* CTA Button Skeleton */}
                <div
                  className="w-full py-4 rounded-lg flex items-center justify-center"
                  style={{
                    background: index === 1 ? THEME.gradientPrimary : 'rgba(255,255,255,0.05)',
                  }}
                >
                  <Shimmer className="w-24 h-5 bg-white/10 rounded" />
                </div>

                {/* Glow for Featured */}
                {index === 1 && (
                  <div
                    className="absolute inset-0 rounded-2xl opacity-30 blur-2xl pointer-events-none"
                    style={{ background: THEME.gradientPrimary }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Shimmer Animation */}
      <style>{`
        @keyframes skeleton-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
};

export default PricePlanSkeleton;
