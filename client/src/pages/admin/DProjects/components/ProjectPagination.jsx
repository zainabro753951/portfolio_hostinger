import React from 'react'
import PaginationSkeleton from './PaginationSkeleton'

const ProjectPagination = () => {
  const pages = [1, 2, 3, 4]

  return (
    <div className="flex justify-center items-center md:mt-[2vw] sm:mt-[3vw] xs:mt-[4vw] md:mb-[1vw] ms:mb-[2vw] xs:mb-[3vw] md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
      {pages.map((p, i) => (
        <button
          key={i}
          className=" md:w-[3vw] md:h-[3vw] sm:w-[5.5vw] sm:h-[5.5vw] xs:w-[8.5vw] xs:h-[8.5vw] rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20
            border border-cyan-400/30 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]
            hover:from-cyan-500/40 hover:to-blue-500/40 hover:scale-105 transition-all duration-300 md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw]"
        >
          {p}
        </button>
      ))}
    </div>
  )
}

export default ProjectPagination
