import React, { useEffect } from 'react';
import { customFetch } from '../../../utilities/customFetch';
import { useDispatch, useSelector } from 'react-redux';
import { TweetDetail } from '..';
import { Spinner } from '../../Icon';
import { TweetAction } from '../../../redux';


export const TweetList: React.FC = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const { data: tweetList, loading } = useSelector((state: any) => state.tweets);
  const fetchData = async () => {
    dispatch(TweetAction.getTweet.pending());
    const { data, error } = await customFetch({}, '/tweet');
    if (error) {
      dispatch(TweetAction.getTweet.errors(error));
    } else if (data) {
      dispatch(TweetAction.getTweet.fulfill(data));
    }
  };
  

  useEffect(() => {
    if (token) fetchData();
  }, []);
  return loading ? (
    <Spinner />
  ) : (
    <div className="flex flex-col w-full gap-4">
      {tweetList &&
        tweetList.map((tweet: any, index: any) => (
          <TweetDetail
            key={index}
            tweetId={tweet._id}
            fullName={tweet.fullName}
            userName={tweet.userName}
            timeAgo={tweet.dateTweet}
            content={tweet.content}
            imageUrl={tweet.image}
            likes={tweet.likes}
            comments={tweet.comments}
            selected={false}
          />
        ))}
    </div>
  );
};
