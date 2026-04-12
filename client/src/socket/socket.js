import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  transports: ["polling", "websocket"],
  path: "/socket.io",
});

// 🔥 Always keep logs while debugging
socket.on("connect", () => console.log("🟢 Socket connected:", socket.id));

socket.on("connect_error", (err) =>
  console.log("🔴 Socket Error:", err.message),
);

socket.on("disconnect", (reason) => console.log("🔴 Disconnected:", reason));

export default socket;
