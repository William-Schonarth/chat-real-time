import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

interface AppError {
  status?: number;
  message?: string;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ error: message });
}
