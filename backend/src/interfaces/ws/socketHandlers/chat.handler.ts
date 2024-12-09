import { Socket, Server } from "socket.io";
import { SOCKET_ACTIONS } from "../../../config/socket";
import { ChatService } from "../../../domain/services/chat.service";
import { RoomService } from "../../../domain/services/room.service";

export function chatHandler(io: Server, socket: Socket) {
  socket.on(SOCKET_ACTIONS.JOIN_ROOM, async (roomId: string) => {
    const userId = socket.data.userId;

    if (!userId) {
      socket.emit(SOCKET_ACTIONS.ERROR_ROOM, { error: "User is required" });
      return;
    }

    const participants = await RoomService.getParticipants(roomId);
    const canJoin = participants.includes(userId);

    if (!canJoin) {
      socket.emit(SOCKET_ACTIONS.ERROR_ROOM, {
        error: "You are not allowed to enter this room",
      });
      return;
    }
    socket.join(roomId);
  });

  socket.on(
    SOCKET_ACTIONS.MESSAGE,
    async ({ roomId, content }: { roomId: string; content: string }) => {
      try {
        const senderId = socket.data.userId;
        const message = await ChatService.sendMessage(
          roomId,
          senderId,
          content
        );

        io.to(roomId).emit(SOCKET_ACTIONS.MESSAGE, {
          id: message.id,
          content: message.content,
          userId: message.userId,
          createdAt: message.createdAt,
        });

        const participants = await RoomService.getParticipants(roomId);

        const recipientId = participants.find((p) => p !== senderId);
        if (recipientId) {
          io.to(recipientId).emit("notification", {
            type: "new_message",
            sender: {
              id: senderId,
              name: socket.data.name,
            },
          });
        }
      } catch (error: any) {
        socket.emit(SOCKET_ACTIONS.ERROR_MESSAGE, {
          error: error.message || "Error sending message",
        });
      }
    }
  );
}
