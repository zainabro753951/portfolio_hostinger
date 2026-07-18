import { Server } from 'socket.io'

let io

export const initSocket = (server) => {
  const isProduction = process.env.NODE_ENV === 'production'

  const rawOrigins = isProduction
    ? process.env.FRONTEND_URLS || 'https://www.zaincode.io,https://zaincode.io'
    : 'http://localhost:5173,http://localhost:5174'

  const allowedOrigins = rawOrigins
    .split(',')
    .map((o) => o.trim())
    .filter((o) => o.length > 0)

  console.log('🔐 Socket.IO CORS allowed origins:', allowedOrigins)

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Shared hosting ke liye polling pehle rakhna zyada reliable hota hai agar WebSocket block ho
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 45000,
  })

  const activeUsers = new Map()

  io.on('connection', (socket) => {
    console.log('🟢 Socket Connected:', socket.id, 'IP:', socket.handshake.address)

    const transportName = socket.transport?.name || socket.conn?.transport?.name || 'unknown'

    activeUsers.set(socket.id, {
      connectedAt: new Date(),
      transport: transportName,
    })

    // Broadcast active users count
    io.emit('activeUsersCount', { count: activeUsers.size })

    socket.on('userActivity', (data) => {
      // Minimal processing to save CPU
      // console.log('📡 User activity:', data)
    })

    socket.on('disconnect', (reason) => {
      console.log(`🔴 Socket Disconnected: ${socket.id} | Reason: ${reason}`)
      activeUsers.delete(socket.id)
      io.emit('activeUsersCount', { count: activeUsers.size })
    })

    socket.on('error', (error) => {
      console.error(`❌ Socket Error (${socket.id}):`, error.message)
      activeUsers.delete(socket.id) // Cleanup on error
    })
  })

  io.on('connection_error', (err) => {
    console.error('🚨 Socket.IO Connection Error:', err.message)
  })

  return io
}

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocket(server) first.')
  }
  return io
}
