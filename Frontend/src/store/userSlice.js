import { createSlice } from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem("user"));

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: user,
        suggestedUsers: [],
        profile: null, 
        profilePosts: [],
        profileSavedPosts: [],
    },
    reducers: {
        setNull: (state, action) => {
            state.user = null;
            state.suggestedUsers = [];
            state.profile = null;
            state.profilePosts = [];
            state.profileSavedPosts = [];
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload;
        },
        setFollowing: (state, action) => {
            console.log(action);

            if (action.payload.type === "follow") {
                state.user.following.push(action.payload.id);
                console.log("followed", action.payload.id);
            } else if (action.payload.type === "unfollow") {
                state.user.following = state.user.following.filter(
                    (user) => user != action.payload.id
                );
            }
            localStorage.setItem("user", JSON.stringify(state.user));
            return state;
        },
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        setProfilePost: (state, action) => {
            state.profilePosts = action.payload;
        },
        savePost: (state, action) => {
            state.user.saved.push(action.payload);
            localStorage.setItem("user", JSON.stringify(state.user));
        },
        unsavePost: (state, action) => {
            state.user.saved = state.user.saved.filter(
                (id) => id != action.payload
            );
            localStorage.setItem("user", JSON.stringify(state.user));
        },
        setProfileSavedPosts: (state, action) => {
            state.profileSavedPosts = action.payload;
        },
    },
});

export const userActions = userSlice.actions;
export default userSlice;
