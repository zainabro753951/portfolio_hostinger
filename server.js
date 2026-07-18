import dotenv from 'dotenv'
import http from 'http'
import app from './app.js'
import { initSocket } from './socket.js'
import logger from './Utils/logger.js'

dotenv.config()

const PORT = process.env.PORT || 3000

const server = http.createServer(app)

// Initialize Socket.io
initSocket(server)

// Prevent server from hanging on long idle connections (Shared hosting optimization)
server.keepAliveTimeout = 65000
server.headersTimeout = 66000

server.listen(PORT, () => {
  logger.info(`🚀 Server running smoothly on port ${PORT}`)
})

// Graceful shutdown (Optional but recommended for stability)
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Closing HTTP server...')
  server.close(() => {
    logger.info('HTTP server closed.')
    process.exit(0)
  })
})
