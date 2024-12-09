"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatHandler = chatHandler;
const socket_1 = require("../../../config/socket");
const chat_service_1 = require("../../../domain/services/chat.service");
const room_service_1 = require("../../../domain/services/room.service");
function chatHandler(io, socket) {
    socket.on(socket_1.SOCKET_ACTIONS.JOIN_ROOM, async (roomId) => {
        const userId = socket.data.userId;
        if (!userId) {
            socket.emit(socket_1.SOCKET_ACTIONS.ERROR_ROOM, { error: "User is required" });
            return;
        }
        const participants = await room_service_1.RoomService.getParticipants(roomId);
        const canJoin = participants.includes(userId);
        if (!canJoin) {
            socket.emit(socket_1.SOCKET_ACTIONS.ERROR_ROOM, {
                error: "You are not allowed to enter this room",
            });
            return;
        }
        socket.join(roomId);
    });
    socket.on(socket_1.SOCKET_ACTIONS.MESSAGE, async ({ roomId, content }) => {
        try {
            const senderId = socket.data.userId;
            const message = await chat_service_1.ChatService.sendMessage(roomId, senderId, content);
            io.to(roomId).emit(socket_1.SOCKET_ACTIONS.MESSAGE, {
                id: message.id,
                content: message.content,
                userId: message.userId,
                createdAt: message.createdAt,
            });
            const participants = await room_service_1.RoomService.getParticipants(roomId);
            const recipientId = participants.find((p) => p !== senderId);
            if (recipientId) {
                io.to(recipientId).emit("notification", {
                    type: "new_message",
                    sender: {
                        id: senderId,
                        name: socket.data.name,
                    },
                });
            }
        }
        catch (error) {
            socket.emit(socket_1.SOCKET_ACTIONS.ERROR_MESSAGE, {
                error: error.message || "Error sending message",
            });
        }
    });
}
