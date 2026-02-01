import React, { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import BorderedButton from "../../../components/BorderedButton";
import GardientButton from "../../../components/GardientButton";
import { useSelector } from "react-redux";
import PricingFaqSkeleton from "./PriceSkeleton";
import Plan from "../../../components/Plan";
import FAQSection from "./FAQSection";

// ===== Animation Variants =====
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut", duration: 0.6 },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut", duration: 0.6 },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { ease: "easeOut", duration: 0.5 },
  },
};

const PricingPlan = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const { plans, isLoading: isPlanLoading } = useSelector(
    (state) => state.plan,
  );
  const { FAQs, isLoading: isFAQLoading } = useSelector((state) => state.FAQ);
  const isPageReady = isFAQLoading || isPlanLoading;

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (isPageReady) return <PricingFaqSkeleton />;

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="w-full h-full bg-[#050617] text-white relative "
    >
      <div className="w-full h-full bg-[#050617] relative">
        <div className="w-full h-full md:py-[8vw] sm:py-[9vw] xs:py-[10vw] md:px-[2.5vw] sm:px-[3vw] xs:px-[3.5vw] flex flex-col md:gap-[4vw] sm:gap-[5vw] xs:gap-[6vw]">
          {/* ===== Pricing Section ===== */}
          <motion.div variants={sectionVariants}>
            <motion.h2
              variants={buttonVariants}
              className="md:text-[2.9vw] sm:text-[3.9vw] xs:text-[5.9vw] font-fira-code font-semibold text-center"
            >
              Pricing{" "}
              <span className="bg-linear-to-r from-light-blue via-theme-cyan to-theme-purple bg-clip-text text-transparent">
                Plan
              </span>
            </motion.h2>

            <motion.div
              variants={containerVariants}
              className="md:mt-[1.5vw] sm:mt-[2.5vw] xs:mt-[3.5vw] grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-5 place-content-center"
            >
              {plans?.map((item, idx) => (
                <Plan key={idx} item={item} />
              ))}
            </motion.div>
          </motion.div>

          {/* ===== FAQ Section ===== */}
          <FAQSection FAQs={FAQs} />
        </div>
      </div>
    </motion.div>
  );
};

export default PricingPlan;
