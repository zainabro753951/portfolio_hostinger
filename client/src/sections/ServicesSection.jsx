import { GradientText, ServiceCard, THEME } from '@/components/UI';
import useCreatedAtSorted from '@/hooks/useCreatedAtSorted';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { memo, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ServicesSection = memo(() => {
  const containerRef = useRef(null);
  const { services: sr } = useSelector((state) => state.service);
  const { sortedData: sortedServices } = useCreatedAtSorted(sr);

  const structuredData = useMemo(() => {
    if (!sortedServices?.length) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@graph': sortedServices.map((service, index) => ({
        '@type': 'Service',
        name: service.title || 'Professional Service',
        description: service.description || 'High-quality digital service',
        url: `${window.location.origin}/services/${service.slug}`,
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
      ref={containerRef}
      className="relative py-16 sm:py-20 md:py-24  overflow-hidden"
      style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
      aria-label="Professional services section"
      role="region"
    >
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 relative" style={{ zIndex: 2 }}>
        <header className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-block px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4"
              style={{
                background: 'rgba(2, 211, 254, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(2, 211, 254, 0.2)',
                color: THEME.cyan,
              }}
            >
              What I Do
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
            style={{ color: THEME.textWhite }}
          >
            My <GradientText>Services</GradientText>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-sm sm:text-base px-4"
            style={{ color: THEME.textGray }}
          >
            I offer a wide range of digital services to help businesses grow and succeed in the
            digital world.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 w-full items-stretch">
          {sortedServices?.map((service, index) => (
            <ServiceCard key={service.id || `service-${index}`} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
});

ServicesSection.displayName = 'ServicesSection';
export default ServicesSection;
