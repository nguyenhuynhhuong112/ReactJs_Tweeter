
const initialState = {
  data: null,
  loading: false,
  error: null,
};

type apiAction = {
  type: string;
  payload: any;
};

export const loginReducer = (state = initialState, action: apiAction) => {
  switch (action.type) {
    case "LOGIN_PENDING":
      return { ...state, loading: true, error: null };
    case "LOGIN_FULFILL":
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
      };
    case "LOGIN_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
