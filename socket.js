import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  const allowedOrigins =
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URLS?.split(",")
      : ["http://localhost:5173", "http://localhost:5174"];

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const activeUsers = new Map();

  io.on("connection", (socket) => {
    console.log("🟢 Socket Connected:", socket.id);

    activeUsers.set(socket.id, true);

    // 🔥 send to all clients
    io.emit("activeUsersCount", {
      count: activeUsers.size,
    });

    socket.on("disconnect", (reason) => {
      console.log(`🔴 Socket Disconnected: ${socket.id} | Reason: ${reason}`);

      activeUsers.delete(socket.id);

      io.emit("activeUsersCount", {
        count: activeUsers.size,
      });
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
