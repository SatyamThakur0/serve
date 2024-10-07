import { Server } from "socket.io";
import http from "http";
import express from "express";

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

const userSocketMap = {};

export const getSocketId = (userId) => userSocketMap[userId];

io.on("connection", (socket) => {
    // console.log(socket);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(
            `User connected : userId = ${userId} socketId = ${socket.id}`
        );
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    io.emit("check", "testing");

    socket.on("disconnect", () => {
        if (userId) {
            delete userSocketMap[userId];
            console.log(
                `User disconnected : userId = ${userId} socketId = ${socket.id}`
            );
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});
