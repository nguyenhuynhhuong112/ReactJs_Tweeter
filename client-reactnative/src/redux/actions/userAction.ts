import IUser from "../../interface/IUser";

export const userActions = {
  getProfileUser: {
    pending: () => ({ type: "GET_USER_PENDING" }),
    fulfill: (data: IUser) => ({
      type: "GET_USER_FULFILL",
      payload: data,
    }),
    error: (error: string) => ({
      type: "GET_USER_ERROR",
      payload: error,
    }),
    
  },
  updateUserProfile: {
    pending: () => ({ type: 'UPDATE_USER_PROFILE_PENDING' }),
    fulfill: (data: any) => ({
      type: 'UPDATE_USER_PROFILE_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'UPDATE_USER_PROFILE_ERROR', payload: error }),
  },
};
