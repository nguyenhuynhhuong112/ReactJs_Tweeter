import IData from "../../interface/IData";
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

export const tweetRedudcer = (state = initialState, action: apiAction) => {
  switch (action.type) {
    case "GET_TWEET_PENDING":
      return { ...state, loading: true, error: null };
    case "GET_TWEET_FULFILL":
      const tweets = action.payload.map((tweet: any) => {
        const format = formatTweetDate(tweet.dateTweet);
        return {
          ...tweet,
          dateTweet: format,
        };
      });
      const sortedTweetsForGet = sortComments(tweets);
      return {
        ...state,
        loading: false,
        data: sortedTweetsForGet,
        error: null,
      };
    case "GET_TWEET_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_TWEET_PENDING":
      return { ...state, loading: true, error: null };
      case "UPDATE_TWEET_FULFILL":
        const tweetUpdate = action.payload;
        const updatedTweets = (state.data || []).map((tweet: IData) => {
          if (tweet._id === action.payload._id) {
            const formattedDate = formatTweetDate(tweetUpdate.dateTweet);
            return {
              ...tweet,
              ...tweetUpdate,
              dateTweet: formattedDate,
            };
          }
          return tweet;
        });
        const sortCommentsUpdate = sortComments(updatedTweets);
        return {
          ...state,
          loading: false,
          data: sortCommentsUpdate,
          error: null,
        };
      case "UPDATE_TWEET_ERROR":
        return { ...state, loading: false, error: action.payload };
        case 'CREATE_TWEET_FULFILL':
          const { _id, content, image, userName, fullName } = action.payload;
          const dateTweet = formatTweetDate(new Date());
          const newTweet = {
            _id,
            content,
            image,
            dateTweet,
            userName,
            fullName,
          };
          const createTweet = state.data ? [newTweet, ...state.data] : [newTweet];
          return {
            loading: false,
            data: createTweet,
            error: null,
          };
    
        case 'CREATE_TWEET_ERROR':
          return { ...state, loading: false, error: action.payload };
        case 'DELETE_TWEET_PENDING':
          return { ...state, loading: true, error: null };
        case 'DELETE_TWEET_FULFILL':
          const tweetDelete = action.payload
          const tweetDidDelete = (state.data || []).filter((tweet:any)=>tweet._id !== tweetDelete)
          return{
            ...state,
            loading:false,
            data:tweetDidDelete,
            error:null
          }
        case 'DELETE_TWEET_ERROR':
          return { ...state, loading: false, error: action.payload };
    default: return state
  }
};
