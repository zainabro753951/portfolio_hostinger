import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { FaSearch } from 'react-icons/fa'
import CustomSelect from '../../Components/CustomSelect'
import { useDispatch } from 'react-redux'
import { setSelectedIds, sortContactMessages } from '../../../../features/messageSlice'
import { useDeleteEntryContext } from '../../../../context/DeleteEntry'
import { glassToast } from '../../Components/ToastMessage'
import { store } from '../../../../app/store'
import { useMarkAsRead } from '../../../../Queries/MarkAsRead'

const ContactMessageHeader = () => {
  const { setRoute, setIds, setQueryKey, setIsOpen } = useDeleteEntryContext()

  // ✅ Whenever something deletes successfully, call refetch()
  useEffect(() => {
    setQueryKey('contactMessages') // used for DeleteConfirm context
  }, [setQueryKey])

  const dispatch = useDispatch()
  const [selected, setSelected] = useState('All')
  // framer variants
  const fadeIn = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.45 } },
  }

  const options = ['All', 'New', 'Read', 'Unread']

  useEffect(() => {
    if (selected) {
      dispatch(sortContactMessages(selected))
    }
  }, [selected, dispatch])

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
      glassToast('Please select at least one message to for mark as read!', 'warning')
      return
    }

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

  return (
    <motion.header
      variants={fadeIn}
      className="flex flex-col  md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw] md:mb-[1.5vw] sm:mb-[2.5vw] xs:mb-[3.5vw] "
    >
      <div>
        <h1 className="md:text-[1.5vw] sm:text-[2.5vw] xs:text-[4.5vw] font-semibold">
          Contact Messages
        </h1>
        <p className="md:text-[1vw] sm:text-[2vw] xs:text-[4vw] text-gray-400 ">
          All messages submitted through your website contact form.
        </p>
      </div>
      <div className="w-full flex justify-end">
        <div className="flex md:flex-row xs:flex-col md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw] md:items-center ">
          <div className="md:py-[0.5vw] sm:py-[1vw] xs:py-[1.5vw] md:px-[1vw] sm:px-[2vw] xs:px-[3vw] bg-gradient-to-r from-cyan-500/30 to-blue-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.25)] rounded-full md:text-[1vw] sm:text-[2vw] xs:text-[4vw] flex items-center md:gap-[0.7vw] sm:gap-[1.7vw] xs:gap-[2.7vw]">
            <FaSearch />
            <input
              type="search"
              className="outline-none"
              placeholder="Search name, email, subject"
            />
          </div>
          <CustomSelect options={options} selected={selected} setSelected={setSelected} />
          <div
            className="flex items-center md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw] border border-cyan-400/20 bg-gradient-to-br from-[#0a0a2a]/60 to-[#101040]/30
        backdrop-blur-2xl shadow-[0_0_20px_rgba(34,211,238,0.2)] md:p-[0.7vw] sm:p-[1.2vw] xs:p-[1.7vw] w-fit  md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw]"
          >
            {/* Mark Read button */}
            <motion.button
              onClick={() => setMarkAsRead()}
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
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200 }}
              onClick={() => setDeleteIds()}
              className="md:py-[0.5vw] sm:py-[1vw] xs:py-[1.5vw] md:px-[1.5vw] sm:px-[2.5vw] xs:px-[4.5vw] bg-gradient-to-r from-red-500/30 to-orange-500/20
          border border-red-400 shadow-[0_0_15px_rgba(34,211,238,0.25)]
          md:text-[1vw] sm:text-[2vw] xs:text-[4vw] md:rounded-[0.7vw] sm:rounded-[1.2vw] xs:rounded-[1.7vw] "
            >
              Delete
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default ContactMessageHeader
