import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true,
            },
        ],
        messages: [
            {
                type: String,
                ref: "message",
            },
        ],
    },
    { timestamps: true }
);

const conversation = mongoose.model("conversation", conversationSchema);
export default conversation;
