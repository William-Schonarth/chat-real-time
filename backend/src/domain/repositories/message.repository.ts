import prisma from "../../config/database";

export class MessageRepository {
  static async createMessage(roomId: string, userId: string, content: string) {
    return await prisma.message.create({
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

  static async getMessagesByRoom(roomId: string) {
    return await prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
    });
  }

  static async userInRoom(userId: string, roomId: string) {
    const room = await prisma.room.findFirst({
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
