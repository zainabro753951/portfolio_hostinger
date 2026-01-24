// src/context/DeleteEntry.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useDeleteEntry } from '../Queries/DeleteEntryQuery'
import { glassToast } from '../pages/admin/Components/ToastMessage'
import { clearViewMessage, deleteMessage } from '../features/messageSlice'
import { useDispatch } from 'react-redux'

export const DeleteEntryContext = createContext()
export const useDeleteEntryContext = () => useContext(DeleteEntryContext)

const DeleteEntry = ({ children }) => {
  const [route, setRoute] = useState('')
  const [queryKey, setQueryKey] = useState([])
  const [ids, setIds] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()

  const { mutate, isPending, isSuccess, isError, data, error } = useDeleteEntry(queryKey)

  const onClose = () => {
    setIsOpen(false)
    setRoute('')
    setIds([])
    setQueryKey([])
  }

  const onDelete = () => {
    mutate({ route, ids })
  }

  useEffect(() => {
    if (isSuccess) {
      glassToast(data?.message || 'Deleted successfully', 'success')
      onClose()
      dispatch(deleteMessage(ids))
      dispatch(clearViewMessage())
    }
    if (isError) {
      console.error(error)
      glassToast(error?.response?.data?.message || 'Error deleting entry', 'error')
    }
  }, [isSuccess, isError])

  return (
    <DeleteEntryContext.Provider
      value={{
        setRoute,
        setIds,
        setQueryKey,
        setIsOpen,
        isOpen,
        onDelete,
        onClose,
        isPending,
      }}
    >
      {children}
    </DeleteEntryContext.Provider>
  )
}

export default DeleteEntry
