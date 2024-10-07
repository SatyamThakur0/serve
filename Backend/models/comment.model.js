import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post",
            required: true,
        },
    },
    { timestamps: true }
);

const comment = mongoose.model("comment", commentSchema);
export default comment;
