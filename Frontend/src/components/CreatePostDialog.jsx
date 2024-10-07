import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { postsActions } from "@/store/postsSlice";

const CreatePostDialog = ({ open, setOpen }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [imgPosted, setImgPosted] = useState(true);
    const inputRef = useRef();
    const captionRef = useRef();
    const dispatch = useDispatch();

    // HANDLE IMAGE PREVIEW
    const handleImagePreview = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImagePreview(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };
    // POST IMAGE
    const postImage = async () => {
        setImgPosted(false);
        try {
            const formData = new FormData();
            formData.append("caption", captionRef.current.value);
            if (imagePreview)
                formData.append("image", inputRef.current.files[0]);
            const res = await fetch(
                "http://localhost:8000/api/post/postimage",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );
            const jsonRes = await res.json();
            console.log(jsonRes);
            dispatch(postsActions.addPost(jsonRes.Post));
            if (jsonRes) setImgPosted(true);
            setImagePreview(false);
            setOpen(false);
            if (jsonRes.success) toast.success(jsonRes.message);
            else toast.error(jsonRes.message);
        } catch (error) {
            console.log(error);
        } finally {
            setImgPosted(true);
        }
    };

    const { user } = useSelector((store) => store.user);
    return (
        <Dialog open={open}>
            <DialogContent
                className="bg-[#eeeeee] rounded-lg p-6 shadow-lg w-auto h-auto max-w-[90vw] max-h-[90vh] overflow-y-auto "
                onInteractOutside={() => {
                    setOpen(false);
                    setImagePreview(null);
                }}
            >
                <DialogTitle
                    className={`text-center border-b border-b-gray-500 pb-5`}
                >
                    Create post
                    {imagePreview &&
                        (imgPosted ? (
                            <p
                                className="float-right h-[10px] text-blue-500 cursor-pointer"
                                onClick={postImage}
                            >
                                Post
                            </p>
                        ) : (
                            <p className="my-0 py-0 h-[10px] float-right bg-transparent hover:bg-transparent text-blue-500 disabled">
                                <Loader2 className="my-0  py-0 animate-spin disabled" />
                            </p>
                        ))}
                </DialogTitle>

                <div id="dialog-description" className="flex gap-6">
                    {imagePreview && (
                        <div className="h flex justify-center items-center w-full">
                            <img
                                className="object-contain rounded-xl"
                                src={imagePreview}
                                alt=""
                                style={{
                                    maxHeight: "420px",
                                    maxWidth: "600px",
                                    borderRadius: "10px",
                                }}
                            />
                        </div>
                    )}
                    <div>
                        <div className={`flex gap-3 mb-3 items-center`}>
                            <div className={``}>
                                <Avatar>
                                    <AvatarImage src={user?.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </div>
                            <div>
                                <div className={`flex gap-3 items-center`}>
                                    <div className={`text-sm font-semibold`}>
                                        {user?.username}
                                    </div>
                                    <div className={`text-sm font`}></div>
                                </div>
                            </div>
                        </div>
                        <textarea
                            ref={captionRef}
                            placeholder="Caption...."
                            className="focus:outline-none border-none px-2 placeholder:text-gray-500 mb-3 "
                            rows={12}
                            cols={40}
                        />

                        <div className="mt-5">
                            <input
                                onChange={(e) => {
                                    handleImagePreview(e);
                                    console.log(e);
                                }}
                                ref={inputRef}
                                type="file"
                                hidden
                            />
                            <Button onClick={() => inputRef.current.click()}>
                                Select from computer
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreatePostDialog;
