import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const Socket = () => {
    const { user } = useSelector((store) => store.user);
    const [socket, setSocket] = useState();
    const Socket = io("http://localhost:8000", {
        transports: ["websocket"],
        query: {
            userId: user?._id,
        },
    });
    // const Socket = useMemo(() =>
    //     io("http://localhost:8000", {
    //         transports: ["websocket"],
    //         query: {
    //             userId: user?._id,
    //         },
    //     })
    // );
    setSocket(Socket);
    return socket;
};

export default Socket;
