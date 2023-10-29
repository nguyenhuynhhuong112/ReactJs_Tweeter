import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TweetDetail } from '../TweetDetail/TweetDetail';
import { GetTweetDetailAction } from '../../../redux';
import { customFetch } from '../../../utilities/customFetch';
import { useParams } from 'react-router';
import { Spinner } from '../../../component/Icon';

function formatTweetDate(dateTweet: any) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(dateTweet).toLocaleDateString('vi-VN', options);
  return formattedDate.replace(/,/g, '');
}

export const Tweet = () => {
  const { tweetId } = useParams();
  const dispatch = useDispatch();
  const tweet = useSelector((state: any) => state.tweetDetail.data);
  useEffect(() => {
    const loadTweetById = async () => {
      dispatch(GetTweetDetailAction.getTweetDetail.pending());
      const { data, error } = await customFetch({}, `/tweet/${tweetId}`);
      if (data) {
        dispatch(GetTweetDetailAction.getTweetDetail.fulfill(data));
      } else {
        dispatch(GetTweetDetailAction.getTweetDetail.errors(error));
      }
    };

    loadTweetById();
  }, [tweetId]);

  return (
    <div className="flex flex-col w-full gap-4">
      {tweet ? (
        <TweetDetail
          key={tweet._id}
          tweetId={tweet._id}
          fullName={tweet.fullName}
          userName={tweet.userName}
          timeAgo={formatTweetDate(tweet.dateTweet)}
          content={tweet.content}
          imageUrl={tweet.image}
          likes={tweet.likes}
          selected={true}
          comments={tweet.comments}
        />
      ) : (
        <Spinner />
      )}
    </div>
  );
};
