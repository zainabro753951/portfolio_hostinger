import { THEME } from '@/components/UI';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Crown, Sparkles, Zap } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PricingCard = ({ plans }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate(); // ✅ Initialize navigate

  // ✅ New function: Handle plan selection & navigate to contact with params
  const handlePlanSelect = useCallback(
    (plan) => {
      const params = new URLSearchParams({
        plan: plan?.planName || 'Unknown',
        price: plan?.price?.toString() || '0',
        period: plan?.period || '/month',
        currency: plan?.currency || 'USD',
        subject: `Interested in ${plan?.planName || 'Pricing'} Plan`,
        message: `Hi, I'm interested in your "${plan?.planName || 'Plan'}" pricing plan.\n\nPlan Details:\n• Price: ${plan?.currency || '$'}${plan?.price || '0'}${plan?.period || '/month'}\n• Features:\n${plan?.featurePoints?.map((f) => `  - ${f.name}`).join('\n') || '  - No features listed'}\n\nPlease let me know the next steps.\n\nBest regards,`,
      });
      navigate(`/contact?${params.toString()}`);
    },
    [navigate]
  );

  const getPlanIcon = (planName) => {
    const name = planName?.toLowerCase();
    if (name === 'standard')
      return <Crown size={20} style={{ color: '#fbbf24' }} aria-hidden="true" />;
    if (name === 'premium')
      return <Sparkles size={20} style={{ color: THEME.purple }} aria-hidden="true" />;
    return <Zap size={20} style={{ color: THEME.cyan }} aria-hidden="true" />;
  };

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="relative rounded-2xl" role="list" aria-label="Pricing Plans List">
      {/* Pricing Cards Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10 px-3 sm:px-0"
        variants={
          prefersReducedMotion
            ? {}
            : {
                visible: {
                  transition: { staggerChildren: 0.15, delayChildren: 0.2 },
                },
              }
        }
      >
        {plans?.map((plan, index) => {
          const isPopular = plan?.planName?.toLowerCase() === 'standard';
          const isHovered = hoveredIndex === index;
          const planId = plan?.id || `plan-${index}`;

          return (
            <motion.div
              key={planId}
              variants={
                prefersReducedMotion
                  ? {}
                  : {
                      hidden: { opacity: 0, y: 50, scale: 0.95 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { type: 'spring', stiffness: 100, damping: 15, duration: 0.6 },
                      },
                    }
              }
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={prefersReducedMotion ? undefined : { y: isPopular ? -12 : -8 }}
              className={`relative group flex flex-col ${isPopular ? 'md:-mt-4 md:mb-4' : 'mt-0 mb-0'}`}
              role="listitem"
            >
              {/* Glow Effect */}
              {isPopular && (
                <div
                  className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-50"
                  style={{ background: THEME.gradientPrimary }}
                  aria-hidden="true"
                />
              )}
              {!isPopular && (
                <div
                  className={`absolute -inset-1 rounded-2xl opacity-0 blur-lg transition-opacity duration-500 ${isHovered ? 'opacity-20' : ''}`}
                  style={{ background: THEME.gradientCyanBlue }}
                  aria-hidden="true"
                />
              )}

              {/* Card */}
              <article
                className={`relative h-full flex flex-col rounded-2xl p-5 sm:p-6 md:p-8 overflow-visible transition-all duration-300 ${isPopular ? 'ring-1 ring-cyan-500/30' : ''}`}
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
                aria-label={`${plan?.planName || 'Pricing Plan'} details`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="relative">
                      <div
                        className="absolute inset-0 rounded-full blur-md opacity-60"
                        style={{ background: THEME.gradientCyanBlue }}
                        aria-hidden="true"
                      />
                      <div
                        className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-white text-xs sm:text-sm font-semibold whitespace-nowrap"
                        style={{ background: THEME.gradientCyanBlue }}
                      >
                        <Crown
                          size={12}
                          className="sm:w-4 sm:h-4"
                          style={{ color: '#fbbf24' }}
                          aria-hidden="true"
                        />
                        Most Popular
                      </div>
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <header className="mb-6 sm:mb-8 text-center">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isPopular
                          ? 'rgba(2, 211, 254, 0.15)'
                          : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${isPopular ? 'rgba(2, 211, 254, 0.3)' : THEME.border}`,
                      }}
                      aria-hidden="true"
                    >
                      {getPlanIcon(plan?.planName)}
                    </div>
                    <h3
                      className="text-xl sm:text-2xl font-bold"
                      style={{ color: THEME.textWhite }}
                    >
                      {plan?.planName || 'Plan'}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm px-2" style={{ color: THEME.textGray }}>
                    {plan?.shortDesc || 'Description not available'}
                  </p>
                </header>

                {/* Price */}
                <div className="mb-6 sm:mb-8 text-center">
                  <div className="flex items-baseline justify-center gap-0.5 sm:gap-1">
                    <span
                      className="text-lg sm:text-2xl font-medium"
                      style={{ color: THEME.textGray }}
                    >
                      $
                    </span>
                    <span
                      className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
                      style={{ color: THEME.textWhite }}
                    >
                      {Math.floor(plan?.price || 0)}
                    </span>
                    <span
                      className="text-sm sm:text-lg ml-0.5 sm:ml-1"
                      style={{ color: THEME.textGray }}
                    >
                      {plan?.currency || ''}
                    </span>
                  </div>
                  <p
                    className="text-xs sm:text-sm mt-1 sm:mt-2 font-medium"
                    style={{ color: THEME.textGrayDark }}
                  >
                    {plan?.period || '/month'}
                  </p>
                </div>

                {/* Divider */}
                <div
                  className="w-full h-px mb-6 sm:mb-8"
                  style={{
                    background: isPopular
                      ? 'linear-gradient(90deg, transparent, rgba(2, 211, 254, 0.5), transparent)'
                      : THEME.border,
                  }}
                  aria-hidden="true"
                />

                {/* Features */}
                <ul
                  className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow px-1"
                  aria-label="Plan Features"
                >
                  {plan?.featurePoints?.map(({ name: feature }, fIndex) => (
                    <motion.li
                      key={fIndex}
                      initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                      transition={prefersReducedMotion ? {} : { delay: 0.3 + fIndex * 0.1 }}
                      className="flex items-start gap-2.5 sm:gap-3 group/item"
                    >
                      <div
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300"
                        style={{
                          background: isPopular
                            ? 'rgba(2, 211, 254, 0.15)'
                            : 'rgba(78, 144, 225, 0.15)',
                        }}
                        aria-hidden="true"
                      >
                        <Check
                          size={10}
                          className="sm:w-3 sm:h-3"
                          style={{ color: isPopular ? THEME.cyan : THEME.blue, strokeWidth: 3 }}
                        />
                      </div>
                      <span
                        className="text-xs sm:text-sm leading-relaxed transition-colors duration-300 group-hover/item:text-white"
                        style={{ color: THEME.textGray }}
                      >
                        {feature || ''}
                      </span>
                    </motion.li>
                  )) || (
                    <li
                      className="text-xs sm:text-sm text-center py-4"
                      style={{ color: THEME.textGray }}
                    >
                      No features listed for this plan.
                    </li>
                  )}
                </ul>

                {/* CTA */}
                <motion.button
                  onClick={() => handlePlanSelect(plan)} // ✅ Added click handler
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                  className="w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 group/btn overflow-hidden relative"
                  style={{
                    background: isPopular ? THEME.gradientPrimary : 'rgba(255,255,255,0.05)',
                    border: isPopular ? 'none' : `1px solid ${THEME.border}`,
                    color: THEME.textWhite,
                  }}
                  aria-label={`Choose the ${plan?.planName || 'Plan'} plan`}
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
                    aria-hidden="true"
                  />
                  <span className="relative z-10">
                    {isPopular ? 'Get Started Now' : 'Choose Plan'}
                  </span>
                  <ArrowRight
                    size={14}
                    className="sm:w-4 sm:h-4 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1"
                    aria-hidden="true"
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
                    aria-hidden="true"
                  />
                )}
              </article>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1 }}
        transition={prefersReducedMotion ? {} : { delay: prefersReducedMotion ? 0 : 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 text-center relative z-10"
      >
        <p
          className="text-xs sm:text-sm flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
          style={{ color: THEME.textGrayDark }}
        >
          <Check
            size={12}
            className="sm:w-4 sm:h-4"
            style={{ color: '#10b981' }}
            aria-hidden="true"
          />
          No credit card required • Cancel anytime • 24/7 Support
        </p>
      </motion.div>
    </div>
  );
};

export default PricingCard;
