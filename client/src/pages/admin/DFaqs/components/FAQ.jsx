import { AnimatePresence, motion } from "motion/react";
import React, { useState, memo, useCallback } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useDeleteEntryContext } from "../../../../context/DeleteEntry";
import { Link } from "react-router-dom";
import { useEffect } from "react";

// Memoized action button component for better performance
const ActionButton = memo(
  ({
    to,
    onClick,
    icon: Icon,
    gradientFrom,
    gradientTo,
    borderColor,
    textColor,
    hoverFrom,
    hoverTo,
    shadowColor,
  }) => {
    const baseClasses = `
      w-9 h-9 sm:w-10 sm:h-10 md:w-10 md:h-10 
      rounded-lg 
      flex items-center justify-center 
      bg-gradient-to-r border 
      transition-all duration-300 ease-out
      will-change-transform transform-gpu
      hover:scale-110 active:scale-95
    `;

    const content = <Icon className="text-sm sm:text-base md:text-lg" />;

    const className = `
      ${baseClasses}
      ${gradientFrom} ${gradientTo} ${borderColor} ${textColor}
      ${hoverFrom} ${hoverTo} ${shadowColor}
    `;

    // ✅ FIX: onClick ko Link par bhi pass karo
    if (to) {
      return (
        <Link to={to} className={className} onClick={onClick}>
          {content}
        </Link>
      );
    }

    return (
      <button onClick={onClick} className={className}>
        {content}
      </button>
    );
  },
);

ActionButton.displayName = "ActionButton";

const FAQ = ({ faq, idx }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    setRoute,
    setIsOpen: setDeleteOpen,
    setQueryKey,
  } = useDeleteEntryContext();

  useEffect(() => {
    setQueryKey("FAQs");
  }, [setQueryKey]);

  // Memoized toggle function
  const toggleFAQ = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Memoized delete handler
  const handleDelete = useCallback(() => {
    setDeleteOpen(true);
    setRoute(`/faq/delete/${faq?.id}`);
    setQueryKey("FAQs");
  }, [setDeleteOpen, setRoute, setQueryKey, faq?.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: idx * 0.08,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="
        rounded-2xl sm:rounded-3xl
        border border-cyan-400/20 
        bg-gradient-to-br from-slate-900/60 to-slate-800/30
        backdrop-blur-xl 
        shadow-[0_4px_30px_rgba(34,211,238,0.15),inset_0_1px_0_rgba(255,255,255,0.05)]
        mt-4 sm:mt-5 md:mt-6 
        w-full flex flex-col overflow-hidden
        will-change-transform transform-gpu
        hover:shadow-[0_8px_40px_rgba(34,211,238,0.25)]
        transition-shadow duration-500
      "
    >
      {/* Question Header */}
      <div
        onClick={toggleFAQ}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleFAQ();
          }
        }}
        className="
          w-full px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-5 
          flex items-center justify-between 
          bg-transparent hover:bg-white/[0.02]
          transition-colors duration-300
          cursor-pointer
          group
        "
        role="button"
        tabIndex={0}
      >
        <h3
          className="
          text-sm sm:text-base md:text-lg 
          font-semibold text-slate-100 
          pr-4 text-left
          group-hover:text-cyan-50
          transition-colors duration-300
          line-clamp-2
        "
        >
          {faq?.question}
        </h3>

        {/* Right Section: Status + Actions */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5 flex-shrink-0">
          {/* Status Badge */}
          <span
            className={`
              px-3 py-1 sm:px-4 sm:py-1.5 
              rounded-full text-xs sm:text-sm font-medium
              border backdrop-blur-sm
              transition-all duration-300
              ${
                faq.status.toLowerCase() === "published"
                  ? "bg-cyan-500/15 text-cyan-300 border-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                  : "bg-amber-500/15 text-amber-300 border-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.2)]"
              }
            `}
          >
            {faq.status}
          </span>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ActionButton
              to={`/admin/faqs/${faq?.id}`}
              icon={FaEdit}
              onClick={(e) => {
                e.stopPropagation();
              }}
              gradientFrom="from-violet-600/25"
              gradientTo="to-indigo-600/25"
              borderColor="border-violet-500/40"
              textColor="text-violet-200"
              hoverFrom="hover:from-violet-500/45"
              hoverTo="hover:to-indigo-500/35"
              shadowColor="shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]"
            />

            <ActionButton
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              icon={FaTrashAlt}
              gradientFrom="from-cyan-600/25"
              gradientTo="to-blue-600/25"
              borderColor="border-cyan-500/40"
              textColor="text-cyan-200"
              hoverFrom="hover:from-cyan-500/45"
              hoverTo="hover:to-blue-500/35"
              shadowColor="shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]"
            />
          </div>
        </div>
      </div>

      {/* Answer Section with AnimatePresence */}
      <AnimatePresence initial={false} mode="wait">
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.4, 0, 0.2, 1], // Smooth cubic-bezier
            }}
            className="overflow-hidden will-change-[height,opacity]"
          >
            <div
              className="
              px-4 pb-4 sm:px-5 sm:pb-5 md:px-6 md:pb-5 
              border-t border-white/5
            "
            >
              <p
                className="
                text-sm sm:text-base md:text-base 
                text-slate-400 leading-relaxed
                pt-4
              "
              >
                {faq?.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(FAQ);
