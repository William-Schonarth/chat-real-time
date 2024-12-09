import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";

export function socketAuthMiddleware(socket: Socket, next: Function) {
  const token = socket.handshake.auth.token as string;

  if (!token) {
    const err = new Error("Token is required");

    // @ts-ignore
    err.data = { code: StatusCodes.UNAUTHORIZED };
    return next(err);
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: string;
      name: string;
    };

    socket.data.userId = payload.id;
    socket.data.name = payload.name;

    return next();
  } catch (err) {
    const error = new Error("Invalid token");

    // @ts-ignore
    error.data = { code: StatusCodes.UNAUTHORIZED };
    return next(error);
  }
}
