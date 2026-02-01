import React, { useState, useCallback, useId, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { IoChevronDown } from "react-icons/io5";

// ---------------------------
// FAQSection component — modern, accessible, performant
// ---------------------------
const FAQSection = ({ FAQs = [], initialOpen = -1 }) => {
  const [openIndex, setOpenIndex] = useState(initialOpen);
  const shouldReduce = useReducedMotion();
  const idBase = useId();
  const headersRef = useRef([]);

  const toggle = useCallback((idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  }, []);

  // keyboard navigation: Arrow Up/Down, Home/End
  const onHeaderKeyDown = useCallback(
    (e, idx) => {
      const len = FAQs.length;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = (idx + 1) % len;
        headersRef.current[next]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = (idx - 1 + len) % len;
        headersRef.current[prev]?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        headersRef.current[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        headersRef.current[len - 1]?.focus();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(idx);
      }
    },
    [FAQs.length, toggle],
  );

  // background uses a translucent gradient so the card reads distinct from page background
  const cardBackground = {
    background: `linear-gradient(135deg, rgba(0,209,243,0.08), rgba(6,12,18,0.55))`,
    border: `1px solid rgba(0,209,243,0.12)`,
    backdropFilter: `blur(6px)`,
  };

  return (
    <section aria-labelledby={`${idBase}-faq-title`} className="w-full">
      <motion.h2
        className="md:text-[2.2rem] text-2xl font-fira-code font-semibold text-center text-white mb-6"
        id={`${idBase}-faq-title`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Frequently Asked{" "}
        <span className="bg-linear-to-r from-light-blue via-theme-cyan to-theme-purple bg-clip-text text-transparent">
          Questions
        </span>
      </motion.h2>

      <motion.div
        className="mx-auto max-w-3xl grid gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.04 } },
        }}
      >
        {FAQs.map((item, idx) => {
          const isOpen = openIndex === idx;
          const headerId = `${idBase}-faq-${idx}-header`;
          const panelId = `${idBase}-faq-${idx}-panel`;

          return (
            <motion.div
              key={idx}
              className="relative rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              style={cardBackground}
            >
              <div>
                <div
                  className={`group flex items-center justify-between gap-4 cursor-pointer p-4 md:p-6 rounded-lg `}
                >
                  <button
                    ref={(el) => (headersRef.current[idx] = el)}
                    id={headerId}
                    aria-controls={panelId}
                    aria-expanded={isOpen}
                    onClick={() => toggle(idx)}
                    onKeyDown={(e) => onHeaderKeyDown(e, idx)}
                    className="text-left flex-1 focus:outline-none"
                    style={{ textAlign: "left" }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-base md:text-lg font-semibold text-white">
                        {item.question}
                      </h3>

                      <div className="flex items-center gap-2">
                        {item?.hint ? (
                          <span className="text-xs text-gray-400 hidden md:inline">
                            {item.hint}
                          </span>
                        ) : null}

                        <motion.span
                          aria-hidden
                          initial={false}
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: shouldReduce ? 0 : 0.28 }}
                          className="text-theme-cyan"
                        >
                          <IoChevronDown size={22} />
                        </motion.span>
                      </div>
                    </div>
                  </button>
                </div>

                <AnimatePresence initial={false} mode="wait">
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={headerId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={cardBackground}
                      transition={{
                        duration: shouldReduce ? 0 : 0.36,
                        ease: "easeInOut",
                      }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 md:p-6 text-gray-300 bg-theme-dark/60 border-t border-[rgba(255,255,255,0.02)]">
                        <p className="text-sm md:text-base leading-relaxed">
                          {item.answer}
                        </p>
                        {item.more && (
                          <div className="mt-3 text-sm text-gray-400">
                            {item.more}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* small helper */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Still stuck?{" "}
        <a href="/contact" className="text-[#00D1F3] underline">
          Contact us
        </a>
      </div>
    </section>
  );
};

export default FAQSection;
