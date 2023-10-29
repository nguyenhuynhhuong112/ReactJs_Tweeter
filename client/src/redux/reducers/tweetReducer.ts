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

export const getTweetReducer = (state = initialState, action: apiAction) => {
  switch (action.type) {
    case 'GET_TWEET_PENDING':
      return { ...state, loading: true, error: null };
    case 'GET_TWEET_FULFILL':
      const tweets = action.payload.map((tweet:any)=>{
        const format = formatTweetDate(tweet.dateTweet)
        return {
          ...tweet,
          dateTweet:format
        }
      })
      return {
        ...state,
        loading: false,
        data: tweets,
        error: null,
      };
    case 'GET_TWEET_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_TWEET_PENDING':
      return { ...state, loading: true };
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
      const updatedTweets = state.data ? [newTweet, ...state.data] : [newTweet];
      return {
        loading: false,
        data: updatedTweets,
        error: null,
      };

    case 'CREATE_TWEET_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'UPDATE_TWEET_PENDING':
      return { ...state, loading: true };
    case 'UPDATE_TWEET_NUMBER':
      return {};
    case 'UPDATE_TWEET_FULFILL':
      const updatedTweet = action.payload;
      const updatedTweetsArray = (state.data || []).map((tweet: any) => {
        if (tweet._id === updatedTweet._id) {
          return {
            ...tweet,
            content: updatedTweet.content,
            image: updatedTweet.image,
          };
        }
        return tweet;
      });

      return {
        ...state,
        loading: false,
        data: updatedTweetsArray,
        error: null,
      };
    case 'GET_BOOKMARK_BY_USERNAME_PENDING':
      return { ...state, loading: true, error: null };
    case 'GET_BOOKMARK_BY_USERNAME_FULFILL':
      return {
        ...state,
        loading: false,
        data: action.payload,
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
        // loading: true,
      };
    case 'UPDATE_COUNT_LIKE_FULFILL':
      const likeTweetArray = (state.data || []).map((tweet: any) => {
        const updatedTweet = action.payload;
        if (tweet._id === updatedTweet._id) {
          return {
            ...tweet,
            likes: action.payload.likes,
          };
        }
        return tweet;
      });

      return {
        ...state,
        loading: false,
        data: likeTweetArray,
        error: null,
      };
    case 'UPDATE_COUNT_LIKE_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'UPDATE_COUNT_BOOKMARK_PENDING':
      return {
        ...state,
        // loading: true,
      };
    case 'UPDATE_COUNT_BOOKMARK_FULFILL':
      const BookmarkTweetArray = (state.data || []).map((tweet: any) => {
        const updatedTweet = action.payload;
        if (tweet._id === updatedTweet._id) {
          return {
            ...tweet,
            bookmarks: action.payload.bookmarks,
          };
        }
        return tweet;
      });

      return {
        ...state,
        loading: false,
        data: BookmarkTweetArray,
        error: null,
      };
    case 'UPDATE_COUNT_BOOKMARK_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'DELETE_TWEET_PENDING':
      return { ...state, loading: true };
    case 'DELETE_TWEET_FULFILL':
      const deletedTweetId = action.payload;
      const updatedTweetsAfterDelete = (state.data || []).filter((tweet: any) => tweet._id !== deletedTweetId);

      return {
        ...state,
        loading: false,
        data: updatedTweetsAfterDelete,
        error: null,
      };
    case 'DELETE_TWEET_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'CREATE_COMMENT_PENDING':
      return {
        ...state,
        loading: true,
      };
    case 'CREATE_COMMENT_FULFILL':
      const createComment = action.payload;
      const updateComments = (state.data || []).map((tweet: any) => {
        if (tweet._id === createComment._id) {
          return {
            ...tweet,
            comments: action.payload.comments,
          };
        }
        return tweet;
      });
      return {
        ...state,
        loading: false,
        data: updateComments,
        error: null,
      };
    case 'CREATE_COMMENT_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'DELETE_COMMENT_PENDING':
      return { ...state, loading: true };
    case 'DELETE_COMMENT_FULFILL':
      const { tweetId, commentId } = action.payload;
      const updatedTweetsWithDeletedComment = (state.data || []).map((tweet: any) => {
        if (tweet._id === tweetId) {
          const updatedComments = (tweet.comments || []).filter((comment: any) => comment._id !== commentId);
          return {
            ...tweet,
            comments: updatedComments,
          };
        }
        return tweet;
      });

      return {
        ...state,
        loading: false,
        data: updatedTweetsWithDeletedComment,
        error: null,
      };

    case 'DELETE_COMMENT_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'UPDATE_COMMENT_PENDING':
      return { ...state, loading: true };
    case 'UPDATE_COMMENT_FULFILL':
      const updatedTweetWithComments = action.payload;
      const updatedTweetsWithComments = (state.data || []).map((tweet: any) => {
        if (tweet._id === updatedTweetWithComments._id) {
          return updatedTweetWithComments;
        }
        return tweet;
      });
      return {
        ...state,
        loading: false,
        data: updatedTweetsWithComments,
        error: null,
      };

    case 'UPDATE_COMMENT_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
