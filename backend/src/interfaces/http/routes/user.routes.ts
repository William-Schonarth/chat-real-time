import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const userRoutes = Router();

userRoutes.get("/", authMiddleware, UserController.getAllUsers);

export default userRoutes;
