"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const http_status_codes_1 = require("http-status-codes");
const room_service_1 = require("../../../domain/services/room.service");
const AppError_1 = require("../../../utils/AppError");
const chat_service_1 = require("../../../domain/services/chat.service");
class RoomController {
    static async getOrCreateRoom(req, res, next) {
        // @ts-ignore
        const senderId = req.user.id;
        const { receiverId } = req.body;
        if (!receiverId) {
            next(new AppError_1.AppError("receiverId is required", http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
        try {
            const room = await room_service_1.RoomService.getOrCreateRoom(senderId, receiverId);
            res.status(http_status_codes_1.StatusCodes.OK).json({ roomId: room.id });
        }
        catch (error) {
            next(new AppError_1.AppError(error.message, error.status));
        }
    }
    static async getRoomMessages(req, res, next) {
        const { roomId } = req.query;
        if (!roomId || typeof roomId !== "string") {
            next(new AppError_1.AppError("roomId is required", http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
        else {
            try {
                const messages = await chat_service_1.ChatService.getRoomMessages(roomId);
                res.status(http_status_codes_1.StatusCodes.OK).json(messages);
            }
            catch (error) {
                next(new AppError_1.AppError(error.message, error.status));
            }
        }
    }
}
exports.RoomController = RoomController;
