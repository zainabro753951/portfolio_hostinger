// src/socket/socket.js
import { io } from "socket.io-client";

const isProduction = import.meta.env.MODE === "production";

// DEV → full backend URL
// PROD → same origin (empty string / undefined)
const SOCKET_URL = isProduction
  ? undefined
  : import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,

  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,

  // Polling first (Hostinger friendly)
  transports: ["polling", "websocket"],
});

export default socket;
