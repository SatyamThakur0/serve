import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "./Post";
import { postsActions } from "@/store/postsSlice";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { Skeleton } from "./ui/skeleton";

const Posts = () => {
    const dispatch = useDispatch();
    const { posts } = useSelector((store) => store.posts);
    const { user } = useSelector((store) => store.user);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            fetch("http://localhost:8000/api/post/allposts", {
                credentials: "include",
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.success)
                        dispatch(postsActions.getAllPost(res.allPosts));
                    // else navigate("/login");
                });
        } catch (error) {
            console.log(error);
        }
    }, []);

    if (!posts)
        return (
            <>
                <div className="flex items-center gap-3">
                    <Skeleton className="my-[10px] bg-slate-300 w-[60px] h-[60px] rounded-full" />
                    <div>
                        <Skeleton className="h-3 my-[10px] bg-slate-300 w-[100px]" />
                        <Skeleton className="h-3 my-[10px] bg-slate-300 w-[100px]" />
                    </div>
                    <div className="w-[250px]">
                        <Skeleton className="h-8 my-[10px] bg-slate-300 w-[15px] float-end" />
                    </div>
                </div>
                <Skeleton className="h-[60vh] my-[10px] bg-slate-300 w-[30vw]" />
                <div className="flex gap-2">
                    <Skeleton className="h-[30px] my-[10px] bg-slate-300 w-[30px]" />
                    <Skeleton className="h-[30px] my-[10px] bg-slate-300 w-[30px]" />
                    <Skeleton className="h-[30px] my-[10px] bg-slate-300 w-[30px]" />
                    <div className="w-[320px]">
                        <Skeleton className="h-[30px] my-[10px] bg-slate-300 w-[30px] float-end" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="my-[10px] bg-slate-300 w-[60px] h-[60px] rounded-full" />
                    <div>
                        <Skeleton className="h-3 my-[10px] bg-slate-300 w-[100px]" />
                        <Skeleton className="h-3 my-[10px] bg-slate-300 w-[100px]" />
                    </div>
                    <div className="w-[250px]">
                        <Skeleton className="h-8 my-[10px] bg-slate-300 w-[15px] float-end" />
                    </div>
                </div>
                <Skeleton className="h-[60vh] my-[10px] bg-slate-300 w-[30vw]" />
                <div className="flex gap-2">
                    <Skeleton className="h-[30px] my-[10px] bg-slate-300 w-[30px]" />
                    <Skeleton className="h-[30px] my-[10px] bg-slate-300 w-[30px]" />
                    <Skeleton className="h-[30px] my-[10px] bg-slate-300 w-[30px]" />
                    <div className="w-[320px]">
                        <Skeleton className="h-[30px] my-[10px] bg-slate-300 w-[30px] float-end" />
                    </div>
                </div>
            </>
        );
    else
        return (
            <div className={`relative w-1/4 flex flex-col`}>
                {posts.map((post) => (
                    <Post key={post?._id} post={post} />
                ))}
            </div>
        );
};

export default Posts;
