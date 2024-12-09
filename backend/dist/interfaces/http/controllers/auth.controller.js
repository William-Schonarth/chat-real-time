"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_codes_1 = require("http-status-codes");
const auth_service_1 = require("../../../domain/services/auth.service");
const AppError_1 = require("../../../utils/AppError");
class AuthController {
    static async register(req, res, next) {
        const { name, username, password } = req.body;
        try {
            const user = await auth_service_1.AuthService.register(name, username, password);
            res.status(http_status_codes_1.StatusCodes.CREATED).json({ user });
        }
        catch (error) {
            next(new AppError_1.AppError(error.message, error.status));
        }
    }
    static async login(req, res, next) {
        const { username, password } = req.body;
        try {
            const result = await auth_service_1.AuthService.login(username, password);
            res.status(http_status_codes_1.StatusCodes.OK).json(result);
        }
        catch (error) {
            next(new AppError_1.AppError(error.message, error.status));
        }
    }
    static async logout(req, res, next) {
        // @ts-ignore
        const userId = req.user.id;
        try {
            const result = await auth_service_1.AuthService.logout(userId);
            res.status(http_status_codes_1.StatusCodes.OK).json(result);
        }
        catch (error) {
            next(new AppError_1.AppError(error.message, error.status));
        }
    }
}
exports.AuthController = AuthController;
