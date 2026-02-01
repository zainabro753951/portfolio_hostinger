import React from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import GardientButton from "./GardientButton";
import { Link } from "react-router-dom";

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const featureVariants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

const Plan = ({
  item = {},
  isInContact = false,
  index = 0,
  highlighted = false,
}) => {
  const price = `${item?.price ?? ""}${item?.currency ? " " + item.currency : ""}/${item?.billingCycle ?? ""}`;

  const accent = "#00D495"; // requested accent color
  // background uses a translucent gradient so the card reads distinct from page background
  const cardBackground = {
    background: `linear-gradient(135deg, rgba(0,209,243,0.08), rgba(6,12,18,0.55))`,
    border: `1px solid rgba(0,209,243,0.12)`,
    backdropFilter: `blur(6px)`,
  };
  return (
    <motion.article
      className={`relative rounded-2xl p-1 transform-gpu will-change-transform select-none`}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="show"
      whileHover={{ y: -10, scale: 1.02 }}
      role="group"
      aria-labelledby={`plan-${item?.id}-title`}
    >
      {/* Outer subtle gradient border */}
      <div
        className={`rounded-2xl bg-linear-to-br from-[#0b1220] via-[#07111a] to-[#07121b] p-px`}
      >
        {/* Card content */}
        <div
          className={`rounded-2xl bg-theme-dark/80 backdrop-blur-md p-6 md:p-8 lg:p-10 flex flex-col justify-between gap-6 min-h-[220px] shadow-[0_8px_30px_rgba(2,6,23,0.6)]`}
          style={cardBackground}
        >
          <header className="flex items-start justify-between gap-4">
            <div>
              <h3
                id={`plan-${item?.id}-title`}
                className={`text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-white`}
              >
                {item?.planName}
              </h3>
              {item?.tag ? (
                <p className="mt-1 text-sm text-theme-cyan/80 font-medium">
                  {item.tag}
                </p>
              ) : null}
            </div>

            <div className="text-right">
              <div
                className={`text-2xl md:text-3xl font-extrabold text-theme-cyan`}
              >
                {item?.price}
              </div>
              <div className="text-xs text-gray-400">
                {item?.currency}/{item?.billingCycle}
              </div>
            </div>
          </header>

          <p className="text-sm md:text-base text-gray-300">
            {item?.shortDesc}
          </p>

          {/* features list with clear affordance and optional detail */}
          <motion.ul className="grid gap-2 mt-2 md:mt-4">
            {Array.isArray(item?.featurePoints) &&
              item.featurePoints.map((pt, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3"
                  variants={featureVariants}
                  transition={{ delay: i * 0.04 }}
                >
                  <span
                    className="shrink-0 mt-1 p-1 rounded-md"
                    style={{
                      background: `linear-gradient(180deg, ${accent}20, transparent)`,
                    }}
                    aria-hidden
                  >
                    <Check className="w-4 h-4 text-white/90" />
                  </span>

                  <div className="flex-1">
                    <div className="text-sm text-gray-100">{pt?.name}</div>
                    {pt?.meta ? (
                      <div className="text-xs text-gray-400 mt-0.5">
                        {pt.meta}
                      </div>
                    ) : null}
                  </div>
                </motion.li>
              ))}
          </motion.ul>

          <div className="mt-4">
            {!isInContact ? (
              <motion.div
                variants={buttonVariants}
                initial="hidden"
                animate="show"
              >
                {/* CTA */}
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 rounded-full bg-linear-to-r from-indigo-500 to-cyan-400 px-6 py-3 font-medium shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  Choose Plan
                </Link>
              </motion.div>
            ) : (
              <div className="text-sm text-gray-400">Already in contact</div>
            )}
          </div>

          {/* subtle ribbon for highlighted plan */}
          {highlighted ? (
            <div className="absolute -top-3 left-4 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-theme-cyan/30 to-[#7c3aed]/20 px-3 py-1 text-xs text-white backdrop-blur">
              Recommended
            </div>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
};

export default Plan;
