import { notificationAction } from "@/store/notificationSlice";
import { useSocket } from "@/store/SocketContext";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const GetRTN = () => {
    const dispatch = useDispatch();
    const socket = useSocket();

    useEffect(() => {
        socket?.on("liked", (notification) => {
            console.log(notification);
            dispatch(notificationAction.addNotification(notification));
            dispatch(notificationAction.addNewNotification(notification));
        });
    }, [socket]);
};

export default GetRTN;
