import { StatusCodes } from "http-status-codes";
import { MessageRepository } from "../repositories/message.repository";

export class ChatService {
  static async sendMessage(roomId: string, senderId: string, content: string) {
    const inRoom = await MessageRepository.userInRoom(senderId, roomId);
    if (!inRoom) {
      throw {
        message: "User does not belong to this room",
        status: StatusCodes.FORBIDDEN,
      };
    }

    const message = await MessageRepository.createMessage(
      roomId,
      senderId,
      content
    );
    return message;
  }

  static async getRoomMessages(roomId: string) {
    return MessageRepository.getMessagesByRoom(roomId);
  }
}
