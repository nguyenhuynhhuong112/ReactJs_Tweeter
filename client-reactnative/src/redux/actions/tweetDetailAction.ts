export const tweetDetailAction = {
    getTweetDetailAction : {
        pending: () => ({ type: 'GET_TWEET_BY_ID_PENDING' }),
        fulfill: (data: any) => ({
          type: 'GET_TWEET_BY_ID_FULFILL',
          payload: data,
        }),
        errors: (error: string) => ({ type: 'GET_TWEET_BY_ID_ERROR', payload: error }),
    }
}