import * as React from "react";
import { View, FlatList, Pressable } from "react-native";
import { TextInput } from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import { userSearchActions } from "../../../redux/actions/userSearchActions";
import { customFetch } from "../../../utilities/customFetch";
import { ListUser } from "../../list/ListUser";

function Search({ navigation }: { navigation: any }) {
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.users);
  const handleInputChange = async (text: string) => {
    if (text) {
      handleSearch({ query: text });
    } else {
      dispatch(userSearchActions.userSearch.fulfill([]));
    }
  };
  const handleSearch = async (query: { query: string }) => {
    dispatch(userSearchActions.userSearch.pending());
    const response = await customFetch(
      { method: "POST", data: query },
      "/search"
    );
    if (response?.data)
      dispatch(userSearchActions.userSearch.fulfill(response.data));
    else dispatch(userSearchActions.userSearch.errors(response?.error));
  };
  const imageAvatarAuthor = useSelector((state: any) => state.imageAuthor);
  console.log("dataa usser search ", users.data);
  const handleUser = async (userName: string) => {
    dispatch(userSearchActions.userSearch.pending());
    const response = await customFetch({}, `/profile/user/${userName}`);
    if (response?.data) {
      dispatch(userSearchActions.userSearch.fulfill(response.data));
      navigation.navigate('user', { userName: userName }); 
    } else {
      dispatch(userSearchActions.userSearch.errors(response?.error));
    }
  };
  return (
    <View style={{ flex: 1, alignItems: "center", marginTop: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 2,
          borderColor: "#D9D9D9",
          borderRadius: 25,
          backgroundColor: "white",
          width: 345,
        }}
      >
        <AntDesign name="search1" size={20} style={{ marginLeft: 10 }} />
        <TextInput
          style={{
            backgroundColor: "white",
            flex: 1,
            height: 43,
            borderRadius: 25,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 25,
          }}
          underlineColor="transparent"
          placeholder="Search on Twitter"
          theme={{ colors: { primary: "transparent" } }}
          onChangeText={handleInputChange}
        />
      </View>
      <FlatList
        data={users.data}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleUser(item.userName)}>
            <ListUser
              fullName={item.fullName}
              userName={item.userName}
              key={item.userName}
              imageUrl={
                Array.isArray(imageAvatarAuthor?.data)
                  ? imageAvatarAuthor.data.find(
                      (user: any) => user.userName === item.userName
                    )?.imageAvatar
                  : null
              }
            />
          </Pressable>
        )}
      />
    </View>
  );
}

export default Search;
