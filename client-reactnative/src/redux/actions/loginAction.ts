import IUser from "../../interface/IUser";

export const loginActions = {
  getLogin: {
    pending: () => ({ type: "LOGIN_PENDING" }),
    fulfill: (data: IUser) => ({
      type: "LOGIN_FULFILL",
      payload: data,
    }),
    error: (error: string) => ({
      type: "LOGIN_ERROR",
      payload: error,
    }),
  },
};
