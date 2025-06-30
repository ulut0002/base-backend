import http from "http";
import { Server } from "socket.io";
import { Express } from "express";
import { getBackendUrl, loadConfig, logger } from "./index";

export const createSocketServer = (app: Express) => {
  const config = loadConfig();
  const backendUrl = getBackendUrl();

  const server = http.createServer(app);
  let io: Server | undefined;

  if (config.enableSocketIo) {
    io = new Server(server, {
      cors: {
        origin: backendUrl,
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      logger.info("A user connected:", socket.id);

      socket.on("disconnect", () => {
        logger.info("User disconnected:", socket.id);
      });
    });
  }

  return { server };
};
