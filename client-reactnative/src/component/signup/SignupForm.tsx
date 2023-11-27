import { Image, Pressable, ToastAndroid } from "react-native";
import { Text, View } from "react-native";
import { style } from "./style";
import { TextInput } from "react-native-paper";
import { useState } from "react";
import { customFetch } from "../../utilities/customFetch";
import {  MessageError } from "../messgae/Message";

export const SignupForm = ({navigation}:{navigation:any}) => {
  const [formData, setFormData] = useState({
    userName:"",
    fullName:"",
    password:"",
    email:""
  })
  const handleInputChange = (key: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };
    const handleSignup = async()=>{
      if(formData.email.trim()==="" || formData.fullName.trim()===""||formData.password.trim()==="" ||formData.userName.trim()==="") {
        console.log("không được để trống")
        return
      }

      const response = await customFetch({method:'POST', data:formData},`/register`)
      if(response?.data){
        navigation.navigate('login')
      }else {
        console.log("sai")
      }
    }
  return (
    <View style={style.container}>
      <View style={style.loginContainer}>
        <View style={{ alignSelf: "flex-start" }}>
          <Image
            style={style.logoLogin}
            source={require("../../../assets/twitter.png")}
          />
        </View>
        <View
          style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ textTransform: "uppercase" }}>signup</Text>
        </View>
        <View>
          <View style={style.conatinerInput}>
            <Text style={{ fontWeight: "700" }}>Username</Text>
            <TextInput
              style={style.textInput}
              underlineColor="transparent"
              theme={{ colors: { primary: "transparent" } }}
              onChangeText={(text)=>handleInputChange("userName",text)}
            />
          </View>
          <View style={style.conatinerInput}>
            <Text style={{ fontWeight: "700" }}>Fullname</Text>
            <TextInput
              style={style.textInput}
              underlineColor="transparent"
              theme={{ colors: { primary: "transparent" } }}
              onChangeText={(text)=>handleInputChange("fullName",text)}
            />
          </View>
          <View style={style.conatinerInput}>
            <Text style={{ fontWeight: "700" }}>Password</Text>
            <TextInput
              style={style.textInput}
              underlineColor="transparent"
              theme={{ colors: { primary: "transparent" } }}
              onChangeText={(text)=>handleInputChange("password",text)}
            />
          </View>
          <View style={style.conatinerInput}>
            <Text style={{ fontWeight: "700" }}>Email</Text>
            <TextInput
              style={style.textInput}
              underlineColor="transparent"
              theme={{ colors: { primary: "transparent" } }}
              onChangeText={(text)=>handleInputChange("email",text)}
            />
          </View>
        </View>
        <View>
          <View style={style.conatinerInput}>
            <Pressable style={style.buttonLogin} onPress={handleSignup}>
              <Text style={style.text}>signup</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};
