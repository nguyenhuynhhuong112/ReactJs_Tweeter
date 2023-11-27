import { Server as SocketServer } from 'socket.io';
import { NotificationType, User } from '../model';
import { createNotification } from './notification.controller';

export const configureSocket = (httpServer: any) => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('joinRoom', ({ room }) => {
      console.log(`Client joined room: ${room}`);
      socket.join(room);
    });

    socket.on('follow', async ({ userName, room, name }) => {
      console.log(`Received follow event from ${name} in room ${room}`);
      console.log('username: ', name);
      const notification = await createNotification(userName, {
        type: NotificationType.Follow,
        message: `${name} started following you.`,
        fromUserName: name,
      });
      console.log('create noti', notification);
      io.to(room).emit('follow', { userName, room, name, notification });
    });

    socket.on('like', async ({ room, userName, name, tweetId }) => {
      console.log(`Received follow event from ${name} in room ${room}`);
      console.log('tweetID', tweetId);
      const notification = await createNotification(userName, {
        type: NotificationType.Like,
        message: `${name} liked your tweet`,
        fromUserName: name,
        tweetId: tweetId,
      });
      io.to(room).emit('like', { userName, room, name, notification, tweetId });
    });

    socket.on('comment', async ({ room, userName, name, tweetId }) => {
      console.log(`Received follow event from ${name} in room ${room}`);
      console.log('tweetID', tweetId);
      const notification = await createNotification(userName, {
        type: NotificationType.Comment,
        message: `${name} commented on your tweet`,
        fromUserName: name,
        tweetId: tweetId,
      });
      io.to(room).emit('like', { userName, room, name, notification, tweetId });
    });
    socket.on('likecomment', async ({ room, userName, name, tweetId, commentId }) => {
      console.log(`Received follow event from ${name} in room ${room}`);
      console.log('tweetID', tweetId);
      const notification = await createNotification(userName, {
        type: NotificationType.LikeComment,
        message: `${name} liked your comment`,
        fromUserName: name,
        tweetId: tweetId,
      });
      io.to(room).emit('likecomment', { userName, room, name, notification, tweetId, commentId });
    });
    socket.on('disconnect', () => {
      console.log('A client disconnected');
    });
  });
};
