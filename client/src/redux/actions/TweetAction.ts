export const TweetAction = {
  getTweet: {
    pending: () => ({ type: 'GET_TWEET_PENDING' }),
    fulfill: (data: any) => ({
      type: 'GET_TWEET_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'GET_TWEET_ERROR', payload: error }),
  },
  getTweetById: {
    pending: () => ({ type: 'GET_TWEET_BY_ID_PENDING' }),
    fulfill: (data: any) => ({
      type: 'GET_TWEET_BY_ID_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'GET_TWEET_BY_ID_ERROR', payload: error }),
  },
  getBookmarkByUserName: {
    pending: () => ({ type: 'GET_BOOKMARK_BY_USERNAME_PENDING' }),
    fulfill: (data: any) => ({
      type: 'GET_BOOKMARK_BY_USERNAME_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'GET_BOOKMARK_BY_USERNAME_ERROR', payload: error }),
  },

  updateTweet: {
    pending: () => ({ type: 'UPDATE_TWEET_PENDING' }),
    fulfill: (data: any) => ({
      type: 'UPDATE_TWEET_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'UPDATE_TWEET_ERROR', payload: error }),
  },
  updateCountLike: {
    pending: () => ({ type: 'UPDATE_COUNT_LIKE_PENDING' }),
    fulfill: (data: any) => ({
      type: 'UPDATE_COUNT_LIKE_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'UPDATE_COUNT_LIKE_ERROR', payload: error }),
  },
  updateCountBookmark: {
    pending: () => ({ type: 'UPDATE_COUNT_BOOKMARK_PENDING' }),
    fulfill: (data: any) => ({
      type: 'UPDATE_COUNT_BOOKMARK_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'UPDATE_COUNT_BOOKMARK_ERROR', payload: error }),
  },
  createTweet: {
    pending: () => ({ type: 'CREATE_TWEET_PENDING' }),
    fulfill: (data: any) => ({
      type: 'CREATE_TWEET_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'CREATE_TWEET_ERROR', payload: error }),
    success: (data: any) => ({
      type: 'CREATE_TWEET_SUCCESS',
      payload: data,
    }),
  },
  deleteTweet: {
    pending: () => ({ type: 'DELETE_TWEET_PENDING' }),
    fulfill: (data: any) => ({
      type: 'DELETE_TWEET_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'DELETE_TWEET_ERROR', payload: error }),
  },
  createComment: {
    pending: () => ({ type: 'CREATE_COMMENT_PENDING' }),
    fulfill: (data: any) => ({
      type: 'CREATE_COMMENT_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'CREATE_COMMENT_ERROR', payload: error }),
  },
  deleteComment: {
    pending: () => ({ type: 'DELETE_COMMENT_PENDING' }),
    fulfill: (data: any) => ({
      type: 'DELETE_COMMENT_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'DELETE_COMMENT_ERROR', payload: error }),
  },
  updateComment: {
    pending: () => ({ type: 'UPDATE_COMMENT_PENDING' }),
    fulfill: (data: any) => ({
      type: 'UPDATE_COMMENT_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'UPDATE_COMMENT_ERROR', payload: error }),
  },
  likesComment: {
    pending: () => ({ type: 'LIKE_COMMENT_PENDING' }),
    fulfill: (data: any) => ({
      type: 'LIKE_COMMENT_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'LIKE_COMMENT_ERROR', payload: error }),
  },
};
