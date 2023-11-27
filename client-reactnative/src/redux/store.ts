import { configureStore } from "@reduxjs/toolkit";
import { loginReducer } from "./reducers/loginReducer";
import { combineReducers } from "redux";
import { userReducer } from "./reducers/userReducer";
import { tweetRedudcer } from "./reducers/tweetReducer";
import { imageReducer } from "./reducers/imageReducer";
import { userSearchReducer } from "./reducers/userSearchReducer";
import { bookmarkReducer } from "./reducers/bookmarkReducer";
import { notificationReducer } from "./reducers/notificationReducer";
import { tweetDetailReducer } from "./reducers/tweetDetailReducer";
export const store = configureStore({
  reducer: combineReducers({
    login: loginReducer,
    user: userReducer,
    tweet: tweetRedudcer,
    imageAuthor: imageReducer,
    users: userSearchReducer,
    bookmarks: bookmarkReducer,
    notifications: notificationReducer,
    tweetDetail:tweetDetailReducer
  }),
  devTools: { name: "tweeter" },
});
