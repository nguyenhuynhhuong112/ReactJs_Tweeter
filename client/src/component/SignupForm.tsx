import React, { FormEvent, useState } from 'react';
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

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4">Sign up</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              User name
            </label>

            <input
              type="text"
              id="userName"
              name="userName"
              placeholder="Enter your username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={formData.userName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="">
              Full name
            </label>

            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your fullname"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={formData.password}
              onChange={handleChange}
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
