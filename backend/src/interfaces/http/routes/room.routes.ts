import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { RoomController } from "../controllers/room.controller";

const roomRoutes = Router();

roomRoutes.post("/getOrCreate", authMiddleware, RoomController.getOrCreateRoom);
roomRoutes.get("/messages", authMiddleware, RoomController.getRoomMessages);

export default roomRoutes;
