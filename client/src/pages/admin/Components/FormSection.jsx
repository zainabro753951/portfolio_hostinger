import { memo } from "react";
import { motion } from "motion/react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

const FormSection = ({ children, title, icon: Icon, className = "" }) => (
  <motion.div
    variants={itemVariants}
    className={`rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-white/10 backdrop-blur-xl p-6 ${className}`}
  >
    {(title || Icon) && (
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
            <Icon className="w-5 h-5" />
          </div>
        )}
        {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
      </div>
    )}
    {children}
  </motion.div>
);

export default memo(FormSection);
