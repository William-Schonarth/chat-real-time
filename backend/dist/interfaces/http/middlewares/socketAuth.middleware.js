"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuthMiddleware = socketAuthMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";
function socketAuthMiddleware(socket, next) {
    const token = socket.handshake.auth.token;
    if (!token) {
        const err = new Error("Token is required");
        // @ts-ignore
        err.data = { code: http_status_codes_1.StatusCodes.UNAUTHORIZED };
        return next(err);
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        socket.data.userId = payload.id;
        socket.data.name = payload.name;
        return next();
    }
    catch (err) {
        const error = new Error("Invalid token");
        // @ts-ignore
        error.data = { code: http_status_codes_1.StatusCodes.UNAUTHORIZED };
        return next(error);
    }
}
