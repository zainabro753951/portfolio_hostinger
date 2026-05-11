import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Star, Users, Zap } from 'lucide-react';
import { motion } from 'motion/react'; // ✅ Fixed: motion/react -> framer-motion
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Hero from '../sections/Hero';
import HeroSkeleton from '../sections/HeroSkeleton';
import PricePlanSection from '../sections/PricePlanSection';
import ServicesSection from '../sections/ServicesSection';

gsap.registerPlugin(ScrollTrigger);

const useHomeData = () => {
  const { data: about, isLoading: isAboutLoading } = useSelector((state) => state.about);
  const { projectCounts, isLoading: isProjectLoading } = useSelector((state) => state.projects);

  return {
    about,
    isLoading: isAboutLoading || isProjectLoading,
    projectCounts,
  };
};

const Home = () => {
  const containerRef = useRef(null);
  const statsRef = useRef(null);
  const { testimonials } = useSelector((state) => state.testimonial);

  // =============== Home Data ================
  const { about, isLoading, projectCounts } = useHomeData();

  // ✅ Single useGSAP with proper cleanup and correct scope
  useGSAP(
    () => {
      // Stats Animation
      gsap.from('.stat-item', {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
      });
    },
    { scope: containerRef } // ✅ Scope set to parent container
  );

  const stats = [
    {
      icon: Users,
      value: projectCounts?.publishedProjects,
      label: 'Projects Completed',
    },
    {
      icon: Star,
      value: testimonials?.length || '30+',
      label: 'Happy Clients',
    },
    { icon: Award, value: about.experience, label: 'Years Experience' },
    { icon: Zap, value: '100%', label: 'Satisfaction Rate' },
  ];

  return (
    <div ref={containerRef} className="bg-gray-900 min-h-screen">
      {/* Hero Section */}
      {isLoading ? <HeroSkeleton /> : <Hero about={{ ...about, projectCounts }} />}

      {/* Services Section */}
      <ServicesSection containerRef={containerRef} />

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-item text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md mb-4 border border-white/10">
                  <stat.icon size={32} className="text-cyan-400" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricePlanSection />

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
              Ready to Start Your <span className="text-cyan-400">Project?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
              Let's collaborate and bring your vision to life. I'm always excited to work on new and
              challenging projects.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={'/contact'}>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 30px rgba(255,255,255,0.3)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 rounded-full bg-white text-gray-900 font-semibold relative overflow-hidden group transition-all duration-300"
                >
                  <span className="relative z-10">Get In Touch</span>
                </motion.button>
              </Link>

              <Link to={'/projects'}>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    borderColor: 'rgba(255,255,255,0.5)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 rounded-full bg-white/10 backdrop-blur-md text-white font-semibold border border-white/20 transition-all duration-300"
                >
                  View Projects
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
