import { Router } from "express";
import isAuthenticated from "../middlewares/userAuthentication.js";
import {
    deletePost,
    getAllPost,
    getComments,
    getUserPost,
    likePost,
    postComment,
    postImage,
    savePost,
} from "../controllers/post.controller.js";
import upload from "../middlewares/multer.js";

export const postRouter = Router();

postRouter.post(
    "/postimage",
    isAuthenticated,
    upload.single("image"),
    postImage
);
postRouter.post("/delete/:id", isAuthenticated, deletePost);
postRouter.get("/allposts", isAuthenticated, getAllPost);
postRouter.get("/posts/:id", isAuthenticated, getUserPost);
postRouter.post("/like/:id", isAuthenticated, likePost);
postRouter.post("/comment/:id", isAuthenticated, postComment);
postRouter.get("/comments/:id", getComments);
postRouter.post("/saveorunsave/:id",isAuthenticated, savePost);
