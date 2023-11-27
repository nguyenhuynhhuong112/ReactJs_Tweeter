import { Pressable, Text, View } from "react-native";
import { style } from "./style";
import { TextInput } from "react-native-paper";
import { useDispatch } from "react-redux";
import { userActions } from "../../redux/actions/userAction";
import { customFetch } from "../../utilities/customFetch";
import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const EditProfile = ({ navigation }: { navigation: any }) => {
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    password: "",
  });
  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };

  const dispatch = useDispatch();
  const handleSave = async () => {
    console.log("form data ", formData);
    dispatch(userActions.updateUserProfile.pending());
    const response = await customFetch(
      { method: "PATCH", data: formData },
      "/profile"
    );
    if (response?.data) {
      console.log("update user", response.data);
      dispatch(userActions.updateUserProfile.fulfill(response.data));
      navigation.navigate("profile");
    } else dispatch(userActions.updateUserProfile.errors(response?.data));
  };
  const handleLogout = async()=>{
    try {
      await AsyncStorage.removeItem('token')
      navigation.navigate('login')
    } catch (error) {
      
    }
  }
  return (
    <View style={style.container}>
      <View style={style.loginContainer}>
        <View>
         <View style={{alignItems:'center', paddingTop:10}}>
         <Text style={{fontWeight:'700', fontSize:20, textTransform:'uppercase'}}>Edit profile</Text>
         </View>
          <View style={style.conatinerInput}>
            <Text style={{ fontWeight: "700" }}>Fullname</Text>
            <TextInput
              style={style.textInput}
              underlineColor="transparent"
              theme={{ colors: { primary: "transparent" } }}
              onChangeText={(text) => handleInputChange("fullName", text)}
            />
          </View>
          <View style={style.conatinerInput}>
            <Text style={{ fontWeight: "700" }}>Password</Text>
            <TextInput
              style={style.textInput}
              underlineColor="transparent"
              theme={{ colors: { primary: "transparent" } }}
              onChangeText={(text) => handleInputChange("password", text)}
            />
          </View>
          <View style={style.conatinerInput}>
            <Text style={{ fontWeight: "700" }}>Email</Text>
            <TextInput
              style={style.textInput}
              underlineColor="transparent"
              theme={{ colors: { primary: "transparent" } }}
              onChangeText={(text) => handleInputChange("email", text)}
            />
          </View>
        </View>
        <View>
          <View style={style.conatinerInput}>
            <Pressable style={style.buttonLogin} onPress={handleSave}>
              <Text style={style.text}>save</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View style={style.containerLogout}>
        <Pressable style={style.buttonLogout} onPress={handleLogout}>
          <Text style={style.text}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
};
