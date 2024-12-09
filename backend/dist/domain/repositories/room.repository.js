"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomRepository = void 0;
const database_1 = __importDefault(require("../../config/database"));
class RoomRepository {
    static async findRoomByParticipants(senderId, receiverId) {
        return await database_1.default.room.findFirst({
            where: {
                participants: {
                    every: {
                        id: { in: [senderId, receiverId] },
                    },
                },
            },
        });
    }
    static async createRoomWithParticipants(senderId, receiverId) {
        return await database_1.default.room.create({
            data: {
                participants: {
                    connect: [{ id: senderId }, { id: receiverId }],
                },
            },
            include: {
                participants: true,
            },
        });
    }
    static async getParticipants(roomId) {
        const room = await database_1.default.room.findUnique({
            where: { id: roomId },
            select: {
                participants: {
                    select: { id: true },
                },
            },
        });
        if (!room || !room.participants) {
            return [];
        }
        return room.participants.map((user) => user.id);
    }
}
exports.RoomRepository = RoomRepository;
