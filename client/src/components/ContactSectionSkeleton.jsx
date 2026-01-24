import { motion } from 'motion/react'
import { SkeletonBlock } from '../pages/admin/DHome/components/SkeletonBlock'

const ContactSectionSkeleton = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full bg-theme-dark relative overflow-hidden"
    >
      {/* Content Wrapper */}
      <div className="relative z-10 w-full h-full md:py-[8vw] sm:py-[9vw] xs:py-[10vw] md:px-[2.5vw] sm:px-[3vw] xs:px-[3.5vw] flex flex-col md:gap-[4vw] sm:gap-[5vw] xs:gap-[6vw]">
        {/* Heading */}
        <div className="flex justify-center mb-[3vw]">
          <SkeletonBlock className="w-[40%] h-[3vw] sm:h-[5vw] xs:h-[8vw] rounded-[1vw]" />
        </div>

        <div className="grid md:grid-cols-2 xs:grid-cols-1 md:gap-[5vw] sm:gap-[10vw] xs:gap-[15vw]">
          {/* LEFT Column */}
          <div className="flex flex-col gap-[2vw]">
            <SkeletonBlock className="w-[30%] h-[2vw] sm:h-[3vw] xs:h-[5vw] rounded-[1vw]" />
            <SkeletonBlock className="w-[75%] h-[4vw] sm:h-[7vw] xs:h-[12vw] rounded-[1vw]" />

            {/* Contact Details */}
            <div className="mt-[1vw] flex flex-col gap-[1vw]">
              <SkeletonBlock className="w-[40%] h-[2.5vw] sm:h-[3.5vw] xs:h-[5.5vw] rounded-[1vw]" />

              {[...Array(2)].map((_, idx) => (
                <div key={idx} className="flex items-center gap-[1.5vw]">
                  <SkeletonBlock className="md:w-[2vw] md:h-[2vw] sm:w-[3vw] sm:h-[3vw] xs:w-[5vw] xs:h-[5vw] rounded-full" />
                  <SkeletonBlock className="w-[35%] h-[1.5vw] sm:h-[2.5vw] xs:h-[4vw] rounded-md" />
                </div>
              ))}
            </div>

            {/* Social Icons */}
            <div className="mt-[1vw] flex flex-col gap-[1vw]">
              <SkeletonBlock className="w-[40%] h-[2.5vw] sm:h-[3.5vw] xs:h-[5.5vw] rounded-[1vw]" />
              <div className="flex items-center gap-[1.5vw]">
                {[...Array(3)].map((_, idx) => (
                  <SkeletonBlock
                    key={idx}
                    className="md:w-[2.5vw] md:h-[2.5vw] sm:w-[3.5vw] sm:h-[3.5vw] xs:w-[5.5vw] xs:h-[5.5vw] rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT Column (Form Skeleton) */}
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-[1vw] rounded-[1.5vw] bg-theme-purple/5 backdrop-blur-2xl border border-white/10  shadow-lg w-full h-full"
            >
              <div className="flex flex-col gap-[1.5vw] md:p-[2vw] sm:p-[2.5vw] xs:p-[3vw]">
                <SkeletonBlock className="w-[40%] h-[2vw] sm:h-[3vw] xs:h-[5vw] rounded-[1vw]" />

                {/* Form Fields */}
                {['Full Name', 'Subject', 'Email'].map((_, idx) => (
                  <div key={idx} className="flex flex-col gap-[1vw]">
                    <SkeletonBlock className="w-[30%] h-[1.5vw] sm:h-[2.5vw] xs:h-[4vw] rounded-md" />
                    <SkeletonBlock className="w-full h-[3vw] sm:h-[5vw] xs:h-[8vw] rounded-md" />
                  </div>
                ))}

                {/* Message Field */}
                <div className="flex flex-col gap-[1vw]">
                  <SkeletonBlock className="w-[40%] h-[1.5vw] sm:h-[2.5vw] xs:h-[4vw] rounded-md" />
                  <SkeletonBlock className="w-full h-[7vw] sm:h-[10vw] xs:h-[18vw] rounded-md" />
                </div>

                {/* Button */}
                <SkeletonBlock className="w-[35%] h-[3vw] sm:h-[5vw] xs:h-[8vw] rounded-[1vw] bg-theme-cyan/20" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default ContactSectionSkeleton
