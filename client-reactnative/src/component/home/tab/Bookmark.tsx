import * as React from "react";
import {  FlatList } from "react-native";
import { Text, View } from "react-native";
import {  useSelector } from "react-redux";
import { LayoutTweet } from "../../tweet/LayoutTweet";

function Bookmark({ navigation }: { navigation: any }) {
  const {data:bookmarks} = useSelector((state:any)=>state.bookmarks)
 
  return (
    <View style={{ flex: 1, backgroundColor:'white' }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 15,
            color: "#3B82F6",
          }}
        >
          BOOKMARKS
        </Text>
      </View>

      <FlatList
        data={bookmarks}
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
          selected={false}
        />
        )}
      />
    </View>
  );
}

export default Bookmark;
