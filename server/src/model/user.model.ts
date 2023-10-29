import mongoose, { Schema, Document } from 'mongoose';

interface IFollowing {
  userName: string;
}
interface IFollowers {
  userName: string;
}
interface IBookmarks {
  tweetId: string;
}
interface IUser extends Document {
  userName: string;
  fullName: string;
  email: string;
  password: string;
  dateJoined: Date;
  cloudinaryId: String;
  imageAvatar: string;
  imageCover: string;
  following: IFollowing[];
  followers: IFollowers[];
  bookmarks: IBookmarks[];
}

const userSchema = new mongoose.Schema<IUser>({
  userName: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  dateJoined: { type: Date, default: Date.now },
  cloudinaryId: { type: String, default: '' },
  imageAvatar: { type: String, default: '' },
  imageCover: { type: String, default: '' },
  following: { type: [{ userName: String }], default: [] },
  followers: { type: [{ userName: String }], default: [] },
  bookmarks: { type: [{ tweetId: String }], default: [] },
});

export const User = mongoose.model<IUser>('User', userSchema);
