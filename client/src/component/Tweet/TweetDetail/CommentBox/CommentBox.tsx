import React, { useState } from 'react';
import * as antd from 'antd';
import './CommentBox.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { TweetAction } from '../../../../redux';
import { customFetch } from '../../../../utilities/customFetch';
import { io } from 'socket.io-client';

const { Avatar, Space, Input, Button } = antd;
interface ICommentProps {
  tweetId: string;
  commentId: string;
  userName: string;
  content: string;
  imageUrl: string;
}
export const CommentBox: React.FC<ICommentProps> = ({ tweetId, commentId, userName, content, imageUrl }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState('');
  const user = useSelector((state: any) => state.user);
  const avatarImage = user.data?.imageAvatar ? user.data.imageAvatar : imageUrl;
  const [isValidComment, setIsValidComment] = useState(true);
  const socket = io('http://localhost:8080', {
    autoConnect: false,
  });
  const handleSubmit = async () => {
    if (isValidComment) {
      const { data, error } = await customFetch(
        { method: 'PATCH', data: { content: value } },
        `/tweet/comments/${tweetId}`
      );
      if (data) {
        console.log('data comment: ', data);
        dispatch(TweetAction.createComment.fulfill(data));
        console.log('comment user ', userName);
        const room = userName;
        const name = user.data && user.data.userName;
        console.log('user comment ', name);
        if (userName === name) {
          setValue('');
          return;
        }
        if (socket && socket.connected) {
          console.log('emit comment', room);
          socket.emit('comment', { room, userName, name, tweetId });
        } else {
          console.log('socket is connected. Connecting....');
          socket.connect();
          socket.once('connect', () => {
            console.log('Socket connected. Emitting comment event.');
            socket.emit('comment', { room, userName, name, tweetId });
          });
        }
        setValue('');
      } else {
        dispatch(TweetAction.createComment.errors(error));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const commentValue = e.target.value;
    setValue(commentValue);
    setIsValidComment(commentValue.trim() !== '');
  };

  return (
    <div className="comment-area">
      <div className="w-full flex items-center gap-4">
        <Avatar src={avatarImage} alt="User Profile" />
        <Space.Compact style={{ width: '100%' }}>
          <Input placeholder="write a comment" value={value} onChange={handleInputChange}></Input>
          <Button className="" type="primary" onClick={handleSubmit} disabled={!isValidComment}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </Button>
        </Space.Compact>
      </div>
    </div>
  );
};
