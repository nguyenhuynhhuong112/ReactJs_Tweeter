import React, { useState } from "react";
import { View, Image, Text, Pressable } from "react-native";
import DropdownComponent from "../../utilities/dropdown";
import { TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { tweetAction } from "../../redux/actions/tweetAction";
import { customFetch } from "../../utilities/customFetch";
import AntDesign from "react-native-vector-icons/AntDesign";
interface IComment {
  imageUrl: string;
  userName: string;
  content: string;
  tweetId: string;
  commentId: string;
}
export const ListComment: React.FC<IComment> = ({
  imageUrl,
  userName,
  content,
  tweetId,
  commentId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState("");
  const user = useSelector((state: any) => state.user)
  const name =
  user.data?.userName === undefined ? "user name" : user.data?.userName;
  const dispatch = useDispatch();
  const handleSave = async () =>{
    dispatch(tweetAction.updateTweet.pending())
    const response = await customFetch({method:'PATCH', data:{content:newContent}},`/tweet/comments/${tweetId}/${commentId}`)
    if(response?.data){
      dispatch(tweetAction.updateTweet.fulfill(response.data))
    }else dispatch(tweetAction.updateTweet.errors(response?.error))
    setIsEditing(false)

  }
  const handleDelete = async () => {
    console.log("comment twetId ", tweetId);
    dispatch(tweetAction.updateTweet.pending());
    const response = await customFetch(
      { method: "DELETE" },
      `/tweet/comments/${tweetId}/${commentId}`
    );
    if (response?.data) {
      dispatch(tweetAction.updateTweet.fulfill(response.data));
    } else dispatch(tweetAction.updateTweet.errors(response?.error));
  };
  return (
    <View>
      <View style={{ flex: 1, justifyContent: "space-between", marginTop: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            style={{ height: 40, width: 40, borderRadius: 50 }}
            source={{ uri: imageUrl }}
          />
          <View
            style={{ flexDirection: "column", paddingLeft: 10, width: 180 }}
          >
            <Text style={{ fontWeight: "600" }}>{`${userName}`}</Text>
            {isEditing ? (
              <TextInput
                underlineColor="transparent"
                theme={{ colors: { primary: "transparent" } }}
                style={{
                  backgroundColor: "white",
                  height: 20,
                  paddingLeft: 0,
                  paddingRight: 0,
                }}
                defaultValue={content}
                onChangeText={(text) => setNewContent(text)}
              />
            ) : (
              <Text>{`${content}`}</Text>
            )}
          </View>
          {isEditing ? (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Pressable
                onPress={() => {
                  setIsEditing(false);
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
                onPress={handleSave}
              >
                <Text style={{ color: "white", textTransform: "uppercase" }}>
                  Save
                </Text>
              </Pressable>
            </View>
          ) : name === userName ? (
            <DropdownComponent
            onDelete={handleDelete}
            onEdit={() => setIsEditing(true)}
          />
          ): null}
        </View>
      </View>
    </View>
  );
};
