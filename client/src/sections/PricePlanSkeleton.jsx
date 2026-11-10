import { memo } from 'react';

const Shimmer = ({ className = '' }) => (
  <div
    className={`relative overflow-hidden rounded-lg bg-surface-soft/60 border border-line-subtle ${className}`}
    aria-hidden="true"
  >
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'linear-gradient(90deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.01) 100%)',
        backgroundSize: '200% 100%',
        animation: 'pricing-skeleton-shimmer 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      }}
    />
  </div>
);

const PricePlanSkeleton = memo(() => {
  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28"
      role="status"
      aria-label="Loading pricing plans"
    >
      {/* Header Skeleton */}
      <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto space-y-4">
        <div className="flex justify-center">
          <Shimmer className="h-7 w-32 rounded-full" />
        </div>
        <Shimmer className="h-10 sm:h-12 w-3/4 mx-auto rounded-xl" />
        <Shimmer className="h-4 w-5/6 mx-auto rounded-md" />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {[0, 1, 2].map((index) => {
          const isFeatured = index === 1;
          return (
            <div
              key={`price-skel-${index}`}
              className={`relative rounded-2xl border p-6 sm:p-8 flex flex-col justify-between bg-surface-card/60 ${
                isFeatured ? 'border-brand-cyan/30 md:-mt-3 md:mb-3 shadow-glow-cyan' : 'border-line-subtle'
              }`}
            >
              {isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Shimmer className="h-7 w-28 rounded-full" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Shimmer className="h-11 w-11 rounded-xl" />
                  <div className="space-y-1.5 flex-1">
                    <Shimmer className="h-5 w-24" />
                    <Shimmer className="h-3 w-36" />
                  </div>
                </div>

                <div className="mb-6 space-y-2">
                  <div className="flex items-baseline gap-2">
                    <Shimmer className="h-10 w-20" />
                    <Shimmer className="h-4 w-12" />
                  </div>
                </div>

                <div className="h-px w-full bg-line-subtle mb-6" />

                <div className="space-y-3 mb-8">
                  {[0, 1, 2, 3].map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <Shimmer className="h-4 w-4 rounded-md shrink-0" />
                      <Shimmer className="h-3.5 w-4/5" />
                    </div>
                  ))}
                </div>
              </div>

              <Shimmer className="h-12 w-full rounded-xl" />
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes pricing-skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
});

PricePlanSkeleton.displayName = 'PricePlanSkeleton';
export default PricePlanSkeleton;
