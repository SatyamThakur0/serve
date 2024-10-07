import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        selectedChat: [],
        onlineUsers: [],
        messages: [],
    },
    reducers: {
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
            
        },
        updateMessages: (state, action) => {
            state.messages.push(action.payload);
        },
    },
});

export const chatAction = chatSlice.actions;
export default chatSlice;
