import React, { useRef, useState } from 'react';
import { Avatar, Card, Divider, Input } from 'antd';
import {
  MessageOutlined,
  RetweetOutlined,
  HeartOutlined,
  StarOutlined,
  HeartFilled,
  CloseOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import './TweetDetail.scss';
import { useDispatch, useSelector } from 'react-redux';
import { customFetch } from '../../../utilities/customFetch';
import { Message, MessageError } from '../../Icon/Message/Message';
import { CommentBox, MenuTweetDetail } from '..';
import { TweetAction } from '../../../redux';
import { CommentsList } from './CommentBox/CommentsList';
import { useNavigate } from 'react-router';
import { io } from 'socket.io-client';

interface TweetProps {
  tweetId: string;
  fullName: string;
  userName: string;
  timeAgo: string;
  content: string;
  imageUrl: string;
  likes: string[];
  selected: boolean;
  comments: string[];
}

export const TweetDetail: React.FC<TweetProps> = ({
  tweetId,
  fullName,
  userName,
  timeAgo,
  content,
  imageUrl,
  selected,
}) => {
  const [tweetState, setTweetState] = useState({
    liked: false,
    isEditing: false,
    editedContent: content,
    editedImageUrl: imageUrl,
    imageVisible: true,
    isImageUploadVisible: false,
  });

  const { isEditing, editedContent, editedImageUrl, imageVisible } = tweetState;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useSelector((state: any) => state.user);

  const { data: tweetList } = useSelector((state: any) => state.tweets);
  const tweet = tweetList && tweetList.find((state: any) => state._id === tweetId);
  const dispatch = useDispatch();

  const likeCount = tweet && tweet.likes ? tweet.likes.length : 0;
  const bookmarkCount = tweet && tweet.bookmarks ? tweet.bookmarks.length : 0;
  const commentCount = tweet && tweet.comments ? tweet.comments.length : 0;

  const listLike = tweet?.likes?.map((element: any) => element.userName) || [];
  const listBookmark = tweet?.bookmarks?.map((element: any) => element.userName) || [];
  const isLike = listLike.includes(user.data?.userName);
  const isBookmark = listBookmark.includes(user.data?.userName);
  const iconClassName = 'flex items-center gap-1 text-md hover:text-primary cursor-pointer text-slate-400';
  const updateTweetState = (newState: any) => {
    setTweetState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };
  const socket = io('http://localhost:8080', {
    autoConnect: false,
  });
  const handleBookmark = async () => {
    dispatch(TweetAction.updateCountBookmark.pending());
    const { data, error } = await customFetch({ method: 'patch' }, `/tweet/bookmark/${tweetId}`);
    if (data) {
      dispatch(TweetAction.updateCountBookmark.fulfill(data || []));
      Message('cập nhật thành công');
    } else dispatch(TweetAction.updateCountBookmark.errors(error));

    location.reload();
  };
  const handleLike = async () => {
    dispatch(TweetAction.updateCountLike.pending());
    const { data, error } = await customFetch({ method: 'patch' }, `/tweet/like/${tweetId}`);
    if (data) {
      dispatch(TweetAction.updateCountLike.fulfill(data || []));
      const room = userName;
      const name = user.data && user.data.userName;
      if (
        userName === name ||
        tweetList
          .find((element: any) => element._id === tweetId)
          ?.likes?.some((element: any) => element.userName === name)
      ) {
        return;
      }

      if (socket && socket.connected) {
        console.log('emit like', room);
        socket.emit('like', { room, userName, name, tweetId });
      } else {
        console.log('socket is connected. Connecting....');
        socket.connect();
        socket.once('connect', () => {
          console.log('Socket connected. Emitting like event.');
          socket.emit('like', { room, userName, name, tweetId });
        });
      }
    } else dispatch(TweetAction.updateCountLike.errors(error));
  };

  const handleImageClose = () => {
    updateTweetState({
      imageVisible: false,
      isImageUploadVisible: true,
    });
    if (editedImageUrl && imageFile) {
      URL.revokeObjectURL(editedImageUrl);
      setImageFile(null);
    }
  };
  const handleImageUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleDelete = async () => {
    if (userName !== user.data.userName) {
      MessageError('Bạn không được xóa');
      return;
    }
    dispatch(TweetAction.deleteTweet.pending());
    const response = await customFetch({ method: 'DELETE', data: { _id: tweetId } }, '/tweet');
    if (response) {
      const { data, error } = response;
      if (data) {
        dispatch(TweetAction.deleteTweet.fulfill(tweetId));
        Message('Delete thành công');
      } else {
        dispatch(TweetAction.deleteTweet.errors(error));
      }
    }
  };
  const handleSubmit = async () => {
    console.log('id sua: ' + tweetId);

    if (userName !== user.data.userName) {
      MessageError('Bạn không được sửa');
      return;
    }
    if (!editedContent.trim() && !imageFile) {
      MessageError('Content and image cannot be empty');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('content', editedContent);

      formData.append('_id', tweetId);
      if (imageFile && imageVisible) {
        formData.append('image', imageFile);
      }
      if (!imageVisible) {
        formData.append('deleteImage', 'true');
      }
      dispatch(TweetAction.updateTweet.pending());
      const { data, error } = await customFetch(
        {
          method: 'PATCH',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
        '/tweet'
      );

      if (data) {
        dispatch(TweetAction.updateTweet.fulfill(data));
        Message('Update thành công');
      } else {
        dispatch(TweetAction.updateTweet.errors(error));
      }
    } catch (error) {
      console.log('error');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      updateTweetState({ editedImageUrl: imageUrl, imageVisible: true });
    }
  };

  const handleEditClose = () => {
    if (!imageFile) {
      updateTweetState({ isEditing: false, editedContent: content });
    } else {
      updateTweetState({ isEditing: false, editedContent: content, editedImageUrl: imageUrl });
    }
  };
  const navigate = useNavigate();
  const loadProfile = () => {
    checkUser ? navigate('/profile') : navigate(`/profile/user/${userName}`);
  };
  const checkUser = userName === user.data?.userName ? true : false;
  const imageAvatarAuthor = useSelector((state: any) => state.avatarAuthor);
  const numCommentsToDisplay = selected ? commentCount : 3;
  const visibleComments = tweet?.comments?.slice(0, numCommentsToDisplay) || [];

  return (
    <Card className="border-none">
      <div className="user-info" onClick={loadProfile}>
        <Avatar
          src={
            Array.isArray(imageAvatarAuthor?.data)
              ? imageAvatarAuthor.data.find((user: any) => user.userName === userName)?.imageAvatar
              : null
          }
          alt="User Profile"
        />
        <div className="user-details">
          <h3>{fullName}</h3>
          <p>{`@${userName} • ${timeAgo}`}</p>
        </div>
        <div className="top-0 right-0 absolute">
          {checkUser ? (
            <MenuTweetDetail onEdit={() => updateTweetState({ isEditing: true })} onDelete={handleDelete} />
          ) : (
            <div></div>
          )}
        </div>
      </div>
      {isEditing ? (
        <div className="edit">
          <div className="flex justify-between mb-2">
            <button className="btnCloseEdit" onClick={handleEditClose}>
              <CloseOutlined />
            </button>
            <button className="btnSave" onClick={handleSubmit}>
              Save
            </button>
          </div>
          <Input
            className="inputContent"
            value={editedContent}
            onChange={(e) => updateTweetState({ editedContent: e.target.value })}
            placeholder="Edit tweet content..."
          />
          <button onClick={handleImageClose}>
            <CloseOutlined />
          </button>
          <div className="icon cursor-pointer " onClick={handleImageUploadClick}>
            {editedImageUrl && imageVisible && <img src={editedImageUrl} alt="Current Image" />}
            <FileImageOutlined />
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
          </div>
        </div>
      ) : (
        <>
          <p className="tweet-content">{content}</p>
          {editedImageUrl && imageVisible && <img src={editedImageUrl} alt="Tweet Image" />}
          <Divider />
          <div className="flex gap-4">
            <div className={iconClassName} onClick={() => navigate(`/tweet/${tweetId}`)}>
              <MessageOutlined />
              <div className="amountInteraction">{`${commentCount}`}</div>
            </div>
            <div className={iconClassName}>
              <RetweetOutlined />
              <div className="amountInteraction"></div>
            </div>
            <div className={iconClassName}>
              <div className="">
                {isLike ? (
                  <HeartFilled className="text-red-500" onClick={handleLike} />
                ) : (
                  <HeartOutlined onClick={handleLike} />
                )}
              </div>
              <div className="amountInteraction">{`${likeCount} `}</div>
            </div>
            <div className={iconClassName}>
              <div className="">
                {isBookmark ? (
                  <StarOutlined className="text-yellow-700" onClick={handleBookmark} />
                ) : (
                  <StarOutlined onClick={handleBookmark} />
                )}
              </div>
              <div className="amountInteraction">{`${bookmarkCount} `}</div>
            </div>
          </div>
        </>
      )}
      <Divider />
      <CommentBox commentId="" content={content} imageUrl="" tweetId={tweetId} userName={userName} />
      {visibleComments.map((comment:any) => (
        <CommentsList
          key={comment._id}
          tweetId={tweetId}
          commentId={comment._id}
          content={comment.content}
          timeAgo={comment.dateComment}
          userName={comment.userName}
          imageUrl=""
        />
      ))}
    </Card>
  );
};
