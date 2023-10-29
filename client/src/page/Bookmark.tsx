// import React from 'react';
import React from 'react';

import { TweetListBookmark } from '../component/Tweet/TweetList/TweetListBookmark';
import Header from '../layout/Header/Header';

export const Bookmark: React.FC = () => {
  return (
    <div className="w-full">
      <Header name="Bookmark" />

      <TweetListBookmark />
    </div>
  );
};
