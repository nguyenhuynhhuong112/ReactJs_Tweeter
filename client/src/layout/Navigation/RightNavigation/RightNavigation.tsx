import React, { useEffect } from 'react';
import './RightNavigation.scss';
import UserAvatar from '../../../component/Icon/UserAvatarProfile/UserAvatar';
import { useDispatch, useSelector } from 'react-redux';
import { customFetch } from '../../../utilities/customFetch';
import { useNavigate } from 'react-router';
import { Button } from 'antd';
import { GetAllUserAction, GetUserFollowAction, UserProfileAction } from '../../../redux';
import { io } from 'socket.io-client';
import { SearchArea } from '../../../component/index';
export const RightNavigation: React.FC = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.users.data);
  const user = useSelector((state: any) => state.user.data);
  const userFollowing = user ? user.following : [];
  const name = user && user.userName;
  console.log('name ', name);
  const token = localStorage.getItem('token');
  const fetchData = async () => {
    dispatch(GetAllUserAction.getAllUser.pending());
    const { data, error } = await customFetch({}, '/profile/all');
    if (data) dispatch(GetAllUserAction.getAllUser.fulfill(data));
    else dispatch(GetAllUserAction.getAllUser.errors(error));
  };
  useEffect(() => {
    fetchData();
    socket.on('follow', (notification) => {
      console.log('Follow notification:', notification.message);
    });
  }, []);
  const navigate = useNavigate();
  const socket = io('http://localhost:8080', {
    autoConnect: false,
  });

  const handleUserNameClick = async (userName: string) => {
    try {
      console.log('userName: ' + userName);
      dispatch(GetUserFollowAction.getUserFollow.pending());
      const { data, error } = await customFetch({}, `/profile/user/${userName}`);
      if (data && data.length > 0) {
        const user = data[0];
        console.log('áaaa', user);
        dispatch(GetUserFollowAction.getUserFollow.fulfill(user));
        navigate(`/profile/user/${userName}`);
      } else {
        dispatch(GetUserFollowAction.getUserFollow.errors(error));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleFollowing = async (userName: string) => {
    if (!token) return;
    dispatch(UserProfileAction.updateFollow.pending());
    const { data, error } = await customFetch(
      {
        method: 'PATCH',
        data: { userName: userName },
      },
      '/profile/following'
    );
    if (data) {
      console.log('payload ', data.following);
      dispatch(UserProfileAction.updateFollow.fulfill(data.following));
      if (isUserFollowing(userName)) {
        return;
      }
      const room = userName;
      if (socket && socket.connected) {
        console.log('emit follow ', name);
        socket.emit('follow', { userName, room, name });
      } else {
        console.log('Socket is not connected. Connecting...');
        socket.connect();
        socket.once('connect', () => {
          console.log('Socket connected. Emitting follow event.');
          console.log('emit follow ', name);
          socket.emit('follow', { userName, room, name });
        });
      }
    } else dispatch(UserProfileAction.updateFollow.errors(error));
  };
  const isUserFollowing = (userName: string) => {
    const followingArray = Array.isArray(userFollowing) ? userFollowing : [];
    return followingArray.some((followingUser: any) => followingUser && followingUser.userName === userName);
  };
  const userSearch = useSelector((state: any) => state.userSearch.data);
  return (
    <div className="bg-white border border-slate-50 p-8 overflow-y-auto min-w-[300px]">
      <SearchArea />
      {(Array.isArray(userSearch) && userSearch.length === 0) || userSearch === null ? (
        <div className="might-like">
          <p className="text-sm text-primary font-semibold mt-4 mb-2">Follow now</p>
          <ul className="flex flex-col gap-4">
            {Array.isArray(users) &&
              users.map((item: any) => (
                <li key={item._id} className="flex gap-4 items-center justify-between">
                  <UserAvatar
                    renderUserInfo
                    avatar={item.imageAvatar || ''}
                    name={item.fullName}
                    id={item.userName}
                    onClick={() => handleUserNameClick(item.userName)}
                  />
                  <Button
                    size="small"
                    onClick={() => {
                      handleFollowing(item.userName);
                    }}>
                    {isUserFollowing(item.userName) ? 'Following' : 'Follow'}
                  </Button>
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
