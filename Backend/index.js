import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { app, server } from "./Socket/socket.js";
import path from "path";

dotenv.config({});

import { userRouter } from "./routes/user.route.js";
import { postRouter } from "./routes/post.route.js";
import { messageRouter } from "./routes/message.route.js";
import isAuthenticated from "./middlewares/userAuthentication.js";
import { notificationRouter } from "./routes/notification.route.js";

const PORT = process.env.PORT || 8000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log(`Database connected...`));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const __dirname = path.resolve();
console.log(__dirname);

console.log(path.join(__dirname, "./frontend/dist/index.html"));

const corsOption = {
    origin: "http://localhost:8000",
    credentials: true,
};
app.use(cors(corsOption));

app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/message", messageRouter);
app.use("/api/notification", notificationRouter);
app.get("/api", isAuthenticated, () => {});

app.use(express.static(path.join(__dirname, "./frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./frontend/dist/index.html"));
});

server.listen(PORT, () => console.log(`Server is live...`));
