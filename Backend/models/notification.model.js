import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
        reactedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
        type: {
            type: String,
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "post",
        },
    },
    { timestamps: true }
);

const notification = mongoose.model("notification", notificationSchema);
export default notification;
