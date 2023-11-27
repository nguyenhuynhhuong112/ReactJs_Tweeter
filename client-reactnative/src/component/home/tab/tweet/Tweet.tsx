import * as React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { customFetch } from "../../../../utilities/customFetch";
import { tweetAction } from "../../../../redux/actions/tweetAction";
function Tweet({ navigation }: { navigation: any }) {
  const user = useSelector((state: any) => state.user);
  const [content, setContent] = React.useState<string>("");
  const [image, setImage] = React.useState<string | null>(null);

  const avatarimage =
    user.data && user.data?.imageAvatar ? user.data.imageAvatar : "";

  const pickImage = async () => {
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
      setImage(result.uri);
    }
  };
  const dispatch = useDispatch();
  const test = async () => {
    if (content.trim() === "" && !image) return;
    dispatch(tweetAction.createTweet.pending())
    const formData = new FormData();
    formData.append("fullName", user.data.fullName);
    formData.append("userName", user.data.userName);
    formData.append("content", content);
    if (image) {
      const localUri = image;
      const filename = localUri.split("/").pop() || "image.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image";
      const blob = await fetch(localUri).then((response) => response.blob());
      formData.append("image", blob, filename);
    }
    const response = await customFetch(
      {
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
      "/tweet"
    );
    if (response?.data) {
        dispatch(tweetAction.createTweet.fulfill(response.data))
        navigation.navigate('Feed')
    }
    else dispatch(tweetAction.createTweet.errors(response?.error))
  };

  return (
    <View style={{ flex: 1, padding: 5, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={avatarimage}
            style={{ width: 50, height: 50, borderRadius: 50 }}
          />
        </View>
        <View>
          <TextInput
            style={{
              width: 300,
              height: 70,
              backgroundColor: "white",
            }}
            value={content}
            onChangeText={(text) => setContent(text)}
            underlineColor="transparent"
            theme={{ colors: { primary: "transparent" } }}
            placeholder="Bạn đang nghĩ gì ?"
            placeholderTextColor="grey"
            multiline={true}
          />
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          )}
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity  onPress={pickImage}>
              <Feather name="image" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity style={{}} onPress={() => {}}>
              <MaterialCommunityIcons
                name="sticker-emoji"
                size={20}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={test}
          >
            <Text
              style={{ color: "#3B82F6", fontSize: 18, fontWeight: "bold" }}
            >
              Tweet
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default Tweet;
