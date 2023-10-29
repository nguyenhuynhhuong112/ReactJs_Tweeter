import React from 'react';
import { UserProfile } from '../component/Profile';
import { TweetListProfile } from '../component/Tweet';

export const Profile: React.FC = () => {
  return (
    <div className="w-full">
      <UserProfile />
      <TweetListProfile />
    </div>
  );
};
