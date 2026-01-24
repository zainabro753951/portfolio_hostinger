// src/socket/SocketProvider.jsx
import { useEffect, useRef } from 'react'
import socket from './socket'
import { setActiveUsersCount } from '../features/siteSettingsSlice'
import { useDispatch } from 'react-redux'

const SocketProvider = ({ children }) => {
  const dispatch = useDispatch()
  const initialized = useRef(false)

  useEffect(() => {
    // 🛑 Prevent double init (React 18 StrictMode fix)
    if (initialized.current) return
    initialized.current = true

    if (!socket.connected) {
      socket.connect()
    }

    socket.on('connect', () => {
      console.log('🟢 Socket connected:', socket.id)
    })

    socket.on('activeUsersCount', ({ count }) => {
      dispatch(setActiveUsersCount({ count }))
    })

    socket.on('disconnect', reason => {
      console.log('🔴 Socket disconnected:', reason)
    })

    socket.on('connect_error', err => {
      console.error('❌ Socket connection error:', err.message)
    })

    return () => {
      // 🧹 Proper cleanup
      socket.off('connect')
      socket.off('activeUsersCount')
      socket.off('disconnect')
      socket.off('connect_error')
    }
  }, [dispatch])

  return children
}

export default SocketProvider
