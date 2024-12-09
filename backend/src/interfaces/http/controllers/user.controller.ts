import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserRepository } from "../../../domain/repositories/user.repository";

export class UserController {
  static async getAllUsers(req: Request, res: Response) {
    // @ts-ignore
    const userId = req.user.id;

    const users = await UserRepository.findAllUsers(userId);

    res.status(StatusCodes.OK).json(users);
  }
}
