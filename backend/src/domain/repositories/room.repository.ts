import prisma from "../../config/database";

export class RoomRepository {
  static async findRoomByParticipants(senderId: string, receiverId: string) {
    return await prisma.room.findFirst({
      where: {
        participants: {
          every: {
            id: { in: [senderId, receiverId] },
          },
        },
      },
    });
  }

  static async createRoomWithParticipants(
    senderId: string,
    receiverId: string
  ) {
    return await prisma.room.create({
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

  static async getParticipants(roomId: string): Promise<string[]> {
    const room = await prisma.room.findUnique({
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
