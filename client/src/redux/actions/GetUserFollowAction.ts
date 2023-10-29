export const GetUserFollowAction = {
  getUserFollow: {
    pending: () => ({ type: 'GET_USER_FOLLOW_PENDING' }),
    fulfill: (data: any) => ({
      type: 'GET_USER_FOLLOW_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'GET_USER_FOLLOW_ERROR', payload: error }),
  },
};
