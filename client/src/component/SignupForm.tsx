import React, { FormEvent, useEffect, useState } from 'react';
import { customFetch } from '../utilities/customFetch';
import { useDispatch } from 'react-redux';
import { Message, MessageError } from './Icon/Message/Message';
import { useNavigate } from 'react-router';
import { UserProfileAction } from '../redux';

export const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    userName: '',
    fullName: '',
    email: '',
    password: '',
  });

  const [isUserNameValid, setIsUserNameValid] = useState(true);
  const [isFullNameValid, setIsFullNameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  // Add a state to track if the button has been clicked
  const [buttonClicked, setButtonClicked] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonClicked(true);
    checkUserName();
    checkFullName();
    checkPassword();

    if (formData.userName.trim() !== '' && formData.fullName.trim() !== '') {
      dispatch(UserProfileAction.getUserProfile.pending());
      const { data, error } = await customFetch({ method: 'POST', data: formData }, '/register');
      if (data) {
        Message('Đăng ký thành công');
        navigate('/login');
        console.log(data);
      } else {
        dispatch(UserProfileAction.getUserProfile.errors(error));
      }
    } else {
      MessageError('Vui lòng nhập lại');
      return;
    }
  };

  const checkUserName = () => {
    const userName = formData.userName;
    const regexPattern = /^[a-z][a-z0-9]{5,}$/;
    setIsUserNameValid(regexPattern.test(userName));
  };

  const checkFullName = () => {
    const fullName = formData.fullName;
    const regexPattern = /\b[A-Za-z]*\s[A-Za-z]*$/;
    setIsFullNameValid(regexPattern.test(fullName));
    console.log('check full name ', isFullNameValid);
  };

  const checkPassword = () => {
    const password = formData.password;
    const regexPattern = /^[a-zA-z0-9!@#$%^&*(),.?":{}|<>]{6,}$/;
    setIsPasswordValid(regexPattern.test(password));
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4">Sign up</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              User name
            </label>
            <span style={{ color: buttonClicked && !isUserNameValid ? 'red' : 'transparent' }}>
              {buttonClicked && !isUserNameValid ? 'User name invalid.' : ''}
            </span>
            <input
              type="text"
              id="userName"
              name="userName"
              placeholder="Enter your username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={formData.userName}
              onChange={handleChange}
              onBlur={checkUserName}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="">
              Full name
            </label>
            <span style={{ color: buttonClicked && !isFullNameValid ? 'red' : 'transparent' }}>
              {buttonClicked && !isFullNameValid ? 'Full name invalid' : ''}
            </span>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your fullname"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={checkFullName}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <span style={{ color: buttonClicked && !isPasswordValid ? 'red' : 'transparent' }}>
              {buttonClicked && !isPasswordValid ? 'Password must be 6 characters long' : ''}
            </span>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={formData.password}
              onChange={handleChange}
              onBlur={checkPassword}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold text-sm mb-2">
              Email
            </label>

            <input
              type="email"
              id="email"
              name="email"
              className="w-full border border-gray-300 py-2 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover-bg-blue-600 transition duration-300">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};
