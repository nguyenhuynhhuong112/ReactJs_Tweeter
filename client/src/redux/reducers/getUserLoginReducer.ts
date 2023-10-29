const initialState = {
  data: null,
  loading: false,
  error: null,
};

type apiAction = {
  type: string;
  payload: any;
};

export const getUserLoginReducer = (state = initialState, action: apiAction) => {
  switch (action.type) {
    case 'GET_USER_LOGIN_PENDING':
      return { ...state, loading: true, error: null };
    case 'GET_USER_LOGIN_FULFILL':
      return {
        ...state,
        loading: false,
        data: {
          userName: action.payload.userName,
          fullName: action.payload.fullName,
          imageAvatar: action.payload.imageAvatar,
          token: action.payload.token,
          following: action.payload.following,
          followers: action.payload.followers,
          bookmarks: action.payload.bookmarks,
        },
        error: null,
      };
    case 'GET_USER_LOGIN_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
