import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { initSocket } from "./socket.js";
import logger from "./Utils/logger.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});
