import user from "../models/user.model.js";
import bcrypt from "bcrypt";
import { createToken } from "../services/auth.service.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import post from "../models/post.model.js";

export const registerUser = async (req, res) => {
    const { username, name, email, password } = req.body;
    try {
        if (!username || !name || !email || !password) {
            return res.status(401).json({
                message: "insufficient data",
                success: false,
            });
        }
        const User = await user.findOne({ email });
        if (User) {
            return res.status(401).json({
                message: "email already registered",
                success: false,
            });
        }
        const Username = await user.findOne({ username });
        if (Username) {
            return res.status(401).json({
                message: "username taken, try another.",
                success: false,
            });
        }
        const hasedPassword = await bcrypt.hash(password, 10);
        const newUser = await user.create({
            name,
            username,
            email,
            password: hasedPassword,
        });
        return res.status(201).json({
            message: "Account Created Successfully",
            success: true,
        });
    } catch (error) {
        console.log("User registration failed", error);
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await user.find({});
        return res.status(200).json(users);
    } catch (error) {
        console.log("Fetching users failed", error);
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(401).json({
                message: "insufficient data",
                success: false,
            });
        }
        const User = await user.findOne({ email }).populate("posts");
        if (!User) {
            return res.status(404).json({
                message: "user not found",
                success: false,
            });
        }
        const match = await bcrypt.compare(password, User.password);
        if (match) {
            const token = createToken(User);
            const payload = {
                _id: User._id,
                username: User.username,
                name: User.name,
                profilePicture: User.profilePicture,
                bio: User.bio,
                following: User.following,
                followers: User.followers,
                saved: User.saved,
                posts: User.posts,
            };
            // document.cookie = `token = ${token}`;

            return res
                .status(200)
                .cookie("token", token, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    // path: "/",
                })
                .json({
                    message: `Welcome, ${User.name}`,
                    success: true,
                    payload,
                    token,
                });
        } else {
            return res.status(404).json({
                message: "incorrect password",
                success: false,
            });
        }
    } catch (error) {
        console.log("login failed", error);
    }
};

export const logout = (req, res) => {
    try {
        return res.clearCookie("token").json({
            message: "logged out successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const getProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const User = await user.findById(id);
        if (User) {
            const payload = {
                _id: User._id,
                name: User.name,
                username: User.username,
                profilePicture: User.profilePicture,
                bio: User.bio,
                following: User.following,
                followers: User.followers,
                posts: User.posts,
            };
            return res.status(200).json(payload);
        } else {
            return res.status(404).json({
                message: "user not found",
                success: false,
            });
        }
    } catch (error) {
        console.log(error);
    }
};

export const editProfile = async (req, res) => {
    const id = req.payload._id;

    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
        const fileUri = getDataUri(profilePicture);
        cloudResponse = await cloudinary.uploader.upload(fileUri);
    }
    const User = await user.findById(id).select("-password");
    if (!User) {
        return res.status(404).json({
            message: "user not found",
            success: false,
        });
    }
    if (bio) User.bio = bio;
    if (gender) User.gender = gender;
    if (profilePicture) User.profilePicture = cloudResponse.secure_url;
    await User.save();
    return res.status(200).json({
        message: "profile updated",
        success: true,
        User,
    });
};

export const getSuggestedUser = async (req, res) => {
    try {
        const suggestedUsers = await user
            .find({ _id: { $ne: req.payload._id } })
            .select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: "no users",
                success: false,
            });
        }

        return res.status(200).json({
            success: true,
            suggestedUsers,
        });
    } catch (error) {
        console.log(error);
    }
};

export const followOrUnfollow = async (req, res) => {
    try {
        const userId = req.payload._id;
        const targetId = req.params.id;
        if (userId === targetId) {
            return res.status(400).json({
                message: "can't follow/unfollow yourself",
                success: false,
            });
        }
        const User = await user.findById(userId);
        const targetUser = await user.findById(targetId);

        const isFollowing = User.following.includes(targetId);

        if (isFollowing) {
            await Promise.all([
                user.updateOne(
                    { _id: userId },
                    { $pull: { following: targetId } }
                ),
                user.updateOne(
                    { _id: targetId },
                    { $pull: { followers: userId } }
                ),
            ]);
            return res.status(200).json({
                message: "unfollowed successfully",
                success: true,
                type: "unfollow",
            });
        } else {
            await Promise.all([
                user.updateOne(
                    { _id: userId },
                    { $push: { following: targetId } }
                ),
                user.updateOne(
                    { _id: targetId },
                    { $push: { followers: userId } }
                ),
            ]);
            return res.status(200).json({
                message: "followed successfully",
                success: true,
                type: "follow",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// const checkForLogin = (req, res) => {
//     try {
//         const token = req.cookies.token;
//     } catch (error) {}
// };
