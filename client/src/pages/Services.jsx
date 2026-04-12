import { useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, LazyMotion, domAnimation } from "motion/react";
import {
  Code,
  Palette,
  Zap,
  TrendingUp,
  Smartphone,
  Globe,
  Layers,
  Sparkles,
  ArrowRight,
  Check,
  MessageCircle,
  Calendar,
  Clock,
  Shield,
} from "lucide-react";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// ✅ Optimized: Static data moved outside component
const MAIN_SERVICES = [
  {
    icon: Code,
    title: "Web Development",
    description:
      "Building fast, responsive, and scalable web applications using modern technologies like React, Next.js, and Node.js.",
    features: [
      "Custom Web Applications",
      "E-commerce Solutions",
      "CMS Integration",
      "API Development",
      "Performance Optimization",
    ],
    color: "from-blue-500 to-cyan-400",
    gradient: "from-blue-500/20 to-cyan-400/20",
    iconBg: "bg-blue-500",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Creating intuitive and visually stunning user interfaces that provide exceptional user experiences.",
    features: [
      "User Research",
      "Wireframing",
      "Prototyping",
      "Visual Design",
      "Design Systems",
    ],
    color: "from-purple-500 to-pink-500",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconBg: "bg-purple-500",
  },
  {
    icon: Zap,
    title: "Motion Graphics",
    description:
      "Bringing designs to life with smooth animations and engaging interactions that captivate users.",
    features: [
      "Micro-interactions",
      "Page Transitions",
      "Scroll Animations",
      "Loading Animations",
      "Lottie Animations",
    ],
    color: "from-yellow-400 to-orange-500",
    gradient: "from-yellow-400/20 to-orange-500/20",
    iconBg: "bg-yellow-400",
  },
  {
    icon: TrendingUp,
    title: "Brand Strategy",
    description:
      "Developing comprehensive brand identities that stand out and resonate with your target audience.",
    features: [
      "Brand Identity",
      "Logo Design",
      "Brand Guidelines",
      "Marketing Materials",
      "Social Media Design",
    ],
    color: "from-green-400 to-emerald-500",
    gradient: "from-green-400/20 to-emerald-500/20",
    iconBg: "bg-green-400",
  },
];

const ADDITIONAL_SERVICES = [
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Creating responsive mobile-first experiences and progressive web apps.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Globe,
    title: "SEO Optimization",
    description: "Improving your website visibility and ranking on search engines.",
    color: "from-cyan-400 to-blue-500",
  },
  {
    icon: Layers,
    title: "3D Design",
    description: "Adding depth to your projects with stunning 3D elements and animations.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Sparkles,
    title: "Consulting",
    description: "Expert advice to help you make the right technical decisions.",
    color: "from-orange-400 to-amber-500",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Discovery",
    description: "Understanding your goals, target audience, and project requirements through in-depth discussions.",
    icon: MessageCircle,
    duration: "1-2 Days",
  },
  {
    number: "02",
    title: "Strategy",
    description: "Developing a comprehensive plan with timelines, milestones, and deliverables.",
    icon: Calendar,
    duration: "2-3 Days",
  },
  {
    number: "03",
    title: "Design",
    description: "Creating wireframes, mockups, and prototypes to visualize the final product.",
    icon: Palette,
    duration: "1-2 Weeks",
  },
  {
    number: "04",
    title: "Development",
    description: "Building the solution with clean code and modern technologies.",
    icon: Code,
    duration: "2-4 Weeks",
  },
  {
    number: "05",
    title: "Launch",
    description: "Deploying your project and ensuring everything runs smoothly.",
    icon: Shield,
    duration: "1 Day",
  },
];

const BENEFITS = [
  { icon: Clock, text: "On-time Delivery" },
  { icon: Shield, text: "Quality Assurance" },
  { icon: MessageCircle, text: "24/7 Support" },
  { icon: Zap, text: "Fast Turnaround" },
];

