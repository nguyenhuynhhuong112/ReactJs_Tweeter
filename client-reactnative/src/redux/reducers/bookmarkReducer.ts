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
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = new Date(dateTweet).toLocaleDateString(
    "vi-VN",
    options
  );
  return formattedDate.replace(/,/g, "");
}
export const bookmarkReducer = (state = initialState, action: apiAction) => {
  switch (action.type) {
    case "GET_BOOKMARK_BY_USERNAME_PENDING":
      return { ...state, loading: true, error: null };
    case "GET_BOOKMARK_BY_USERNAME_FULFILL":
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
    case "GET_BOOKMARK_BY_USERNAME_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_COUNT_BOOKMARK_PENDING":
      return { ...state, loading: true, error: null };
      case "UPDATE_COUNT_BOOKMARK_FULFILL":
        const tweetBookmark = action.payload;
        const isTweetExist = (state.data || []).some(tweet => tweet._id === tweetBookmark._id);
        let updatedBookmark;
        if (isTweetExist) {
          updatedBookmark = (state.data || []).filter(tweet => tweet._id !== tweetBookmark._id);
        } else {
          updatedBookmark = [...state.data, tweetBookmark];
        }
        return {
          ...state,
          loading: false,
          data: updatedBookmark,
          error: null,
        };
    case "UPDATE_COUNT_BOOKMARK_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
