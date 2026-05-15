// ============================================================================
// 📁 Contact.jsx
// ============================================================================
import { GlassCard, GradientText, THEME } from '@/components/UI';
import { useGSAP } from '@gsap/react';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Sparkles } from 'lucide-react';
import { memo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContactSection from '../sections/ContactSection';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Contact = memo(() => {
  const faqSectionRef = useRef(null); // 👈 Section ki ref
  const containerRef = useRef(null);
  const [searchParams] = useSearchParams();
  const [openFaq, setOpenFaq] = useState(null);

  useGSAP(
    () => {
      // 👇 Scope ke andar query karein taake global conflict na ho
      const faqItems = faqSectionRef.current?.querySelectorAll('.faq-item');

      gsap.to('.gradient-orb', {
        scale: 1.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      if (!faqItems?.length) {
        console.warn('❌ No FAQ items found');
        return;
      }

      console.log('🚀 Starting animation on:', faqItems);

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
    },
    { scope: containerRef }
  );

  const faqs = [
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
  ];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden"
      style={{ backgroundColor: THEME.bg, fontFamily: "'Inter', sans-serif" }}
    >
      {/* 🌌 BACKGROUND LAYERS (Exact Match) */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="gradient-orb absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse"
          style={{ background: 'rgba(2, 211, 254, 0.12)' }}
        />
        <div
          className="gradient-orb absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: '1s', background: 'rgba(78, 144, 225, 0.12)' }}
        />
        <div
          className="gradient-orb absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: '2s', background: 'rgba(154, 92, 183, 0.1)' }}
        />
      </div>

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

      {/* 🦸 HERO SECTION */}
      <section className="relative pt-24 pb-12" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center"
          >
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{
                background: 'rgba(2, 211, 254, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(2, 211, 254, 0.2)',
                color: THEME.cyan,
              }}
            >
              <Sparkles size={14} className="inline mr-2 mb-0.5" />
              Get In Touch
            </span>
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
              style={{ color: THEME.textWhite }}
            >
              Let's <GradientText>Talk</GradientText>
            </h1>
            <p
              className="text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ color: THEME.textGray }}
            >
              Have a project in mind or just want to say hello? I'd love to hear from you. Let's
              create something amazing together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 📧 CONTACT FORM SECTION */}
      <section className="relative py-24" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto px-6">
          <ContactSection />
        </div>
      </section>

      {/* ❓ FAQ SECTION */}
      <section ref={faqSectionRef} className=" relative py-24 " style={{ zIndex: 2 }}>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{ background: 'rgba(2, 211, 254, 0.05)' }}
        />

        <div className="max-w-4xl mx-auto px-6 relative">
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
                background: 'rgba(78, 144, 225, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(78, 144, 225, 0.2)',
                color: THEME.blue,
              }}
            >
              FAQ
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6" style={{ color: THEME.textWhite }}>
              Frequently Asked <GradientText>Questions</GradientText>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <GlassCard key={index} className="faq-item mb-4" hover={false}>
                <motion.button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between text-left"
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                >
                  <h3
                    className="text-lg font-semibold pr-4 transition-colors duration-300"
                    style={{ color: THEME.textWhite }}
                  >
                    {faq.q}
                  </h3>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={24} style={{ color: THEME.cyan }} />
                  </motion.div>
                </motion.button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <p className="px-6 pb-6 leading-relaxed" style={{ color: THEME.textGray }}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
});

export default Contact;
