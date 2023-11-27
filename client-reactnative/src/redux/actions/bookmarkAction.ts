export const bookmarkAction = {
  getBookmarkByUserName: {
    pending: () => ({ type: "GET_BOOKMARK_BY_USERNAME_PENDING" }),
    fulfill: (data: any) => ({
      type: "GET_BOOKMARK_BY_USERNAME_FULFILL",
      payload: data,
    }),
    errors: (error: string) => ({
      type: "GET_BOOKMARK_BY_USERNAME_ERROR",
      payload: error,
    }),
  },
  updateCountBookmark: {
    pending: () => ({ type: "UPDATE_COUNT_BOOKMARK_PENDING" }),
    fulfill: (data: any) => ({
      type: "UPDATE_COUNT_BOOKMARK_FULFILL",
      payload: data,
    }),
    errors: (error: string) => ({
      type: "UPDATE_COUNT_BOOKMARK_ERROR",
      payload: error,
    }),
  },
};
