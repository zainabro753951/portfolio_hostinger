import { memo } from 'react';

const ShimmerBar = ({ className = '', style = {} }) => (
  <div
    className={`relative overflow-hidden rounded-xl bg-surface-card border border-line-subtle ${className}`}
    style={style}
    aria-hidden="true"
  >
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'linear-gradient(90deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.01) 100%)',
        backgroundSize: '200% 100%',
        animation: 'hero-skeleton-shimmer 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      }}
    />
  </div>
);

const HeroSkeleton = memo(() => {
  return (
    <div
      className="relative isolate overflow-clip"
      role="status"
      aria-label="Loading hero section"
    >
      {/* Background radial glows matching Hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_20%_0%,rgb(var(--brand-blue)/0.08),transparent),radial-gradient(40%_50%_at_90%_90%,rgb(var(--brand-purple)/0.06),transparent)]"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:min-h-svh lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-28 lg:pt-36">
        {/* Text column */}
        <div className="order-2 w-full text-center lg:order-1 lg:text-left space-y-4">
          {/* Badge Skeleton */}
          <div className="flex justify-center lg:justify-start">
            <ShimmerBar className="h-9 w-48 rounded-full" />
          </div>

          {/* Heading Skeleton */}
          <div className="space-y-3 py-2">
            <ShimmerBar className="h-10 sm:h-14 lg:h-16 w-3/4 mx-auto lg:mx-0 rounded-2xl" />
            <ShimmerBar className="h-10 sm:h-14 lg:h-16 w-1/2 mx-auto lg:mx-0 rounded-2xl" />
          </div>

          {/* Role Skeleton */}
          <ShimmerBar className="h-6 sm:h-7 w-2/5 mx-auto lg:mx-0 rounded-lg" />

          {/* Description Skeleton */}
          <div className="space-y-2.5 max-w-lg mx-auto lg:mx-0 pt-2 pb-4">
            <ShimmerBar className="h-4 w-full rounded-md" />
            <ShimmerBar className="h-4 w-5/6 mx-auto lg:mx-0 rounded-md" />
            <ShimmerBar className="h-4 w-3/5 mx-auto lg:mx-0 rounded-md" />
          </div>

          {/* CTA Buttons Skeleton */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2 pb-6">
            <ShimmerBar className="h-12 w-full sm:w-44 rounded-xl" />
            <ShimmerBar className="h-12 w-full sm:w-36 rounded-xl" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 border-t border-line-subtle max-w-md mx-auto lg:mx-0">
            {[0, 1, 2].map((i) => (
              <div key={i} className="text-center space-y-2">
                <ShimmerBar className="h-7 w-14 sm:w-16 mx-auto rounded-lg" />
                <ShimmerBar className="h-3 w-16 sm:w-20 mx-auto rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Portrait column */}
        <div className="order-1 lg:order-2">
          <div className="relative mx-auto w-full max-w-[11rem] sm:max-w-[16rem] md:max-w-xs lg:max-w-none">
            {/* Soft glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(closest-side,rgb(var(--brand-cyan)/0.12),rgb(var(--brand-purple)/0.06)_60%,transparent)]"
            />

            {/* Portrait box */}
            <div className="relative aspect-[4/4] w-full overflow-hidden rounded-2xl border border-line-strong bg-surface-card shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
              <ShimmerBar className="h-full w-full rounded-none border-none" />
            </div>

            {/* Desktop floating card skeleton 1 */}
            <div className="hidden lg:block absolute -left-8 bottom-12 w-52">
              <ShimmerBar className="h-16 w-full rounded-2xl" />
            </div>

            {/* Desktop floating card skeleton 2 */}
            <div className="hidden lg:block absolute -right-6 top-16 w-36">
              <ShimmerBar className="h-20 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hero-skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
});

HeroSkeleton.displayName = 'HeroSkeleton';
export default HeroSkeleton;
