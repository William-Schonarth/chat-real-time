import { Server, Socket } from "socket.io";

export function notificationHandler(io: Server, socket: Socket) {
  const userId = socket.data.userId;
  socket.join(userId);
}
