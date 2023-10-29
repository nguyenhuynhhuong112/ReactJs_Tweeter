const initialState = {
    data: null,
    loading: false,
    error: null,
  };
  
  type apiAction = {
    type: string;
    payload: any;
  };

export const GetTweetDetail = (state = initialState, action:apiAction)=>{
    switch(action.type){
        case 'GET_TWEET_DETAIL_PENDING':
            return {...state, loading:true, error:null}
        case 'GET_TWEET_DETAIL_FULFILL':
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
              };
        case 'GET_TWEET_DETAIL_ERROR':
            return {
                ...state, loading:true
            }
        default:
            return state
            
    }
}