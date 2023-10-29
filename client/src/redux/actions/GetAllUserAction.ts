export const GetAllUserAction = {
  getAllUser: {
    pending: () => ({ type: 'GET_ALL_USER_PENDING' }),
    fulfill: (data: any) => ({
      type: 'GET_ALL_USER_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'GET_ALL_USER_ERROR', payload: error }),
  },
};
