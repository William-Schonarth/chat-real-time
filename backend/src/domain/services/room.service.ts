import { RoomRepository } from "../repositories/room.repository";

export class RoomService {
  static async getOrCreateRoom(senderId: string, receiverId: string) {
    let room = await RoomRepository.findRoomByParticipants(
      senderId,
      receiverId
    );

    if (!room) {
      room = await RoomRepository.createRoomWithParticipants(
        senderId,
        receiverId
      );
    }

    return room;
  }

  static async getParticipants(roomId: string) {
    return await RoomRepository.getParticipants(roomId);
  }
}
