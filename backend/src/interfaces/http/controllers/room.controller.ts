import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { RoomService } from "../../../domain/services/room.service";
import { AppError } from "../../../utils/AppError";
import { ChatService } from "../../../domain/services/chat.service";

export class RoomController {
  static async getOrCreateRoom(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // @ts-ignore
    const senderId = req.user.id;
    const { receiverId } = req.body;

    if (!receiverId) {
      next(new AppError("receiverId is required", StatusCodes.BAD_REQUEST));
    }

    try {
      const room = await RoomService.getOrCreateRoom(senderId, receiverId);

      res.status(StatusCodes.OK).json({ roomId: room.id });
    } catch (error: any) {
      next(new AppError(error.message, error.status));
    }
  }

  static async getRoomMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { roomId } = req.query;

    if (!roomId || typeof roomId !== "string") {
      next(new AppError("roomId is required", StatusCodes.BAD_REQUEST));
    } else {
      try {
        const messages = await ChatService.getRoomMessages(roomId);

        res.status(StatusCodes.OK).json(messages);
      } catch (error: any) {
        next(new AppError(error.message, error.status));
      }
    }
  }
}
