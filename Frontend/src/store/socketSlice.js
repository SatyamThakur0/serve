import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name: "socket",
    initialState: {
        socket: null,
    },
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
    },
});
export const socketActions = socketSlice.actions;
export default socketSlice;
