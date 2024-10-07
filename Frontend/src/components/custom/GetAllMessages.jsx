import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { chatAction } from "@/store/chatSlice";

const GetAllMessages = () => {
    const dispatch = useDispatch();
    const { selectedChat } = useSelector((state) => state.chat);
    useEffect(() => {
        const getMessages = async () => {
            let res = await fetch(
                `http://localhost:8000/api/message/get/${selectedChat._id}`,
                { credentials: "include" }
            );
            res = await res.json();
            console.log(res);

            dispatch(chatAction.setMessages(res.messages));
        };
        getMessages();
    }, [selectedChat]);
};

export default GetAllMessages;
