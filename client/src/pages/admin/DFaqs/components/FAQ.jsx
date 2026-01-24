import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { useDeleteEntryContext } from '../../../../context/DeleteEntry'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

const actionButtonClass = `md:w-[2vw] md:h-[2vw] sm:w-[4.5vw] sm:h-[4.5vw] xs:w-[7vw] xs:h-[7vw] md:rounded-[0.5vw] sm:rounded-[1vw] xs:rounded-[1.5vw] flex items-center justify-center bg-gradient-to-r border  transition-all duration-300`

const FAQ = ({ faq, idx }) => {
  const [activeIndex, setActiveIndex] = useState(null)
  const { setRoute, setIsOpen, setQueryKey } = useDeleteEntryContext()

  // ✅ Whenever something deletes successfully, call refetch()
  useEffect(() => {
    setQueryKey('FAQs') // used for DeleteConfirm context
  }, [setQueryKey])

  const toggleFAQ = index => {
    setActiveIndex(activeIndex === index ? null : index)
  }
  return (
    <>
      <div
        className="md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw]
        border border-cyan-400/20 bg-gradient-to-br from-[#0a0a2a]/60 to-[#101040]/30
        backdrop-blur-2xl shadow-[0_0_20px_rgba(34,211,238,0.2)]
        md:mt-[2vw] sm:mt-[3vw] xs:mt-[4vw] w-full flex flex-col"
      >
        {/* Question Div */}
        <div
          onClick={() => toggleFAQ(idx)}
          className="w-full md:p-[1.5vw] sm:p-[2vw] xs:p-[2.5vw] flex items-center justify-between"
        >
          <p className="md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] font-semibold">
            {faq?.question}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center md:gap-[3vw] sm:gap-[4vw] xs:gap-[5vw]">
            <div className=" text-center">
              <span
                className={`md:px-[1vw] sm:px-[2vw] xs:px-[3vw] md:py-[0.3vw] sm:py-[0.8vw] xs:py-[1.3vw] rounded-full md:text-[1vw] sm:text-[2vw] xs:text-[4vw]
                    ${
                      faq.status.toLowerCase() === 'published'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/40'
                    }`}
              >
                {faq.status}
              </span>
            </div>
            <div className=" flex justify-center md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
              <Link
                to={`/admin/faqs/${faq?.id}`}
                className={
                  actionButtonClass +
                  'from-purple-600/30 to-indigo-600/30 border border-purple-500/40 text-purple-200 hover:from-purple-500/50 hover:to-indigo-500/40 shadow-[0_0_10px_rgba(147,51,234,0.3)]'
                }
              >
                <FaEdit className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw]" />
              </Link>

              <button
                onClick={() => {
                  setIsOpen(true)
                  setRoute(`/faq/delete/${faq?.id}`)
                  setQueryKey('FAQs')
                }}
                className={
                  actionButtonClass +
                  'from-cyan-600/30 to-blue-600/30 border border-cyan-500/40 text-cyan-200 hover:from-cyan-500/50 hover:to-blue-500/40 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                }
              >
                <FaTrashAlt className="md:text-[0.9vw] sm:text-[1.9vw] xs:text-[3.9vw]" />
              </button>
            </div>
          </div>
        </div>

        {/* Answer Div */}
        <AnimatePresence mode="wait">
          {activeIndex === idx && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <div className="w-full md:p-[1.5vw] sm:p-[2vw] xs:p-[2.5vw]">
                <p className="md:text-[1.2vw] sm:text-[2.2vw] xs:text-[4.2vw] text-gray-400 ">
                  {faq?.answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default FAQ
