import React from 'react'
import { motion } from 'motion/react'
import { useCursorHoverContext } from '../context/CursorHover'
export default function CircularBadgeStatic({
  text = 'CREATIVE • DESIGN • DEVELOPMENT • CODE • SYSTEM • ',
  aboutImage,
}) {
  const { onCursorEnter, onCursorLeave } = useCursorHoverContext()
  const viewBox = 500
  const radius = 200
  const center = viewBox / 2

  // Repeat the text enough to make the circle look continuous
  const repeatedText = Array(3).fill(text).join(' ')

  return (
    <div
      onMouseEnter={onCursorEnter}
      onMouseLeave={onCursorLeave}
      className="relative rounded-full md:border-[0.3vw] sm:border-[0.6vw] xs:border-[0.9vw] border-theme-cyan md:w-[30vw] md:h-[30vw] sm:w-[50vw] sm:h-[50vw] xs:w-[80vw] xs:h-[80vw] flex items-center justify-center badge transition-all duration-500 will-change-transform"
    >
      {/* SVG overlay (text follows outer circle and decorative dots) */}
      <motion.svg
        viewBox={`0 0 ${viewBox} ${viewBox}`}
        className="absolute inset-0 w-full h-full pointer-events-none will-change-transform z-50"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="circular badge"
        style={{ originX: '50%', originY: '50%' }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: 20,
          ease: 'linear',
        }}
      >
        <defs>
          <path
            id="outerCirclePath"
            d={`M ${center} ${center - radius} a ${radius} ${radius} 0 1 1 -0.01 0`}
          />
        </defs>

        <text className="uppercase font-inter tracking-wider">
          <textPath
            href="#outerCirclePath"
            className="md:text-[3vw] sm:text-[5vw] xs:text-[9.5vw]"
            style={{ fill: '#e6e6e6' }}
          >
            {repeatedText}
          </textPath>
        </text>
      </motion.svg>

      {/* Back ground color container */}
      <div className="md:w-[29.5vw] md:h-[29.5vw] sm:w-[49.5vw] sm:h-[49.5vw] xs:w-[79.5vw] xs:h-[78.5vw] rounded-full bg-black absolute black-circle transition-all duration-500 will-change-transform"></div>

      {/* Center image */}
      <div className="md:w-[21vw] md:h-[21vw] sm:w-[35vw] sm:h-[35vw] xs:w-[58vw] xs:h-[58vw] md:border-[0.3vw] sm:border-[0.6vw] xs:border-[0.9vw] border-theme-purple rounded-full absolute overflow-hidden">
        <img
          src={aboutImage?.url || '/imgs/me.jpg'}
          className="w-full h-full object-cover"
          alt={aboutImage?.key}
        />
      </div>
    </div>
  )
}
