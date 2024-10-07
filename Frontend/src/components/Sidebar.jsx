import { CgClapperBoard } from "react-icons/cg";
import { FaRegCompass, FaRegHeart } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { RiAddBoxLine } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import { FiSearch, FiHome } from "react-icons/fi";
import { toast } from "sonner";
import { Link, Outlet, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "@/store/userSlice";
import SidebarItem from "./SidebarItem";
import CreatePostDialog from "./CreatePostDialog";
import { useEffect, useState } from "react";
import GetSuggestedUsers from "./GetSuggestedUsers";
import { postsActions } from "@/store/postsSlice";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { notificationAction } from "@/store/notificationSlice";
import { useSocket } from "@/store/SocketContext";
import GetRTN from "./custom/GetRTN";
import { Button } from "./ui/button";

const Sidebar = () => {
    const { user } = useSelector((store) => store.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [openNotiPanel, setOpenNotiPanel] = useState(false);
    const { notifications, newNotifications } = useSelector(
        (store) => store.notification
    );
    const socket = useSocket();

    GetSuggestedUsers();
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8000/api/user/logout", {
                method: "POST",
                headers: { "content-type": "application/json" },
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
                dispatch(userActions.setNull());
                dispatch(postsActions.setNull());
                toast.success(data.message);
                navigate("/login");
                localStorage.removeItem("user");
                localStorage.removeItem("profile");
            }
        } catch (error) {
            console.log(error);
        }
    };

    GetRTN();

    const getNotifications = async () => {
        let res = await fetch(
            "http://localhost:8000/api/notification/allnotificactions",
            {
                method: "GET",
                credentials: "include",
            }
        );
        res = await res.json();
        console.log(res);
        dispatch(notificationAction.setNotifications(res.Notifications));
    };

    const handleSidebar = (itemName) => {
        if (itemName === "Create") {
            setOpen(true);
        } else if (itemName === "Profile") {
            dispatch(userActions.setProfile(null));
            dispatch(userActions.setProfilePost([]));
            dispatch(userActions.setProfile(user));
            localStorage.setItem("profile", JSON.stringify(user));
            navigate(`./profile/${user?._id}`);
        } else if (itemName === "Home") {
            navigate("/");
        } else if (itemName === "Messages") {
            navigate("/chat");
        } else if (itemName === "Notifications") {
            getNotifications();
            setOpenNotiPanel(true);
            dispatch(notificationAction.setNewNotificationEmpty());
        }
    };

    const SidebarItems = [
        {
            icon: <FiHome className="scale-150" />,
            itemName: "Home",
        },
        {
            icon: <FiSearch className="scale-150" />,
            itemName: "Search",
        },
        {
            icon: <FaRegCompass className="scale-150" />,
            itemName: "Explore",
        },
        {
            icon: <CgClapperBoard className="scale-150" />,
            itemName: "Reels",
        },
        {
            icon: <IoChatbubbleEllipsesOutline className="scale-150" />,
            itemName: "Messages",
        },
        {
            icon: (
                <div>
                    <FaRegHeart className="scale-150" />
                    {newNotifications.length > 0 && (
                        <Button
                            size="icon"
                            className={`rounded-full h-[17px] w-[17px] absolute left-16 top-[52vh] bg-red-600 hover:bg-red-600`}
                        >
                            {newNotifications.length}
                        </Button>
                    )}
                </div>
            ),
            itemName: "Notifications",
        },
        {
            icon: <RiAddBoxLine className="scale-150" />,
            itemName: "Create",
        },
        {
            icon: (
                <Avatar className="w-7 h-7">
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback>ST</AvatarFallback>
                </Avatar>
            ),
            itemName: "Profile",
        },
    ];
    return (
        <>
            <Dialog open={openNotiPanel}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogTitle />
                <DialogContent
                    className={`outline-none overflow-y-scroll flex flex-col h-[80vh] max-h-[80vh]`}
                    onInteractOutside={() => setOpenNotiPanel(false)}
                >
                    <h1 className="text-center font-bold text-2xl">
                        Notifications
                    </h1>
                    {notifications?.map((notification) => (
                        <div
                            key={notification._id}
                            className="flex gap-3 items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <span className={`flex items-center gap-2 `}>
                                    <Avatar
                                        className="cursor-pointer"
                                        // onClick={() =>
                                        //     navigate(`/profile/${post.author._id}`)
                                        // }
                                    >
                                        <AvatarImage
                                            src={
                                                notification.reactedBy
                                                    .profilePicture
                                            }
                                        />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <Link
                                        // to={`/profile/${post.author._id}`}
                                        className={`font-semibold`}
                                    >
                                        {notification.reactedBy.username}
                                    </Link>
                                </span>
                                <p>
                                    {notification.type == "like"
                                        ? "lliked"
                                        : ""}{" "}
                                    your post.
                                </p>
                            </div>
                            {/* <div className="h-[20px] w-[30px] object-cover"> */}
                            <img
                                className=" h-10"
                                src={notification.post?.image}
                                alt=""
                            />
                            {/* </div> */}
                        </div>
                    ))}
                </DialogContent>
            </Dialog>

            <div
                className={`flex w-screen h-screen ${styles.outer} scroll-smooth overflow-scroll overscroll-none`}
            >
                <div
                    className={`overscroll-none p-8 fixed ${styles.sidebar} gap-8 h-screen`}
                >
                    <div className={`mt-4 px-4 font-bold mb-8`}>LOGO</div>
                    <div className={`flex w-full items-center justify-start `}>
                        <div
                            className={`flex flex-col justify-center gap-3 items-start `}
                        >
                            {SidebarItems.map((item) => (
                                <SidebarItem
                                    key={item.itemName}
                                    item={item}
                                    handleSidebar={handleSidebar}
                                />
                            ))}
                        </div>
                    </div>
                    <CreatePostDialog open={open} setOpen={setOpen} />
                    <div
                        onClick={handleLogout}
                        className={`${styles.floatbottom} flex gap-2 items-center rounded-md cursor-pointer hover:bg-slate-100 px-6 py-3`}
                    >
                        <BiLogOut className="scale-150" />
                        <Link>Logout</Link>
                    </div>
                </div>
                <Outlet />
            </div>
        </>
    );
};

export default Sidebar;
