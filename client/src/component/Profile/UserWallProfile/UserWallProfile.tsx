import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { customFetch } from '../../../utilities/customFetch';
import Header from '../../../layout/Header/Header';
import { GetUserFollowAction, TweetAction, UserProfileAction } from '../../../redux';
import { io } from 'socket.io-client';
import { TweetDetail } from '../../../component/Tweet';
import { Avatar, Button } from 'antd';
import { useParams } from 'react-router';
export const UserWallProfile: React.FC = () => {
  const user = useSelector((state: any) => state.userFollow);
  const users = useSelector((state: any) => state.user.data);
  const date = user.data?.dateJoined === undefined ? 'date joined' : user.data.dateJoined;
  const name = user.data?.userName === undefined ? 'user name' : user.data?.userName;
  let fullNameUser = user.data?.fullName === undefined ? 'full name' : user.data?.fullName;
  const coverimage = user.data && user.data?.imageCover ? user.data.imageCover : '';
  const avatarimage = user.data && user.data?.imageAvatar ? user.data.imageAvatar : '';
  const followings = user.data && user.data.following ? user.data.following.length : 0;
  const followers = user.data && user.data.followers ? user.data.followers.length : 0;
  const dispatch = useDispatch();
  const userFollowing = users ? users.following : [];
  const token = localStorage.getItem('token');
  const formatMonthYear = (isoDate: string): string => {
    const date = new Date(isoDate);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month < 10 ? '0' : ''}${month} ${year}`;
  };
  const fetchData = async () => {
    dispatch(TweetAction.getTweet.pending());
    const { data, error } = await customFetch({}, `/profile/tweet/${userName}`);
    if (data) {
      dispatch(TweetAction.getTweet.fulfill(data || []));
    } else dispatch(TweetAction.getTweet.errors(error));
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
  const { userName } = useParams();
  const loadData = async () => {
    try {
      console.log('userName: ' + userName);
      dispatch(GetUserFollowAction.getUserFollow.pending());
      const { data, error } = await customFetch({}, `/profile/user/${userName}`);
      if (data && data.length > 0) {
        const user = data[0];
        console.log('áaaa', user);
        dispatch(GetUserFollowAction.getUserFollow.fulfill(user));
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
    } else dispatch(UserProfileAction.updateFollow.errors(error));
  };
  const [avatarImage, setAvatarImage] = useState(user.data && user.data.imageAvatar ? user.data.imageAvatar : '');
  useEffect(() => {
    fetchData();
    loadData();
    socket.on('follow', (notification) => {
      console.log('Follow notification:', notification.message);
    });
    if (user.data && user.data.imageAvatar) {
      setAvatarImage(user.data.imageAvatar);
    }

  }, [userName]);
  const isUserFollowing = (userName: string) => {
    const followingArray = Array.isArray(userFollowing) ? userFollowing : [];
    return followingArray.some((followingUser: any) => followingUser && followingUser.userName === userName);
  };
  const { data: tweetList } = useSelector((state: any) => state.tweets);
  return (
    <div className="profile-info px-4 w-full css-dev-only-do-not-override-39ufzt">
      <div>
        <Header name={name} />
        <div className="cover-image relative">
          <img src={coverimage} alt="Cover Image" className="w-full h-80 object-cover rounded-lg" />
        </div>
        <div className="avatar-button-container mt-4 flex items-start justify-between">
          <div className="avatar">
            <Avatar src={avatarimage} alt="User Profile" className="w-24 h-24 rounded-full" />
            {/* <img src={avatarimage} alt="User Avatar"  /> */}
          </div>
        </div>
        <div className="user-details mt-4">
          <h2 className="text-xl font-semibold">{fullNameUser}</h2>
          {users?.userName === name ? (
            <div></div>
          ) : (
            <Button
              size="small"
              onClick={() => {
                handleFollowClick(name);
                handleFollowing(name);
              }}>
              {isUserFollowing(name) ? 'Following' : 'Follow'}
            </Button>
          )}

          <p className="text-gray-600">{`@${name}`}</p>
          <p className="text-gray-600">
            <FontAwesomeIcon icon={faCalendarDays} /> {`Joined: ${formatMonthYear(date)}`}
          </p>
          <p className="text-gray-600">
            <span className="mr-4">{`${followings} Following`}</span>
            <span>{`${followers} Followers`}</span>
          </p>
        </div>
        <div>
          {tweetList &&
            tweetList.map((tweet, index) => (
              <TweetDetail
                key={index}
                tweetId={tweet._id}
                fullName={tweet.fullName}
                userName={tweet.userName}
                timeAgo={tweet.dateTweet}
                content={tweet.content}
                imageUrl={tweet.image}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
