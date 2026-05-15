import { GlassCard, GradientText, THEME } from '@/components/UI';
import { useGSAP } from '@gsap/react';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Sparkles } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContactSection from '../sections/ContactSection';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ═══════════════════════════════════════════════════════════════════════════
// 🧩 FAQ ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const FaqItem = memo(({ faq, index, isOpen, onToggle }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <GlassCard className="faq-item mb-3 sm:mb-4" hover={false}>
      <motion.button
        onClick={onToggle}
        className="w-full p-4 sm:p-5 md:p-6 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 rounded-t-xl"
        whileHover={
          prefersReducedMotion ? undefined : { backgroundColor: 'rgba(255,255,255,0.03)' }
        }
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <h3
          className="text-sm sm:text-base md:text-lg font-semibold pr-2 sm:pr-4 transition-colors duration-300 text-left"
          style={{ color: THEME.textWhite }}
        >
          {faq.q}
        </h3>
        <motion.div
          animate={prefersReducedMotion ? undefined : { rotate: isOpen ? 180 : 0 }}
          transition={prefersReducedMotion ? {} : { duration: 0.3 }}
          className="flex-shrink-0 ml-2 sm:ml-4"
        >
          <ChevronDown
            size={18}
            className="sm:w-5 sm:h-5 md:w-6 md:h-6"
            style={{ color: THEME.cyan }}
            aria-hidden="true"
          />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={
              prefersReducedMotion ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }
            }
            animate={prefersReducedMotion ? undefined : { height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={prefersReducedMotion ? {} : { duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
            id={`faq-answer-${index}`}
            role="region"
          >
            <p
              className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 leading-relaxed text-xs sm:text-sm md:text-base"
              style={{ color: THEME.textGray }}
            >
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
});
FaqItem.displayName = 'FaqItem';

// ═══════════════════════════════════════════════════════════════════════════
// 📝 CONTACT PAGE
// ═══════════════════════════════════════════════════════════════════════════
const Contact = memo(() => {
  const faqSectionRef = useRef(null);
  const containerRef = useRef(null);
  const [searchParams] = useSearchParams();
  const [openFaq, setOpenFaq] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Auto-open FAQ based on URL param
  useEffect(() => {
    const faqIndex = searchParams.get('faq');
    if (faqIndex && !isNaN(faqIndex)) {
      setOpenFaq(Number(faqIndex));
    }
  }, [searchParams]);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const faqItems = faqSectionRef.current?.querySelectorAll('.faq-item');
      gsap.to('.gradient-orb', {
        scale: 1.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      if (faqItems?.length) {
        gsap.from(faqItems, {
          y: 30,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: faqSectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
        });
      }
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  const handleToggleFaq = useCallback((index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  }, []);

  const faqs = useMemo(
    () => [
      {
        q: 'What is your typical project timeline?',
        a: 'Project timelines vary based on complexity. A simple website takes 1-2 weeks, while complex applications may take 4-8 weeks.',
      },
      {
        q: 'Do you offer ongoing support?',
        a: 'Yes! I offer maintenance packages to keep your website running smoothly with regular updates and support.',
      },
      {
        q: 'What are your payment terms?',
        a: 'I typically require a 50% deposit to start, with the remaining 50% due upon project completion.',
      },
      {
        q: 'Can you work with existing designs?',
        a: 'Absolutely! I can work with your existing designs or create new ones from scratch based on your requirements.',
      },
    ],
    []
  );

  // SEO Structured Data
  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    }),
    [faqs]
  );

  const contactInfoData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Portfolio Contact',
      description: 'Contact information and inquiry form for project collaboration.',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        url: `${window.location.origin}/contact`,
      },
    }),
    []
  );

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen min-h-[100dvh] overflow-x-hidden"
      style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
      aria-label="Contact Page"
    >
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactInfoData) }}
      />

      {/* 🌌 BACKGROUND LAYERS */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <div
          className="gradient-orb absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full blur-[80px] md:blur-[120px] animate-pulse"
          style={{ background: 'rgba(2, 211, 254, 0.12)' }}
        />
        <div
          className="gradient-orb absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full blur-[80px] md:blur-[120px] animate-pulse"
          style={{ animationDelay: '1s', background: 'rgba(78, 144, 225, 0.12)' }}
        />
        <div
          className="gradient-orb absolute top-1/2 left-1/2 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full blur-[60px] md:blur-[100px] animate-pulse"
          style={{ animationDelay: '2s', background: 'rgba(154, 92, 183, 0.1)' }}
        />
      </div>

      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} aria-hidden="true">
        {[...Array(10)].map((_, i) => (
          <div
            key={`p-${i}`}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              left: `${(i * 11.3) % 100}%`,
              top: `${(i * 17.7) % 100}%`,
              background: i % 3 === 0 ? THEME.cyan : i % 3 === 1 ? THEME.blue : THEME.purple,
              opacity: 0.2 + (i % 3) * 0.1,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 4)}s`,
            }}
          />
        ))}
      </div>

      {/* 🦸 HERO SECTION */}
      <header
        className="relative pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8 md:pb-12"
        style={{ zIndex: 2 }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? {} : { duration: 0.8, ease: 'easeOut' }}
            className="text-center"
          >
            <span
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6"
              style={{
                background: 'rgba(2, 211, 254, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(2, 211, 254, 0.2)',
                color: THEME.cyan,
              }}
            >
              <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" aria-hidden="true" />
              Get In Touch
            </span>
            <h1
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 px-2 leading-tight"
              style={{ color: THEME.textWhite }}
            >
              Let's <GradientText>Talk</GradientText>
            </h1>
            <p
              className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-4"
              style={{ color: THEME.textGray }}
            >
              Have a project in mind or just want to say hello? I'd love to hear from you. Let's
              create something amazing together.
            </p>
          </motion.div>
        </div>
      </header>

      {/* 📧 CONTACT FORM SECTION */}
      <section
        className="relative py-10 sm:py-16 md:py-24"
        style={{ zIndex: 2 }}
        aria-label="Contact Form"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <ContactSection />
        </div>
      </section>

      {/* ❓ FAQ SECTION */}
      <section
        ref={faqSectionRef}
        className="relative py-10 sm:py-16 md:py-24"
        style={{ zIndex: 2 }}
        aria-labelledby="faq-heading"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] rounded-full blur-[100px] sm:blur-[120px] md:blur-[150px] pointer-events-none"
          style={{ background: 'rgba(2, 211, 254, 0.05)' }}
          aria-hidden="true"
        />

        <div className="max-w-3xl sm:max-w-4xl mx-auto px-3 sm:px-4 md:px-6 relative">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={prefersReducedMotion ? undefined : { once: true }}
            transition={prefersReducedMotion ? {} : { duration: 0.6 }}
            className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16"
          >
            <span
              className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4"
              style={{
                background: 'rgba(78, 144, 225, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(78, 144, 225, 0.2)',
                color: THEME.blue,
              }}
            >
              FAQ
            </span>
            <h2
              id="faq-heading"
              className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2 leading-tight"
              style={{ color: THEME.textWhite }}
            >
              Frequently Asked <GradientText>Questions</GradientText>
            </h2>
          </motion.div>

          <div
            className="space-y-3 sm:space-y-4"
            role="list"
            aria-label="Frequently asked questions"
          >
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openFaq === index}
                onToggle={() => handleToggleFaq(index)}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
});

Contact.displayName = 'Contact';
export default Contact;
