import { motion } from 'motion/react'
import React from 'react'
import { useSelector } from 'react-redux'
import FAQ from './FAQ'

const glassClass = `md:p-[1.5vw] sm:p-[2vw] xs:p-[2.5vw] md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw]
      bg-gradient-to-br from-[#0a0a2a]/60 to-[#101040]/30
                 border border-white/20 backdrop-blur-2xl shadow-[0_0_20px_rgba(34,211,238,0.2)]
       w-full`

const FAQTable = () => {
  const { FAQs } = useSelector(state => state.FAQ)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={glassClass}
    >
      <h3 className="md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] font-semibold">All FAQs</h3>

      <div className="w-full flex flex-col ">
        {FAQs.length > 0 ? (
          FAQs?.map((item, idx) => {
            return <FAQ faq={item} idx={idx} key={idx} />
          })
        ) : (
          <div
            className="w-full md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw]
        border border-cyan-400/20 bg-gradient-to-br from-[#0a0a2a]/60 to-[#101040]/30
        backdrop-blur-2xl shadow-[0_0_20px_rgba(34,211,238,0.2)]
         md:text-[1.2vw] sm:text-[2.2vw] xs:text-[4.2vw] text-gray-400 md:p-[1.5vw] sm:p-[2vw] xs:p-[2.5vw] md:mt-[2vw] sm:mt-[3vw] xs:mt-[4vw]"
          >
            No FAQs have been added yet. Start by creating your first one!
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default FAQTable
