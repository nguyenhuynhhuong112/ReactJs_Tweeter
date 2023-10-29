import React, { useEffect, useState } from 'react';
import './LeftNavigation.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import navigationItems from '../Navigation.config';
import { faBars, faBell } from '@fortawesome/free-solid-svg-icons';
import UserAvatar from '../../../component/Icon/UserAvatarProfile/UserAvatar';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Dropdown, MenuProps } from 'antd';
import { GetAvatarAction, NotificationAction, TweetAction, UserProfileAction } from '../../../redux';
import { customFetch } from '../../../utilities/customFetch';
import { io } from 'socket.io-client';
const variants = {
  open: { width: '200px' },
  closed: { width: '80px' },
};
export const LeftNavigation: React.FC = () => {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const user = useSelector((state: any) => state?.user);
  const [isUserInfoVisible, setIsUserInfoVisible] = useState(true);
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const avatarImage = (user.data && user.data?.imageAvatar) || '';
  const name = user.data?.userName === undefined ? 'user name' : user.data?.userName;
  const fullNameUser = user.data?.fullName === undefined ? 'full name' : user.data?.fullName;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const nameLogout = token || token === '' ? 'Log out' : 'Log in';
  const countNoti = useSelector((state: any) => state.notification);
  const notificationCounts = countNoti?.data?.unreadCount || 0;
  const socket = io('http://localhost:8080', {
    autoConnect: false,
  });
  const toggleNavigation = () => {
    setIsNavigationOpen(!isNavigationOpen);
    setIsLogoVisible(!isLogoVisible);
    setIsUserInfoVisible(!isUserInfoVisible);
  };
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);
  const fetchData = async () => {
    if (!token) return;
    dispatch(UserProfileAction.getUserProfile.pending());
    const { data, error } = await customFetch({}, '/profile');
    if (data) {
      dispatch(UserProfileAction.getUserProfile.fulfill(data));
    } else {
      dispatch(UserProfileAction.getUserProfile.errors(error));
    }
  };
  const handleProfile = () => {
    navigate('/profile');
  };
  const hanldeLogout = () => {
    localStorage.removeItem('token');
    dispatch(UserProfileAction.getUserProfile.fulfill(null));
    navigate('/login');
  };
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link to={'profile'} onClick={handleProfile}>
          <span className="hover:text-primary">Profile</span>
        </Link>
      ),
    },
    {
      key: '2',
      label: <span className="hover:text-primary">Settings</span>,
    },
    {
      key: '3',
      label: (
        <Link to={'login'} onClick={hanldeLogout}>
          <span className="text-red-500">{nameLogout}</span>
        </Link>
      ),
    },
  ];
  const getAuthorAvatars = async () => {
    const { data, error } = await customFetch({}, '/profile/imageAvatar');
    console.log('data ', data);
    if (data) dispatch(GetAvatarAction.getAuthor.fulfill(data));
    else dispatch(GetAvatarAction.getAuthor.errors(error));
  };
 
  useEffect(() => {
    if (!token) return;
    fetchData();
    notification();
    getAuthorAvatars();
  }, [token]);
  useEffect(() => {
    socket.connect();
    socket.emit('joinRoom', { room: name });
    socket.on('follow', (data) => {
      dispatch(NotificationAction.getNotification.fulfill(data.notification));
    });
    socket.on('like', (data) => {
      dispatch(NotificationAction.getNotification.fulfill(data.notification));
    });
    return () => {
      socket.disconnect();
    };
  }, [socket, name]);
  const notification = async () => {
    dispatch(NotificationAction.getNotification.pending());
    const { data, error } = await customFetch({}, '/notification');
    if (data) {
      dispatch(NotificationAction.getNotification.fulfill(data));
    } else dispatch(NotificationAction.getNotification.errors(error));
  };

  return (
    <motion.div
      className={twMerge(
        'flex flex-col items-center bg-white px-2 py-8 gap-4 h-full border border-slate-50',
        isNavigationOpen && 'px-8'
      )}
      initial="closed"
      animate={isNavigationOpen ? 'open' : 'closed'}
      variants={variants}>
      <span
        className={twMerge(
          'flex w-full justify-center items-center text-primary gap-4',
          isNavigationOpen && 'justify-between'
        )}>
        {isNavigationOpen && <p className="text-xl font-bold">Tweeter</p>}
        <FontAwesomeIcon className="cursor-pointer" icon={faBars} onClick={toggleNavigation} width={30} />
      </span>
      <ul className="flex flex-col gap-8 mt-8">
        {navigationItems.map((item) => (
          <li key={item.id}>
            <Link to={item.to || '/'} className="flex items-center text-primary gap-4">
              {item.icon === faBell ? (
                <div className="relative">
                  <FontAwesomeIcon icon={item.icon} width={30} />
                  {notificationCounts > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-2">
                      {notificationCounts}
                    </span>
                  )}
                </div>
              ) : (
                <div>
                  <FontAwesomeIcon icon={item.icon} width={30} />
                </div>
              )}
              {isNavigationOpen && <div>{item.label}</div>}
            </Link>
          </li>
        ))}
      </ul>
      <Dropdown className="mt-auto" menu={{ items }} placement="topRight" arrow>
        <span>
          <UserAvatar
            size={'large'}
            avatar={avatarImage}
            renderUserInfo={isNavigationOpen}
            name={`${name}`}
            id={`${fullNameUser}`}
          />
        </span>
      </Dropdown>
    </motion.div>
  );
};
