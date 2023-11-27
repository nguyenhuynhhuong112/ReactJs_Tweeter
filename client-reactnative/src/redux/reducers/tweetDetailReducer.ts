import { formatTweetDate, sortComments } from "../../utilities/FormatDate";

const initialState = {
    data: null,
    loading: false,
    error: null,
  };
  
  type apiAction = {
    type: string;
    payload: any;
  };

export const tweetDetailReducer = (state = initialState, action:apiAction)=>{
    switch(action.type){
        case 'GET_TWEET_BY_ID_PENDING':
            return {...state, loading:true, error:null}
        case 'GET_TWEET_BY_ID_FULFILL':
            const tweet = action.payload
            const formatDatedJoined = formatTweetDate(tweet.dateTweet)
            const tweetFormat = {
                ...tweet,
                dateTweet: formatDatedJoined
            }
            return {
                ...state,
                loading: false,
                data: tweetFormat,
                error: null,
              };
        case 'GET_TWEET_BY_ID_ERROR':
            return {
                ...state, loading:true
            }
        default:
            return state
            
    }
}