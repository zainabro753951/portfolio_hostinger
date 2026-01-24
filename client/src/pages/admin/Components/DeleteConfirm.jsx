import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useDeleteEntryContext } from '../../../context/DeleteEntry'

const DeleteConfirm = () => {
  const { isOpen, onDelete, onClose, isPending, route, ids } = useDeleteEntryContext()

  // Dynamic heading & text
  const getTitle = () => {
    if (ids?.length > 1) return `Delete ${ids.length} Items?`
    if (route?.includes('contact')) return 'Delete Message?'
    if (route?.includes('project')) return 'Delete Project?'
    if (route?.includes('blog')) return 'Delete Blog Post?'
    return 'Confirm Deletion'
  }

  const getMessage = () => {
    if (ids?.length > 1)
      return `Are you sure you want to delete ${ids.length} selected items? This action cannot be undone.`
    return 'Are you sure you want to delete this item? This action cannot be undone.'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-0 h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, type: 'spring', stiffness: 180 }}
            className="bg-gradient-to-br from-[#0a0a2a] to-[#171753] border border-cyan-400/30
              md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[3.5vw]
              md:p-[3vw] sm:p-[4vw] xs:p-[5vw]
              shadow-[0_0_25px_rgba(34,211,238,0.25)]
              text-center max-w-md w-[90%]"
          >
            {/* 🔹 Title */}
            <h2 className="text-cyan-300 md:text-[1.7vw] sm:text-[2.7vw] xs:text-[4.7vw] font-semibold md:mb-[1vw] sm:mb-[2vw] xs:mb-[3vw]">
              {getTitle()}
            </h2>

            {/* 🔹 Message */}
            <p className="text-cyan-100/80 md:mb-[1.6vw] sm:mb-[2.6vw] xs:mb-[3.6vw] md:text-[1.2vw] sm:text-[2.2vw] xs:text-[4.2vw]">
              {getMessage()}
            </p>

            {/* 🔹 Buttons */}
            <div className="flex justify-center md:gap-[1.6vw] sm:gap-[2.6vw] xs:gap-[3.6vw]">
              <motion.button
                disabled={isPending}
                onClick={onDelete}
                whileHover={!isPending ? { scale: 1.05 } : {}}
                transition={{ type: 'spring', stiffness: 200 }}
                className={`md:py-[0.5vw] sm:py-[1vw] xs:py-[1.5vw]
                  md:px-[1.5vw] sm:px-[2.5vw] xs:px-[4.5vw]
                  border shadow-[0_0_15px_rgba(34,211,238,0.25)]
                  md:text-[1vw] sm:text-[2vw] xs:text-[4vw]
                  md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw]
                  ${
                    isPending
                      ? 'bg-gray-500/30 border-gray-400 cursor-not-allowed text-gray-300'
                      : 'bg-gradient-to-r from-red-500/30 to-orange-500/20 border-red-400 text-red-200 hover:from-red-500/50 hover:to-orange-500/30'
                  }`}
              >
                {isPending ? 'Deleting...' : 'Confirm'}
              </motion.button>

              <motion.button
                disabled={isPending}
                whileHover={!isPending ? { scale: 1.05 } : {}}
                onClick={onClose}
                transition={{ type: 'spring', stiffness: 200 }}
                className={`md:py-[0.5vw] sm:py-[1vw] xs:py-[1.5vw]
                  md:px-[1.5vw] sm:px-[2.5vw] xs:px-[4.5vw]
                  border shadow-[0_0_15px_rgba(34,211,238,0.25)]
                  md:text-[1vw] sm:text-[2vw] xs:text-[4vw]
                  md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw]
                  ${
                    isPending
                      ? 'bg-gray-500/30 border-gray-400 cursor-not-allowed text-gray-300'
                      : 'bg-gradient-to-r from-cyan-500/30 to-blue-500/20 border-cyan-400 text-cyan-200 hover:from-cyan-500/50 hover:to-blue-500/30'
                  }`}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DeleteConfirm
