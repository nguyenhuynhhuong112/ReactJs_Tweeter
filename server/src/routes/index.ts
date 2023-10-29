import express from 'express';
import userRouter from './user.routers';
import tweetRouter from './tweet.routers';
import notificationRouter from './notification.routers';
const router = express.Router();

export default (): express.Router => {
  userRouter(router);
  tweetRouter(router);
  notificationRouter(router);
  return router;
};
