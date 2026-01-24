import { io } from "socket.io-client";

const isProduction = import.meta.env.MODE === "production";

// Production mein relative path use hoga (Hostinger friendly)
// Dev mein environment variable ya localhost use hoga
const SOCKET_URL = isProduction
  ? "/"
  : import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,

  // IMPORTANT: Hostinger par WebSocket aksar block hota hai ya upgrade fail hota hai.
  // Polling ko priority dena connection stabilize karta hai.
  transports: ["polling", "websocket"],

  // Agar aapka backend kisi subfolder ya specific path par hai
  path: "/socket.io/",
});

// Debugging ke liye (Optional)
if (!isProduction) {
  socket.on("connect", () => console.log("🟢 Socket connected locally"));
  socket.on("connect_error", (err) =>
    console.log("🔴 Socket Error:", err.message),
  );
}

export default socket;
