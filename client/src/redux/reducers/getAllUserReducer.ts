const initialState = {
  data: null,
  loading: false,
  error: null,
};

type apiAction = {
  type: string;
  payload: any;
};
export const getAllUserReducer = (state = initialState, action: apiAction) => {
  switch (action.type) {
    case 'GET_ALL_USER_PENDING':
      return { ...state, loading: true, error: null };
    case 'GET_ALL_USER_FULFILL':
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case 'GET_ALL_USER_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
