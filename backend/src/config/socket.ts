import { Server } from "socket.io";
import { notificationHandler } from "../interfaces/ws/socketHandlers/notification.handle";
import { chatHandler } from "../interfaces/ws/socketHandlers/chat.handler";
import { socketAuthMiddleware } from "../interfaces/http/middlewares/socketAuth.middleware";

export default function initSocket(io: Server) {
  io.use(socketAuthMiddleware);

  io.on(SOCKET_ACTIONS.CONNECTION, (socket) => {
    notificationHandler(io, socket);
    chatHandler(io, socket);
  });
}

export enum SOCKET_ACTIONS {
  CONNECTION = "connection",
  USER_ONLINE = "user_online",
  USER_OFFLINE = "user_offline",
  USER_REGISTERED = "user_registered",
  JOIN_ROOM = "join_room",
  ERROR_ROOM = "error_room",
  MESSAGE = "message",
  ERROR_MESSAGE = "error_message",
}
