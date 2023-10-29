import React, { useState, useRef } from 'react';
import 'tailwindcss/tailwind.css';
import { FileImageOutlined, CloseOutlined } from '@ant-design/icons';
import { Input, Button, Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { customFetch } from '../../../utilities/customFetch';
import { Message, MessageError } from '../../Icon/Message/Message';
import { TweetAction } from '../../../redux';
import { useNavigate } from 'react-router';

interface TweetBoxProps {
  onTweet: (tweetText: string) => void;
}

export const TweetBox: React.FC<TweetBoxProps> = () => {
  const [tweetText, setTweetText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const avatarImage = (user.data && user.data.imageAvatar) || '';
  const handleTweet = async () => {
    try {
      if (tweetText.trim() === '' && !imageFile) {
        MessageError('Không thể tạo bài tweet');
        return;
      }
      if (tweetText.trim() !== '' || imageFile) {
        dispatch(TweetAction.createTweet.pending());
        const formData = new FormData();
        formData.append('content', tweetText);
        if (imageFile) {
          formData.append('image', imageFile);
        }
        formData.append('fullName', user.data.fullName);
        formData.append('userName', user.data.userName);
        const { data, error } = await customFetch(
          {
            method: 'POST',
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
          '/tweet'
        );
        if (data) {
          console.log('Tweet created successfully:', data);
          dispatch(TweetAction.createTweet.fulfill(data));
          setTweetText('');
          setImageFile(null);
          Message('Upload thành công');
        } else {
          dispatch(TweetAction.createTweet.errors(error));
        }
      }
    } catch (error) {
      console.error('Error creating tweet:', error);
    }
  };
  const handleImageUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      console.log('Selected image file:', file);
    }
  };
  const handleRemoveImage = () => {
    setImageFile(null);
  };
  return (
    <div className="tweet-box w-full flex flex-col p-4 bg-white rounded-lg border border-gray-300">
      <div className="flex w-full items-center">
        <div className="avatar-button-container" onClick={() => navigate(`/profile`)}>
          <Avatar src={avatarImage} alt="User Profile" className="w-12 h-12 rounded-full" />
          {/* <img src={avatarImage} alt="User Avatar" className="w-12 h-12 rounded-full object-contain" /> */}
        </div>
        <Input
          bordered={false}
          maxLength={100}
          placeholder="What's happening ? "
          className="textArea"
          value={tweetText}
          onChange={(e) => setTweetText(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between mt-4 space-x-2">
        <span className="icon" onClick={handleImageUploadClick}>
          <FileImageOutlined />
        </span>

        <div>
          <Button className="button-Tweet" size="middle" onClick={handleTweet}>
            Tweet
          </Button>
        </div>
      </div>

      {imageFile && (
        <div className="relative">
          <button className="close-button" onClick={handleRemoveImage}>
            <CloseOutlined />
          </button>
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Selected"
            className="selected-image max-w-[100px] max-h-[300px]"
          />
        </div>
      )}

      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
    </div>
  );
};
