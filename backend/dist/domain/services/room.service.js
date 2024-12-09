"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const room_repository_1 = require("../repositories/room.repository");
class RoomService {
    static async getOrCreateRoom(senderId, receiverId) {
        let room = await room_repository_1.RoomRepository.findRoomByParticipants(senderId, receiverId);
        if (!room) {
            room = await room_repository_1.RoomRepository.createRoomWithParticipants(senderId, receiverId);
        }
        return room;
    }
    static async getParticipants(roomId) {
        return await room_repository_1.RoomRepository.getParticipants(roomId);
    }
}
exports.RoomService = RoomService;
