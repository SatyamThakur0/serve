import { Heart, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";

const ProfilePosts = () => {
    const { profilePosts } = useSelector((store) => store.user);
    return (
        <div className="bordder-2 border-green-500 gap-[5px] w-[945px] justify flex flex-wrap">
            {profilePosts.map((post) => {
                return (
                    <div
                        key={post._id}
                        className="max-w-[308px] min-w-[308px] min-h-[308px] justify-center flex max-h-[308px] bordder-2 border-red-700"
                    >
                        <img
                            className="object-cover"
                            src={post.image}
                            alt="image"
                        />
                        <div
                            // key={post._id}
                            className=" absolute w-[308px] flex items-center justify-center hover:bg-black  hover:bg-opacity-50 bg-opacity-0 hover:text-opacity-100 text-opacity-0 transition-all h-[308px] text-white borjder-2 border-red-700"
                        >
                            <div className="flex justify-center items-center gap-2 hover:opacity-100">
                                <span className="flex justify-center items-center gap-1">
                                    <Heart />
                                    {post.likes.length}
                                </span>
                                <span className="flex justify-center items-center gap-1">
                                    <MessageCircle />
                                    {post.comments.length}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProfilePosts;
