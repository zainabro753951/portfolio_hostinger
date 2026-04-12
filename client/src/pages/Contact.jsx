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

gsap.registerPlugin(ScrollTrigger); // ✅ Fixed: removed duplicate useGSAP registration

const Contact = () => {
  const containerRef = useRef(null);
  const contactRef = useRef(null);
  const formRef = useRef(null);
  
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  // ✅ Fixed: Single scope for all animations
  useGSAP(
    () => {
      // Contact info animation
      gsap.from(".contact-info-item", {
        x: -50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contactRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // Form animation
      gsap.from(".form-container", {
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true,
        },
      });

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
    { scope: containerRef } // ✅ Fixed: proper scope
  );

  const handleChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      setFormState({ name: "", email: "", subject: "", message: "" });
      
      // Reset after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "hello@portfolio.com",
      href: "mailto:hello@portfolio.com",
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "New York, NY",
      href: "#",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub", color: "hover:text-gray-100" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-400" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-400" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-400" },
  ];

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

  const inputFields = [
    { name: "name", type: "text", label: "Your Name" },
    { name: "email", type: "email", label: "Your Email" },
    { name: "subject", type: "text", label: "Subject" },
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

      {/* Contact Section */}
      <section ref={contactRef} className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
                  Contact <span className="text-purple-500">Information</span>
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Feel free to reach out through any of these channels. I'm
                  always open to discussing new projects and opportunities.
                </p>
              </motion.div>

              {/* Contact Details */}
              <div className="space-y-4 mb-12">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    className="contact-info-item flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400/30 0 group"
                    whileHover={{ x: 10, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <item.icon size={24} className="text-white" />
                    </div>
                    <div className="text-start">
                      <p className="text-gray-500 text-sm">{item.label}</p>
                      <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  Follow Me
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      whileHover={{ scale: 1.15, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-12 h-12 rounded-xl bg-white/5 backdrop-blur-md flex items-center justify-center text-gray-400 ${social.color} border border-white/10 hover:border-current `}
                    >
                      <social.icon size={20} />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <div ref={formRef} className="form-container">
              <motion.div
                className=" bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  Send a Message
                </h2>

                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="text-center py-12"
                    >
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
                      >
                        <CheckCircle size={40} className="text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-gray-400">
                        Thank you for reaching out. I'll get back to you soon.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      {inputFields.map((field) => (
                        <div key={field.name} className="relative">
                          <motion.label
                            animate={{
                              y: focusedField === field.name || formState[field.name] ? -24 : 0,
                              scale: focusedField === field.name || formState[field.name] ? 0.85 : 1,
                              color: focusedField === field.name ? "#22d3ee" : "#6b7280",
                            }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 top-3 origin-left pointer-events-none font-medium"
                          >
                            {field.label}
                          </motion.label>
                          <input
                            type={field.type}
                            name={field.name}
                            value={formState[field.name]}
                            onChange={handleChange}
                            onFocus={() => setFocusedField(field.name)}
                            onBlur={() => setFocusedField(null)}
                            required
                            className="w-full bg-transparent border-b-2 border-white/20 focus:border-cyan-400 outline-none py-3 text-white transition-colors duration-300"
                          />
                          <motion.div
                            className="absolute bottom-0 left-0 h-0.5 bg-cyan-400"
                            initial={{ width: "0%" }}
                            animate={{ width: focusedField === field.name ? "100%" : "0%" }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      ))}

                      {/* Message Field */}
                      <div className="relative">
                        <motion.label
                          animate={{
                            y: focusedField === "message" || formState.message ? -24 : 0,
                            scale: focusedField === "message" || formState.message ? 0.85 : 1,
                            color: focusedField === "message" ? "#22d3ee" : "#6b7280",
                          }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-3 origin-left pointer-events-none font-medium"
                        >
                          Your Message
                        </motion.label>
                        <textarea
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("message")}
                          onBlur={() => setFocusedField(null)}
                          required
                          rows={4}
                          className="w-full bg-transparent border-b-2 border-white/20 focus:border-cyan-400 outline-none py-3 text-white transition-colors duration-300 resize-none"
                        />
                        <motion.div
                          className="absolute bottom-0 left-0 h-0.5 bg-cyan-400"
                          initial={{ width: "0%" }}
                          animate={{ width: focusedField === "message" ? "100%" : "0%" }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(34, 211, 238, 0.3)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 mt-8"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send size={20} />
                            <span>Send Message</span>
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

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
                    <ChevronDown size={24} className="text-cyan-400 flex-shrink-0" />
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