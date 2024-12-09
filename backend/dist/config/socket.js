"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKET_ACTIONS = void 0;
exports.default = initSocket;
const notification_handle_1 = require("../interfaces/ws/socketHandlers/notification.handle");
const chat_handler_1 = require("../interfaces/ws/socketHandlers/chat.handler");
const socketAuth_middleware_1 = require("../interfaces/http/middlewares/socketAuth.middleware");
function initSocket(io) {
    io.use(socketAuth_middleware_1.socketAuthMiddleware);
    io.on(SOCKET_ACTIONS.CONNECTION, (socket) => {
        (0, notification_handle_1.notificationHandler)(io, socket);
        (0, chat_handler_1.chatHandler)(io, socket);
    });
}
var SOCKET_ACTIONS;
(function (SOCKET_ACTIONS) {
    SOCKET_ACTIONS["CONNECTION"] = "connection";
    SOCKET_ACTIONS["USER_ONLINE"] = "user_online";
    SOCKET_ACTIONS["USER_OFFLINE"] = "user_offline";
    SOCKET_ACTIONS["USER_REGISTERED"] = "user_registered";
    SOCKET_ACTIONS["JOIN_ROOM"] = "join_room";
    SOCKET_ACTIONS["ERROR_ROOM"] = "error_room";
    SOCKET_ACTIONS["MESSAGE"] = "message";
    SOCKET_ACTIONS["ERROR_MESSAGE"] = "error_message";
})(SOCKET_ACTIONS || (exports.SOCKET_ACTIONS = SOCKET_ACTIONS = {}));
