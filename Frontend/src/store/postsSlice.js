import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
    name: "posts",
    initialState: {
        posts: null,
    },
    reducers: {
        setNull: (state, action) => {
            state.posts = null;
        },
        getAllPost: (state, action) => {
            state.posts = action.payload;
            return state;
        },
        addPost: (state, action) => {
            state.posts = [action.payload, ...state.posts];
        },
        deletePost: (state, action) => {
            state.posts = state.posts.filter(
                (post) => post._id != action.payload
            );
        },
        likeDislikePost: (state, action) => {
            state.posts.map((post) => {
                if (post._id === action.payload.postId) {
                    if (action.payload.type === "like") {
                        post.likes.push(action.payload.userId);
                    } else {
                        post.likes = post.likes.filter(
                            (id) => id != action.payload.userId
                        );
                    }
                }
                return state;
            });
        },
    },
});

export const postsActions = postsSlice.actions;
export default postsSlice;
