// ============================================================================
// 📁 PricingCard.jsx
// ============================================================================
import { THEME } from '@/components/UI';
import { ArrowRight, Check, Crown, Sparkles, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

const PricingCard = ({ plans }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const getPlanIcon = (planName) => {
    const name = planName?.toLowerCase();
    if (name === 'standard') return <Crown size={20} style={{ color: '#fbbf24' }} />;
    if (name === 'premium') return <Sparkles size={20} style={{ color: THEME.purple }} />;
    return <Zap size={20} style={{ color: THEME.cyan }} />;
  };

  return (
    <div className="relative rounded-2xl">
      {/* Pricing Cards Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 relative z-10"
      >
        {plans?.map((plan, index) => {
          const isPopular = plan?.planName?.toLowerCase() === 'standard';
          const isHovered = hoveredIndex === index;

          return (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: 'spring', stiffness: 100, damping: 15, duration: 0.6 },
                },
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ y: isPopular ? -12 : -8 }}
              className={`relative group ${isPopular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {/* Glow Effect */}
              {isPopular && (
                <div
                  className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-50"
                  style={{ background: THEME.gradientPrimary }}
                />
              )}
              {!isPopular && (
                <div
                  className={`absolute -inset-1 rounded-2xl opacity-0 blur-lg transition-opacity duration-500 ${isHovered ? 'opacity-20' : ''}`}
                  style={{ background: THEME.gradientCyanBlue }}
                />
              )}

              {/* Card */}
              <div
                className="relative h-full flex flex-col rounded-2xl p-8 overflow-visible transition-all duration-300"
                style={{
                  background: THEME.bgCard,
                  backdropFilter: 'blur(10px)',
                  border: isPopular
                    ? `2px solid rgba(2, 211, 254, 0.3)`
                    : `1px solid ${THEME.border}`,
                  boxShadow: isPopular
                    ? '0 0 40px rgba(2, 211, 254, 0.1)'
                    : '0 10px 30px rgba(0,0,0,0.3)',
                }}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="relative">
                      <div
                        className="absolute inset-0 rounded-full blur-md opacity-60"
                        style={{ background: THEME.gradientCyanBlue }}
                      />

                      <div
                        className="relative flex items-center gap-2 px-5 py-2 rounded-full text-white text-sm font-semibold"
                        style={{ background: THEME.gradientCyanBlue }}
                      >
                        <Crown size={14} style={{ color: '#fbbf24' }} />
                        Most Popular
                      </div>
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-8 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: isPopular
                          ? 'rgba(2, 211, 254, 0.15)'
                          : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${isPopular ? 'rgba(2, 211, 254, 0.3)' : THEME.border}`,
                      }}
                    >
                      {getPlanIcon(plan?.planName)}
                    </div>
                    <h3 className="text-2xl font-bold" style={{ color: THEME.textWhite }}>
                      {plan?.planName}
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: THEME.textGray }}>
                    {plan?.shortDesc}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8 text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-medium" style={{ color: THEME.textGray }}>
                      $
                    </span>
                    <span
                      className="text-6xl font-bold tracking-tight"
                      style={{ color: THEME.textWhite }}
                    >
                      {Math.floor(plan?.price || 0)}
                    </span>
                    <span className="text-lg ml-1" style={{ color: THEME.textGray }}>
                      {plan?.currency}
                    </span>
                  </div>
                  <p className="text-sm mt-2 font-medium" style={{ color: THEME.textGrayDark }}>
                    {plan?.period || '/month'}
                  </p>
                </div>

                {/* Divider */}
                <div
                  className="w-full h-px mb-8"
                  style={{
                    background: isPopular
                      ? 'linear-gradient(90deg, transparent, rgba(2, 211, 254, 0.5), transparent)'
                      : THEME.border,
                  }}
                />

                {/* Features */}
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
                        className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300"
                        style={{
                          background: isPopular
                            ? 'rgba(2, 211, 254, 0.15)'
                            : 'rgba(78, 144, 225, 0.15)',
                        }}
                      >
                        <Check
                          size={12}
                          style={{ color: isPopular ? THEME.cyan : THEME.blue, strokeWidth: 3 }}
                        />
                      </div>
                      <span
                        className="text-sm leading-relaxed transition-colors duration-300 group-hover/item:text-white"
                        style={{ color: THEME.textGray }}
                      >
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-6 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 group/btn overflow-hidden relative"
                  style={{
                    background: isPopular ? THEME.gradientPrimary : 'rgba(255,255,255,0.05)',
                    border: isPopular ? 'none' : `1px solid ${THEME.border}`,
                    color: THEME.textWhite,
                  }}
                  onMouseEnter={
                    !isPopular
                      ? (e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                          e.currentTarget.style.borderColor = THEME.borderHover;
                        }
                      : undefined
                  }
                  onMouseLeave={
                    !isPopular
                      ? (e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                          e.currentTarget.style.borderColor = THEME.border;
                        }
                      : undefined
                  }
                >
                  <span
                    className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    }}
                  />
                  <span className="relative z-10">
                    {isPopular ? 'Get Started Now' : 'Choose Plan'}
                  </span>
                  <ArrowRight
                    size={16}
                    className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1"
                  />
                </motion.button>

                {/* Bottom Line for Popular */}
                {isPopular && (
                  <div
                    className="absolute bottom-0 left-4 right-4 h-px"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, rgba(2, 211, 254, 0.5), transparent)',
                    }}
                  />
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
        className="max-w-7xl mx-auto px-6 py-12 text-center relative z-10"
      >
        <p
          className="text-sm flex items-center justify-center gap-2"
          style={{ color: THEME.textGrayDark }}
        >
          <Check size={14} style={{ color: '#10b981' }} />
          No credit card required • Cancel anytime • 24/7 Support
        </p>
      </motion.div>
    </div>
  );
};

export default PricingCard;
