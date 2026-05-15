import { GradientText, THEME } from '@/components/UI';
import { motion } from 'framer-motion';
import { memo, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import PricingCard from './PricingCard';

const PricePlanSection = memo(() => {
  const containerRef = useRef(null);
  const { plans, isLoading } = useSelector((state) => state.plan);

  // SEO Structured Data
  const structuredData = useMemo(() => {
    if (!plans || plans.length === 0) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Pricing Plans',
      description: 'Flexible pricing plans for development and design services.',
      itemListElement: plans.map((plan, index) => ({
        '@type': 'Offer',
        position: index + 1,
        name: plan.title || 'Pricing Plan',
        description: plan.description || `Plan ${index + 1} for services`,
        price: plan.price || 0,
        priceCurrency: 'USD', // Assuming USD, or adjust if plan has currency
        availability: 'https://schema.org/InStock',
        url: `${window.location.origin}/services/${plan.slug || ''}`,
      })),
    };
  }, [plans]);

  if (isLoading) {
    return (
      <section
        className="relative overflow-hidden flex items-center justify-center py-24 sm:py-32"
        style={{ backgroundColor: THEME.bg }}
        aria-label="Loading pricing plans"
        role="status"
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
      className="relative py-16 sm:py-20 md:py-24 overflow-hidden"
      style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
      aria-label="Pricing Plans Section"
      role="region"
      id="pricing"
    >
      {/* Structured Data for SEO */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-6 relative" style={{ zIndex: 2 }}>
        {/* Section Header */}
        <header className="text-center mb-10 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4"
              style={{
                background: 'rgba(154, 92, 183, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(154, 92, 183, 0.2)',
                color: THEME.purple,
              }}
            >
              Pricing Plans
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2"
            style={{ color: THEME.textWhite }}
          >
            Choose Your <GradientText>Plan</GradientText>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-2"
            style={{ color: THEME.textGray }}
          >
            Flexible pricing options designed to fit your needs and budget. Get started today!
          </motion.p>
        </header>

        {/* Pricing Cards Grid */}
        <div aria-label="Available Pricing Options">
          <PricingCard plans={plans} />
        </div>
      </div>
    </section>
  );
});

PricePlanSection.displayName = 'PricePlanSection';
export default PricePlanSection;