// ✅ Optimized: Service Card Component
const ServiceCard = ({ service, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: index * 0.15, duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -12, transition: { duration: 0.3 } }}
      className="group relative"
      style={{ perspective: "1000px" }}
    >
      <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${service.gradient} border border-white/10 hover:border-white/30 transition-all duration-500 h-full overflow-hidden backdrop-blur-sm`}>
        {/* Animated Background */}
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${service.color} opacity-10 rounded-full blur-[80px] group-hover:opacity-25 transition-all duration-700 group-hover:scale-150`} />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" 
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} 
        />

        {/* Icon */}
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center mb-6 shadow-lg relative z-10`}
        >
          <service.icon size={32} className="text-white" />
        </motion.div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-white mb-4 relative z-10 group-hover:text-cyan-400 transition-colors duration-300">
          {service.title}
        </h3>
        <p className="text-gray-400 mb-6 leading-relaxed relative z-10">
          {service.description}
        </p>

        {/* Features List */}
        <ul className="space-y-3 mb-8 relative z-10">
          {service.features.map((feature, fIndex) => (
            <motion.li 
              key={fIndex}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + fIndex * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 group/item"
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                className={`w-5 h-5 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center flex-shrink-0`}
              >
                <Check size={12} className="text-white" />
              </motion.div>
              <span className="text-gray-300 text-sm group-hover/item:text-white transition-colors">{feature}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA */}
        <motion.button
          whileHover={{ x: 8 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-cyan-400 font-semibold group/btn relative z-10"
        >
          <span>Learn More</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ArrowRight size={18} className="group-hover/btn:text-white transition-colors" />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
};

// ✅ Optimized: Process Step Component
const ProcessStep = ({ step, index, isLast }) => {
  const item = {
  hidden: { opacity: 0, x: -50 },
  show: { opacity: 1, x: 0 }
};
  return (
    <motion.div
  variants={item}
      whileHover={{ x: 10 }}
transition={{
  duration: 0.6,
  ease: "easeOut"
}}
      className="relative flex items-start gap-6 group"
>
      {/* Connector Line */}
      {!isLast && (
        <div className="absolute left-8 top-16 w-0.5 h-16 bg-gradient-to-b from-cyan-400 to-transparent opacity-30" />
      )}

      {/* Number Badge */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 relative z-10"
      >
        <span className="text-2xl font-bold text-white">{step.number}</span>
      </motion.div>

      {/* Content Card */}
      <div className="flex-1 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 group-hover:bg-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
            {step.title}
          </h3>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Clock size={14} />
            <span>{step.duration}</span>
          </div>
        </div>
        <p className="text-gray-400 leading-relaxed">{step.description}</p>
        
        {/* Step Icon */}
        <div className="mt-4 flex items-center gap-2">
          <step.icon size={18} className="text-cyan-400" />
          <span className="text-xs text-cyan-400 font-medium uppercase tracking-wider">Step {step.number}</span>
        </div>
      </div>
    </motion.div>
  );
};

// ✅ Optimized: Additional Service Card
const AdditionalServiceCard = ({ service, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative"
    >
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-cyan-400/30 text-center transition-all duration-300 h-full overflow-hidden">
        {/* Hover Glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className={`w-14 h-14 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center mx-auto mb-4 shadow-lg relative z-10`}
        >
          <service.icon size={28} className="text-white" />
        </motion.div>
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors relative z-10">
          {service.title}
        </h3>
        <p className="text-gray-400 text-sm relative z-10">{service.description}</p>
      </div>
    </motion.div>
  );
};

const Services = () => {
  const containerRef = useRef(null);
  const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

  // ✅ Optimized: GSAP with proper cleanup
  useGSAP(
    () => {
      // Benefits animation
      gsap.from(".benefit-item", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".benefits-section",
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <LazyMotion features={domAnimation}>
      <div ref={containerRef} className="bg-gray-900 min-h-screen pt-24">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10" />
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <motion.span
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-cyan-400 text-sm font-medium mb-6 border border-white/10"
              >
                What I Offer
              </motion.span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white">
                My{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Services
                </span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                Comprehensive digital solutions tailored to your needs. From
                concept to launch, I'll help you build something amazing.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Benefits Bar */}
        <section className="benefits-section py-12 border-y border-white/5 bg-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {BENEFITS.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="benefit-item flex items-center justify-center gap-3 text-gray-300"
                  whileHover={{ scale: 1.05, color: "#22d3ee" }}
                >
                  <benefit.icon size={20} className="text-cyan-400" />
                  <span className="font-medium">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Services */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-purple-400 text-sm font-medium mb-4 border border-white/10">
                Core Services
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
                How Can I{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Help You
                </span>
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {MAIN_SERVICES.map((service, index) => (
                <ServiceCard key={service.title} service={service} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px]" />

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-cyan-400 text-sm font-medium mb-4 border border-white/10">
                More Services
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
                Additional{" "}
                <span className="text-cyan-400">Offerings</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ADDITIONAL_SERVICES.map((service, index) => (
                <AdditionalServiceCard key={service.title} service={service} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 relative bg-white/5">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-blue-400 text-sm font-medium mb-4 border border-white/10">
                My Process
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
                How I{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Work
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                A proven process that ensures every project is delivered on time,
                within budget, and exceeds expectations.
              </p>
            </motion.div>

            <motion.div className="space-y-8" variants={container}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}>
              {PROCESS_STEPS.map((step, index) => (
                <ProcessStep 
                  key={step.number} 
                  step={step} 
                  index={index} 
                  isLast={index === PROCESS_STEPS.length - 1} 
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20" />
          <div className="absolute inset-0 backdrop-blur-3xl" />

          <div className="max-w-4xl mx-auto px-6 lg:px-8 relative text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Ready to Start Your{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Project?
                </span>
              </h2>
              <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                Let's discuss how I can help bring your vision to life. Get in
                touch for a free consultation.
              </p>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(34, 211, 238, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-full bg-white text-gray-900 font-bold text-lg relative overflow-hidden group"
              >
                <span className="relative z-10 ">Get a Free Quote</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
};

export default Services;