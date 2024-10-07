import user from "../models/user.model.js";
import post from "../models/post.model.js";
import comment from "../models/comment.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
import { getSocketId, io } from "../Socket/socket.js";
import notification from "../models/notification.model.js";

//POST IMAGE
export const postImage = async (req, res) => {
    try {
        const authorId = req.payload._id;
        const { caption } = req.body;
        const image = req.file;
        console.log(image);

        if (!image)
            return res.json({ message: "image required", success: false });
        const imageUri = getDataUri(image);
        const cloudResponse = await cloudinary.uploader.upload(imageUri);
        const Post = await post.create({
            image: cloudResponse.secure_url,
            caption,
            author: authorId,
        });
        const author = await user.findByIdAndUpdate(
            authorId,
            {
                $push: { posts: Post._id },
            },
            { new: true }
        );
        await Post.populate("author", "username _id profilePicture");
        return res.status(200).json({
            message: "posted successfully",
            success: true,
            Post,
        });
    } catch (error) {
        console.log(error);
    }
};

//DELETE POST
export const deletePost = async (req, res) => {
    try {
        const authorId = req.payload._id;
        const postId = req.params.id;
        const author = await user.findById(authorId);
        const havePost = author.posts.includes(postId);
        if (havePost === false) {
            return res.status(404).json({
                message: "something went wrong",
                success: false,
            });
        }
        // DELETE POST
        const Post = await post.findByIdAndDelete(postId);
        // REMOVING POST FROM USER
        await user.findByIdAndUpdate(authorId, { $pull: { posts: postId } });
        //DELETING COMMENTS OF THAT POST
        const Comments = await comment.deleteMany({ post: postId });
        const savedByArray = Post.savedBy;
        await user.updateMany(
            { _id: { $in: savedByArray } },
            { $pull: { saved: postId } }
        );

        if (Post)
            return res.status(200).json({
                message: "post deleted successfully",
                success: true,
                postId,
            });
        else
            return res.status(404).json({
                success: false,
                message: "failed",
            });
    } catch (error) {
        console.log(error);
    }
};

//GET ALL POST
export const getAllPost = async (req, res) => {
    try {
        const allPosts = await post
            .find()
            .sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profilePicture" })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                select: "username profilePicture",
            });

        return res.status(200).json({
            allPosts,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

////GET USER POST
export const getUserPost = async (req, res) => {
    try {
        const userId = req.params.id;
        const userPosts = await post
            .find({ author: userId })
            .sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profilePicture" })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: {
                    path: "author",
                    select: "username profilePicture",
                },
            });
        return res.status(200).json({
            userPosts,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

//LIKE POST
export const likePost = async (req, res) => {
    try {
        const userId = req.payload._id;
        const postId = req.params.id;
        let Post = await post.findOne({ _id: postId }).populate("author");
        const postAuthor = Post.author;
        if (!Post)
            return res
                .status(404)
                .json({ message: "post not found", success: false });

        if (Post.likes.includes(userId)) {
            Post.likes = Post.likes.filter((id) => id != userId);
            Post = await Post.save();
            return res.status(200).json({
                postId: Post._id,
                userId,
                success: true,
                type: "dislike",
            });
        } else {
            Post.likes.push(userId);
            Post = await Post.save();
            const reactedBy = await user
                .findOne({ _id: userId })
                .select("profilePicture username");

            if (userId != postAuthor._id) {
                const Notification = await notification.create({
                    user: postAuthor._id,
                    reactedBy,
                    type: "like",
                    post: Post,
                });
                const socketId = getSocketId(postAuthor._id);
                if (socketId) {
                    io.to(socketId).emit("liked", Notification);
                }
            }
            return res.status(200).json({
                postId: Post._id,
                userId,
                success: true,
                type: "like",
            });
        }

        //HERE WE ALSO IMPLEMENT SOCKET.IO FOR REAL TIME NOTIFICATION LATER
    } catch (error) {
        console.log(error);
    }
};

//COMMENT ON POST
export const postComment = async (req, res) => {
    try {
        const userId = req.payload._id;
        const postId = req.params.id;
        const text = req.body.text;
        if (!text)
            return res.status(404).json({
                message: "text is required",
                success: false,
            });
        const Comment = await comment.create({
            author: userId,
            post: postId,
            text: req.body.text,
        });

        const Post = await post.findById(postId);
        Post.comments.push(Comment._id);
        await Post.save();
        await Comment.populate({
            path: "author",
            select: "username profilePicture",
        });
        return res.status(200).json({
            message: "commented successfully",
            success: true,
            Comment,
        });
    } catch (error) {
        console.log(error);
    }
};

// GET COMMENT OF A POST
export const getComments = async (req, res) => {
    try {
        const postId = req.params.id;
        const Comments = await comment
            .find({ post: postId })
            .sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profilePicture" });
        if (!Comments)
            return res.status(404).json({
                message: "fetch failed",
                success: false,
            });

        return res.status(200).json({
            Comments,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

// SAVE POST
export const savePost = async (req, res) => {
    try {
        const userId = req.payload._id;
        const postId = req.params.id;
        const User = await user.findById(userId);
        const Post = await post.findById(postId);
        if (User.saved.includes(postId)) {
            User.saved = User.saved.filter((id) => id != postId);
            Post.savedBy = Post.savedBy.filter((id) => id != userId);
            await User.save();
            await Post.save();
            return res.status(200).json({
                type: "unsaved",
                message: "post unsaved",
                success: true,
            });
        } else {
            User.saved.push(postId);
            Post.savedBy.push(userId);
            await User.save();
            await Post.save();
            return res.status(200).json({
                type: "saved",
                message: "post saved",
                success: true,
            });
        }
    } catch (error) {
        console.log(error);
    }
};

export const getSavedPost = async (req, res) => {
    try {
        const id = req.params.id;
        const User = await user.findById(id);
        if (!User) {
            return res.status(404).json({
                success: false,
                fetch: failed,
            });
        }
        await User.populate("saved");
        return res.json({
            success: true,
            savedPosts: User.saved,
        });
    } catch (error) {
        console.log(error);
    }
};
