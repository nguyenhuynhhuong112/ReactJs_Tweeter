import React, { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { customFetch } from '../utilities/customFetch';
import { useNavigate } from 'react-router';
import { Message } from './Icon/Message/Message';
import {  UserProfileAction } from '../redux';
import { Spinner } from './Icon';
export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { loading } = useSelector((state: any) => state);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { userName, password } = formData;
  const dispatch = useDispatch();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(UserProfileAction.getUserProfile.pending());
    const { data, error } = await customFetch({ method: 'POST', data: formData }, '/login');
    if (data) {
      const token = data.token;
      localStorage.setItem('token', token);
      dispatch(UserProfileAction.getUserProfile.fulfill(data));
      Message('Đăng nhập thành công');
      navigate('/', { replace: true });
    } else {
      dispatch(UserProfileAction.getUserProfile.errors(error));
      setError('Sai username hoặc mật khẩu');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        {loading ? (
          <Spinner />
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="text-red-500">{error}</div>}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
             
              <input
                type="text"
                id="userName"
                name="userName"
                placeholder="Enter your username"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={userName}
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
                value={password}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
              Login
            </button>
            <div className="text-sm py-2 text-[#FF0000]">
              Do you have an account?
              <span>
                <a href="/signup" className="underline">
                  Sign up{' '}
                </a>
              </span>
              here
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
