import express from 'express';
import { middlewareJWT } from '../middlewares/middleware';
import { getNotificationByUserName, updateNotificationIsRead } from '../controllers/notification.controller';
const notificationRouter = (router: express.Router) => {
  router.get('/notification', middlewareJWT, getNotificationByUserName);
  router.patch('/notification/:notificationId', middlewareJWT, updateNotificationIsRead);
};
export default notificationRouter;
