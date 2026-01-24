import React, { useEffect, useRef, useState } from 'react'
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import {
  contactMsgFindById,
  selectAllMessages,
  toggleSelectMessage,
} from '../../../../features/messageSlice'
import { useDeleteEntryContext } from '../../../../context/DeleteEntry'

const CMTable = () => {
  const { contactCurrentMessages, currentPageMsgsCounts } = useSelector(
    state => state.contactMessages
  )
  const { setRoute, setIds, setQueryKey, setIsOpen } = useDeleteEntryContext()

  // ✅ Whenever something deletes successfully, call refetch()
  useEffect(() => {
    setQueryKey('contactMessages') // used for DeleteConfirm context
  }, [setQueryKey])

  const dispatch = useDispatch()
  const masterRef = useRef(null)

  // 🟦 Update master checkbox state
  useEffect(() => {
    if (contactCurrentMessages.length > 0 && masterRef.current) {
      const allSelected = contactCurrentMessages.every(m => m.selected)
      const someSelected = contactCurrentMessages.some(m => m.selected)
      masterRef.current.checked = allSelected
      masterRef.current.indeterminate = someSelected && !allSelected
    }
  }, [contactCurrentMessages])

  // 🟧 Handlers
  const handleSelectAll = e => {
    dispatch(selectAllMessages(e.target.checked))
  }

  const handleRowSelect = id => {
    console.log(typeof id)
    dispatch(toggleSelectMessage(id))
  }

  const handleViewMessageStack = id => {
    dispatch(contactMsgFindById(id))
  }

  const setDeleteIds = async (id = null) => {
    let idsToDelete = []
    if (id) {
      // 🗑️ Single delete
      idsToDelete = [id]
    } else {
      // 🧾 Multiple or All delete
      idsToDelete = contactCurrentMessages.filter(m => m.selected).map(m => m.id)
    }

    setIds(idsToDelete)
    setIsOpen(true)
    setRoute('/message/delete')
    setQueryKey('contactMessages')
  }

  return (
    <div
      className="w-full md:rounded-[1.5vw] sm:rounded-[2vw] xs:rounded-[2.5vw]
        border border-cyan-400/20 bg-gradient-to-br from-[#0a0a2a]/60 to-[#101040]/30
        backdrop-blur-2xl shadow-[0_0_20px_rgba(34,211,238,0.2)]
         overflow-hidden"
    >
      {/* ✅ Scrollable Wrapper for Mobile */}
      <div className="overflow-x-auto custom-scrollbar ">
        <div className="space-y-4">
          <div className="md:min-w-[200vw] sm:min-w-[350vw] xs:min-w-[550vw]">
            {/* Header */}
            <div className="w-full grid grid-cols-16 md:gap-[2vw] sm:gap-[4vw] xs:gap-[6vw] items-center md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw] font-semibold text-cyan-300 border-b border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-lg">
              <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center tracking-wide uppercase">
                <input
                  ref={masterRef}
                  type="checkbox"
                  onChange={handleSelectAll}
                  className="accent-cyan-400 md:w-[1vw] md:h-[1vw] sm:w-[2vw] sm:h-[2vw] xs:w-[3.5vw] xs:h-[3.5vw]"
                />
              </div>
              {[
                'id',
                'Plan Id (optional)',
                'Sender',
                'Subject',
                'Email',
                'City',
                'Country',
                'ISP',
                'Latitude',
                'Longitude',
                'IP Address',
                'Region',
                'Date',
                'Status',
                'Action',
              ].map((head, i) => {
                return (
                  <div
                    key={i}
                    className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center tracking-wide uppercase"
                  >
                    {head}
                  </div>
                )
              })}
            </div>

            {/* Scrollable Table Body */}
            <div className="md:max-h-[25vw] sm:max-h-[55vw] xs:max-h-[75vw] overflow-y-auto custom-scrollbar divide-y divide-cyan-400/20 ">
              {contactCurrentMessages.length > 0 ? (
                contactCurrentMessages.map((item, _) => {
                  console.log(item)

                  const date = new Date(item?.createdAt).toLocaleDateString()
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-16 md:gap-[2vw] sm:gap-[4vw] xs:gap-[6vw] items-center text-cyan-100 md:text-[0.95vw] sm:text-[1.9vw] xs:text-[3.5vw]
                  hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10
                  transition-all duration-300 ease-in-out break-words"
                    >
                      <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center tracking-wide uppercase">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => handleRowSelect(item?.id)}
                          className="accent-cyan-400 md:w-[1vw] md:h-[1vw] sm:w-[2vw] sm:h-[2vw] xs:w-[3.5vw] xs:h-[3.5vw]"
                        />
                      </div>

                      <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center font-medium">
                        {item.id}
                      </div>

                      <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center font-medium">
                        {item.planId}
                      </div>

                      <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center font-medium">
                        {item.fullName}
                      </div>

                      <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center font-medium">
                        {item.subject}
                      </div>

                      <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center font-medium">
                        {item.email}
                      </div>

                      <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center font-medium">
                        {item?.city || 'Not Provided'}
                      </div>

                      <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center font-medium">
                        {item?.country || 'Not Provided'}
                      </div>

                      <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center font-medium">
                        {item?.isp || 'Not Provided'}
                      </div>

                      <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center font-medium">
                        {item?.latitude || 'Not Provided'}
                      </div>

                      <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center font-medium">
                        {item?.longitude || 'Not Provided'}
                      </div>

                      <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center font-medium">
                        {item?.ipAddress || 'Not Provided'}
                      </div>

                      <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center font-medium">
                        {item?.region || 'Not Provided'}
                      </div>

                      <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center font-medium">
                        {date}
                      </div>

                      <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] text-center">
                        <span
                          className={`md:px-[1vw] sm:px-[2vw] xs:px-[3vw] md:py-[0.3vw] sm:py-[0.8vw] xs:py-[1.3vw] rounded-full text-[0.9em]
                      ${
                        item.status.toLowerCase() === 'read'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/40'
                      }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="md:py-[1.5vw] sm:py-[2.5vw] xs:py-[3.5vw] flex justify-center md:gap-[1vw] sm:gap-[2vw] xs:gap-[3vw]">
                        <button
                          className="md:w-[2.5vw] md:h-[2.5vw] sm:w-[5vw] sm:h-[5vw] xs:w-[7.5vw] xs:h-[7.5vw] md:rounded-[0.5vw] sm:rounded-[1vw] xs:rounded-[1.5vw] flex items-center justify-center
                      bg-gradient-to-r from-purple-600/30 to-indigo-600/30
                      border border-purple-500/40 text-purple-200 hover:from-purple-500/50 hover:to-indigo-500/40
                      shadow-[0_0_10px_rgba(147,51,234,0.3)] transition-all duration-300"
                          title="View"
                          onClick={() => handleViewMessageStack(item?.id)}
                        >
                          <FaEye className="md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw]" />
                        </button>

                        <button
                          onClick={() => setDeleteIds(item?.id)}
                          className="md:w-[2.5vw] md:h-[2.5vw] sm:w-[5vw] sm:h-[5vw] xs:w-[7.5vw] xs:h-[7.5vw] flex items-center justify-center md:rounded-[0.5vw] sm:rounded-[1vw] xs:rounded-[1.5vw]
                      bg-gradient-to-r from-cyan-600/30 to-blue-600/30
                      border border-cyan-500/40 text-cyan-200 hover:from-cyan-500/50 hover:to-blue-500/40
                      shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all duration-300"
                          title="Delete"
                        >
                          <FaTrashAlt className="md:text-[1vw] sm:text-[2vw] xs:text-[3.5vw]" />
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="md:text-[1.2vw] sm:text-[2.2vw] xs:text-[4.2vw] text-gray-400 text-center md:py-[2vw] sm:py-[3vw] xs:py-[4vw]">
                  No Message found with this filter
                </p>
              )}

              {/* Empty state */}
              {currentPageMsgsCounts.length === 0 && (
                <div className="p-8 text-center text-gray-300">No messages found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CMTable
