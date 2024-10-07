import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { userActions } from "@/store/userSlice";

const EditProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.user);
    const [open, setOpen] = useState(false);
    const [updated, setUpdated] = useState(true);
    const inputRef = useRef();
    const [input, setInput] = useState({
        profilePicture: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender || "male",
    });

    const fileChangeHandler = (e) => {
        e.preventDefault();
        const file = e.target.files?.[0];
        if (file) console.log(file);
        else console.log("not working");
        setInput({ ...input, profilePicture: file });
        setOpen(false);
    };

    const editProfile = async (e) => {
        e.preventDefault();
        try {
            setUpdated(false);
            const formData = new FormData();
            formData.append("profilePicture", input.profilePicture);
            formData.append("bio", input.bio);
            formData.append("gender", input.gender);
            let res = await fetch(
                "http://localhost:8000/api/user/profile/edit",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );
            res = await res.json();
            console.log(res);

            if (res.success) {
                navigate(`/profile/${user._id}`);
                toast.success(res.message);
                const payload = {
                    ...user,
                    bio: input.bio,
                    profilePicture: res.User.profilePicture,
                    gender: input.gender,
                };
                dispatch(userActions.setUser(payload));
                dispatch(userActions.setProfile(payload));
                localStorage.setItem("user", JSON.stringify(payload));
                localStorage.setItem("profile", JSON.stringify(payload));
                setUpdated(true);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setUpdated(true);
        }
    };
    return (
        <>
            <div className="bord4er-2 border-red-700 w-[800px] relative left-[25vw] px-20">
                <div className="h-[120px] flex items-center borfder-2 border-green-700 font-bold text-lg">
                    Edit Profile
                </div>
                <div className="borcder-2 border-green-700 flex items-center justify-between bg-gray-300 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex">
                            <Avatar className="w-[60px] h-[60px]">
                                <AvatarImage src={user?.profilePicture} />
                                <AvatarFallback>ST</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex">
                            <div className="flex flex-col gap-0">
                                <div className={`font-semibold m-0`}>
                                    {user?.username}
                                </div>
                                <p className={`text-gray-600 m-0`}>
                                    {user?.name}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Dialog open={open}>
                            <DialogTrigger asChild>
                                <Button
                                    onClick={() => setOpen(true)}
                                    className="bg-black hover:bg-gray-700"
                                >
                                    Change photo
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="flex flex-col items-center w-[250px]">
                                <DialogTitle />
                                <DialogDescription />
                                <DialogHeader />
                                <div className="flex flex-col justify-center items-center">
                                    <Avatar className="w-[60px] h-[60px]">
                                        <AvatarImage
                                            src={user?.profilePicture}
                                        />
                                        <AvatarFallback>ST</AvatarFallback>
                                    </Avatar>
                                    <p className="text-gray-600 text-xs">
                                        Current photo
                                    </p>
                                </div>
                                <input
                                    onChange={(e) => {
                                        fileChangeHandler(e);
                                        console.log(e);
                                    }}
                                    ref={inputRef}
                                    type="file"
                                    hidden
                                />
                                <Button
                                    onClick={() => {
                                        inputRef.current.click();
                                        // setOpen(false);
                                    }}
                                    className="w-full flex items-center justify-center rounded-lg h-[40px] cursor-pointer font-semibold bg-gray-0 text-blue-600 hover:bg-gray-200"
                                >
                                    Upload photo
                                </Button>
                                <div className=" w-full flex items-center justify-center rounded-lg hover:bg-gray-200 h-[40px]  cursor-pointer font-semibold text-red-600">
                                    Remove current photo
                                </div>
                                <div
                                    className=" w-full flex items-center justify-center rounded-lg  h-[40px]  cursor-pointer hover:bg-gray-200"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="my-3">
                    <p className="font-bold mb-2">Bio</p>
                    <Textarea
                        className="appearance-none border bg-[#eeeee] resize-none focus-visible:ring-[#eeeee] border-gray-400 rounded-xl"
                        placeholder="Type your bio here."
                        name="bio"
                        value={input.bio}
                        onChange={(e) =>
                            setInput({ ...input, bio: e.target.value })
                        }
                    />
                </div>
                <div className="w-full border bhorder-gray-400">
                    <p className="font-bold mb-2">Gender</p>
                    <select
                        name="gender"
                        value={input.gender}
                        onChange={(e) => {
                            setInput({ ...input, gender: e.target.value });
                        }}
                        id="gender"
                        className="w-full appearance-none rounded-xl px-3 outline-none border bg-[#eeeeee] border-gray-400 h-[50px]"
                    >
                        <option value="male" className="cursor-pointer">
                            male
                        </option>
                        <option value="female" className="h-[40px] w-[200px]">
                            female
                        </option>
                    </select>
                </div>
                <div className="mt-4 w-full">
                    {updated ? (
                        <Button
                            onClick={(e) => editProfile(e)}
                            className="bg-black float-right text-lg w-1/4 hover:bg-gray-700 font-semibold"
                        >
                            Submit
                        </Button>
                    ) : (
                        <Button
                            // onClick={(e) => editProfile(e)}
                            className="bg-black float-right text-lg w-1/4 hover:bg-gray-700 font-semibold disabled cursor-wait flex items-center gap-2"
                        >
                            <Loader2 className="h-[20px] w-[20px] animate-spin" />
                            updating...
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
};
export default EditProfile;
