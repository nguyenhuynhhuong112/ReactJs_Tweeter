import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Bookmark, Home, LogIn, Notifications, Profile, Signup, UserWall } from '../page';
import { UserLoginAction } from '../redux';
import { isTokenExpired } from './CheckToken';
import { LeftNavigation, RightNavigation } from './Navigation';
import { Tweet } from '../component/Tweet/TweetDetail/Tweet';

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state: any) => !!state.getUserLogin.data);
  const token = localStorage.getItem('token');
  const savedRoute = localStorage.getItem('lastRoute');

  console.log('checktoken: ', isTokenExpired(token));

  useEffect(() => {
    if (token && !isLoggedIn && !isTokenExpired(token)) {
      dispatch(UserLoginAction.getUserLogin.fulfill({ token }));
    } else if (isTokenExpired(token)) {
      localStorage.removeItem('token');
      console.log('logout nè ');
    }
  }, [dispatch, isLoggedIn, isTokenExpired(token)]);

  useEffect(() => {
    if (isLoggedIn) {
      if (savedRoute) {
      } else {
        navigate('/');
      }
    }
  }, [isLoggedIn, savedRoute, navigate]);

  useEffect(() => {
    localStorage.setItem('lastRoute', location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex w-full h-full justify-between">
      {isTokenExpired(token) && (
        <div className="content-container w-full mr-auto">
          <Routes>
            <Route path="/*" element={<LogIn />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      )}
      {isLoggedIn && !isTokenExpired(token) && (
        <div className="flex justify-between w-full">
          <LeftNavigation />
          <div className="flex flex-col gap-4 p-4 overflow-y-auto w-3/6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/bookmark" element={<Bookmark />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/user/:userName" element={<UserWall />} />
              <Route path="/tweet/:tweetId" element={<Tweet />} />
            </Routes>
          </div>
          <RightNavigation />
        </div>
      )}
    </div>
  );
};

export default Layout;
