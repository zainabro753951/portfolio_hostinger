import { ServiceCard } from '@/components/UI';
import useCreatedAtSorted from '@/hooks/useCreatedAtSorted';
import { fadeUp, staggerParent, useMotionPrefs, VIEWPORT_ONCE } from '@/lib/motion';
import { motion } from 'motion/react';
import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';

const ServiceSkeletonCard = () => (
  <div
    className="relative min-h-[300px] rounded-2xl border border-line-subtle bg-surface-card/60 p-6 flex flex-col justify-end overflow-hidden"
    aria-hidden="true"
  >
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'linear-gradient(90deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.01) 100%)',
        backgroundSize: '200% 100%',
        animation: 'service-shimmer 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      }}
    />
    <div className="space-y-3 z-10">
      <div className="h-6 w-3/4 rounded-lg bg-surface-soft border border-line-subtle" />
      <div className="h-4 w-full rounded-md bg-surface-soft/60" />
      <div className="h-4 w-2/3 rounded-md bg-surface-soft/60" />
    </div>
  </div>
);

const ServicesSection = memo(() => {
  const { services: sr, isLoading } = useSelector((state) => state.service);
  const { sortedData: sortedServices } = useCreatedAtSorted(sr);
  const { reduced, isMobile } = useMotionPrefs();

  const prefs = useMemo(() => ({ reduced, isMobile }), [reduced, isMobile]);
  const parentVariants = useMemo(() => staggerParent(0.1, 0.1), []);
  const itemVariants = useMemo(() => fadeUp(prefs, 0), [prefs]);

  const structuredData = useMemo(() => {
    if (!sortedServices?.length || typeof window === 'undefined') return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@graph': sortedServices.map((service) => ({
        '@type': 'Service',
        name: service.title || 'Professional Service',
        description: service.description || 'High-quality digital service',
        url: `${window.location.origin}/services/${service.slug || ''}`,
        serviceType: service.title,
        provider: {
          '@type': 'Person',
          name: 'Portfolio Owner',
        },
      })),
    };
  }, [sortedServices]);

  return (
    <section
      className="relative py-16 sm:py-20 lg:py-28 overflow-hidden isolate"
      aria-label="Professional Services"
    >
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Subtle background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(45%_50%_at_50%_30%,rgb(var(--brand-cyan)/0.06),transparent)]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="mb-4 inline-block"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-cyan border border-brand-cyan/20 bg-brand-cyan/10">
              What I Offer
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink mb-4 sm:mb-5"
          >
            Services &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">
              Expertise
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="text-sm sm:text-base leading-relaxed text-ink-secondary"
          >
            End-to-end digital solutions crafted for high performance, modern architecture, and
            intuitive user journeys.
          </motion.p>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
            {[0, 1, 2, 3].map((i) => (
              <ServiceSkeletonCard key={`service-skeleton-${i}`} />
            ))}
          </div>
        ) : sortedServices && sortedServices.length > 0 ? (
          <motion.div
            variants={parentVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full items-stretch"
          >
            {sortedServices.map((service, index) => (
              <motion.div
                key={service.id || `service-${index}`}
                variants={itemVariants}
                className="h-full"
              >
                <ServiceCard service={service} index={index} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 rounded-2xl border border-line-subtle bg-surface-card/40">
            <p className="text-ink-secondary text-sm">Services will be listed here soon.</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes service-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
});

ServicesSection.displayName = 'ServicesSection';
export default ServicesSection;
