const initialState = {
  data: null,
  loading: false,
  error: null,
};
type apiAction = {
  type: string;
  payload: any;
};

export const getUserSearchReducer = (state = initialState, action: apiAction) => {
  switch (action.type) {
    case 'GET_USERS_PENDING':
      return { ...state, loading: true, error: null };
    case 'GET_USERS_FULFILL':
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case 'GET_USERS_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
