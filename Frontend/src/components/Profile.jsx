import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Heart, MoreHorizontal, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import ProfilePosts from "./ProfilePosts";
import { IoMdGrid } from "react-icons/io";
import { FaRegBookmark } from "react-icons/fa";
import { BiUserPin } from "react-icons/bi";
import ProfileSavedPosts from "./ProfileSavedPosts";
import { Toggle } from "./ui/toggle";
import { Skeleton } from "./ui/skeleton";
import { GetProfileData } from "./GetProfileData";
import { userActions } from "@/store/userSlice";

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const { user } = useSelector((store) => store.user);
    const [tab, setTab] = useState("POSTS");
    const profile = JSON.parse(localStorage.getItem("profile"));
    // const { profile } = useSelector((store) => store.user);

    return (
        <>
            <div className="borders-2 border-red-700 w-[950px] relative left-[25vw]">
                <GetProfileData userId={id} />
                {profile ? (
                    <>
                        <div className="h-[30%] my-4 bogrder-2 border-green-500 p-6 flex gap-[6vw] ml-6">
                            <div>
                                <Avatar className="w-[180px] h-[180px]">
                                    <AvatarImage
                                        src={profile?.profilePicture}
                                    />
                                    <AvatarFallback>ST</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex flex-col gap-3">
                                {user?._id === id ? (
                                    <div className="flex items-center gap-3">
                                        <p className="text-lg">
                                            {profile?.username}
                                        </p>
                                        <Button
                                            onClick={() => navigate("./edit")}
                                            className="bg-gray-300  active:bg-slate-300 hover:bg-slate-400 h-[30px] text-black"
                                        >
                                            Edit profile
                                        </Button>
                                        <Button className=" text-black bg-gray-300  active:bg-slate-300 hover:bg-slate-400 h-[30px] ">
                                            View archive
                                        </Button>
                                        <Settings />
                                    </div>
                                ) : user?.following.includes(id) ? (
                                    <div className="flex items-center gap-3">
                                        <p>{profile?.username}</p>
                                        <Button className="bg-gray-300  active:bg-slate-300 hover:bg-slate-400 h-[30px] text-black">
                                            Following
                                        </Button>
                                        <Button className="bg-gray-300 h-[30px] active:bg-slate-300 hover:bg-slate-400 text-black">
                                            Message
                                        </Button>
                                        <MoreHorizontal />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <p>{profile?.username}</p>
                                        <Button className="bg-gray-300 h-[30px]  active:bg-slate-300 hover:bg-slate-400 text-black">
                                            Follow
                                        </Button>

                                        <MoreHorizontal />
                                    </div>
                                )}
                                <div className="flex gap-[60px]">
                                    <div>
                                        <span className="font-semibold">
                                            {profile?.posts.length}
                                        </span>{" "}
                                        posts
                                    </div>
                                    <div>
                                        <span className="font-semibold">
                                            {profile?.following.length}
                                        </span>{" "}
                                        following
                                    </div>
                                    <div>
                                        <span className="font-semibold">
                                            {profile?.followers.length}
                                        </span>{" "}
                                        followers
                                    </div>
                                </div>
                                <span className="font-semibold">
                                    {profile?.name}
                                </span>
                                <span>{profile?.bio}</span>
                            </div>
                        </div>
                        <div className="h-[150px] borer-2 border-black">
                            <Toggle aria-label="Toggle italic">
                                <Heart className="h-4 w-4" />
                            </Toggle>
                        </div>
                        <div className="border-t border-gray-300">
                            <div className="flex justify-center gap-10 text-xs font-medium tracking-wider">
                                <span
                                    onClick={() => {
                                        setTab("POSTS");
                                    }}
                                    className={`cursor-pointer ${
                                        tab === "POSTS"
                                            ? "border-t border-black text-black"
                                            : "text-gray-700"
                                    }  flex gap-[4px] items-center p-4 `}
                                >
                                    <IoMdGrid className="scale-[1.2]" />
                                    POSTS
                                </span>
                                <span
                                    onClick={() => {
                                        setTab("SAVED");
                                    }}
                                    className={`cursor-pointer ${
                                        tab === "SAVED"
                                            ? "text-black border-t border-black"
                                            : "text-gray-700"
                                    }  flex gap-[4px] items-center p-4`}
                                >
                                    <FaRegBookmark className="scale-[1.2]" />
                                    SAVED
                                </span>
                                <span
                                    onClick={() => {
                                        setTab("TAGGED");
                                    }}
                                    className={`cursor-pointer ${
                                        tab === "TAGGED"
                                            ? "text-black border-t border-black"
                                            : "text-gray-700"
                                    } flex gap-[5px] items-center p-4`}
                                >
                                    <BiUserPin className="scale-[1.6]" />
                                    TAGGED
                                </span>
                            </div>
                            {tab === "POSTS" && <ProfilePosts />}
                            {tab === "SAVED" && (
                                <ProfileSavedPosts userId={id} />
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="h-[30%] my-4 bogrder-2 border-green-500 p-6 flex gap-[6vw] ml-6">
                            <div>
                                <Skeleton
                                    className={`w-[180px] bg-slate-300 h-[180px] rounded-full`}
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <div>
                                    <Skeleton className="h-4 my-[10px] bg-slate-300 w-[250px]" />
                                    <Skeleton className="h-4 my-[10px] bg-slate-300 w-[250px]" />
                                </div>
                                <div className="my-[15px]">
                                    <Skeleton className="h-4 my-[10px] bg-slate-300 w-[100px]" />
                                    <Skeleton className="h-4 my-[10px] bg-slate-300 w-[100px]" />
                                </div>
                            </div>
                        </div>
                        <div className="ml-14 flex gap-5">
                            <Skeleton
                                className={`w-[80px] bg-slate-300 h-[80px] rounded-full`}
                            />
                            <Skeleton
                                className={`w-[80px] bg-slate-300 h-[80px] rounded-full`}
                            />
                            <Skeleton
                                className={`w-[80px] bg-slate-300 h-[80px] rounded-full`}
                            />
                            <Skeleton
                                className={`w-[80px] bg-slate-300 h-[80px] rounded-full`}
                            />
                            <Skeleton
                                className={`w-[80px] bg-slate-300 h-[80px] rounded-full`}
                            />
                            <Skeleton
                                className={`w-[80px] bg-slate-300 h-[80px] rounded-full`}
                            />
                        </div>
                        <div className="flex gap-1 mt-20 ml-14">
                            <Skeleton className="h-[308px] my-[10px] bg-slate-300 w-[308px]" />
                            <Skeleton className="h-[308px] my-[10px] bg-slate-300 w-[308px]" />
                            <Skeleton className="h-[308px] my-[10px] bg-slate-300 w-[308px]" />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Profile;

{
    /* <>
    <div className="h-[30%] my-4 bogrder-2 border-green-500 p-6 flex gap-[6vw] ml-6">
        <div>
            <Skeleton className={`w-[180px] h-[180px] rounded-full`} />
        </div>
        <div className="flex flex-col gap-3">
            <div>
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[250px]" />
            </div>
            <div>
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[100px]" />
            </div>
        </div>
    </div>
    <div className="h-[150px] borer-2 border-black">
        <Toggle aria-label="Toggle italic">
            <Heart className="h-4 w-4" />
        </Toggle>
    </div>
    <div className="border-t border-gray-300">
        <div className="flex justify-center gap-10 text-xs font-medium tracking-wider">
            <span
                onClick={() => {
                    setTab("POSTS");
                }}
                className={`cursor-pointer ${
                    tab === "POSTS"
                        ? "border-t border-black text-black"
                        : "text-gray-700"
                }  flex gap-[4px] items-center p-4 `}
            >
                <IoMdGrid className="scale-[1.2]" />
                POSTS
            </span>
            <span
                onClick={() => {
                    setTab("SAVED");
                }}
                className={`cursor-pointer ${
                    tab === "SAVED"
                        ? "text-black border-t border-black"
                        : "text-gray-700"
                }  flex gap-[4px] items-center p-4`}
            >
                <FaRegBookmark className="scale-[1.2]" />
                SAVED
            </span>
            <span
                onClick={() => {
                    setTab("TAGGED");
                }}
                className={`cursor-pointer ${
                    tab === "TAGGED"
                        ? "text-black border-t border-black"
                        : "text-gray-700"
                } flex gap-[5px] items-center p-4`}
            >
                <BiUserPin className="scale-[1.6]" />
                TAGGED
            </span>
        </div>
        {tab === "POSTS" && <ProfilePosts />}
        {tab === "SAVED" && <ProfileSavedPosts userId={id} />}
    </div>
</> */
}
