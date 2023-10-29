import { IUser } from 'redux/config/IUser';

const initialState = {
  data: null,
  loading: false,
  error: null,
};
type state = {
  data: null | IUser;
  loading: boolean;
  error: any;
};
type apiAction = {
  type: string;
  payload: any;
};

export const userReducer = (state: state = initialState, action: apiAction) => {
  switch (action.type) {
    case 'UPDATE_USER_BOOKMARK_PENDING':
      return { ...state, loading: true, error: null };
    case 'UPDATE_USER_BOOKMARK_FULFILL':
      const bookmarkUserArray = state.data.map((user: any) => {
        const updatedUser = action.payload;
        if (user.userName === updatedUser.userName) {
          return {
            ...user,
            bookmarks: action.payload.bookmarks,
          };
        }
        return user;
      });
      return {
        ...state,
        loading: false,
        data: bookmarkUserArray,
        error: null,
      };
    case 'UPDATE_USER_BOOKMARK_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'GET_USER_PROFILE_PENDING':
      return { ...state, loading: true, error: null };
    case 'GET_USER_PROFILE_FULFILL':
      return {
        ...state,
        loading: false,
        data: {
          userName: action.payload.userName,
          fullName: action.payload.fullName,
          dateJoined: action.payload.dateJoined,
          email: action.payload.email,
          imageAvatar: action.payload.imageAvatar,
          imageCover: action.payload.imageCover,
          following: action.payload.following,
          followers: action.payload.followers,
          bookmarks: action.payload.bookmarks,
        },
        error: null,
      };
    case 'GET_USER_PROFILE_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_USER_PROFILE_PENDING':
      return { ...state, loading: true };
    case 'UPDATE_USER_PROFILE_FULFILL':
      const { fullName, email, imageAvatar, imageCover } = action.payload;

      const updatedData = state.data
        ? {
            ...state.data,
            fullName: fullName !== undefined ? fullName : state.data.fullName,
            email: email !== undefined ? email : state.data.email,
            imageAvatar: imageAvatar !== undefined ? imageAvatar : state.data.imageAvatar,
            imageCover: imageCover !== undefined ? imageCover : state.data.imageCover,
          }
        : null;

      return {
        ...state,
        loading: false,
        data: updatedData,
        error: null,
      };
    case 'UPDATE_USER_PROFILE_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'USER_FOLLOW_PENDING':
      return { ...state, loading: true };

    case 'USER_FOLLOW_FULFILL':
      const updateFollowing = state.data
        ? {
            ...state.data,
            following: action.payload,
          }
        : null;

      return {
        ...state,
        loading: false,
        data: updateFollowing,
        error: null,
      };
    case 'USER_FOLLOW_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
