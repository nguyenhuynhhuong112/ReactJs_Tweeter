import React, { useState } from 'react';
import * as antd from 'antd';
import './CommentBox.scss';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { Message, MessageError } from '../../../Icon/Message/Message';
import { customFetch } from '../../../../utilities/customFetch';
import { useDispatch, useSelector } from 'react-redux';
import { TweetAction } from '../../../../redux';
import { useNavigate } from 'react-router';
import { io } from 'socket.io-client';
const { Avatar, Input, Modal } = antd;

interface ICommentProps {
  tweetId: string;
  commentId: string;
  userName: string;
  timeAgo: Date;
  content: string;
  imageUrl: string;
  likescomment: string[];
}

export const CommentsList: React.FC<ICommentProps> = ({ commentId, tweetId, userName, content, imageUrl }) => {
  const [commentState, setCommentState] = useState({
    isEditingComment: false,
    editedContentComment: content,
  });

  const iconClassName = 'flex items-center gap-1 text-md hover:text-primary cursor-pointer text-slate-400';
  const { isEditingComment, editedContentComment } = commentState;
  const user = useSelector((state: any) => state.user);
  const { data: tweetList } = useSelector((state: any) => state.tweets);
  const tweet = tweetList && tweetList.find((state: any) => state._id === tweetId);
  const listLikeComment =
    tweet?.comments.find((com: any) => com._id === commentId).likescomment?.map((element: any) => element.userName) ||
    [];
  const isLike = listLikeComment.includes(user.data?.userName);
  const likeCommentCount =
    tweet && tweet?.comments.find((com: any) => com._id === commentId).likescomment
      ? tweet?.comments.find((com: any) => com._id === commentId).likescomment.length
      : 0;
  const avatarImage = user.data?.imageAvatar ? user.data.imageAvatar : imageUrl;
  const dispatch = useDispatch();
  const socket = io('http://localhost:8080', {
    autoConnect: false,
  });
  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const handleUpdate = () => {
    setConfirmationModalVisible(true);
  };

  const handleConfirmation = async (confirm: boolean) => {
    if (confirm) {
      if (editedContentComment.trim() !== '') {
        const { data, error } = await customFetch(
          { method: 'PATCH', data: { content: editedContentComment } },
          `/tweet/comments/${tweetId}/${commentId}`
        );
        if (data) {
          dispatch(TweetAction.updateComment.fulfill(data));
          setCommentState({ isEditingComment: false, editedContentComment: editedContentComment });
        } else {
          dispatch(TweetAction.updateComment.errors(error));
        }
      } else {
        MessageError('Comment cant be empty');
      }
    }

    setConfirmationModalVisible(false);
  };

  const handleCancel = () => {
    setCommentState({ isEditingComment: false, editedContentComment: content });
  };

  const handleDelete = async () => {
    const response = await customFetch({ method: 'DELETE' }, `/tweet/comments/${tweetId}/${commentId}`);
    dispatch(TweetAction.deleteComment.pending());
    if (response) {
      const { data, error } = response;
      if (data) {
        dispatch(TweetAction.deleteComment.fulfill({ tweetId, commentId }));
        Message('Delete complete');
      } else {
        dispatch(TweetAction.deleteComment.errors(error));
      }
    }
  };
  const handleLike = async () => {
    const response = await customFetch({ method: 'PATCH' }, `/tweet/comments/like/${tweetId}/${commentId}`);
    dispatch(TweetAction.likesComment.pending());
    if (response.data) {
      dispatch(TweetAction.likesComment.fulfill(response.data || []));
      const room = userName;
      const name = user.data && user.data.userName;
      if (
        userName === name ||
        tweet?.comments.find((com: any) => com._id === commentId).likescomment?.some((element: any) => element.userName)
      ) {
        return;
      }

      if (socket && socket.connected) {
        console.log('emit like', room);
        socket.emit('likecomment', { room, userName, name, tweetId });
      } else {
        console.log('socket is connected. Connecting....');
        socket.connect();
        socket.once('connect', () => {
          console.log('Socket connected. Emitting like event.');
          socket.emit('likecomment', { room, userName, name, tweetId });
        });
      }
    } else {
      dispatch(TweetAction.likesComment.errors(response.error));
    }
  };

  const updateCommentState = (newState: any) => {
    setCommentState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };
  const navigate = useNavigate();
  const checkUser = userName === user.data?.userName ? true : false;
  const imageAvatarAuthor = useSelector((state: any) => state.avatarAuthor);
  return (
    <div className="comment-area">
      {!isEditingComment ? (
        <div className="comment-card-content">
          <div className="avatar-container" onClick={() => navigate(`/profile/user/${userName}`)}>
            <Avatar
              src={
                Array.isArray(imageAvatarAuthor?.data)
                  ? imageAvatarAuthor.data.find((user: any) => user.userName === userName)?.imageAvatar
                  : null
              }
              alt="User Profile"
            />
          </div>
          <div className="comment">
            <p className="userName-area">{userName}</p>
            <p>{content}</p>
            <div className="tool">
              <div className={iconClassName}>
                <div className="">
                  {isLike ? (
                    <HeartFilled className="text-red-500" onClick={handleLike} />
                  ) : (
                    <HeartOutlined onClick={handleLike} />
                  )}
                </div>
                <div className="amountInteraction">{`${likeCommentCount} `}</div>
              </div>
              {checkUser && (
                <div>
                  <button className="btnEdit" onClick={() => updateCommentState({ isEditingComment: true })}>
                    Edit
                  </button>
                  <button className="btnDelete" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="edit-mode">
          <div className="avatar-container">
            <Avatar src={avatarImage} alt="User Profile" />
          </div>
          <div className="Edit_Update">
            <p className="userName-area">{userName}</p>
            <Input
              className="inputContent"
              value={editedContentComment}
              onChange={(e) => updateCommentState({ editedContentComment: e.target.value })}
              placeholder="Edit comment content..."
            />
            <button className="btnUpdate" onClick={handleUpdate}>
              Update
            </button>
            <button className="btnCancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <Modal
        visible={isConfirmationModalVisible}
        title="Confirm update"
        onOk={() => handleConfirmation(true)}
        onCancel={() => handleConfirmation(false)}
        centered
        closable={false}
        okText="Yes"
        cancelText="No">
        Are you sure to update this comment?
      </Modal>
    </div>
  );
};
