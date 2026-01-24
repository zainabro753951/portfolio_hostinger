import React from 'react'

const HalfPurpleCircles = () => {
  return (
    <div
      className="purple-shadow-circle md:w-[20vw] md:h-[25vw] sm:w-[30vw] sm:h-[35vw] xs:w-[50vw] xs:h-[55vw] rounded-full bg-theme-purple/20 blur-3xl
 half-cirle-left"
    ></div>
  )
}

const HalfCyanCircles = () => {
  return (
    <div
      className="purple-shadow-circle md:w-[20vw] md:h-[25vw] sm:w-[30vw] sm:h-[35vw] xs:w-[50vw] xs:h-[55vw] rounded-full bg-theme-cyan/20 blur-3xl
 half-cirle-right"
    ></div>
  )
}

export { HalfPurpleCircles, HalfCyanCircles }
