"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = __importDefault(require("../../config/database"));
class UserRepository {
    static async createUser(name, username, password) {
        return await database_1.default.user.create({
            data: { name, username, password },
        });
    }
    static async findByUsername(username) {
        return await database_1.default.user.findUnique({ where: { username } });
    }
    static async updateOnlineStatus(userId, isOnline) {
        return await database_1.default.user.update({
            where: { id: userId },
            data: { isOnline },
        });
    }
    static async findAllUsers(userId) {
        return await database_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                username: true,
                isOnline: true,
                createdAt: true,
            },
            where: {
                id: {
                    not: userId,
                },
            },
        });
    }
}
exports.UserRepository = UserRepository;
