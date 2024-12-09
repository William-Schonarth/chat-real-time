"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const room_controller_1 = require("../controllers/room.controller");
const roomRoutes = (0, express_1.Router)();
roomRoutes.post("/getOrCreate", auth_middleware_1.authMiddleware, room_controller_1.RoomController.getOrCreateRoom);
roomRoutes.get("/messages", auth_middleware_1.authMiddleware, room_controller_1.RoomController.getRoomMessages);
exports.default = roomRoutes;
