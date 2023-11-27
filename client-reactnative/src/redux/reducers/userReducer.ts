import { formatDateJoin } from "../../utilities/FormatDate";

const initialState = {
    data: null,
    loading: false,
    error: null,
  };
  
  type apiAction = {
    type: string;
    payload: any;
  };
  
  export const userReducer = (state = initialState, action: apiAction) => {
    switch (action.type) {
      case "GET_USER_PENDING":
        return { ...state, loading: true, error: null };
        case "GET_USER_FULFILL":
          const user = action.payload;
          const formattedDateJoined = formatDateJoin(user.dateJoined);
          const formattedUser = {
            ...user,
            dateJoined: formattedDateJoined,
          };
    
          return {
            ...state,
            data: formattedUser,
            loading: false,
            error: null,
          };
      case "GET_USER_ERROR":
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
        case 'UPDATE_USER_PROFILE_PENDING':
          return { ...state, loading: true };
          case 'UPDATE_USER_PROFILE_FULFILL':
            const userUpdate = action.payload;
            const formateDate = formatDateJoin(userUpdate.dateJoined); 
            const formatDatedJoined = {
              ...userUpdate,
              dateJoined: formateDate,
            };
          
            return {
              ...state,
              data: formatDatedJoined,
              loading: false,
              error: null,
            };
          
        case 'UPDATE_USER_PROFILE_ERROR':
          return {
            ...state,
            loading: false,
            error: action.payload,
          };
      default:
        return state;
    }
  };
  