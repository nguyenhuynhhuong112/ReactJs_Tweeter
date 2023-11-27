import { Image, Text } from "react-native";
import { View } from "react-native";
import { style } from "./style";
import { TextInput } from "react-native-paper";
import { Pressable } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { customFetch } from "../../utilities/customFetch";
import { imageActions } from "../../redux/actions/imageAction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isTokenExpired } from "../../utilities/checkToken";
export const LoginForm = ({ navigation }: { navigation: any }) => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [error,setError] = useState("")
  const handleSignupForm = () => {
    navigation.navigate("signup");
  };
  const dispatch = useDispatch();
 
  const handleLogin = async () => {
    const response = await customFetch(
      { method: "POST", data: formData },
      "/login"
    );
    if (response?.data) {
    console.log("đã login")
      const token = response.data.token;
      await AsyncStorage.setItem("token", token);
      if (token) {
        navigation.navigate("Tabs");
      }
    } else{
      setError("Sai username hoặc password vui lòng thử lại")
    }
  };

  const loadDataImage = async () => {
    dispatch(imageActions.getImage.pending());
    const response = await customFetch({}, "/profile/imageAvatar");
    if (response?.data) dispatch(imageActions.getImage.fulfill(response.data));
    else dispatch(imageActions.getImage.errors(response?.error));
  };
  useEffect(() => {
    loadDataImage();
    const checkToken = async () =>{
      const token = await AsyncStorage.getItem('token')
      if(isTokenExpired(token)){
        navigation.navigate('login')
        AsyncStorage.removeItem('token')
      }else if(!isTokenExpired(token)){
        navigation.navigate('Tabs')
      }
    }
    checkToken()
  }, []);
  return (
    <View style={style.container}>
      <View style={style.loginContainer}>
        <View style={{ alignSelf: "flex-start" }}>
          <Image
            source={require("../../../assets/twitter.png")}
            style={style.logoLogin}
          />
        </View>
        <View
          style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ textTransform: "uppercase", fontWeight:'700' }}>login</Text>
        </View>
        <View>
          <View style={style.conatinerInput}>
            <Text style={{ fontWeight: "700" }}>Username</Text>
            <TextInput
              style={style.textInput}
              underlineColor="transparent"
              theme={{ colors: { primary: "transparent" } }}
              onChangeText={(text) =>
                setFormData({ ...formData, userName: text })
              }
            />
          </View>
          <View style={style.conatinerInput}>
            <Text style={{ fontWeight: "700" }}>Password</Text>
            <TextInput
              style={style.textInput}
              underlineColor="transparent"
              theme={{ colors: { primary: "transparent" } }}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
            />
          </View>
        </View>
        <View>
          {error && (<Text style={{color:'red', width:249}}>{`${error}`}</Text>)}
          <View style={style.conatinerInput}>
            <Pressable style={style.buttonLogin} onPress={handleLogin}>
              <Text style={style.text}>login</Text>
            </Pressable>
          </View>
          <View>
            <Pressable style={style.buttonSignup} onPress={handleSignupForm}>
              <Text style={style.text}>signup</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};
