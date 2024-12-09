import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "../../../domain/services/auth.service";
import { AppError } from "../../../utils/AppError";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    const { name, username, password } = req.body;

    try {
      const user = await AuthService.register(name, username, password);

      res.status(StatusCodes.CREATED).json({ user });
    } catch (error: any) {
      next(new AppError(error.message, error.status));
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;

    try {
      const result = await AuthService.login(username, password);

      res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
      next(new AppError(error.message, error.status));
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    const userId = req.user.id;

    try {
      const result = await AuthService.logout(userId);

      res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
      next(new AppError(error.message, error.status));
    }
  }
}
