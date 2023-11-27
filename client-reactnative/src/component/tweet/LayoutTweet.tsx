import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  FlatList,
} from "react-native";
import IData from "../../interface/IData";
import { TextInput } from "react-native-paper";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { style } from "./style";
import { useDispatch, useSelector } from "react-redux";
import { tweetAction } from "../../redux/actions/tweetAction";
import { customFetch } from "../../utilities/customFetch";
import { bookmarkAction } from "../../redux/actions/bookmarkAction";
import { io } from "socket.io-client";
import Feather from "react-native-vector-icons/Feather";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { ListComment } from "../list/ListComment";
import DropdownComponent from "../../utilities/dropdown";
interface IComment {
  userName: string;
  content: string;
  createAt: Date;
  _id: string;
}
interface LayoutTweetProps {
  navigation?: any;
  tweetId: string;
  fullName: string;
  userName: string;
  timeAgo: string;
  content: string;
  imageUrl: string;
  likes: string[];
  selected: boolean;
  comments: IComment[];
}

export const LayoutTweet: React.FC<LayoutTweetProps> = ({
  navigation,
  tweetId,
  fullName,
  userName,
  timeAgo,
  content,
  imageUrl,
  likes,
  comments,
  selected,
}) => {
  const navigateToProfile = () => {
    navigation.navigate("profile");
  };
  const dispatch = useDispatch();
  const [contentComment, setContentComment] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { data: tweetList } = useSelector((state: any) => state.tweet);
  const imageAuthor = useSelector((state: any) => state.imageAuthor);
  const user = useSelector((state: any) => state.user);
  const room = userName;
  const name =
    user.data?.userName === undefined ? "user name" : user.data?.userName;
  const avatarimage =
    user.data && user.data?.imageAvatar ? user.data.imageAvatar : "";
  const socket = io("http://localhost:8080", {
    autoConnect: false,
  });
  const handleLike = async () => {
    dispatch(tweetAction.updateTweet.pending());
    const response = await customFetch(
      { method: "PATCH" },
      `/tweet/like/${tweetId}`
    );
    const data = response?.data;
    if (data) {
      let flag = true;
      dispatch(tweetAction.updateTweet.fulfill(data));
      if (userName === name) {
        return;
      } else if (
        tweetList
          .find((element: any) => element._id === tweetId)
          ?.likes?.some((element: any) => element.userName === name)
      ) {
        flag = false;
        if (socket && socket.connected) {
          socket.emit("like", { room, userName, name, tweetId, data, flag });
        } else {
          socket.connect();
          socket.once("connect", () => {
            socket.emit("like", { room, userName, name, tweetId, data, flag });
          });
        }
      }
      if (socket && socket.connected) {
        socket.emit("like", { room, userName, name, tweetId, data, flag });
      } else {
        socket.connect();
        socket.once("connect", () => {
          socket.emit("like", { room, userName, name, tweetId, data, flag });
        });
      }
    } else dispatch(tweetAction.updateTweet.errors(response?.error));
  };
  const { data: tweet } = useSelector((state: any) => state.tweet);
  const findTweet =
    tweet && tweet.find((element: IData) => element._id === tweetId);
  const countLike = findTweet && findTweet.likes ? findTweet.likes.length : 0;
  const countComment =
    findTweet && findTweet.comments ? findTweet.comments.length : 0;
  const countBookmarks =
    findTweet && findTweet.bookmarks ? findTweet.bookmarks.length : 0;
  const listLike = findTweet?.likes?.map((element) => element.userName) || [];
  const isLike = listLike.includes(name);
  const handleBookmark = async () => {
    dispatch(tweetAction.updateTweet.pending());
    const response = await customFetch(
      { method: "PATCH" },
      `/tweet/bookmark/${tweetId}`
    );
    if (response?.data) {
      console.log("count bookmark ", response.data);
      dispatch(bookmarkAction.updateCountBookmark.fulfill(response.data));
      dispatch(tweetAction.updateTweet.fulfill(response.data));
    } else dispatch(tweetAction.updateTweet.errors(response?.error));
  };
  const isBookmarked =
    findTweet && findTweet.bookmarks
      ? findTweet.bookmarks.includes(name)
      : false;
  const handleComment = async () => {
    dispatch(tweetAction.updateTweet.pending());
    const response = await customFetch(
      { method: "PATCH", data: { content: contentComment } },
      `/tweet/comments/${tweetId}`
    );
    const data = response?.data;
    if (data) {
      dispatch(tweetAction.updateTweet.fulfill(data));
      setContentComment("");
      if(name === userName) return
      if (socket && socket.connected) {
        socket.emit("comment", { room, userName, name, tweetId, data });
      } else {
        socket.connect();
        socket.once("connect", () => {
          socket.emit("comment", { room, userName, name, tweetId, data });
        });
      }
    } else {
      dispatch(tweetAction.updateTweet.errors(response?.error));
    }
  };
  const handleLoadTweet = (tweetId: string) => {
    navigation.navigate("tweetDetail", { tweetId });
  };
  const handleDeleteTweet = async () => {
    console.log("delete ", tweetId);
    dispatch(tweetAction.deleteTweet.pending());
    const response = await customFetch(
      { method: "DELETE", data: { _id: tweetId } },
      "/tweet"
    );
    if (response?.data) {
      dispatch(tweetAction.deleteTweet.fulfill(tweetId));
    } else {
      dispatch(tweetAction.deleteTweet.errors(response?.error));
    }
  };
  const [imageTweet, setImageTweet] = useState<string | null>(null);
  const uploadImageTweet = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Quyền truy cập ảnh từ thiết bị bị từ chối!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImageTweet(result.uri);
    }
  };
  const handleEdit = async () => {
    console.log("edit ", tweetId);
    if (newContent.trim() === "" && !imageTweet) {
      console.log("edit không được không có ảnh hoặc content");
      return;
    }
    const formData = new FormData();
    formData.append("_id", tweetId);
    if (imageTweet) {
      const localUri = imageTweet;
        const filename = localUri.split("/").pop() || "image.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image";
        const blob = await fetch(localUri).then((response) => response.blob());
        formData.append("image", blob, filename);
    }
    if (newContent) {
      formData.append("content", newContent);
    }
    const response = await customFetch(
      {
        method: "PATCH",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
      "/tweet"
    );
    if (response?.data) {
      console.log("response data ", response.data)
      dispatch(tweetAction.updateTweet.fulfill(response.data));
    } else dispatch(tweetAction.updateTweet.errors(response?.data));
    setIsEditing(false);
  };
  return (
    <View style={style.container}>
      <View>
        <TouchableOpacity style={style.button1}>
          <Image
            style={style.imageAvatar}
            source={{
              uri: Array.isArray(imageAuthor?.data)
                ? imageAuthor.data.find(
                    (user: any) => user.userName === userName
                  )?.imageAvatar
                : null,
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={style.container2}>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            height: "auto",
          }}
        >
          <View style={style.container3}>
            <TouchableOpacity>
              <Text style={style.textName}>{`${fullName}`}</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={style.textUsername}>{`@${userName}`}</Text>
            </TouchableOpacity>
          </View>
          {name === userName && (
            <DropdownComponent
              onDelete={handleDeleteTweet}
              onEdit={() => {
                setIsEditing(true);
              }}
            />
          )}
        </View>
        <Text style={{ color: "#D9D9D9" }}>{`${timeAgo}`}</Text>
        {isEditing && (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Pressable
              onPress={() => {
                setIsEditing(false), setImageTweet("");
              }}
            >
              <AntDesign
                name="close"
                size={20}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </Pressable>
            <Pressable
              style={{
                width: 50,
                height: 27,
                backgroundColor: "#3B82F6",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
              }}
              onPress={handleEdit}
            >
              <Text style={{ color: "white", textTransform: "uppercase" }}>
                Save
              </Text>
            </Pressable>
          </View>
        )}
        <View>
          {isEditing ? (
            <View>
              <TextInput
                underlineColor="transparent"
                theme={{ colors: { primary: "transparent" } }}
                style={
                  imageUrl
                    ? style.contentWithoutImage
                    : style.contentWithoutImage
                }
                defaultValue={content}
                onChangeText={(text) => setNewContent(text)}
              />
              {!imageUrl && (
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity onPress={() => uploadImageTweet()}>
                    <Feather name="upload" size={20} color="black" />
                  </TouchableOpacity>
                  <Pressable
                    onPress={() => {
                      setImageTweet("");
                    }}
                  >
                    <AntDesign
                      name="close"
                      size={20}
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                  </Pressable>
                </View>
              )}
            </View>
          ) : (
            <Text
              style={
                imageUrl ? style.contentWithoutImage : style.contentWithoutImage
              }
            >
              {content}
            </Text>
          )}
          {imageUrl || imageTweet ? (
            <TouchableOpacity style={style.button2}>
              <Image
                style={style.imageTweet}
                source={{ uri: imageUrl ?? imageTweet ?? "" }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={style.container4}>
          <TouchableOpacity style={style.button3} onPress={handleLike}>
            {isLike ? (
              <AntDesign name="hearto" size={24} color="red" />
            ) : (
              <AntDesign name="hearto" size={24} />
            )}
            <Text>{`${countLike}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.button4}
            onPress={() => handleLoadTweet(tweetId)}
          >
            <EvilIcons name="comment" size={30} color="black" />
            <Text>{`${countComment}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.button5}>
            {isBookmarked ? (
              <Pressable onPress={handleBookmark}>
                <AntDesign name="staro" size={24} color="red" />
              </Pressable>
            ) : (
              <Pressable onPress={handleBookmark}>
                <AntDesign name="staro" size={24} color="black" />
              </Pressable>
            )}
            <Text>{`${countBookmarks}`}</Text>
          </TouchableOpacity>
        </View>
        <View style={style.container5}>
          <TouchableOpacity onPress={navigateToProfile}>
            <Image
              style={style.imageAvatarComment}
              source={{ uri: avatarimage }}
            />
          </TouchableOpacity>

          <View>
            <TextInput
              style={style.textInputComment}
              underlineColor="transparent"
              theme={{ colors: { primary: "transparent" } }}
              placeholder="Thêm bình luận"
              placeholderTextColor="grey"
              multiline={true}
              value={contentComment}
              onChangeText={(text) => setContentComment(text)}
            />
          </View>
          <Pressable
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#3B82F6",
              borderRadius: 8,
              width: 35,
              height: 35,
            }}
            onPress={() => {
              handleComment(), navigation.navigate("comment");
            }}
          >
            <Feather name="send" size={20} color="white" />
          </Pressable>
        </View>
        <FlatList
          data={selected ? comments?.slice(0, 3) : comments}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ListComment
            tweetId={tweetId}
              content={item.content}
              imageUrl={
                Array.isArray(imageAuthor?.data)
                  ? imageAuthor.data.find(
                      (user: any) => user.userName === item.userName
                    )?.imageAvatar
                  : null
              }
              userName={item.userName}
              commentId={item._id}
            />
          )}
        />
      </View>
    </View>
  );
};
