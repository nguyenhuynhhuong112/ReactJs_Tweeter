import { View } from "react-native";
import { LayoutTweet } from "./LayoutTweet";
import { useDispatch, useSelector } from "react-redux";
import { tweetDetailAction } from "../../redux/actions/tweetDetailAction";
import { customFetch } from "../../utilities/customFetch";
import { useEffect } from "react";

export const TweetDetail = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { tweetId } = route.params;
  const dispatch = useDispatch();
  console.log("twwetid ", tweetId);
  const { data: tweetDetail } = useSelector((state: any) => state.tweetDetail);
  const loadTweetById = async () => {
    dispatch(tweetDetailAction.getTweetDetailAction.pending());
    const response = await customFetch({}, `/tweet/${tweetId}`);
    if (response?.data) {
      dispatch(tweetDetailAction.getTweetDetailAction.fulfill(response.data));
    } else
      dispatch(tweetDetailAction.getTweetDetailAction.errors(response?.error));
  };
  useEffect(() => {
    loadTweetById();
  }, [tweetId]);
  return (
    <View style={{backgroundColor:'white', height:'100%'}}>
    {tweetDetail && (
      <LayoutTweet
        comments={tweetDetail.comments}
        content={tweetDetail.content}
        fullName={tweetDetail.fullName}
        imageUrl={tweetDetail.image}
        likes={tweetDetail.likes}
        selected={false}
        timeAgo={tweetDetail.dateTweet}
        tweetId={tweetDetail._id}
        userName={tweetDetail.userName}
      />
    )}
  </View>
  );
};
