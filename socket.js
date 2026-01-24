import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  // Agar same port hai, toh 'cors' object ki zaroorat nahi padti
  // Magar development flexibility ke liye hum isse empty ya specific rakh sakte hain
  io = new Server(server, {
    cors: {
      // Same port ke liye "*" ya origin define karne ki sakht zaroorat nahi hoti
      // Lekin agar aap safe side rehna chahte hain:
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const activeUsers = new Map();

  io.on("connection", (socket) => {
    console.log("🟢 Socket Connected:", socket.id);

    activeUsers.set(socket.id, true);

    // Broadcast count
    io.emit("activeUsersCount", {
      count: activeUsers.size,
    });

    socket.on("disconnect", (reason) => {
      console.log("🔴 Socket Disconnected:", socket.id);
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
