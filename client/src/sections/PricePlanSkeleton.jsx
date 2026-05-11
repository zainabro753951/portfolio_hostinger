// PricePlanSkeleton.jsx
import { motion } from 'motion/react';
import { useRef } from 'react';

const Shimmer = ({ className = '' }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>
);

const PricePlanSkeleton = () => {
  const pricingRef = useRef(null);

  return (
    <section ref={pricingRef} className="py-24 relative overflow-hidden">
      {/* Background Elements - Same as original */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Section Header Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Badge Placeholder */}
          <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-4">
            <Shimmer className="w-24 h-4 rounded-full bg-white/5" />
          </div>

          {/* Title Placeholder */}
          <div className="flex justify-center mb-6">
            <Shimmer className="w-64 sm:w-80 lg:w-96 h-10 sm:h-12 lg:h-14 rounded-lg bg-white/10" />
          </div>

          {/* Description Placeholder */}
          <div className="max-w-2xl mx-auto space-y-2">
            <Shimmer className="w-full h-4 rounded bg-white/5" />
            <Shimmer className="w-4/5 h-4 rounded bg-white/5 mx-auto" />
          </div>
        </motion.div>

        {/* Pricing Cards Grid - Same structure */}
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {[0, 1, 2].map((index) => (
            <div key={index} className={`relative ${index === 1 ? 'md:scale-105 z-10' : ''}`}>
              <div
                className={`relative p-8 rounded-3xl h-full ${
                  index === 1
                    ? 'bg-white/10 backdrop-blur-xl border-2 border-purple-500/50'
                    : 'bg-white/5 backdrop-blur-md border border-white/10'
                }`}
              >
                {/* Featured Badge Placeholder */}
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500/50 to-blue-500/50">
                    <Shimmer className="w-20 h-4 rounded-full bg-white/10" />
                  </div>
                )}

                {/* Plan Name Placeholder */}
                <Shimmer className="w-32 h-6 rounded bg-white/10 mb-2" />

                {/* Description Placeholder */}
                <Shimmer className="w-full h-4 rounded bg-white/5 mb-6" />

                {/* Price Placeholder */}
                <div className="flex items-baseline gap-2 mb-8">
                  <Shimmer className="w-16 h-12 rounded bg-white/10" />
                  <Shimmer className="w-12 h-4 rounded bg-white/5" />
                </div>

                {/* Features List Placeholder */}
                <ul className="space-y-4 mb-8">
                  {[0, 1, 2, 3, 4].map((fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3">
                      {/* Check Icon Placeholder */}
                      <div
                        className={`w-5 h-5 rounded-full flex-shrink-0 ${
                          index === 1 ? 'bg-purple-500/30' : 'bg-blue-500/30'
                        }`}
                      />
                      <Shimmer className="w-3/4 h-4 rounded bg-white/5" />
                    </li>
                  ))}
                </ul>

                {/* CTA Button Placeholder */}
                <div
                  className={`w-full py-4 rounded-xl ${
                    index === 1
                      ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30'
                      : 'bg-white/10'
                  }`}
                >
                  <Shimmer className="w-24 h-5 rounded mx-auto bg-white/10" />
                </div>

                {/* Glow Effect Placeholder for Featured */}
                {index === 1 && (
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-30 blur-xl -z-10" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Shimmer Animation Style */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.8s infinite;
        }
      `}</style>
    </section>
  );
};

export default PricePlanSkeleton;
