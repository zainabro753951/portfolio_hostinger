import dotenv from "dotenv";
import http from "http";

import app from "./app.js";
import pool from "./db.config.js";
import { initSocket } from "./socket.js";
import { loadSeoCache } from "./Utils/seoCache.js";
import logger from "./Utils/logger.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Shared hosting optimization
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

const startServer = async () => {
  try {
    // 1. Verify MySQL connection
    await pool.query("SELECT 1");

    logger.info("MySQL connected successfully");

    // 2. Load all SEO records into memory
    await loadSeoCache();

    // 3. Start server after SEO preload
    server.listen(PORT, () => {
      logger.info(`🚀 Server running smoothly on port ${PORT}`);
    });
  } catch (error) {
    logger.error("SERVER STARTUP FAILED:", error);

    process.exit(1);
  }
};

startServer();

// Graceful shutdown
const shutdown = (signal) => {
  logger.info(`${signal} received. Shutting down...`);

  server.close(async () => {
    try {
      await pool.end();

      logger.info("HTTP server and MySQL pool closed.");

      process.exit(0);
    } catch (error) {
      logger.error("SHUTDOWN ERROR:", error);
      process.exit(1);
    }
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
