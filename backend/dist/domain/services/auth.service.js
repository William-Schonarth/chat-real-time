"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const user_repository_1 = require("../repositories/user.repository");
const server_1 = require("../../app/server");
const socket_1 = require("../../config/socket");
const AppError_1 = require("../../utils/AppError");
const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";
class AuthService {
    static async register(name, username, password) {
        const userExists = await user_repository_1.UserRepository.findByUsername(username);
        if (userExists) {
            throw new AppError_1.AppError("Username already exists", http_status_codes_1.StatusCodes.CONFLICT);
        }
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const user = await user_repository_1.UserRepository.createUser(name, username, passwordHash);
        server_1.io.emit(socket_1.SOCKET_ACTIONS.USER_REGISTERED, {
            userId: user.id,
            username: user.username,
        });
        return user;
    }
    static async login(username, password) {
        const user = await user_repository_1.UserRepository.findByUsername(username);
        if (!user) {
            throw new AppError_1.AppError("User not found", http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match) {
            throw new AppError_1.AppError("Invalid password", http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
        await user_repository_1.UserRepository.updateOnlineStatus(user.id, true);
        const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.name, username: user.username }, JWT_SECRET, {
            expiresIn: "1d",
        });
        server_1.io.emit(socket_1.SOCKET_ACTIONS.USER_ONLINE, {
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
    static async logout(userId) {
        await user_repository_1.UserRepository.updateOnlineStatus(userId, false);
        server_1.io.emit(socket_1.SOCKET_ACTIONS.USER_OFFLINE, { userId });
        return { message: "User logged out" };
    }
}
exports.AuthService = AuthService;
