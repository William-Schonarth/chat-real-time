import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { UserRepository } from "../repositories/user.repository";
import { io } from "../../app/server";
import { SOCKET_ACTIONS } from "../../config/socket";
import { AppError } from "../../utils/AppError";

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";

export class AuthService {
  static async register(name: string, username: string, password: string) {
    const userExists = await UserRepository.findByUsername(username);
    if (userExists) {
      throw new AppError("Username already exists", StatusCodes.CONFLICT);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserRepository.createUser(name, username, passwordHash);

    io.emit(SOCKET_ACTIONS.USER_REGISTERED, {
      userId: user.id,
      username: user.username,
    });

    return user;
  }

  static async login(username: string, password: string) {
    const user = await UserRepository.findByUsername(username);
    if (!user) {
      throw new AppError("User not found", StatusCodes.UNAUTHORIZED);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new AppError("Invalid password", StatusCodes.UNAUTHORIZED);
    }

    await UserRepository.updateOnlineStatus(user.id, true);

    const token = jwt.sign(
      { id: user.id, name: user.name, username: user.username },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    io.emit(SOCKET_ACTIONS.USER_ONLINE, {
      userId: user.id,
      username: user.username,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        isOnline: true,
        createdAt: user.createdAt,
      },
    };
  }

  static async logout(userId: string) {
    await UserRepository.updateOnlineStatus(userId, false);

    io.emit(SOCKET_ACTIONS.USER_OFFLINE, { userId });

    return { message: "User logged out" };
  }
}
