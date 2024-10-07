import notification from "../models/notification.model.js";

export const getAllNotifications = async (req, res) => {
    const userId = req.payload._id;
    const Notifications = await notification
        .find({ user: userId })
        .sort({ createdAt: -1 })
        .populate({ path: "reactedBy", select: "username profilePicture" })
        .populate({ path: "post", select: "image" });
    if (Notifications) {
        res.status(200).json({
            message: "success",
            Notifications,
        });
    } else {
        res.status(404).json({ message: "Not found" });
    }
};
