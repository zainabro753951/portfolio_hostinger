import React from 'react'

const ServiceSkeleton = () => {
  return (
    <div className="w-full text-white bg-circut font-inter">
      <div className="w-full h-full bg-theme-dark/80">
        <div className="w-full h-full md:py-[8vw] sm:py-[9vw] xs:py-[10vw] md:px-[2.5vw] sm:px-[3vw] xs:px-[3.5vw] bg-theme-purple/10 animate-pulse">
          {/* Section Heading Skeleton */}
          <div className="w-full flex justify-center">
            <div className="h-[3vw] sm:h-[4vw] xs:h-[6vw] w-[35vw] sm:w-[45vw] xs:w-[60vw] bg-gray-700/60 rounded-full"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="md:mt-[1.5vw] sm:mt-[2.5vw] xs:mt-[3.5vw] grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="md:p-[0.2vw] sm:p-[0.4vw] xs:p-[0.8vw] md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] gradient-button"
              >
                <div className="w-full h-full md:p-[1.5vw] sm:p-[2vw] xs:p-[2.5vw] bg-theme-dark md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] flex flex-col md:gap-[1.5vw] sm:gap-[2vw] xs:gap-[2.5vw]">
                  {/* Icon Placeholder */}
                  <div className="md:h-[3vw] sm:h-[4vw] xs:h-[6vw] md:w-[3vw] sm:w-[4vw] xs:w-[6vw] bg-gray-700/70 rounded-full"></div>

                  {/* Title Placeholder */}
                  <div className="h-[1.6vw] sm:h-[2.6vw] xs:h-[4.6vw] w-[70%] bg-gray-700/70 rounded-md"></div>

                  {/* Description Placeholder */}
                  <div className="space-y-[0.6vw] sm:space-y-[1vw] xs:space-y-[1.5vw] mt-[0.8vw]">
                    <div className="h-[1vw] sm:h-[1.6vw] xs:h-[3vw] w-full bg-gray-700/60 rounded-md"></div>
                    <div className="h-[1vw] sm:h-[1.6vw] xs:h-[3vw] w-[85%] bg-gray-700/60 rounded-md"></div>
                    <div className="h-[1vw] sm:h-[1.6vw] xs:h-[3vw] w-[70%] bg-gray-700/60 rounded-md"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceSkeleton
