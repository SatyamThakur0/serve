import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        caption: {
            type: String,
            default: "",
        },
        image: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        savedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            default: [],
        }],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "comment",
            },
        ],
    },
    { timestamps: true }
);

const post = mongoose.model("post", postSchema);
export default post;
