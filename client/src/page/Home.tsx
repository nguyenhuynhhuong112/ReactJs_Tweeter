import React from 'react';
import Header from '../layout/Header/Header';
import { TweetBox, TweetList } from '../component/Tweet';
export const Home: React.FC = () => {
  return (
    <>
      <Header name="home" />
      <TweetBox />
      <TweetList />
    </>
  );
};
