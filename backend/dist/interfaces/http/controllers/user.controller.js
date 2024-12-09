"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_repository_1 = require("../../../domain/repositories/user.repository");
class UserController {
    static async getAllUsers(req, res) {
        // @ts-ignore
        const userId = req.user.id;
        const users = await user_repository_1.UserRepository.findAllUsers(userId);
        res.status(http_status_codes_1.StatusCodes.OK).json(users);
    }
}
exports.UserController = UserController;
