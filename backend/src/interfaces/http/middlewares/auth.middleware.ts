import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../../utils/AppError";

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next(new AppError("No token provided", StatusCodes.UNAUTHORIZED));
  } else {
    const token = authHeader.split(" ")[1];

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      next();
    } catch (err) {
      next(new AppError("Invalid token", StatusCodes.UNAUTHORIZED));
    }
  }
}
