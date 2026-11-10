import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

import ContactSection from '../sections/ContactSection';
import { useMotionPrefs, fadeUp, staggerParent, VIEWPORT_ONCE } from '@/lib/motion';

// ═══════════════════════════════════════════════════════════════════════════
// 🧩 FAQ ITEM ACCORDION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const FaqItem = memo(({ faq, index, isOpen, onToggle }) => {
  const { prefersReducedMotion } = useMotionPrefs();

  return (
    <div
      className={`rounded-2xl transition-all duration-300 overflow-hidden ${
        isOpen
          ? 'bg-surface-card border border-brand-cyan/40 shadow-glow-cyan'
          : 'bg-surface-card/70 hover:bg-surface-card border border-line-subtle hover:border-brand-cyan/25'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 sm:p-5 md:p-6 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 gap-4"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-question-${index}`}
      >
        <span className="font-heading text-sm sm:text-base md:text-lg font-semibold text-ink leading-snug">
          {faq.question}
        </span>
        <motion.div
          animate={prefersReducedMotion ? undefined : { rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-elevated/80 border border-line-subtle flex items-center justify-center text-brand-cyan"
          aria-hidden="true"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${index}`}
            role="region"
            aria-labelledby={`faq-question-${index}`}
            initial={prefersReducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 pt-1 text-ink-secondary text-xs sm:text-sm md:text-base leading-relaxed border-t border-white/8">
              <p>{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

FaqItem.displayName = 'FaqItem';

// ═══════════════════════════════════════════════════════════════════════════
// 📝 CONTACT PAGE MAIN
// ═══════════════════════════════════════════════════════════════════════════
const Contact = memo(() => {
  const [searchParams] = useSearchParams();
  const [openFaq, setOpenFaq] = useState(null);
  const { prefersReducedMotion } = useMotionPrefs();
  const { FAQs = [] } = useSelector((state) => state.FAQ);

  // Auto-open FAQ based on URL param (?faq=0)
  useEffect(() => {
    const faqIndex = searchParams.get('faq');
    if (faqIndex !== null && !isNaN(Number(faqIndex))) {
      setOpenFaq(Number(faqIndex));
    }
  }, [searchParams]);

  const handleToggleFaq = useCallback((index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  }, []);

  // SEO Schema.org Structured Data
  const structuredData = useMemo(() => {
    if (!FAQs?.length) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }, [FAQs]);

  const contactInfoData = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Full Stack Engineering & Product Development',
      description: 'Contact information and consultation form for web development projects.',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'technical sales',
        url: `${origin}/contact`,
      },
    };
  }, []);

  return (
    <div id="contact-page" className="relative min-h-screen text-ink overflow-x-clip bg-surface-base">
      {/* Schema.org Structured Data */}
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

      {/* 🌌 AMBIENT BACKGROUND GLOWS (Pure CSS, 0 JS load) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 h-80 w-80 sm:h-96 sm:w-96 rounded-full bg-brand-cyan/10 blur-[130px]" />
        <div className="absolute top-2/3 right-1/4 h-80 w-80 sm:h-96 sm:w-96 rounded-full bg-brand-blue/10 blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/3 h-72 w-72 rounded-full bg-brand-purple/10 blur-[150px]" />
      </div>

      <div className="relative z-10">
        {/* ═══════════════════════════════════════════════════════════════════
            HERO HEADER
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="pt-24 sm:pt-32 pb-8 sm:pb-12 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 mb-4 sm:mb-6 shadow-glow-cyan">
                <Sparkles size={13} className="text-brand-cyan" aria-hidden="true" />
                Let's Connect
              </span>

              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-ink mb-4 sm:mb-6 leading-tight">
                Let's Build Something{' '}
                <span className="bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple bg-clip-text text-transparent">
                  Exceptional
                </span>
              </h1>

              <p className="text-ink-secondary text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Have a new product to architect, a technical question, or an ambitious project?
                Send a transmission or reach out through my direct channels.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            INTERACTIVE CONTACT FORM & DETAILS SECTION
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-8 sm:py-12 md:py-16" aria-label="Contact channels">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <ContactSection />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            FAQ ACCORDION SECTION
           ═══════════════════════════════════════════════════════════════════ */}
        {FAQs.length > 0 && (
          <section
            className="py-16 sm:py-24"
            aria-labelledby="faq-section-heading"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <motion.div
                variants={fadeUp}
                initial={prefersReducedMotion ? false : 'hidden'}
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
                className="text-center mb-10 sm:mb-14"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-brand-blue bg-brand-blue/10 border border-brand-blue/20 mb-3">
                  <HelpCircle size={13} className="text-brand-blue" aria-hidden="true" />
                  Common Questions
                </span>
                <h2
                  id="faq-section-heading"
                  className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-ink"
                >
                  Frequently Asked{' '}
                  <span className="bg-gradient-to-r from-brand-cyan to-brand-blue bg-clip-text text-transparent">
                    Inquiries
                  </span>
                </h2>
              </motion.div>

              <motion.div
                variants={staggerParent}
                initial={prefersReducedMotion ? false : 'hidden'}
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
                className="space-y-3.5 sm:space-y-4"
                role="list"
                aria-label="Frequently asked questions list"
              >
                {FAQs.map((faq, index) => (
                  <FaqItem
                    key={faq.id || index}
                    faq={faq}
                    index={index}
                    isOpen={openFaq === index}
                    onToggle={() => handleToggleFaq(index)}
                  />
                ))}
              </motion.div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
});

Contact.displayName = 'Contact';
export default Contact;
