import React from 'react';
import { BrowserRouter as Router, Route, BrowserRouter, Routes } from 'react-router-dom'; // Update import statements
import Home from '../page/Home';
import Explore from '../page/Explore';
import Bookmark from '../page/Bookmark';
import Notification from '../page/Notifications';
import Profile from '../page/Profile';
import ProfileFollow from '../component/UserWallProfile/UserWallProfile';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/bookmark" element={<Bookmark />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/user/follow" element={<ProfileFollow />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
