import React, { useState } from 'react';
import * as antd from 'antd';
import './CommentBox.scss';
import { Message, MessageError } from '../../../Icon/Message/Message';
import { customFetch } from '../../../../utilities/customFetch';
import { useDispatch, useSelector } from 'react-redux';
import { TweetAction } from '../../../../redux';
import { useNavigate } from 'react-router';
const { Avatar, Input, Modal } = antd;

interface ICommentProps {
  tweetId: string;
  commentId: string;
  userName: string;
  timeAgo: Date;
  content: string;
  imageUrl: string;
}

export const CommentsList: React.FC<ICommentProps> = ({ commentId, tweetId, userName, content, imageUrl }) => {
  const [commentState, setCommentState] = useState({
    isEditingComment: false,
    editedContentComment: content,
  });

  const { isEditingComment, editedContentComment } = commentState;
  const user = useSelector((state: any) => state.user);
  const avatarImage = user.data?.imageAvatar ? user.data.imageAvatar : imageUrl;
  const dispatch = useDispatch();

  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);
  // const [shouldUpdateComment, setShouldUpdateComment] = useState(false);

  const showConfirmationModal = () => {
    setConfirmationModalVisible(true);
  };

  const hideConfirmationModal = () => {
    setConfirmationModalVisible(false);
  };

  const handleUpdate = () => {
    showConfirmationModal();
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
          setCommentState({ isEditingComment: false, editedContentComment: '' });
        } else {
          dispatch(TweetAction.updateComment.errors(error));
        }
      } else {
        MessageError('Comment không được để trống');
      }
    }

    hideConfirmationModal();
  };

  const handleCancel = () => {
    setCommentState({ isEditingComment: false, editedContentComment: content });
  };

  const handleDelete = async () => {
    const response = await customFetch({ method: 'DELETE' }, `/tweet/comments/${tweetId}/${commentId}`);
    if (response) {
      const { data, error } = response;
      if (data) {
        dispatch(TweetAction.deleteComment.fulfill({ tweetId, commentId }));
        Message('Delete thành công');
      } else {
        dispatch(TweetAction.deleteComment.errors(error));
      }
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
          <div className="avatar-container" onClick={()=>navigate(`/profile/user/${userName}`)}>
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
        title="Xác nhận cập nhật"
        onOk={() => handleConfirmation(true)}
        onCancel={() => handleConfirmation(false)}
        centered
        closable={false}
        okText="Yes"
        cancelText="No">
        Bạn có chắc muốn cập nhật comment này?
      </Modal>
    </div>
  );
};
