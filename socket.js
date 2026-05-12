// socket.js
import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  const isProduction = process.env.NODE_ENV === 'production';

  let allowedOrigins = isProduction
    ? (process.env.FRONTEND_URLS || 'https://www.zaincode.io,https://zaincode.io').split(',')
    : ['http://localhost:5173', 'http://localhost:5174'];

  allowedOrigins = allowedOrigins.map((o) => o.trim()).filter((o) => o.length > 0);

  console.log('🔐 Socket.IO CORS allowed origins:', allowedOrigins);

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 45000,
  });

  const activeUsers = new Map();

  io.on('connection', (socket) => {
    console.log('🟢 Socket Connected:', socket.id, 'IP:', socket.handshake.address);
    console.log('🔍 Origin:', socket.handshake.headers.origin);

    // ✅ Safe transport access (FIXED)
    const transportName = socket.transport?.name || socket.conn?.transport?.name || 'unknown';
    console.log('🔍 Transport:', transportName);

    activeUsers.set(socket.id, {
      connectedAt: new Date(),
      transport: transportName, // ✅ Safe value
    });

    // 🔥 Send active users count to all clients
    io.emit('activeUsersCount', {
      count: activeUsers.size,
    });

    console.log(activeUsers.size);

    socket.on('userActivity', (data) => {
      console.log('📡 User activity:', data);
    });

    socket.on('disconnect', (reason) => {
      console.log(`🔴 Socket Disconnected: ${socket.id} | Reason: ${reason}`);
      activeUsers.delete(socket.id);

      io.emit('activeUsersCount', {
        count: activeUsers.size,
      });
    });

    socket.on('error', (error) => {
      console.error(`❌ Socket Error (${socket.id}):`, error);
    });
  });

  io.on('connection_error', (err) => {
    console.error('🚨 Socket.IO Connection Error:', {
      message: err.message,
      context: err.context,
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocket(server) first.');
  }
  return io;
};
