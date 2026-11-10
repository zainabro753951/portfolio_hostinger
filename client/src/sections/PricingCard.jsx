import { useMotionPrefs } from '@/lib/motion';
import { ArrowRight, Check, Crown, Sparkles, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const PricingCard = memo(({ plans }) => {
  const navigate = useNavigate();
  const { reduced, isMobile } = useMotionPrefs();

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
    if (name === 'standard') {
      return <Crown size={18} className="text-amber-400" aria-hidden="true" />;
    }
    if (name === 'premium') {
      return <Sparkles size={18} className="text-brand-purple" aria-hidden="true" />;
    }
    return <Zap size={18} className="text-brand-cyan" aria-hidden="true" />;
  };

  const containerVariants = useMemo(() => {
    if (reduced) return {};
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: isMobile ? 0.05 : 0.12, delayChildren: 0.1 },
      },
    };
  }, [reduced, isMobile]);

  const cardVariants = useMemo(() => {
    if (reduced) return { hidden: { opacity: 1 }, visible: { opacity: 1 } };
    return {
      hidden: { opacity: 0, y: isMobile ? 12 : 24 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      },
    };
  }, [reduced, isMobile]);

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center py-12 rounded-2xl border border-line-subtle bg-surface-card/40">
        <p className="text-ink-secondary text-sm">No pricing plans available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="relative isolate" role="list" aria-label="Pricing Plans List">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch"
      >
        {plans.map((plan, index) => {
          const isPopular = plan?.planName?.toLowerCase() === 'standard';
          const planId = plan?.id || `plan-${index}`;

          return (
            <motion.div
              key={planId}
              variants={cardVariants}
              whileHover={
                reduced || isMobile
                  ? undefined
                  : { y: isPopular ? -8 : -5, transition: { duration: 0.25 } }
              }
              className={`relative flex flex-col ${isPopular ? 'md:-mt-3 md:mb-3' : ''}`}
              role="listitem"
            >
              {/* Popular Glow behind card */}
              {isPopular && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-3 rounded-3xl opacity-40 blur-xl bg-gradient-to-r from-brand-cyan/20 via-brand-blue/20 to-brand-purple/20"
                />
              )}

              {/* Card Surface */}
              <article
                className={`relative flex-1 flex flex-col justify-between rounded-2xl p-6 sm:p-8 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 ${
                  isPopular
                    ? 'border-2 border-brand-cyan/40 bg-surface-card/90 shadow-glow-cyan'
                    : 'border border-line-subtle bg-surface-card/60 hover:border-line-strong'
                }`}
                aria-label={`${plan?.planName || 'Pricing Plan'} details`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold text-surface-void bg-gradient-to-r from-brand-cyan to-brand-blue shadow-md">
                      <Crown size={12} className="text-surface-void" aria-hidden="true" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  {/* Header: Icon & Plan Name */}
                  <header className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${
                            isPopular
                              ? 'border-brand-cyan/30 bg-brand-cyan/10'
                              : 'border-line-subtle bg-surface-soft'
                          }`}
                        >
                          {getPlanIcon(plan?.planName)}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
                          {plan?.planName || 'Plan'}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                        {plan?.shortDesc || 'Tailored for standard project requirements'}
                      </p>
                    </div>
                  </header>

                  {/* Price display */}
                  <div className="mb-6 pb-6 border-b border-line-subtle">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs sm:text-sm font-medium text-ink-muted">
                        {plan?.currency || '$'}
                      </span>
                      <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-ink">
                        {Math.floor(plan?.price || 0)}
                      </span>
                      <span className="text-xs sm:text-sm text-ink-muted ml-1">
                        {plan?.period || '/month'}
                      </span>
                    </div>
                  </div>

                  {/* Feature list */}
                  <ul className="space-y-3 mb-8" aria-label="Plan Features">
                    {plan?.featurePoints && plan.featurePoints.length > 0 ? (
                      plan.featurePoints.map(({ name: feature }, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-3">
                          <div
                            className={`grid h-5 w-5 shrink-0 place-items-center rounded-md mt-0.5 ${
                              isPopular ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-surface-soft text-brand-blue'
                            }`}
                            aria-hidden="true"
                          >
                            <Check size={12} strokeWidth={2.5} />
                          </div>
                          <span className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-ink-muted italic">Features customized per request.</li>
                    )}
                  </ul>
                </div>

                {/* Select CTA Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full min-h-[44px] py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base ${
                      isPopular
                        ? 'bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple text-surface-void hover:opacity-95 shadow-glow-cyan'
                        : 'border border-line-subtle bg-surface-soft/80 text-ink hover:border-line-strong hover:bg-surface-soft'
                    }`}
                    aria-label={`Select the ${plan?.planName || 'Plan'} plan`}
                  >
                    <span>{isPopular ? 'Get Started' : 'Choose Plan'}</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-200 group-hover/btn:translate-x-1"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </article>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Trust note */}
      <div className="mt-8 text-center">
        <p className="inline-flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-ink-muted">
          <Check size={14} className="text-emerald-400 shrink-0" aria-hidden="true" />
          <span>Clear milestones • Transparent scope • Ongoing post-launch support</span>
        </p>
      </div>
    </div>
  );
});

PricingCard.displayName = 'PricingCard';
export default PricingCard;
