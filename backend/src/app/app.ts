import express from "express";
import cors from "cors";
import passport from "passport";
import routes from "../interfaces/http/routes";
import { errorHandler } from "../interfaces/http/middlewares/errorHandler.middleware";
import "../config/passport";

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/api", routes);

app.use(errorHandler);

export default app;
