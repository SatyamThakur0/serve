import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        newNotifications: [],
    },
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
        },
        addNotification: (state, action) => {
            // state.notifications.push(action.payload);
            state.notifications = [action.payload, ...state.notifications];
        },
        addNewNotification: (state, action) => {
            state.newNotifications = [
                action.payload,
                ...state.newNotifications,
            ];
        },
        setNewNotificationEmpty: (state, action) => {
            state.newNotifications = [];
        },
    },
});

export const notificationAction = notificationSlice.actions;
export default notificationSlice;
