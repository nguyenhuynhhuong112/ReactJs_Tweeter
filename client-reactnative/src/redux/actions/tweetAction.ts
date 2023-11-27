export const tweetAction = {
    getTweet: {
        pending: () => ({ type: 'GET_TWEET_PENDING' }),
        fulfill: (data: any) => ({
          type: 'GET_TWEET_FULFILL',
          payload: data,
        }),
        errors: (error: string) => ({ type: 'GET_TWEET_ERROR', payload: error }),
      },
      updateTweet:{
        pending: () => ({ type: 'UPDATE_TWEET_PENDING' }),
        fulfill: (data: any) => ({
          type: 'UPDATE_TWEET_FULFILL',
          payload: data,
        }),
        errors: (error: string) => ({ type: 'UPDATE_TWEET_ERROR', payload: error }),
      },
      createTweet: {
        pending: () => ({ type: 'CREATE_TWEET_PENDING' }),
        fulfill: (data: any) => ({
          type: 'CREATE_TWEET_FULFILL',
          payload: data,
        }),
        errors: (error: string) => ({ type: 'CREATE_TWEET_ERROR', payload: error }),
      },
      deleteTweet: {
        pending: () => ({ type: 'DELETE_TWEET_PENDING' }),
        fulfill: (data: any) => ({
          type: 'DELETE_TWEET_FULFILL',
          payload: data,
        }),
        errors: (error: string) => ({ type: 'DELETE_TWEET_ERROR', payload: error }),
      },
    }