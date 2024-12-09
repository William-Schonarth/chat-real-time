"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const http_status_codes_1 = require("http-status-codes");
const message_repository_1 = require("../repositories/message.repository");
class ChatService {
    static async sendMessage(roomId, senderId, content) {
        const inRoom = await message_repository_1.MessageRepository.userInRoom(senderId, roomId);
        if (!inRoom) {
            throw {
                message: "User does not belong to this room",
                status: http_status_codes_1.StatusCodes.FORBIDDEN,
            };
        }
        const message = await message_repository_1.MessageRepository.createMessage(roomId, senderId, content);
        return message;
    }
    static async getRoomMessages(roomId) {
        return message_repository_1.MessageRepository.getMessagesByRoom(roomId);
    }
}
exports.ChatService = ChatService;
