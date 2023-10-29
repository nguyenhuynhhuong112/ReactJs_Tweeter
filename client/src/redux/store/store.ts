import { combineReducers } from 'redux';
import {  configureStore } from '@reduxjs/toolkit';
import {
  GetTweetDetail,
  GetAvatarReducer,
  getUserSearchReducer,
  getUserLoginReducer,
  userReducer,
  getTweetReducer,
  getAllUserReducer,
  getNotificationReducer,
  getUserFollowReducer,
} from '../index';

export const store = configureStore({
  reducer: combineReducers({
    getUserLogin: getUserLoginReducer,
    user: userReducer,
    tweets: getTweetReducer,
    users: getAllUserReducer,
    notification: getNotificationReducer,
    userSearch: getUserSearchReducer,
    userFollow: getUserFollowReducer,
    avatarAuthor: GetAvatarReducer,
    tweetDetail:GetTweetDetail
  }),
  devTools: { name: ' Twetter' },
});
