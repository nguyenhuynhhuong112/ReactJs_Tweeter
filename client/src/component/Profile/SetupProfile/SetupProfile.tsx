import React, { ChangeEvent, useRef, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './SetupProfile.scss';
import { customFetch } from '../../../utilities/customFetch';
import { useDispatch, useSelector } from 'react-redux';
import { GetAvatarAction, UserProfileAction } from '../../../redux';
import ImgCrop from 'antd-img-crop';

interface SetupProfileProps {
  isProfileSetupOpen: boolean;
  onCloseProfileSetup: () => void;
}

export const SetupProfile: React.FC<SetupProfileProps> = ({ isProfileSetupOpen, onCloseProfileSetup }) => {
  const setup = `profile-setup-modal ${isProfileSetupOpen ? 'visible' : 'hidden'}`;
  const path = '/profile';
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [uploadType, setUploadType] = useState<'avatar' | 'coverImage' | ''>('');
  const { fullName, email, password } = formData;
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const coverImageFileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const [isFullNameValid, setIsFullNameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCoverImageUploadClick = () => {
    setUploadType('coverImage');
    if (coverImageFileInputRef.current) {
      coverImageFileInputRef.current.click();
    }
  };

  const handleAvatarImageUploadClick = () => {
    setUploadType('avatar');
    if (avatarFileInputRef.current) {
      avatarFileInputRef.current.click();
    }
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (uploadType === 'coverImage') {
        setSelectedFile(e.target.files[0]);
      } else if (uploadType === 'avatar') {
        setSelectedFile(e.target.files[0]);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const updatedData = {
        fullName,
        email,
        password,
      };
      dispatch(UserProfileAction.updateUserProfile.pending());
      const { data: updateData, error: updateError } = await customFetch(
        {
          method: 'PATCH',
          data: updatedData,
        },
        path
      );

      if (updateData) {
        dispatch(UserProfileAction.updateUserProfile.fulfill(updateData));
      } else {
        dispatch(UserProfileAction.updateUserProfile.errors(updateError));
      }

      if (uploadType === 'coverImage' && selectedFile) {
        const coverImageFormData = new FormData();
        coverImageFormData.append('image', selectedFile);
        dispatch(UserProfileAction.updateUserProfile.pending());
        const { data: coverImageUploadData, error: coverImageUploadError } = await customFetch(
          {
            method: 'PATCH',
            data: coverImageFormData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
          '/profile/coverimage'
        );

        if (coverImageUploadData) {
          const newImage = coverImageUploadData.users.imageCover;
          dispatch(
            UserProfileAction.updateUserProfile.fulfill({
              ...user.data,
              imageCover: newImage,
            })
          );
          console.log('Cover image uploaded successfully:', coverImageUploadData);
        } else {
          dispatch(UserProfileAction.updateUserProfile.errors(coverImageUploadError));
          console.error('Error uploading cover image:', coverImageUploadError);
        }
      }

      if (uploadType === 'avatar' && selectedFile) {
        const avatarFormData = new FormData();
        avatarFormData.append('image', selectedFile);

        const { data: avatarUploadData, error: avatarUploadError } = await customFetch(
          {
            method: 'PATCH',
            data: avatarFormData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
          '/profile/avatar'
        );

        // Handle avatar upload response
        if (avatarUploadData) {
          const newImage = avatarUploadData.users.imageAvatar;
          dispatch(
            UserProfileAction.updateUserProfile.fulfill({
              ...user.data,
              imageAvatar: newImage,
            })
          );
          const { data: avatarNew, error } = await customFetch({}, `/profile/imageAvatar`);
          if (avatarNew) dispatch(GetAvatarAction.updateAuthor.fulfill(avatarNew));
          else dispatch(GetAvatarAction.updateAuthor.errors(error));
          console.log('Avatar uploaded successfully:', avatarUploadData);
        } else {
          dispatch(UserProfileAction.updateUserProfile.errors(avatarUploadError));
          console.error('Error uploading avatar:', avatarUploadError);
        }
      }

      onCloseProfileSetup();
    } catch (error) {
      console.log('error: ', error);
    }
  };
  console.log('username ', user.data.userName);
  const checkFullName = () => {
    const regexPattern = /^[A-Z][a-z]*(\s+[A-Z][a-z]*){1,}$/;
    setIsFullNameValid(regexPattern.test(fullName));
  };
  const checkPassword = () => {
    const regexPattern = /^[a-zA-z0-9!@#$%^&*(),.?\":{}|<>]{6,}$/;
    setIsPasswordValid(regexPattern.test(password));
  };
  const [isEmailValid, setIsEmailValid] = useState(true);
  const checkEmail = () => {
    const regexPattern = /^[a-z0-9]+@[a-z]+\.(com)$/;
    setIsEmailValid(regexPattern.test(email));
  };
  return (
    <div className={`${setup}`}>
      <Form labelCol={{ span: 5 }} wrapperCol={{ span: 14 }} layout="horizontal" className="edit-form">
        <div className="close-button flex justify-between" onClick={onCloseProfileSetup}>
          <FontAwesomeIcon icon={faTimes} />
          <h2 className="uppercase font-semibold">edit profile</h2>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              Save
            </Button>
          </Form.Item>
        </div>
        <span style={{ color: isFullNameValid ? '' : 'red' }}>
          {isFullNameValid
            ? ''
            : 'Full name invalid. Must have 2 words in capital letters, the first letter of the words must be separated by a space, no special characters or numbers'}
        </span>
        <Form.Item label="Full Name">
          <Input name="fullName" value={fullName} onChange={handleChange} onBlur={checkFullName} />
        </Form.Item>
        <span style={{ color: isEmailValid ? '' : 'red' }}>{isEmailValid ? '' : 'Email invalid'}</span>
        <Form.Item label="Email">
          <Input type="email" name="email" value={email} onChange={handleChange} onBlur={checkEmail} />
        </Form.Item>
        <span style={{ color: isPasswordValid ? '' : 'red' }}>
          {isPasswordValid ? '' : 'Password must be 6 characters long'}
        </span>
        <Form.Item label="Password">
          <Input type="password" name="password" value={password} onChange={handleChange} onBlur={checkPassword} />
        </Form.Item>
        <Form.Item label="Cover Image" valuePropName="fileList" className="">
          <ImgCrop>
            <div onClick={handleCoverImageUploadClick}>
              <input type="file" accept="image/*" onChange={handleFileChange} className="coverImage" />
            </div>
          </ImgCrop>
        </Form.Item>
        <Form.Item label="Avatar" valuePropName="fileList" className="">
          <ImgCrop>
            <div onClick={handleAvatarImageUploadClick}>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </ImgCrop>
        </Form.Item>
      </Form>
    </div>
  );
};
