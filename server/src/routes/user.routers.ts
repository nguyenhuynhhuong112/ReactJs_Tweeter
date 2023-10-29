import {
  createUser,
  getUser,
  getUserByUserName,
  getUserProfile,
  searchUser,
  updateFollow,
  updateUser,
  uploadImage,
  updateBookmark,
  getImageAvatarByUserName,
} from '../controllers/user.controller';
import express from 'express';
import { upload } from '../util/multer';
import { middlewareJWT } from '../middlewares/middleware';
import { authen } from '../middlewares/auth.controller';
const userRouter = (router: express.Router) => {
  router.get('/profile/all', middlewareJWT, getUser);
  router.get('/profile/user/:userName', getUserByUserName);
  router.get('/profile', middlewareJWT, getUserProfile);
  router.get('/profile/imageAvatar', getImageAvatarByUserName);
  router.post('/register', createUser);
  router.post('/login', authen);
  router.post('/search', searchUser);
  router.patch('/profile', middlewareJWT, updateUser);
  router.patch('/profile/avatar', middlewareJWT, upload.single('image'), uploadImage);
  router.patch('/profile/coverimage', middlewareJWT, upload.single('image'), uploadImage);
  router.patch('/profile/following', middlewareJWT, updateFollow);
  router.patch('/profile/bookmark/:tweetId', middlewareJWT, updateBookmark);
};

export default userRouter;
