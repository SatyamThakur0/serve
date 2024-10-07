import { Router } from "express";
import isAuthenticated from "../middlewares/userAuthentication.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";

export const messageRouter = Router();

messageRouter.post("/send/:id", isAuthenticated, sendMessage);
messageRouter.get("/get/:id", isAuthenticated, getMessage);
