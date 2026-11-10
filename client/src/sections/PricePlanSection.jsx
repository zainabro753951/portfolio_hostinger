import { fadeUp, useMotionPrefs, VIEWPORT_ONCE } from '@/lib/motion';
import { motion } from 'motion/react';
import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PricePlanSkeleton from './PricePlanSkeleton';
import PricingCard from './PricingCard';

const PricePlanSection = memo(() => {
  const { plans, isLoading } = useSelector((state) => state.plan);
  const { reduced, isMobile } = useMotionPrefs();

  const prefs = useMemo(() => ({ reduced, isMobile }), [reduced, isMobile]);
  const headerVariants = useMemo(() => fadeUp(prefs, 0), [prefs]);

  // SEO Structured Data
  const structuredData = useMemo(() => {
    if (!plans || plans.length === 0 || typeof window === 'undefined') return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Pricing Plans',
      description: 'Flexible pricing plans for development and design services.',
      itemListElement: plans.map((plan, index) => ({
        '@type': 'Offer',
        position: index + 1,
        name: plan.planName || 'Pricing Plan',
        description: plan.shortDesc || `Plan ${index + 1} for services`,
        price: plan.price || 0,
        priceCurrency: plan.currency || 'USD',
        availability: 'https://schema.org/InStock',
        url: `${window.location.origin}/contact?plan=${encodeURIComponent(plan.planName || '')}`,
      })),
    };
  }, [plans]);

  if (isLoading) {
    return <PricePlanSkeleton />;
  }

  return (
    <section
      id="pricing"
      className="relative py-16 sm:py-20 lg:py-28 overflow-hidden isolate"
      aria-label="Pricing Plans"
    >
      {/* Structured Data for SEO */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Subtle background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(45%_50%_at_50%_60%,rgb(var(--brand-purple)/0.06),transparent)]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <motion.div
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="mb-4 inline-block"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-purple border border-brand-purple/20 bg-brand-purple/10">
              Investment Options
            </span>
          </motion.div>

          <motion.h2
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink mb-4 sm:mb-5"
          >
            Transparent{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">
              Pricing Plans
            </span>
          </motion.h2>

          <motion.p
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="text-sm sm:text-base leading-relaxed text-ink-secondary"
          >
            Predictable, value-driven rates designed to match your project scale from MVP launch to
            enterprise growth.
          </motion.p>
        </div>

        {/* Pricing Cards Grid */}
        <PricingCard plans={plans} />
      </div>
    </section>
  );
});

PricePlanSection.displayName = 'PricePlanSection';
export default PricePlanSection;
