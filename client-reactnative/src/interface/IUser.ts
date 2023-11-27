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
export default IUser