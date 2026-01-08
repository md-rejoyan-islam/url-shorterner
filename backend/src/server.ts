import app from "./app/app";
import connectDB from "./config/db";
import { connectRedis } from "./config/redis";
import { port } from "./config/secret";

import http from "http";

const server = http.createServer(app);

server.listen(port, async () => {
  connectDB();
  connectRedis();
  // await redisClient.flushAll();
  console.log(`Server is running on http://localhost:${port}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err: Error) => {
  console.error(`Uncaught Exception: ${err.message}`);
  server.close(() => process.exit(1));
});
