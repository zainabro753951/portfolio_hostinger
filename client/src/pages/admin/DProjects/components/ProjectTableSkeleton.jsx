import React from 'react'

export const ProjectHeaderSkeleton = () => {
  return (
    <>
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] flex justify-center animate-pulse "
          >
            <div className="w-[60%] h-[1em] bg-cyan-300/10 rounded-md "></div>
          </div>
        ))}
    </>
  )
}

export const ProjectBodySkeleton = () => {
  return (
    <>
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 items-center text-cyan-100 md:text-[0.95vw] sm:text-[1.9vw] xs:text-[3.5vw] animate-pulse"
          >
            {/* Title */}
            <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] flex justify-center">
              <div className="w-[70%] h-[1em] bg-cyan-300/10 rounded-md"></div>
            </div>

            {/* Tags */}
            <div className="flex justify-center">
              <div className="w-[60%] h-[1em] bg-cyan-300/10 rounded-md"></div>
            </div>

            {/* Tech */}
            <div className="flex justify-center">
              <div className="w-[60%] h-[1em] bg-cyan-300/10 rounded-md"></div>
            </div>

            {/* Status */}
            <div className="flex justify-center">
              <div className="w-[50%] h-[1.3em] bg-cyan-300/10 rounded-full"></div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
              <div className="md:w-[2.5vw] md:h-[2.5vw] sm:w-[5vw] sm:h-[5vw] xs:w-[7.5vw] xs:h-[7.5vw] bg-cyan-300/10 rounded-md"></div>
              <div className="md:w-[2.5vw] md:h-[2.5vw] sm:w-[5vw] sm:h-[5vw] xs:w-[7.5vw] xs:h-[7.5vw] bg-cyan-300/10 rounded-md"></div>
            </div>
          </div>
        ))}
    </>
  )
}
