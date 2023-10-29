import { Server as SocketServer } from 'socket.io';
import { NotificationType, User } from '../model';
import { createNotification } from './notification.controller';
import { addComment } from './comment.controller';

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
      const userFind = await User.findOne({ userName: name });
      console.log('userFind: ', userFind);
      const notification = await createNotification(userName, {
        type: NotificationType.Follow,
        message: `${name} is now following you.`,
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
        message: `${name} like tweet of you`,
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
        message: `${name} comment tweet of you`,
        fromUserName: name,
        tweetId: tweetId,
      });
      io.to(room).emit('like', { userName, room, name, notification, tweetId });
    });
    socket.on('disconnect', () => {
      console.log('A client disconnected');
    });
  });
};
