"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationHandler = notificationHandler;
function notificationHandler(io, socket) {
    const userId = socket.data.userId;
    socket.join(userId);
}
