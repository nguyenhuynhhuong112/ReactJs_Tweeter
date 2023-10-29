import { List, Avatar } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationAction } from '../../redux';
import { customFetch } from '../../utilities/customFetch';
import './ListNotification.scss';
import { useNavigate } from 'react-router';

export const ListNotification: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [clickedNotificationIds, setClickedNotificationIds] = useState<string[]>([]);
  const [clickedNotification, setClickedNotification] = useState<string | null>(null);
  const token = localStorage.getItem('token');
  const noti = useSelector((state: any) => state.notification);
  const [showReadNotifications, setShowReadNotifications] = useState(false);
  const [showUnreadNotifications, setShowUnreadNotifications] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(true);
  const [selectedButton, setSelectedButton] = useState('All');

  const fetchData = async () => {
    dispatch(NotificationAction.getNotification.pending());
    const { data, error } = await customFetch({}, '/notification');
    if (data) dispatch(NotificationAction.getNotification.fulfill(data));
    else dispatch(NotificationAction.getNotification.errors(error));
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    fetchData();
  }, []);

  const handleShowReadNotifications = () => {
    setSelectedButton('Read');
    setShowReadNotifications(true);
    setShowUnreadNotifications(false);
    setShowAllNotifications(false);
  };

  const handleShowUnreadNotifications = () => {
    setSelectedButton('Unread');
    setShowReadNotifications(false);
    setShowUnreadNotifications(true);
    setShowAllNotifications(false);
  };

  const handleShowAllNotifications = () => {
    setSelectedButton('All');
    setShowReadNotifications(false);
    setShowUnreadNotifications(false);
    setShowAllNotifications(true);
  };

  const handleItemClick = async (_id: string, isRead: boolean) => {
    console.log('Clicked item _id:', _id);
    if (!isRead) {
      if (!clickedNotificationIds.includes(_id)) {
        setClickedNotificationIds((prevIds) => [...prevIds, _id]);
      }
      setClickedNotification(_id);
      dispatch(NotificationAction.updateNotification.pending());
      const { data, error } = await customFetch({ method: 'PATCH' }, `/notification/${_id}`);
      if (data) {
        dispatch(NotificationAction.updateNotification.fulfill(data));
        const updatedNotifications = notifications.map((notification: { _id: string }) => {
          if (notification._id === _id) {
            return { ...notification, isRead: true };
          }
          return notification;
        });

        dispatch(NotificationAction.getNotification.fulfill({ notifications: updatedNotifications }));
      } else {
        dispatch(NotificationAction.updateNotification.errors(error));
      }
    }
  };

  const notifications =
    noti.data && noti.data.notifications
      ? noti.data.notifications
          .map((notification: any) => ({
            _id: notification._id,
            message: notification.message,
            fromUserName: notification.fromUserName,
            isRead: notification.isRead,
            avatarUrl: notification.avatarUrl,
            createdAt: new Date(notification.createdAt),
            type: notification.type,
            tweetId: notification.tweetId,
          }))
          .sort((a: any, b: any) => b.createdAt - a.createdAt)
      : [];
  const imageAvatarAuthor = useSelector((state: any) => state.avatarAuthor);
  return (
    <div>
      <div className="notification-buttons">
        <button className={`btnNoti ${selectedButton === 'All' ? 'active' : ''}`} onClick={handleShowAllNotifications}>
          All
        </button>
        <button
          className={`btnNoti ${selectedButton === 'Read' ? 'active' : ''}`}
          onClick={handleShowReadNotifications}>
          Read
        </button>
        <button
          className={`btnNoti ${selectedButton === 'Unread' ? 'active' : ''}`}
          onClick={handleShowUnreadNotifications}>
          Unread
        </button>
      </div>

      <List
        itemLayout="horizontal"
        dataSource={notifications.filter((item: any) => {
          if (showAllNotifications) {
            return true;
          }
          if (showReadNotifications && item.isRead) {
            return true;
          }
          if (showUnreadNotifications && !item.isRead) {
            return true;
          }
          return false;
        })}
        renderItem={(item: any, index) => (
          <List.Item
            key={index}
            className={`notification-item ${item.isRead ? 'read' : ''}`}
            onClick={() => (
              handleItemClick(item._id, item.isRead),
              item.type === 'follow'
                ? navigate(`/profile/user/${item.fromUserName}`)
                : navigate(`/tweet/${item.tweetId}`)
            )}>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={
                    Array.isArray(imageAvatarAuthor?.data)
                      ? imageAvatarAuthor.data.find((user: any) => user.userName === item.fromUserName)?.imageAvatar
                      : null
                  }
                />
              }
              title={`${item.message}`}
              description={item.fromUserName}
            />
            {!item.isRead && (
              <div
                className={`notification-unread-indicator ${clickedNotification === item._id ? 'hidden' : ''}`}
                style={{
                  backgroundColor: 'lightblue',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  marginRight: '10px',
                }}></div>
            )}
          </List.Item>
        )}
      />
    </div>
  );
};
