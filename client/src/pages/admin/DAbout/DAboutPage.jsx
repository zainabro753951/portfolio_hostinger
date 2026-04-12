import React, { memo } from "react";
import { motion } from "motion/react";
import AboutForm from "./components/AboutForm";

const DAboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 min-h-screen"
    >
      <motion.div variants={itemVariants}>
        <AboutForm />
      </motion.div>
    </motion.section>
  );
};

export default memo(DAboutPage);
