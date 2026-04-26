import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "motion/react"; // ✅ Fixed: motion/react -> framer-motion
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  CheckCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import ContactSection from "../sections/ContactSection";

gsap.registerPlugin(ScrollTrigger); // ✅ Fixed: removed duplicate useGSAP registration

const Contact = () => {
  const containerRef = useRef(null);

  const [searchParams] = useSearchParams();

  const slug = searchParams.get("slug");
  const subject = searchParams.get("subject");
  const message = searchParams.get("message");
  const service = searchParams.get("service");


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  // ✅ Fixed: Single scope for all animations
  useGSAP(
    () => {

      // FAQ animation
      gsap.from(".faq-item", {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".faq-section",
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    },
    { scope: containerRef }, // ✅ Fixed: proper scope
  );

  const faqs = [
    {
      q: "What is your typical project timeline?",
      a: "Project timelines vary based on complexity. A simple website takes 1-2 weeks, while complex applications may take 4-8 weeks.",
    },
    {
      q: "Do you offer ongoing support?",
      a: "Yes! I offer maintenance packages to keep your website running smoothly with regular updates and support.",
    },
    {
      q: "What are your payment terms?",
      a: "I typically require a 50% deposit to start, with the remaining 50% due upon project completion.",
    },
    {
      q: "Can you work with existing designs?",
      a: "Absolutely! I can work with your existing designs or create new ones from scratch based on your requirements.",
    },
  ];



  return (
    <div ref={containerRef} className="bg-gray-900 min-h-screen pt-24">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-cyan-400 text-sm font-medium mb-6 border border-white/10">
              Get In Touch
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white">
              Let's <span className="text-blue-500">Talk</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Have a project in mind or just want to say hello? I'd love to hear
              from you. Let's create something amazing together.
            </p>
          </motion.div>
        </div>
      </section>

      <ContactSection />

      {/* FAQ Section */}
      <section className="faq-section py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px]" />

        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-cyan-400 text-sm font-medium mb-4 border border-white/10">
              FAQ
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              Frequently Asked <span className="text-cyan-400">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="faq-item bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
                initial={false}
              >
                <motion.button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between text-left"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                >
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.q}
                  </h3>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown
                      size={24}
                      className="text-cyan-400 flex-shrink-0"
                    />
                  </motion.div>
                </motion.button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <p className="px-6 pb-6 text-gray-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
