export const UserLoginAction = {
  getUserLogin: {
    pending: () => ({ type: 'GET_USER_LOGIN_PENDING' }),
    fulfill: (data: any) => ({
      type: 'GET_USER_LOGIN_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'GET_USER_LOGIN_ERROR', payload: error }),
  },
};
