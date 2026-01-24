import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { initSocket } from "./socket.js";
import logger from "./Utils/logger.js";

// Load Environment Variables
dotenv.config();

// --- DEBUG LOGS START ---
console.log("--- ENV DEBUGGING ---");
console.log("Raw PORT from ENV:", process.env.PORT);
console.log("Raw FRONTEND_URLS:", process.env.FRONTEND_URLS);
console.log("Node Environment:", process.env.NODE_ENV);
console.log("--- END DEBUGGING ---");
// ------------------------

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  // Verification ke liye ek aur log
  if (!process.env.PORT) {
    console.warn(
      "⚠️ Warning: PORT variable not found in ENV, using default 3000",
    );
  } else {
    console.log(`✅ Success: Environment variables are being detected.`);
  }
});
