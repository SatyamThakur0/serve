import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
            default: "",
        },
        bio: {
            type: String,
            default: "",
        },
        gender: {
            type: String,
            enum: ["male", "female"],
        },
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
        ],
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
        ],
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "post",
            },
        ],
        saved: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "post",
            },
        ],
    },
    { timestamps: true }
);

const user = mongoose.model("user", userSchema);
export default user;
