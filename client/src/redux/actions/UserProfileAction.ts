export const UserProfileAction = {
  getUserProfile: {
    pending: () => ({ type: 'GET_USER_PROFILE_PENDING' }),
    fulfill: (data: any) => ({
      type: 'GET_USER_PROFILE_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'GET_USER_PROFILE_ERROR', payload: error }),
  },
  updateUserBookmark: {
    pending: () => ({ type: 'UPDATE_USER_BOOKMARK_PENDING' }),
    fulfill: (data: any) => ({
      type: 'UPDATE_USER_BOOKMARK_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'UPDATE_USER_BOOKMARK_ERROR', payload: error }),
  },
  updateUserProfile: {
    pending: () => ({ type: 'UPDATE_USER_PROFILE_PENDING' }),
    fulfill: (data: any) => ({
      type: 'UPDATE_USER_PROFILE_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'UPDATE_USER_PROFILE_ERROR', payload: error }),
  },
  updateFollow: {
    pending: () => ({ type: 'USER_FOLLOW_PENDING' }),
    fulfill: (data: any) => ({
      type: 'USER_FOLLOW_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'USER_FOLLOW_ERROR', payload: error }),
  },
};
