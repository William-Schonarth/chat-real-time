"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../../utils/AppError");
const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        next(new AppError_1.AppError("No token provided", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    else {
        const token = authHeader.split(" ")[1];
        try {
            const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            req.user = payload;
            next();
        }
        catch (err) {
            next(new AppError_1.AppError("Invalid token", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        }
    }
}
