import { RequestHandler } from 'express';
import { NotificationType, Notification } from '../model';
export async function createNotification(
  userName: string,
  notificationData: { type: NotificationType; message: string; fromUserName: string; tweetId?: string }
): Promise<any> {
  try {
    const existingNotification = await Notification.findOne({ userName });
    let noti;
    if (existingNotification) {
      if (notificationData.type === NotificationType.Like) {
        existingNotification.notifications.push({
          ...notificationData,
          isRead: false,
          tweetId: notificationData.tweetId,
        });
      } else {
        existingNotification.notifications.push({ ...notificationData, isRead: false });
      }
      noti = await existingNotification.save();
    } else {
      const newNotification = {
        userName,
        notifications: [{ ...notificationData, isRead: false, tweetId: notificationData.tweetId }],
      };
      noti = await Notification.create(newNotification);
    }
    console.log('new noti.');
    return noti;
  } catch (error) {
    console.error('error:', error);
  }
}

export const getNotificationByUserName: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user;
    const notificationFind = await Notification.findOne({ userName: user.userName });
    if (!notificationFind) throw Error('not found');
    res.status(200).json(notificationFind);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateNotificationIsRead: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user;
    const { notificationId } = req.params;
    const notificationFind = await Notification.findOne({ userName: user.userName });
    if (!notificationFind) {
      return res.status(400).json({ message: 'Notification not found' });
    }
    const notificationToUpdate = notificationFind.notifications.find(
      (notification) => notification._id && notification._id.toString() === notificationId
    );
    if (!notificationToUpdate) {
      return res.status(400).json({ message: 'Notification ID not found' });
    }
    notificationToUpdate.isRead = true;
    await notificationFind.save();
    return res.status(200).json(notificationFind);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
