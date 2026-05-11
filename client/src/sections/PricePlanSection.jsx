import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import PricePlanSkeleton from './PricePlanSkeleton';
import PricingCard from './PricingCard';

const pricingPlans = [
  {
    name: 'Basic',
    price: '$99',
    period: '/project',
    description: 'Perfect for small projects and startups',
    features: [
      'Single Page Website',
      'Responsive Design',
      'Basic SEO',
      '2 Revisions',
      '1 Week Delivery',
    ],
    featured: false,
    buttonText: 'Get Started',
  },
  {
    name: 'Standard',
    price: '$199',
    period: '/project',
    description: 'Ideal for growing businesses',
    features: [
      'Multi-Page Website',
      'Advanced UI/UX Design',
      'Full SEO Optimization',
      'Unlimited Revisions',
      '2 Weeks Delivery',
      'Source Files Included',
    ],
    featured: true,
    buttonText: 'Most Popular',
  },
  {
    name: 'Premium',
    price: '$299',
    period: '/project',
    description: 'For enterprises and complex projects',
    features: [
      'Full-Stack Application',
      'Custom Animations',
      'Priority Support',
      'Unlimited Revisions',
      '3 Weeks Delivery',
      'Source Files + Documentation',
      '6 Months Maintenance',
    ],
    featured: false,
    buttonText: 'Contact Us',
  },
];

const PricePlanSection = () => {
  const pricingRef = useRef(null);
  const { plans, isLoading } = useSelector((state) => state.plan);
  console.log(!isLoading);

  useGSAP(
    () => {
      // Pricing Animation
      gsap.from('.pricing-card', {
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: pricingRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
        },
      });
    },
    { scope: pricingRef }
  );

  if (isLoading) return <PricePlanSkeleton />;

  return (
    <section ref={pricingRef} className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-purple-400 text-sm font-medium mb-4 border border-white/10">
            Pricing Plans
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Choose Your <span className="text-purple-500">Plan</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Flexible pricing options designed to fit your needs and budget. Get started today!
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <PricingCard plans={plans} />
      </div>
    </section>
  );
};

export default PricePlanSection;
