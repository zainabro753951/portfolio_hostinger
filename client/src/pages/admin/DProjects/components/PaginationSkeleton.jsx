import React from 'react'

const PaginationSkeleton = () => {
  return (
    <>
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="md:w-[3vw] md:h-[3vw] sm:w-[5.5vw] sm:h-[5.5vw] xs:w-[8.5vw] xs:h-[8.5vw] rounded-full
      bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30
      shadow-[0_0_10px_rgba(34,211,238,0.2)] animate-pulse"
          ></div>
        ))}
    </>
  )
}

export default PaginationSkeleton
