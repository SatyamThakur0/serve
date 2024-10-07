import { useSelector } from "react-redux";
import GetAllMessages from "./custom/GetAllMessages";
import GetRTM from "./custom/GetRTM";
import styles from "./Post.module.css";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";

const Messages = ({ chatSelected }) => {
    GetRTM();
    GetAllMessages();
    const scroll = useRef();
    const navigate = useNavigate();

    const { messages } = useSelector((store) => store.chat);
    const { user } = useSelector((store) => store.user);
    useEffect(() => {
        scroll.current.scrollTop = scroll.current.scrollHeight;
    }, [messages]);
    return (
        <>
            <div
                ref={scroll}
                className={`bocrder ${styles.noScrollbar} h-[83vh] w-full overflow-scroll flex flex-col border-red-600`}
            >
                {messages.length === 0 ? (
                    <p className="ml-[50%] mt-[30vh]">
                        <Loader2 className="animate-spin" />
                    </p>
                ) : (
                    <>
                        <div className="bordzer border-red-600 my-20 w-full flex flex-col items-center">
                            <Avatar className="w-[100px] h-[100px]">
                                <AvatarImage
                                    src={chatSelected?.profilePicture}
                                />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <h1 className="font-semibold text-xl">
                                {chatSelected.name}
                            </h1>
                            <Button
                                onClick={() => {
                                    navigate(`/profile/${chatSelected._id}`);
                                }}
                                className="bg-gray-300 text-black hover:bg-gray-400 h-8 mt-2"
                            >
                                View profile
                            </Button>
                        </div>
                        {messages?.map((msg) => (
                            <div
                                key={msg._id}
                                className={`${
                                    msg.sender[0] === user._id
                                        ? "justify-end text-white"
                                        : "justify-start text-black"
                                } m-1 borhder border-green-500 flex`}
                            >
                                <span
                                    className={`${
                                        msg.sender[0] === user._id
                                            ? "justify-end text-white bg-blue-500"
                                            : "justify-start text-black bg-gray-300"
                                    } w-fit py-1 px-2 mx-3 rounded-lg`}
                                    key={msg._id}
                                >
                                    {msg.message}
                                </span>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </>
    );
};
export default Messages;
