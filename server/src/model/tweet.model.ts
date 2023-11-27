import mongoose, { Schema, Document, Types } from 'mongoose';
interface ILike {
  userName: string;
}
interface IBookmark {
  userName: string;
}
interface ILikecomment {
  userName: string;
}
interface IComment {
  content: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date | null;
  likescomment: ILikecomment[];
}
interface ITweet extends Document {
  content: string;
  userName: string;
  fullName: string;
  dateTweet: Date;
  image: string;
  cloudinaryId: string;
  likes: ILike[];
  bookmarks: IBookmark[];
  comments: Types.DocumentArray<IComment>;
}
const commentSchema = new Schema<IComment>({
  userName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  likescomment: { type: [{ userName: String }], default: [] },
});
const tweetSchema = new mongoose.Schema<ITweet>({
  content: { type: String, required: false },
  userName: { type: String, required: true },
  fullName: { type: String, required: true },
  dateTweet: { type: Date, default: Date.now },
  image: { type: String, required: false },
  cloudinaryId: { type: String, require: false },
  likes: { type: [{ userName: String }], default: [] },
  bookmarks: { type: [{ userName: String }], default: [] },
  comments: [commentSchema],
});

export const Tweet = mongoose.model<ITweet>('Tweet', tweetSchema);
