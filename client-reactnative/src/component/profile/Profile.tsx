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
import { tweetAction } from "../../redux/actions/tweetAction";
import { customFetch } from "../../utilities/customFetch";
import { useEffect } from "react";
import { LayoutTweet } from "../tweet/LayoutTweet";
import * as ImagePicker from "expo-image-picker";
import * as React from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import { userActions } from "../../redux/actions/userAction";
import { imageActions } from "../../redux/actions/imageAction";
import SearchUpload from "../search/searchUpload";
export const Profile = ({ navigation }: { navigation: any }) => {
  const user = useSelector((state: any) => state.user);
  const [imageCover, setImageCover] = React.useState<string | null>(null);
  const [imageAvatar, setImageAvatar] = React.useState<string | null>(null);
  const [isEdit, setIsEdit] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const fullNameUser =
    user.data?.fullName === undefined ? "full name" : user.data?.fullName;
  const date =
    user.data?.dateJoined === undefined ? "date joined" : user.data.dateJoined;
  const followings =
    user.data && user.data.following ? user.data.following.length : 0;
  const followers =
    user.data && user.data.followers ? user.data.followers.length : 0;
  const coverimage =
    user.data && user.data?.imageCover ? user.data.imageCover : "";
  const avatarimage =
    user.data && user.data?.imageAvatar ? user.data.imageAvatar : "";
  const name =
    user.data?.userName === undefined ? "user name" : user.data?.userName;
  const dispatch = useDispatch();
  const loadTweetUser = async () => {
    if (name === undefined) return;
    dispatch(tweetAction.getTweet.pending());
    const response = await customFetch({}, `/profile/tweet/${name}`);
    if (response?.data) {
      dispatch(tweetAction.getTweet.fulfill(response.data));
      console.log("dataa twweet ", response?.data);
    } else dispatch(tweetAction.getTweet.errors(response?.error));
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadTweetUser();
    });

    return unsubscribe;
  }, [navigation]);
  const { data: tweetList } = useSelector((state: any) => state.tweet);
  const uploadAvatarImage = async () => {
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
      setImageAvatar(result.uri);
    }
  };
  const uploadCoverImage = async () => {
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
      setImageCover(result.uri);
    }
  };
  const handleSave = async () => {
    dispatch(userActions.updateUserProfile.pending());
    const formData = new FormData();
    if (status === "cover") {
      if (imageCover) {
        const localUri = imageCover;
        const filename = localUri.split("/").pop() || "image.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image";
        const blob = await fetch(localUri).then((response) => response.blob());
        formData.append("image", blob, filename);
      }
      const response = await customFetch(
        {
          method: "PATCH",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        `/profile/coverimage`
      );
      if (response?.data) {
        dispatch(userActions.updateUserProfile.fulfill(response.data.users));
        setIsEdit(false);
        setImageCover(null);
      } else dispatch(userActions.updateUserProfile.errors(response?.error));
    } else if(status === 'avatar'){
      if(imageAvatar){
        const localUri = imageAvatar;
        const filename = localUri.split("/").pop() || "image.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image";
        const blob = await fetch(localUri).then((response) => response.blob());
        formData.append("image", blob, filename);
      }
      const response = await customFetch(
        {
          method: "PATCH",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        `/profile/avatar`
      );
      if (response?.data) {
        dispatch(userActions.updateUserProfile.fulfill(response.data.users));
        dispatch(imageActions.updateAuthor.fulfill(response.data.users))
        setIsEdit(false);
        setImageAvatar(null);
      } else dispatch(userActions.updateUserProfile.errors(response?.error));
    }
  };
  const handleEdit = ()=>{
    navigation.navigate('settings')
  }
  return (
    <ScrollView>
      <View style={{ backgroundColor: "white" }}>
        <View style={style.container}>
          <View style={style.container1}>
            <Pressable
              onPress={() => {
                uploadCoverImage(), setIsEdit(true), setStatus("cover");
              }}
            >
              <Image
                style={style.imageCover}
                source={{
                  uri: isEdit && imageCover !== null ? imageCover : coverimage,
                }}
                resizeMode="contain"
              />
            </Pressable>
            <View style={style.container2}>
              <Pressable
                onPress={() => {
                  uploadAvatarImage(), setIsEdit(true), setStatus('avatar');
                }}
              >
                <Image
                  style={{ width: 90, height: 90, borderRadius: 50 }}
                  source={{
                    uri:
                      isEdit && imageAvatar !== null
                        ? imageAvatar
                        : avatarimage,
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
                {isEdit ? (
                  <View style={{ flexDirection: "row" }}>
                    <Pressable
                      onPress={() => {
                        setIsEdit(false), setImageCover("");
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
                    <Pressable style={style.buttonSave} onPress={handleSave}>
                      <Text style={style.textButton}>Save</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable style={style.button} onPress={handleEdit}>
                    <Text style={style.textButton}>Settings</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </View>
        <View>
          <FlatList
            data={tweetList}
            ListHeaderComponent={() => (
              <SearchUpload navigation={navigation} user={user.data} />
            )}
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
