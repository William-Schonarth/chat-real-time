import prisma from "../../config/database";

export class UserRepository {
  static async createUser(name: string, username: string, password: string) {
    return await prisma.user.create({
      data: { name, username, password },
    });
  }

  static async findByUsername(username: string) {
    return await prisma.user.findUnique({ where: { username } });
  }

  static async updateOnlineStatus(userId: string, isOnline: boolean) {
    return await prisma.user.update({
      where: { id: userId },
      data: { isOnline },
    });
  }

  static async findAllUsers(userId: string) {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        isOnline: true,
        createdAt: true,
      },
      where: {
        id: {
          not: userId,
        },
      },
    });
  }
}
