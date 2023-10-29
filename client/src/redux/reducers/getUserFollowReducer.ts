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

export const getUserFollowReducer = (state: state = initialState, action: apiAction) => {
  switch (action.type) {
    case 'GET_USER_FOLLOW_PENDING':
      return { ...state, loading: true, error: null };
    case 'GET_USER_FOLLOW_FULFILL':
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
        },
        error: null,
      };
    case 'GET_USER_FOLLOW_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
