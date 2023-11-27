import mongoose, { Document, Schema, SchemaType, Types } from 'mongoose';
import { NotificationType } from './notification.enum';

interface INotification extends Document {
  userName: string;
  notifications: Types.DocumentArray<{
    _id?: Types.ObjectId;
    type: NotificationType;
    message: string;
    fromUserName: string;
    isRead: boolean;
    createAt: Date;
    tweetId: String;
    commentId: String;
  }>;
}

const notificationSchema: Schema = new Schema({
  userName: { type: String, required: true },
  notifications: [
    {
      type: { type: String, enum: Object.values(NotificationType), required: true },
      message: { type: String, required: true },
      fromUserName: { type: String, required: true },
      isRead: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
      tweetId: { type: String, require: false },
      commentId: { type: String, require: false },
    },
  ],
});

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
