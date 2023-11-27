export const imageActions = {
    getImage:{
        pending: () => ({ type: 'GET_IMAGE_PENDING' }),
        fulfill: (data: any) => ({
          type: 'GET_IMAGE_FULFILL',
          payload: data,
        }),
        errors: (error: string) => ({ type: 'GET_IMAGE_ERROR', payload: error }),
    },
    updateAuthor: {
      pending: () => ({ type: 'UPDATE_AVATAR_AUTHOR_PENDING' }),
      fulfill: (data: any) => ({
        type: 'UPDATE_AVATAR_AUTHOR_FULFILL',
        payload: data,
      }),
      errors: (error: string) => ({ type: 'UPDATE_AVATAR_AUTHOR_ERROR', payload: error }),
    },
}