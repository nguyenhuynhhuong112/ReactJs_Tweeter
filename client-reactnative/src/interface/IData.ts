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
interface IData extends Document {
  content: string;
  userName: string;
  fullName: string;
  dateTweet: Date;
  image: string;
  cloudinaryId: string;
  likes: ILike[];
  bookmarks: IBookmark[];
  comments: IComment[]
}

export default IData;
