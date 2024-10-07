import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import postsSlice from "./postsSlice";
import chatSlice from "./chatSlice";
import notificationSlice from "./notificationSlice";
// import {
//     persistStore,
//     persistReducer,
//     FLUSH,
//     REHYDRATE,
//     PAUSE,
//     PERSIST,
//     PURGE,
//     REGISTER,
// } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import postsSlice from "./postsSlice";

// const persistConfig = {
//     key: "root",
//     version: 1,
//     storage,
// };
// const rootReducer = combineReducers({
//     user: userSlice.reducer,
//     posts: postsSlice.reducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

const Store = configureStore({
    reducer: {
        posts: postsSlice.reducer,
        user: userSlice.reducer,
        chat: chatSlice.reducer,
        notification: notificationSlice.reducer,
    },
});

export default Store;
// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import userSlice from "./userSlice";
// import {
//     persistStore,
//     persistReducer,
//     FLUSH,
//     REHYDRATE,
//     PAUSE,
//     PERSIST,
//     PURGE,
//     REGISTER,
// } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import postsSlice from "./postsSlice";

// const persistConfig = {
//     key: "root",
//     version: 1,
//     storage,
// };
// const rootReducer = combineReducers({
//     user: userSlice.reducer,
//     posts: postsSlice.reducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const Store = configureStore({
//     reducer: persistedReducer,
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: {
//                 ignoredActions: [
//                     FLUSH,
//                     REHYDRATE,
//                     PAUSE,
//                     PERSIST,
//                     PURGE,
//                     REGISTER,
//                 ],
//             },
//         }),
// });

// export default Store;
