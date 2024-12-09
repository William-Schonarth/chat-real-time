import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket(token?: string) {
  if (!socket) {
    socket = io(
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000",
      {
        transports: ["websocket"],
        auth: {
          token,
        },
      }
    );

    socket.on("connect", () => {
      console.log("Web Socket connected:", socket?.id);
    });

    socket.on("Web Socket disconnected", () => {
      console.log("web");
    });
  }
  return socket;
}

export function getSocket() {
  return socket;
}

export const SOCKET_ACTIONS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  USER_ONLINE: "user_online",
  USER_OFFLINE: "user_offline",
  USER_REGISTERED: "user_registered",
  JOIN_ROOM: "join_room",
  ERROR_ROOM: "error_room",
  MESSAGE: "message",
  ERROR_MESSAGE: "error_message",
  NOTIFICATION: "notification",
};
