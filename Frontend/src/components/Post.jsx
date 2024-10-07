import { FaBookmark, FaRegComment } from "react-icons/fa";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import styles from "./Post.module.css";
import { MoreHorizontal } from "lucide-react";
import { useRef, useState } from "react";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { postsActions } from "@/store/postsSlice";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { userActions } from "@/store/userSlice";

const Post = ({ post }) => {
    const [open, setOpen] = useState(false);
    const [openOption, setOpenOption] = useState(false);
    const [text, setText] = useState("");
    const comInp = useRef();
    const { user } = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [postLike, setPostLike] = useState({
        liked: post?.likes.includes(user?._id) || false,
        likeCount: post?.likes.length,
    });

    const inputHandler = (e) => {
        if (!e.target.value.trim()) {
            setText("");
        } else setText(e.target.value);
    };

    const deletePost = async (postId) => {
        try {
            let res = await fetch(
                `http://localhost:8000/api/post/delete/${postId}`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "content-type": "application/json" },
                }
            );
            res = await res.json();
            console.log(res);

            if (res.success) {
                toast.success(res.message);
                dispatch(postsActions.deletePost(res.postId));
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const savePost = async (postId) => {
        try {
            let res = await fetch(
                `http://localhost:8000/api/post/saveorunsave/${postId}`,
                {
                    credentials: "include",
                    headers: { "content-type": "applicationn/json" },
                    method: "POST",
                }
            );
            res = await res.json();
            if (res.success) {
                if (res.type === "saved") {
                    dispatch(userActions.savePost(postId));
                } else {
                    dispatch(userActions.unsavePost(postId));
                }
                toast.success(res.message);
            } else toast.error(res.message);
        } catch (error) {
            console.log(error);
        }
    };

    const postComment = async (text) => {
        try {
            let res = await fetch(
                `http://localhost:8000/api/post/comment/${post._id}`,
                {
                    credentials: "include",
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ text }),
                }
            );
            comInp.current.value = "";
            setText("");
            res = await res.json();
            if (!res.success) {
                toast.error(res.message);
            }
            return res.Comment;
        } catch (error) {
            console.log(error);
        }
    };

    const likeDislikeHandler = async (postId) => {
        try {
            let res = await fetch(
                `http://localhost:8000/api/post/like/${postId}`,
                {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    credentials: "include",
                }
            );
            res = await res.json();
            if (res.success) {
                if (res.type === "like") {
                    setPostLike({
                        liked: true,
                        likeCount: postLike.likeCount + 1,
                    });
                } else {
                    setPostLike({
                        liked: false,
                        likeCount: postLike.likeCount - 1,
                    });
                }
                dispatch(postsActions.likeDislikePost(res));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            className={`${styles.post} m-1 flex flex-col justify-center items-center w-1/4 h-fit`}
        >
            <div className={`w-full py-4 px-1 h-15 flex items-center`}>
                <span className={`flex w-full items-center gap-2 `}>
                    <Avatar
                        className="cursor-pointer"
                        onClick={() => navigate(`/profile/${post.author._id}`)}
                    >
                        <AvatarImage src={post.author.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Link
                        to={`/profile/${post.author._id}`}
                        className={`font-semibold`}
                    >
                        {post.author.username}
                    </Link>
                    {/* <div className={`text-gray-700`}>2d</div> */}
                </span>
                <div className={`float-end w-5 h-5`}>
                    <Dialog open={openOption}>
                        <DialogTrigger
                            asChild
                            onClick={() => setOpenOption(true)}
                            className={`cursor-pointer`}
                        >
                            <MoreHorizontal />
                        </DialogTrigger>
                        <DialogContent className="flex flex-col outline-none items-center w-1/5">
                            {user?._id !== post.author._id && (
                                <div
                                    variant="ghost"
                                    className={`w-fit font-semibold rounded-lg cursor-pointer hover:bg-slate-100 p-2 text-red-700`}
                                >
                                    Unfollow
                                </div>
                            )}

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
                                onClick={() => setOpenOption(false)}
                                variant="ghost"
                                className={`w-fit cursor-pointer hover:bg-slate-100 font-semibold p-2 rounded-lg`}
                            >
                                Cancel
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className={`w-full flex justify-center h-fit`}>
                <img
                    onDoubleClick={() => likeDislikeHandler(post._id)}
                    className={`rounded-md`}
                    src={post.image}
                    alt=""
                />
            </div>
            <div className={`flex items-center h-8 mt-2 px-1 w-full`}>
                <div className={`flex gap-5  w-full`}>
                    {postLike.liked ? (
                        <div onClick={() => likeDislikeHandler(post._id)}>
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
                        <div onClick={() => likeDislikeHandler(post._id)}>
                            <FaRegHeart
                                className={`scale-150 cursor-pointer`}
                            />
                        </div>
                    )}
                    <div
                        onClick={() => {
                            // getComments(post._id);
                            setOpen(true);
                        }}
                    >
                        <FaRegComment className={`scale-150 cursor-pointer`} />
                    </div>
                    <div>
                        <PiPaperPlaneTiltBold
                            className={`scale-150 cursor-pointer`}
                        />
                    </div>
                </div>
                <div
                    onClick={() => {
                        savePost(post._id);
                    }}
                >
                    {user?.saved.includes(post._id) ? (
                        <FaBookmark className={`scale-150 cursor-pointer`} />
                    ) : (
                        <FaRegBookmark className={`scale-150 cursor-pointer`} />
                    )}
                </div>
            </div>
            <div className={`w-full px-1`}>
                <div className={`text-sm font-semibold`}>
                    {postLike.likeCount} Likes
                </div>
                {post.caption && (
                    <div className={`text-sm`}>
                        <b>{post.author.username}</b> {post.caption}
                    </div>
                )}
            </div>
            <div className={`w-full text-sm px-1`}>
                {post.comments.length > 0 && (
                    <p
                        className="cursor-pointer  text-gray-500"
                        onClick={() => setOpen(true)}
                    >
                        View all {post.comments.length} comments
                    </p>
                )}
                {open && (
                    <CommentDialog
                        open={open}
                        setOpen={setOpen}
                        post={post}
                        postLike={postLike}
                        setPostLike={setPostLike}
                        likeDislikeHandler={likeDislikeHandler}
                        postComment={postComment}
                    />
                )}
                <div className="flex items-center mb-4">
                    <input
                        ref={comInp}
                        onChange={inputHandler}
                        placeholder="Add a comment..."
                        className={`px-1 w-full h-10 ${styles.commentinput}`}
                        type="text"
                    />
                    {text && (
                        <p
                            onClick={() => postComment(text)}
                            className="text-sm font-bold text-sky-500 cursor-pointer"
                        >
                            Post
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Post;
