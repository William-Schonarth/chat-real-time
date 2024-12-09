"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepository = void 0;
const database_1 = __importDefault(require("../../config/database"));
class MessageRepository {
    static async createMessage(roomId, userId, content) {
        return await database_1.default.message.create({
            data: {
                content,
                user: {
                    connect: { id: userId },
                },
                room: {
                    connect: { id: roomId },
                },
            },
            include: {
                user: true,
                room: true,
            },
        });
    }
    static async getMessagesByRoom(roomId) {
        return await database_1.default.message.findMany({
            where: { roomId },
            orderBy: { createdAt: "asc" },
        });
    }
    static async userInRoom(userId, roomId) {
        const room = await database_1.default.room.findFirst({
            where: {
                id: roomId,
                participants: {
                    some: {
                        id: userId,
                    },
                },
            },
        });
        return !!room;
    }
}
exports.MessageRepository = MessageRepository;
