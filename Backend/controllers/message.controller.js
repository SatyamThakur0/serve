import conversation from "../models/conversation.model.js";
import message from "../models/message.model.js";
import { getSocketId, io } from "../Socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.payload._id;
        const receiverId = req.params.id;

        let Conversation = await conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if (!Conversation) {
            Conversation = await conversation.create({
                participants: [senderId, receiverId],
            });
        }
        const newMessage = await message.create({
            sender: senderId,
            receiver: receiverId, 
            message: req.body.message,
        });
        if (newMessage) Conversation.messages.push(newMessage._id);
        await Conversation.save();

        const receiverSocketId = await getSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(200).json({
            message: "message sent",
            success: true,
            newMessage,
        });
    } catch (error) {
        console.log(error);
    }
};

export const getMessage = async (req, res) => {
    try {
        const senderId = req.payload._id;
        const receiverId = req.params.id;

        let Conversation = await conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if (!Conversation) {
            return res.status(200).json({ success: true, messages: [] });
        }
        await Conversation.populate("messages");
        return res.status(200).json({
            success: true,
            messages: Conversation.messages,
        });
    } catch (error) {
        console.log(error);
    }
};
