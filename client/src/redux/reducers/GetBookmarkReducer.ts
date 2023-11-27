const initialState = {
  data: null,
  loading: false,
  error: null,
};

type apiAction = {
  type: string;
  payload: any;
};
function formatTweetDate(dateTweet: any) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(dateTweet).toLocaleDateString('vi-VN', options);
  return formattedDate.replace(/,/g, '');
}
export const getBookmarkReducer = (state = initialState, action: apiAction) => {
  switch (action.type) {
    case 'GET_BOOKMARK_BY_USERNAME_PENDING':
      return { ...state, loading: true, error: null };
    case 'GET_BOOKMARK_BY_USERNAME_FULFILL':
      const tweets = action.payload.map((tweet: any) => {
        const format = formatTweetDate(tweet.dateTweet);
        return {
          ...tweet,
          dateTweet: format,
        };
      });
      return {
        ...state,
        loading: false,
        data: tweets,
        error: null,
      };
    case 'GET_BOOKMARK_BY_USERNAME_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'UPDATE_TWEET_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'UPDATE_COUNT_LIKE_PENDING':
      return {
        ...state,
        loading: true,
      };
    case 'UPDATE_COUNT_BOOKMARK_FULFILL':
      const tweetBookmark = action.payload;
      const updateBookmark = (state.data || []).filter((tweet: any) => tweet._id !== tweetBookmark._id);
      return {
        ...state,
        loading: false,
        data: updateBookmark,
        error: null,
      };

    case 'UPDATE_COUNT_LIKE_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
