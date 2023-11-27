import { middlewareJWT } from './../middlewares/middleware';
import express from 'express';
import { upload } from '../util/multer';
import {
  createTweet,
  deleteTweet,
  getBookmarkByUserName,
  getTweetByFollowing,
  getTweetById,
  getTweetByUserName,
  updateCountBookmark,
  updateCountLike,
  updateTweet,
} from '../controllers/tweet.controller';
import { addComment, updateComment, deleteComment, likesComment } from '../controllers/comment.controller';

const tweetRouter = (router: express.Router) => {
  router.post('/tweet', middlewareJWT, upload.single('image'), createTweet);
  router.get('/tweet', middlewareJWT, getTweetByFollowing);
  router.get('/profile/tweet/:userName', getTweetByUserName);
  router.get('/tweet/:tweetId', getTweetById);
  router.patch('/tweet', middlewareJWT, upload.single('image'), updateTweet);
  router.patch('/tweet/like/:TweetId', middlewareJWT, updateCountLike);
  router.patch('/tweet/bookmark/:TweetId', middlewareJWT, updateCountBookmark);
  router.delete('/tweet', middlewareJWT, deleteTweet);
  router.get('/bookmark', middlewareJWT, getBookmarkByUserName);
  router.patch('/tweet/comments/:tweetId', middlewareJWT, addComment);
  router.patch('/tweet/comments/:tweetId/:commentId', middlewareJWT, updateComment);
  router.delete('/tweet/comments/:tweetId/:commentId', middlewareJWT, deleteComment);
  router.patch('/tweet/comments/like/:tweetId/:commentId', middlewareJWT, likesComment);
};

export default tweetRouter;
