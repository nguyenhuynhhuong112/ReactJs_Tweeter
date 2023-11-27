import {
  Image,
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";
import { style } from "./style";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { tweetAction } from "../../redux/actions/tweetAction";
import { customFetch } from "../../utilities/customFetch";
import { LayoutTweet } from "../tweet/LayoutTweet";
import * as React from "react";
import { userActions } from "../../redux/actions/userAction";
import { io } from "socket.io-client";
export const ProfileUser = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const users = useSelector((state: any) => state.users);
  const author = useSelector((state: any) => state.user);
  const user = users.data[0];
  const socket = io("http://localhost:8080", {
    autoConnect: false,
  });
  console.log("userName ", user);
  const { userName } = route.params;
  console.log("object userName",userName)
  const fullNameUser = user?.fullName || "full name";
  const date = user?.dateJoined || "date joined";
  const followings = user?.following ? user.following.length : 0;
  const followers = user?.followers ? user.followers.length : 0;
  const coverimage = user?.imageCover || "";
  const avatarimage = user?.imageAvatar || "";
  const nameMe = user?.userName || "user name";
  const name = author.data && author.data.userName;
  const userFollowing = author.data ? author.data?.following : [];
  const dispatch = useDispatch();
  useEffect(() => {
    const loadTweetUser = async () => {
      if (name === undefined) return;
      dispatch(tweetAction.getTweet.pending());
      const response = await customFetch({}, `/profile/tweet/${userName}`);
      if (response?.data) {
        dispatch(tweetAction.getTweet.fulfill(response.data));
        console.log("dataa twweet ", response?.data);
      } else dispatch(tweetAction.getTweet.errors(response?.error));
    };

    loadTweetUser();
    navigation.setOptions({
      title: userName,
    });
  }, [userName]);

  const { data: tweetList } = useSelector((state: any) => state.tweet);
  const isUserFollowing = (userName: string) => {
    const followingArray = Array.isArray(userFollowing) ? userFollowing : [];
    return followingArray.some(
      (followingUser: any) =>
        followingUser && followingUser.userName === userName
    );
  };
  const handleFollowing = async (userName: string) => {
    dispatch(userActions.updateUserProfile.pending());
    const response = await customFetch(
      {
        method: "PATCH",
        data: { userName: userName },
      },
      "/profile/following"
    );
    if (response?.data) {
      console.log("payload ", response?.data);
      dispatch(userActions.updateUserProfile.fulfill(response?.data));
      const room = userName;
      if (socket && socket.connected) {
        console.log("emit follow ", name);
        socket.emit("follow", { userName, room, name });
      } else {
        console.log("Socket is not connected. Connecting...");
        socket.connect();
        socket.once("connect", () => {
          console.log("Socket connected. Emitting follow event.");
          console.log("emit follow ", name);
          socket.emit("follow", { userName, room, name });
        });
      }
    } else dispatch(userActions.updateUserProfile.errors(response?.error));
  };
  return (
    <ScrollView>
      <View style={{ backgroundColor: "white" }}>
        <View style={style.container}>
          <View style={style.container1}>
            <Pressable onPress={() => {}}>
              <Image
                style={style.imageCover}
                source={{
                  uri: coverimage,
                }}
                resizeMode="contain"
              />
            </Pressable>
            <View style={style.container2}>
              <Pressable onPress={() => {}}>
                <Image
                  style={{ width: 90, height: 90, borderRadius: 50 }}
                  source={{
                    uri: avatarimage,
                  }}
                  resizeMode="contain"
                />
              </Pressable>
              <View style={style.container3}>
                <Text>{`${fullNameUser}`}</Text>
                <Text>{`${date}`}</Text>
                <View style={style.container4}>
                  <Text
                    style={style.textFollowing}
                  >{`${followings} following`}</Text>
                  <Text>{`${followers} followers`}</Text>
                </View>
              </View>
              <View style={style.container5}>
                {userName === author.data && author.data.userName ? (
                  navigation.navigate('profile')
                ) : (
                  <Pressable
                    style={style.button}
                    onPress={() => handleFollowing(userName)}
                  >
                    <Text style={style.textButton}>{`${
                      isUserFollowing(nameMe) ? "Following" : "Follow"
                    }`}</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </View>
        <View>
          <FlatList
            data={tweetList}
            renderItem={({ item }) => (
              <LayoutTweet
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
      </View>
    </ScrollView>
  );
};
