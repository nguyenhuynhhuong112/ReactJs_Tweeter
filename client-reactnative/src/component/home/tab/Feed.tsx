import * as React from "react";
import { useEffect } from "react";
import { FlatList } from "react-native";
import { Text, View } from "react-native";
import SearchUpload from "../../search/searchUpload";
import { LayoutTweet } from "../../tweet/LayoutTweet";
import { useDispatch, useSelector } from "react-redux";
import { tweetAction } from "../../../redux/actions/tweetAction";
import { customFetch } from "../../../utilities/customFetch";

function Feed({ navigation }: { navigation: any }) {
  const dispatch = useDispatch();
  const loadDataTweet = async () => {
    dispatch(tweetAction.getTweet.pending());
    const response = await customFetch({}, "/tweet");
    if (response?.data) {
      dispatch(tweetAction.getTweet.fulfill(response.data))
    }else {
      dispatch(tweetAction.getTweet.errors(response?.error))
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDataTweet();
    });
    return unsubscribe;
  }, [navigation]);
  const {data:user} = useSelector((state:any)=>state.user)
  const {data:tweetList} = useSelector((state:any)=>state.tweet)
  return (
    <View style={{ flex: 1, backgroundColor: "white", width: "100%" }}>
      <FlatList
        data={tweetList}
        ListHeaderComponent={() => (
          <SearchUpload navigation={navigation} user={user} />
        )}
        renderItem={({ item }) => (
          <LayoutTweet
            navigation={navigation}
            tweetId={item._id}
            fullName={item.fullName}
            userName={item.userName}
            timeAgo={item.dateTweet}
            content={item.content}
            imageUrl={item.image}
            likes={item.likes}
            comments={item.comments}
            selected={true}
          />
        )}
      />
    </View>
  );
}

export default Feed;
