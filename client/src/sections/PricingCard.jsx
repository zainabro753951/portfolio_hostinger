import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Zap, Crown, ArrowRight } from 'lucide-react';

const PricingCard = ({ plans }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const getPlanIcon = (planName) => {
    const name = planName?.toLowerCase();
    if (name === 'standard') return <Crown size={20} className="text-yellow-400" />;
    if (name === 'premium') return <Sparkles size={20} className="text-purple-400" />;
    return <Zap size={20} className="text-blue-400" />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  return (
    <div>
      {/* Pricing Cards Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 relative z-10"
      >
        {plans?.map((plan, index) => {
          const isStandard = plan?.planName?.toLowerCase() === 'standard';
          const isHovered = hoveredIndex === index;

          return (
            <motion.div
              key={index}
              variants={cardVariants}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{
                y: -10,
                scale: plan?.planName?.toLowerCase() === 'standard' ? 1.05 : 1.02,
              }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`relative group ${isStandard ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {/* Card Glow Effect */}
              {isStandard && (
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl opacity-30 blur-lg group-hover:opacity-50 transition-opacity duration-500" />
              )}

              {/* Hover Glow for Non-Standard */}
              {!isStandard && (
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600/50 to-blue-600/50 rounded-3xl opacity-0 blur-lg transition-opacity duration-500 ${isHovered ? 'opacity-20' : ''}`}
                />
              )}

              <div
                className={`relative h-full flex flex-col rounded-3xl p-8 transition-all duration-500 ${
                  isStandard
                    ? 'bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-2xl border-2 border-purple-500/40 shadow-2xl shadow-purple-900/20'
                    : 'bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                {/* Popular Badge */}
                {isStandard && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-md opacity-60" />
                      <div className="relative flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold shadow-lg">
                        <Crown size={14} className="text-yellow-300" />
                        Most Popular
                      </div>
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        isStandard
                          ? 'bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-purple-500/30'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      {getPlanIcon(plan?.planName)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white capitalize">{plan?.planName}</h3>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mt-0.5">{plan?.shortDesc}</p>
                </div>

                {/* Price Section */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-gray-400 text-2xl font-medium">$</span>
                    <span className="text-6xl font-bold text-white tracking-tight">
                      {Math.floor(plan?.price || 0)}
                    </span>
                    <span className="text-gray-400 text-lg ml-1">{plan?.currency}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2 font-medium">
                    {plan?.period || '/month'}
                  </p>
                </div>

                {/* Divider */}
                <div
                  className={`w-full h-px mb-8 ${
                    isStandard
                      ? 'bg-gradient-to-r from-transparent via-purple-500/50 to-transparent'
                      : 'bg-white/10'
                  }`}
                />

                {/* Features List */}
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan?.featurePoints?.map(({ name: feature }, fIndex) => (
                    <motion.li
                      key={fIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + fIndex * 0.1 }}
                      className="flex items-start gap-3 group/item"
                    >
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-300 ${
                          isStandard
                            ? 'bg-purple-500/20 group-hover/item:bg-purple-500/40'
                            : 'bg-blue-500/20 group-hover/item:bg-blue-500/40'
                        }`}
                      >
                        <Check
                          size={12}
                          className={isStandard ? 'text-purple-400' : 'text-blue-400'}
                          strokeWidth={3}
                        />
                      </div>
                      <span className="text-gray-300 text-sm leading-relaxed group-hover/item:text-white transition-colors duration-300 text-start">
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
                    isStandard
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 hover:shadow-xl'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-white/30'
                  }`}
                >
                  <span>{isStandard ? 'Get Started Now' : 'Choose Plan'}</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover/btn:translate-x-1"
                  />
                </motion.button>

                {/* Bottom Glow Line */}
                {isStandard && (
                  <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="max-w-7xl mx-auto mt-16 text-center relative z-10"
      >
        <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
          <Check size={14} className="text-green-400" />
          No credit card required • Cancel anytime • 24/7 Support
        </p>
      </motion.div>
    </div>
  );
};

export default PricingCard;
