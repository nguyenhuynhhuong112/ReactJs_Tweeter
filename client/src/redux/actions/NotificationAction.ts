export const NotificationAction = {
  getNotification: {
    pending: () => ({ type: 'GET_NOTIFICATION_PENDING' }),
    fulfill: (data: any) => ({
      type: 'GET_NOTIFICATION_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'GET_NOTIFICATION_ERROR', payload: error }),
  },
  updateNotification: {
    pending: () => ({ type: 'UPDATE_NOTIFICATION_PENDING' }),
    fulfill: (data: any) => ({
      type: 'UPDATE_NOTIFICATION_FULFILL',
      payload: data,
    }),
    errors: (error: string) => ({ type: 'UPDATE_NOTIFICATION_ERROR', payload: error }),
  },
};
