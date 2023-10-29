export const GetAvatarAction = {
  getAuthor: {
    pending: () => ({ type: 'GET_AVATAR_AUTHOR_PENDING' }),
    fulfill: (data: any) => ({
      type: 'GET_AVATAR_AUTHOR_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'GET_AVATAR_AUTHOR_ERROR', payload: error }),
  },
  updateAuthor: {
    pending: () => ({ type: 'UPDATE_AVATAR_AUTHOR_PENDING' }),
    fulfill: (data: any) => ({
      type: 'UPDATE_AVATAR_AUTHOR_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'UPDATE_AVATAR_AUTHOR_ERROR', payload: error }),
  },
};
