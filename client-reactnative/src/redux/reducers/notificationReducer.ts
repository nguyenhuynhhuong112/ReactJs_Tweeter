const initialState = {
  data: null,
  loading: false,
  error: null,
};
type state = {
  data: null | any;
  loading: boolean;
  error: any;
};
type apiAction = {
  type: string;
  payload: any;
};
const sortByCreatedAtDesc = (data: any[]) => {
  return data.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
      return 0; 
    }

    return dateB.getTime() - dateA.getTime();
  });
};

export const notificationReducer = (
  state: state = initialState,
  action: apiAction
) => {
  switch (action.type) {
    case "GET_NOTIFICATION_PENDING":
      return { ...state, loading: true, error: null };
    case "GET_NOTIFICATION_FULFILL":
      return {
        ...state,
        data: sortByCreatedAtDesc(action.payload),
        loading: false,
        error: null,
      };
    case "GET_NOTIFICATION_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "CREATE_NOTIFICATION_PENDING":
      return { ...state, loading: true, error: null };
    case "CREATE_NOTIFICATION_FULFILL":
      return {
        ...state,
        data:sortByCreatedAtDesc(action.payload),
        loading: false,
        error: null,
      };
    case "CREATE_NOTIFICATION_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_NOTIFICATION_PENDING":
      return { ...state, loading: true, error: null };
    case "UPDATE_NOTIFICATION_FULFILL":
      return {
        ...state,
        data:sortByCreatedAtDesc(action.payload),
        loading:false,
        error:null
      }
    case 'UPDATE_NOTIFICATION_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
