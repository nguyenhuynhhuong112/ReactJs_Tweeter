import { useDispatch, useSelector } from 'react-redux';
import { customFetch } from '../../../utilities/customFetch';
import React, { useEffect } from 'react';
import { TweetDetail } from '..';
import { TweetAction } from '../../../redux';
import { Spinner } from '../../Icon';

export const TweetListProfile: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const userName = user.data ? user.data.userName : '';
  const { data: tweetList, loading } = useSelector((state: any) => state.tweets);
  const fetchData = async () => {
    dispatch(TweetAction.getTweet.pending());
    const { data, error } = await customFetch({}, `/profile/tweet/${userName}`);
    if (data) {
      dispatch(TweetAction.getTweet.fulfill(data));
      console.log("data ",data)
    } else dispatch(TweetAction.getTweet.errors(error));
  };
  useEffect(() => {
    fetchData();
  }, [userName]);
  return loading ? (
    <Spinner />
  ) : (
    <div>
      {tweetList && Array.isArray(tweetList) ? (
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
          selected={false}
          comments={tweet.comments}
          />
        ))
      ) : (
        <p>No tweets available.</p>
      )}
    </div>
  );
};
