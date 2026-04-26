import { motion } from "motion/react";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import FAQ from "./FAQ";
import useCreatedAtSorted from "../../../../hooks/useCreatedAtSorted";

const FAQTable = () => {
  const { FAQs } = useSelector((state) => state.FAQ);
  const { sortedData: sortedFAQs } = useCreatedAtSorted(FAQs);

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  // Animation variants for empty state
  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="
        w-full
        p-5 sm:p-6 md:p-8
        rounded-2xl sm:rounded-3xl
        bg-gradient-to-br from-slate-900/70 to-slate-800/40
        border border-white/15 
        backdrop-blur-2xl 
        shadow-[0_8px_40px_rgba(34,211,238,0.15),inset_0_1px_0_rgba(255,255,255,0.05)]
        will-change-transform transform-gpu
      "
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h2
            className="
            text-lg sm:text-xl md:text-2xl 
            font-bold text-white
            tracking-wide
          "
          >
            All FAQs
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-1">
            {sortedFAQs?.length || 0}{" "}
            {sortedFAQs?.length === 1 ? "question" : "questions"} total
          </p>
        </div>

        {/* Optional: Add FAQ Button could go here */}
      </div>

      {/* FAQ List */}
      <motion.div
        className="w-full flex flex-col gap-4 sm:gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sortedFAQs?.length > 0 ? (
          sortedFAQs.map((item, idx) => (
            <FAQ faq={item} idx={idx} key={item.id || idx} />
          ))
        ) : (
          <motion.div
            variants={emptyStateVariants}
            className="
              w-full 
              p-6 sm:p-8 md:p-10
              rounded-2xl sm:rounded-3xl
              border border-dashed border-cyan-400/30 
              bg-gradient-to-br from-slate-800/30 to-slate-700/20
              backdrop-blur-xl
              text-center
              mt-4 sm:mt-6
              group
              hover:border-cyan-400/50
              transition-colors duration-300
            "
          >
            {/* Icon */}
            <div
              className="
              w-16 h-16 sm:w-20 sm:h-20 
              mx-auto mb-4 sm:mb-5
              rounded-full 
              bg-gradient-to-br from-cyan-500/20 to-blue-500/20
              border border-cyan-400/30
              flex items-center justify-center
              group-hover:scale-110 group-hover:from-cyan-500/30 group-hover:to-blue-500/30
              transition-all duration-500
            "
            >
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* Text */}
            <h3
              className="
              text-base sm:text-lg md:text-xl 
              font-semibold text-slate-200 
              mb-2
            "
            >
              No FAQs Yet
            </h3>
            <p
              className="
              text-sm sm:text-base 
              text-slate-400 
              max-w-md mx-auto
              leading-relaxed
            "
            >
              No FAQs have been added yet. Start by creating your first one to
              help your users!
            </p>

            {/* Optional CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                mt-5 sm:mt-6
                px-6 py-2.5 sm:px-8 sm:py-3
                bg-gradient-to-r from-cyan-500/20 to-blue-500/20
                border border-cyan-400/40
                text-cyan-300 font-medium
                rounded-full
                text-sm sm:text-base
                hover:from-cyan-500/30 hover:to-blue-500/30
                hover:border-cyan-400/60
                hover:text-cyan-200
                transition-all duration-300
                inline-flex items-center gap-2
              "
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add First FAQ
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default memo(FAQTable);
