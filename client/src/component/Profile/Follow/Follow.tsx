import { Avatar, Button, List } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { customFetch } from '../../../utilities/customFetch';
import { useNavigate } from 'react-router';
import { GetUserFollowAction, UserProfileAction } from '../../../redux';
import { Message } from '../../../component/Icon';
import { io } from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './Follow.scss';
interface FollowProps {
  isFollowOpen: boolean;
  onCloseFollow: () => void;
}
export const Follow: React.FC<FollowProps> = ({ isFollowOpen, onCloseFollow }) => {
  const user = useSelector((state: any) => state.user.data);
  const userFollowing = user ? user.following : [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleUserNameClick = async (userName: string) => {
    try {
      console.log('userName: ' + userName);
      dispatch(GetUserFollowAction.getUserFollow.pending());
      const { data, error } = await customFetch({}, `/profile/user/${userName}`);
      if (data && data.length > 0) {
        const user = data[0];
        navigate(`/profile/user`);
        dispatch(GetUserFollowAction.getUserFollow.fulfill(user));
      } else {
        dispatch(GetUserFollowAction.getUserFollow.errors(error));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const socket = io('http://localhost:8080', {
    autoConnect: false,
  });
  const handleFollowClick = (userName: string) => {
    console.log('Following user: ' + userName);
    if (!isUserFollowing(userName)) {
      return;
    }
    const room = userName;
    if (socket && socket.connected) {
      socket.emit('follow', { userName, room });
    } else {
      console.log('Socket is not connected. Connecting...');
      socket.connect();
      socket.once('connect', () => {
        console.log('Socket connected. Emitting follow event.');
        socket.emit('follow', { userName, room, name });
      });
    }
  };
  const token = localStorage.getItem('token');
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
    } else dispatch(UserProfileAction.updateFollow.errors(error));
  };
  const isUserFollowing = (userName: string) => {
    const followingArray = Array.isArray(userFollowing) ? userFollowing : [userFollowing];
    return followingArray.some((followingUser: any) => followingUser.userName === userName);
  };
  console.log('following user profile: ', userFollowing);
  const open = isFollowOpen ? 'block' : 'hidden';
  return (
    <div className={`follow-container md:w-1/2 p-2 md:p-4  mx-auto border-2 rounded shadow-slate-100 bg-white ${open}`}>
      <div className="flex-row mb-4">
        <button onClick={onCloseFollow} className="text-gray-600">
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className="uppercase font-semibold text-center">following</h2>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={userFollowing}
        renderItem={(item: any, index) => (
          <List.Item key={index}>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                  onClick={() => handleUserNameClick(item.userName)}
                />
              }
              title={
                <span style={{ cursor: 'pointer' }} onClick={() => handleUserNameClick(item.userName)}>
                  {item.fullName}
                </span>
              }
              description={
                <span style={{ cursor: 'pointer' }} onClick={() => handleUserNameClick(item.userName)}>
                  {item.userName}
                </span>
              }
            />
            <Button
              size="small"
              onClick={() => {
                handleFollowClick(item.userName);
                handleFollowing(item.userName);
              }}>
              {isUserFollowing(item.userName) ? 'Following' : 'Follow'}
            </Button>
          </List.Item>
        )}
      />
    </div>
  );
};
