import { GradientText, THEME } from '@/components/UI';
import useCreatedAtSorted from '@/hooks/useCreatedAtSorted';
import { safeParse } from '@/Utils/Utils';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { memo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Gradients matching the theme for cards
const SERVICE_GRADIENTS = [
  'linear-gradient(135deg, #4e90e1, #02d3fe)',
  'linear-gradient(135deg, #9a5cb7, #ec4899)',
  'linear-gradient(135deg, #02d3fe, #4e90e1)',
  'linear-gradient(135deg, #f59e0b, #02d3fe)',
];

const ServiceCard = memo(({ service, index }) => {
  const serviceImage = safeParse(service?.serviceImage);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;
  const imageUrl = serviceImage?.url ? `${backendUrl}${serviceImage.url}` : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'power3.out' }}
      whileHover={{ y: -8 }}
      className="group relative rounded-2xl overflow-hidden"
      style={{
        background: THEME.bgCard,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${THEME.border}`,
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Background Image or Gradient Fallback */}
      <div className="absolute inset-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={service?.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: SERVICE_GRADIENTS[index % 4] }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,10,15,0.95), rgba(10,10,15,0.5), transparent)',
          }}
        />
      </div>

      {/* Hover Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ background: SERVICE_GRADIENTS[index % 4] }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col justify-end h-full">
        <h3
          className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-cyan-400"
          style={{ color: THEME.textWhite }}
        >
          {service?.title}
        </h3>
        <p className="text-sm leading-relaxed mb-5 line-clamp-3" style={{ color: THEME.textGray }}>
          {service?.description}
        </p>

        {/* CTA */}
        <Link
          to={`/services/${service?.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-300 cursor-pointer"
          style={{ color: THEME.cyan }}
        >
          <span className="relative inline-block overflow-hidden">
            <span className="block transition-transform duration-300 group-hover:-translate-y-full">
              View Details
            </span>
            <span className="absolute inset-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
              Learn More
            </span>
          </span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ArrowRight size={16} />
          </motion.div>
        </Link>
      </div>

      {/* Inner Border */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500"
        style={{ border: `1px solid ${THEME.border}`, transitionProperty: 'border-color' }}
      />
    </motion.div>
  );
});

ServiceCard.displayName = 'ServiceCard';

const ServicesSection = memo(() => {
  const containerRef = useRef(null);
  const { services: sr } = useSelector((state) => state.service);
  const { sortedData: sortedServices } = useCreatedAtSorted(sr);

  return (
    <section
      ref={containerRef}
      className="relative py-24 overflow-hidden"
      style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
    >
      {/* Particles */}
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

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📋 SERVICES CONTENT                                                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 relative" style={{ zIndex: 2 }}>
        {/* Header */}
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
              background: 'rgba(2, 211, 254, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(2, 211, 254, 0.2)',
              color: THEME.cyan,
            }}
          >
            What I Do
          </span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            style={{ color: THEME.textWhite }}
          >
            My <GradientText>Services</GradientText>
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: THEME.textGray }}>
            I offer a wide range of digital services to help businesses grow and succeed in the
            digital world.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedServices?.map((service, index) => (
            <ServiceCard key={service.id || index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
});

export default ServicesSection;
