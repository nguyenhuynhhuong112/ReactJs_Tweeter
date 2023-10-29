export const GetTweetDetailAction = {
    getTweetDetail : {
        pending: () => ({ type: 'GET_TWEET_DETAIL_PENDING' }),
        fulfill: (data: any) => ({
          type: 'GET_TWEET_DETAIL_FULFILL',
          payload: data,
        }),
        errors: (error: string) => ({ type: 'GET_TWEET_DETAIL_ERROR', payload: error }),
    }
}