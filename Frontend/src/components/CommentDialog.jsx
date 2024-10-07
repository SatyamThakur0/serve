// import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import styles from "./Post.module.css";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { FaRegBookmark, FaRegComment, FaRegHeart } from "react-icons/fa";
import { PiPaperPlaneTiltBold } from "react-icons/pi";

const CommentDialog = ({
    open,
    setOpen,
    post,
    postLike,
    likeDislikeHandler,
    postComment,
}) => {
    const [openOption, setOpenOption] = useState(false);
    const [comments, setComments] = useState([]);
    const [fetched, setFetched] = useState(false);
    const inpRef = useRef();
    const { user } = useSelector((store) => store.user);
    const [inptext, setInptext] = useState("");

    useEffect(() => {
        fetch(`http://localhost:8000/api/post/comments/${post._id}`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((res) => {
                setComments(res.Comments);
                setFetched(true);
            });
    }, []);

    if (!fetched)
        return (
            <Dialog open={open}>
                <DialogTitle />
                <DialogContent
                    aria-describedby="dialog-description"
                    className="outline-none"
                    onInteractOutside={() => setOpen(false)}
                >
                    <p
                        id="dialog-description"
                        className="font-medium text-center"
                    >
                        Loading...
                    </p>
                </DialogContent>
            </Dialog>
        );
    else {
        return (
            <Dialog open={open}>
                <DialogTitle />

                <DialogContent
                    className={`outline-none flex flex-col gap-0 bg-[#eeeeee] p-0 h-[85vh] w-[450px]`}
                    onInteractOutside={() => setOpen(false)}
                >
                    <div
                        className={`w-full  py-4 h-15 flex items-center border-b border-gray-800`}
                    >
                        <span className={` flex pl-3 items-center gap-2 `}>
                            <Avatar>
                                <AvatarImage src={post.author.profilePicture} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className={`font-semibold`}>
                                {post.author.username}
                            </div>
                            <div className={`text-gray-700`}>2d</div>
                        </span>
                        <div className={`float-end w-5 h-5`}>
                            <Dialog>
                                <DialogTrigger
                                    open={openOption}
                                    asChild
                                    className={`cursor-pointer absolute right-2`}
                                >
                                    <MoreHorizontal className={`mr-3`} />
                                </DialogTrigger>
                                <DialogContent
                                    onInteractOutside={() =>
                                        setOpenOption(false)
                                    }
                                    className="flex flex-col outline-none items-center w-1/5"
                                >
                                    <div
                                        variant="ghost"
                                        className={`w-fit font-semibold rounded-lg cursor-pointer hover:bg-slate-100 p-2 text-red-700`}
                                    >
                                        Unfollow
                                    </div>
                                    <div
                                        variant="ghost"
                                        className={`w-fit text-center hover:bg-slate-100 p-2 font-semibold cursor-pointer rounded-lg`}
                                    >
                                        Add to favorates
                                    </div>
                                    {user?._id === post.author._id && (
                                        <div
                                            variant="ghost"
                                            className={`text-red-700 w-fit cursor-pointer p-2 font-semibold hover:bg-slate-100 rounded-lg`}
                                            onClick={() => deletePost(post._id)}
                                        >
                                            Delete
                                        </div>
                                    )}
                                    <div
                                        variant="ghost"
                                        className={`w-fit cursor-pointer hover:bg-slate-100 font-semibold p-2 rounded-lg`}
                                    >
                                        Cancel
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <div
                        className={`${styles.noScrollbar} h-[480px] border-red-600 overflow-scroll p-3 flex flex-col  gap-2`}
                    >
                        {comments.length != 0 ? (
                            comments.map((comment) => {
                                return (
                                    <div
                                        id="dialog-description"
                                        key={comment._id}
                                        className={` flex gap-3 items-center`}
                                    >
                                        <div className={``}>
                                            <Avatar>
                                                <AvatarImage
                                                    src={
                                                        comment.author
                                                            ?.profilePicture
                                                    }
                                                />
                                                <AvatarFallback>
                                                    CN
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div>
                                            <div
                                                className={`flex gap-3 items-center`}
                                            >
                                                <div
                                                    className={`text-xs font-semibold`}
                                                >
                                                    {comment.author?.username}
                                                </div>
                                                <div className={`text-sm font`}>
                                                    {comment.text}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p
                                id="dialog-description"
                                className="outline-none text-center mt-[50%] text-xl font-bold"
                            >
                                No comments
                            </p>
                        )}
                    </div>

                    <div
                        className={`flex items-center h-8 px-3 w-full border-t border-gray-800 py-5`}
                    >
                        <div className={`flex gap-5  w-full`}>
                            {postLike.liked ? (
                                <div
                                    onClick={() => likeDislikeHandler(post._id)}
                                >
                                    <svg
                                        className={`${styles.svg} cursor-pointer`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        id="heart"
                                    >
                                        <path
                                            fill="#f05542"
                                            d="M5.301 3.002c-.889-.047-1.759.247-2.404.893-1.29 1.292-1.175 3.49.26 4.926l.515.515L8.332 14l4.659-4.664.515-.515c1.435-1.437 1.55-3.634.26-4.926-1.29-1.292-3.483-1.175-4.918.262l-.516.517-.517-.517C7.098 3.438 6.19 3.049 5.3 3.002z"
                                        ></path>
                                    </svg>
                                </div>
                            ) : (
                                <div
                                    onClick={() => likeDislikeHandler(post._id)}
                                >
                                    <FaRegHeart
                                        className={`scale-150 cursor-pointer`}
                                    />
                                </div>
                            )}
                            <div>
                                <FaRegComment
                                    className={`scale-150 cursor-pointer`}
                                />
                            </div>
                            <div>
                                <PiPaperPlaneTiltBold
                                    className={`scale-150 cursor-pointer`}
                                />
                            </div>
                        </div>
                        <div>
                            <FaRegBookmark
                                className={`scale-150 cursor-pointer`}
                            />
                        </div>
                    </div>
                    <div className={`w-full px-3 mb-2`}>
                        <div className={`text-sm font-semibold`}>
                            {postLike.likeCount} Likes
                        </div>
                        {/* {post.caption && (
                                <div className={`text-sm`}>
                                    <b>{post.author.username}</b> {post.caption}
                                </div>
                            )} */}
                    </div>

                    <div className="flex items-center border-t border-gray-800 px-3">
                        <input
                            ref={inpRef}
                            onChange={(e) => {
                                e.preventDefault();
                                if (e.target.value.trim()) {
                                    setInptext(e.target.value);
                                } else setInptext("");
                            }}
                            placeholder="Add a comment..."
                            className={`px-1 bg-[#eeeeee] w-full h-10 ${styles.commentinput}`}
                            type="text"
                        />
                        {inptext && (
                            <p
                                onClick={async () => {
                                    inpRef.current.value = "";
                                    setInptext("");
                                    const Comment = await postComment(inptext);
                                    setComments([Comment, ...comments]);
                                }}
                                className="text-sm font-bold text-sky-500 cursor-pointer"
                            >
                                Post
                            </p>
                        )}
                    </div>
                    {/* </div> */}
                </DialogContent>
            </Dialog>
        );
    }
};

export default CommentDialog;
