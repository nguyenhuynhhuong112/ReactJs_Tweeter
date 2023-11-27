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
  
  export const userSearchReducer = (state = initialState, action: apiAction) => {
    switch (action.type) {
      case 'GET_USERS_PENDING':
        return { ...state, loading: true, error: null };
      case 'GET_USERS_FULFILL':
        const formattedData = action.payload.map((user) => ({
          ...user,
          dateJoined: formatDateJoin(user.dateJoined), // Adjust this based on your data structure
        }));
        return {
          ...state,
          loading: false,
          data: formattedData,
          error: null,
        };
      case 'GET_USERS_ERROR':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  