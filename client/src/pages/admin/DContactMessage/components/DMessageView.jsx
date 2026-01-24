import React, { useEffect } from 'react'
import { motion } from 'motion/react'
import { useDispatch, useSelector } from 'react-redux'
import { useDeleteEntryContext } from '../../../../context/DeleteEntry'
import { setSelectedIds } from '../../../../features/messageSlice'
import { store } from '../../../../app/store'
import { glassToast } from '../../Components/ToastMessage'
import { useMarkAsRead } from '../../../../Queries/MarkAsRead'

const glassClass = `
  md:p-[1.5vw] sm:p-[2vw] xs:p-[3vw]
  md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw]
  bg-gradient-to-br from-[#0a0a2a]/60 to-[#101040]/30
  border border-white/20 backdrop-blur-2xl
  shadow-[0_0_25px_rgba(34,211,238,0.15)]
  w-full flex flex-col md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]
`

const DMessageView = () => {
  const { viewMessage } = useSelector(state => state.contactMessages)
  const { setRoute, setIds, setQueryKey, setIsOpen } = useDeleteEntryContext()
  const dispatch = useDispatch()

  // ✅ Whenever something deletes successfully, call refetch()
  useEffect(() => {
    setQueryKey('contactMessages') // used for DeleteConfirm context
  }, [setQueryKey])

  const setDeleteIds = async (id = null) => {
    // Dispatch selection update
    dispatch(setSelectedIds(id))

    // 🧠 Get fresh state directly after dispatch
    const state = store.getState()
    const updatedIds = id
      ? [id]
      : state.contactMessages.contactCurrentMessages?.filter(m => m.selected).map(m => m.id) || []

    // ⚠️ Validation — must have at least one ID
    if (!updatedIds.length) {
      glassToast('Please select at least one message to delete!', 'warning')
      return
    }

    // ✅ Continue deletion process
    setIds(updatedIds)
    setRoute('/message/delete')
    setQueryKey('contactMessages')
    setIsOpen(true)
  }

  const { mutate, isError, isSuccess, data, error } = useMarkAsRead()
  const setMarkAsRead = async (id = null) => {
    // Dispatch selection update
    dispatch(setSelectedIds(id))

    // 🧠 Get fresh state directly after dispatch
    const state = store.getState()
    const updatedIds = id
      ? [id]
      : state.contactMessages.contactCurrentMessages?.filter(m => m.selected).map(m => m.id) || []

    // ⚠️ Validation — must have at least one ID
    if (!updatedIds.length) {
      glassToast('Please select at least one message for mark as read!', 'warning')
      return
    }

    console.log(updatedIds)

    // ✅ Continue Mark as read query process
    mutate(updatedIds)
  }

  useEffect(() => {
    if (isSuccess) glassToast(data?.message, 'success')
    if (isError) {
      console.log(error)
      glassToast(error?.response?.data?.message, 'error')
    }
  }, [isSuccess, isError])

  const fullDateTime = new Date(viewMessage?.createdAt).toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // 👈 ye 12-hour AM/PM format dikhayega
  })
  console.log(fullDateTime)

  return (
    <>
      <div className={glassClass}>
        {viewMessage ? (
          <div>
            <div className="w-full flex xs:flex-col md:flex-row xs:gap-[3vw] sm:gap-[2vw] md:gap-0 items-center justify-between md:pb-[1vw] sm:pb-[2vw] xs:pb-[3vw] border-b border-gray-600">
              <div className="md:w-1/2">
                <h5 className="md:text-[1.2vw] sm:text-[2.2vw] xs:text-[4.2vw] font-semibold">
                  {viewMessage?.fullName}
                </h5>
                <p className="md:text-[1vw] sm:text-[2vw] xs:text-[4vw] text-gray-400">
                  {viewMessage?.email} • {fullDateTime}
                </p>
              </div>
              <div className="flex items-center md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
                {/* Mark Read button */}
                <motion.button
                  onClick={() => setMarkAsRead(viewMessage?.id)}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="md:py-[0.5vw] sm:py-[1vw] xs:py-[1.5vw] md:px-[1.5vw] sm:px-[2.5vw] xs:px-[4.5vw] bg-gradient-to-r from-cyan-500/30 to-blue-500/20
          border border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.25)]
          md:text-[1vw] sm:text-[2vw] xs:text-[4vw] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw]"
                >
                  Mark Read
                </motion.button>

                {/* Delete Button */}
                <motion.button
                  onClick={() => setDeleteIds(viewMessage?.id)}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="md:py-[0.5vw] sm:py-[1vw] xs:py-[1.5vw] md:px-[1.5vw] sm:px-[2.5vw] xs:px-[4.5vw] bg-gradient-to-r from-red-500/30 to-orange-500/20
          border border-red-400 shadow-[0_0_15px_rgba(34,211,238,0.25)]
          md:text-[1vw] sm:text-[2vw] xs:text-[4vw] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] "
                >
                  Delete
                </motion.button>
              </div>
            </div>
            {/* Message */}
            <div className="md:mt-[1vw] sm:mt-[2vw] xs:mt-[3vw]">
              <p className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-300">
                {viewMessage?.message}
              </p>
            </div>
          </div>
        ) : (
          <p className="md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-300">
            No Message Selected for Viewing
          </p>
        )}
      </div>
    </>
  )
}

export default DMessageView
