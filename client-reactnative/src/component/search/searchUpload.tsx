import React from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { style } from "./style";
import IUser from "../../interface/IUser";

interface SearchUploadProps {
  navigation: any;
  user: IUser;
}

const SearchUpload: React.FC<SearchUploadProps> = ({ navigation, user }) => {
  const navigateToProfile = () => {
    navigation.navigate("Profile");
  };
  
  const navigateToTweet = () => {
    navigation.navigate("Tweet", { user: user });
  };

  return (
    <View style={style.container}>
      <TouchableOpacity style={style.button20} onPress={navigateToProfile}>
        <Image style={style.imageAvatar} source={{ uri: user?.imageAvatar || '' }} />
      </TouchableOpacity>

      <View style={style.container}>
        <TouchableOpacity style={style.button} onPress={navigateToTweet}>
          <Text style={style.text}>Bạn đang nghĩ gì ?</Text>
        </TouchableOpacity>
      </View>
      <View style={style.container2}>
        <TouchableOpacity onPress={navigateToTweet}>
          <Feather name="image" size={40} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchUpload;
