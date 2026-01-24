import { motion } from 'motion/react'
const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
  },
  transition: {
    repeat: Infinity,
    duration: 1.6,
    ease: 'linear',
  },
}

export const SkeletonBlock = ({ className }) => (
  <motion.div
    className={`relative overflow-hidden rounded-[0.6vw] bg-white/6 ${className}`}
    style={{
      backgroundImage:
        'linear-gradient(110deg, rgba(255,255,255,0.06) 8%, rgba(255,255,255,0.14) 18%, rgba(255,255,255,0.06) 33%)',
      backgroundSize: '200% 100%',
    }}
    animate={shimmer.animate}
    transition={shimmer.transition}
  />
)
