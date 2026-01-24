import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { initSocket } from "./socket.js";
import logger from "./Utils/logger.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

console.log("==========================");
console.log("==========================");
console.log("==========================");
console.log("Port: " + process.env.PORT);
console.log("DB_HOST: " + process.env.DB_HOST);
console.log("DB_USER: " + process.env.DB_USER);
console.log("DB_DATABASE: " + process.env.DB_DATABASE);
console.log("==========================");
console.log("==========================");
console.log("==========================");

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});
