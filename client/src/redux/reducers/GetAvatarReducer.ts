const initialState = {
  data: null,
  loading: false,
  error: null,
};

type apiAction = {
  type: string;
  payload: any;
};

export const GetAvatarReducer = (state = initialState, action: apiAction) => {
  switch (action.type) {
    case 'GET_AVATAR_AUTHOR_PENDING':
      return { ...state, loading: true };
    case 'GET_AVATAR_AUTHOR_FULFILL':
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case 'GET_AVATAR_AUTHOR_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'UPDATE_AVATAR_AUTHOR_PENDING':
      return { ...state, loading: true };
    case 'UPDATE_AVATAR_AUTHOR_FULFILL':
      const newAvatar = action.payload;
      return {
        ...state,
        loading: false,
        data: newAvatar,
        error: null,
      };
    default:
      return state;
  }
};
