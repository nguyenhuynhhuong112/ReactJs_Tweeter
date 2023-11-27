import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { customFetch } from '../../../utilities/customFetch';
import { TweetDetail } from '../TweetDetail/TweetDetail';
import { TweetAction } from '../../../redux';
import { Spinner } from '../../Icon';

export const TweetListBookmark: React.FC = () => {
  const dispatch = useDispatch();

  const { data: tweetList, loading } = useSelector((state: any) => state.tweets);
  console.log('fj', tweetList);
  const fetchData = async () => {
    dispatch(TweetAction.getBookmarkByUserName.pending());
    const { data, error } = await customFetch({}, `/bookmark`);
    if (data) {
      dispatch(TweetAction.getBookmarkByUserName.fulfill(data));
    } else dispatch(TweetAction.getBookmarkByUserName.errors(error));
  };
  useEffect(() => {
    fetchData();
  }, []);

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
            comments={tweet.comments}
            selected={false}
          />
        ))
      ) : (
        <p>No tweets available.</p>
      )}
    </div>
  );
};
