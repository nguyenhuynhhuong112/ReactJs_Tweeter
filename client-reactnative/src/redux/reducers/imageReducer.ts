const initialState = {
    data: null,
    loading: false,
    error: null,
  };
  
  type apiAction = {
    type: string;
    payload: any;
  };
export const imageReducer = (state = initialState, action: apiAction) =>{
    switch(action.type){
        case 'GET_IMAGE_PENDING':
      return { ...state, loading: true };
    case 'GET_IMAGE_FULFILL':
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case 'GET_IMAGE_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
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
      const findAuthor = (state.data || []).map((user) => {
        if(user.userName === newAvatar.userName){
         return{
          ...user,
          imageAvatar:newAvatar.imageAvatar
         }
        }
        return user
      })
      
      return {
        ...state,
        loading: false,
        data: findAuthor,
        error: null,
      };
    default: return state;
    }
}