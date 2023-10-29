const initialState = {
  data: null,
  loading: false,
  error: null,
};
type state = {
  data: null | any;
  loading: boolean;
  error: any;
};
type apiAction = {
  type: string;
  payload: any;
};

export const getNotificationReducer = (state: state = initialState, action: apiAction) => {
  let unreadCount: number;
  switch (action.type) {
    case 'GET_NOTIFICATION_PENDING':
      return { ...state, loading: true, error: null };
    case 'GET_NOTIFICATION_FULFILL':
      const notificationData = action.payload;
      const updatedNotifications = notificationData.notifications.map((notification: any) => ({
        ...notification,
        isRead: notification.isRead || false,
      }));

      unreadCount = updatedNotifications.reduce((count: number, notification: any) => {
        return notification.isRead === false ? count + 1 : count;
      }, 0);

      return {
        ...state,
        loading: false,
        data: {
          ...notificationData,
          notifications: updatedNotifications,
          unreadCount: unreadCount,
        },
        error: null,
      };
    case 'GET_NOTIFICATION_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_NOTIFICATION_PENDING':
      return { ...state, loading: true, error: null };
    case 'UPDATE_NOTIFICATION_FULFILL':
      const { _id } = action.payload;
      const updatedData = state.data
        ? {
            ...state.data,
            notifications: state.data.notifications.map((notification: any) =>
              notification._id === _id ? { ...notification, isRead: true } : notification
            ),
            unreadCount: state.data.unreadCount > 0 ? state.data.unreadCount - 1 : state.data.unreadCount,
          }
        : null;
      return {
        ...state,
        loading: false,
        data: updatedData,
        error: null,
      };
    case 'UPDATE_NOTIFICATION_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'CREATE_NOTFICATION_PENDING':
      return { ...state, loading: true, error: null };
    // case 'CREATE_NOTFICATION_FULFILL':
    default:
      return state;
  }
};
