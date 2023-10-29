import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, List } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { GetUserFollowAction, GetUserSearchActions, UserProfileAction } from '../../redux';
import { customFetch } from '../../utilities/customFetch';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router';

export function SearchArea() {
  const [value, setValue] = useState('');
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.userSearch);
  const user = useSelector((state: any) => state.user.data);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setValue(searchValue);
    if (searchValue) {
      userData({ query: searchValue });
    } else {
      dispatch(GetUserSearchActions.getUser.fulfill([]));
    }
  };
  const userData = async (searchValue: { query: string }) => {
    dispatch(GetUserSearchActions.getUser.pending());
    const { data, error } = await customFetch({ method: 'POST', data: searchValue }, '/search');
    if (data) dispatch(GetUserSearchActions.getUser.fulfill(data));
    else dispatch(GetUserSearchActions.getUser.errors(error));
  };
  const userSearch = users.data
    ? users.data.map((user: any) => ({
        userName: user.userName,
        fullName: user.fullName,
      }))
    : [];
  const socket = io('http://localhost:8080', {
    autoConnect: false,
  });
  const name = user && user.userName;
  const handleFollowClick = (userName: string) => {
    const isAlreadyFollowing = isUserFollowing(userName);
    console.log('check follow ', isAlreadyFollowing);
    if (!isAlreadyFollowing) {
      const room = userName;

      if (socket && socket.connected) {
        socket.emit('follow', { userName, room, name });
      } else {
        console.log('Socket is not connected. Connecting...');
        socket.connect();
        socket.once('connect', () => {
          console.log('Socket connected. Emitting follow event.');
          socket.emit('follow', { userName, room, name });
        });
      }
    } else {
      console.log('Người dùng đã được theo dõi.');
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
  const userFollowing = user ? user.following : [];
  const navigate = useNavigate();
  const handleUserNameClick = async (userName: string) => {
    try {
      console.log('userName: ' + userName);
      const { data, error } = await customFetch({}, `/profile/user/${userName}`);
      if (data && data.length > 0) {
        const user = data[0];
        navigate(`/profile/user/${userName}`);
        dispatch(GetUserFollowAction.getUserFollow.fulfill(user));
      } else {
        dispatch(GetUserFollowAction.getUserFollow.errors(error));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const imageAvatarAuthor = useSelector((state: any) => state.avatarAuthor);
  return (
    <div className=" p-2  ml-auto mr-auto">
      <Input
        className="rounded-2xl"
        bordered
        allowClear
        size="large"
        placeholder="Search on Twitter"
        value={value}
        prefix={<SearchOutlined />}
        onChange={handleInputChange}
      />
      {value && (
        <List
          itemLayout="horizontal"
          dataSource={userSearch}
          renderItem={(item: any, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={
                      Array.isArray(imageAvatarAuthor?.data)
                        ? imageAvatarAuthor.data.find((user: any) => user.userName === item.userName)?.imageAvatar
                        : null
                    }
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
      )}
    </div>
  );
}
