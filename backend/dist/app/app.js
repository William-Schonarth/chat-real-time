"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const routes_1 = __importDefault(require("../interfaces/http/routes"));
const errorHandler_middleware_1 = require("../interfaces/http/middlewares/errorHandler.middleware");
require("../config/passport");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use("/api", routes_1.default);
app.use(errorHandler_middleware_1.errorHandler);
exports.default = app;
