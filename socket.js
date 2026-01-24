import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URLS?.split(",") || [
        "http://localhost:5173",
        "http://localhost:5174",
      ],
      credentials: true,
    },
  });

  const activeUsers = new Map();

  io.on("connection", (socket) => {
    console.log("🟢 Socket Connected:", socket.id);

    // Add user
    activeUsers.set(socket.id, true);

    // 🔥 Broadcast updated count to ALL clients
    io.emit("activeUsersCount", {
      count: activeUsers.size,
    });

    // 🔴 Disconnect event
    socket.on("disconnect", (reason) => {
      console.log("🔴 Socket Disconnected:", socket.id, "| Reason:", reason);
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
