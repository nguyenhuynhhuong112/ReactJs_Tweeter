export const userSearchActions = {
    userSearch: {
      pending: () => ({ type: 'GET_USERS_PENDING' }),
      fulfill: (data: any) => ({
        type: 'GET_USERS_FULFILL',
        payload: data,
      }),
      errors: (error: string) => ({ type: 'GET_USERS_ERROR', payload: error }),
    },
  };
  