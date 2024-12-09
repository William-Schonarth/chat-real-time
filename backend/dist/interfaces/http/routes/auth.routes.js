"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authRoutes = (0, express_1.Router)();
authRoutes.post("/register", auth_controller_1.AuthController.register);
authRoutes.post("/login", auth_controller_1.AuthController.login);
authRoutes.post("/logout", auth_middleware_1.authMiddleware, auth_controller_1.AuthController.logout);
exports.default = authRoutes;
