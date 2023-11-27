import { View, Image, Text, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../redux/actions/userAction";
import { customFetch } from "../../utilities/customFetch";
import { io } from "socket.io-client";
interface ListUserProps {
  userName: string;
  fullName: string;
  imageUrl: string;
}
export const ListUser: React.FC<ListUserProps> = ({
  userName,
  fullName,
  imageUrl,
}) => {
  const socket = io("http://localhost:8080", {
    autoConnect: false,
  });
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.data);
  const name = user && user.userName;
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
      if (isUserFollowing(userName)) {
        return;
      }
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
  const author = useSelector((state: any) => state.user);
  const userFollowing = author.data ? author.data?.following : [];
  const isUserFollowing = (userName: string) => {
    const followingArray = Array.isArray(userFollowing) ? userFollowing : [];
    return followingArray.some(
      (followingUser: any) =>
        followingUser && followingUser.userName === userName
    );
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        marginTop: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          style={{ height: 60, width: 60, borderRadius: 50 }}
          source={{ uri: imageUrl }}
        />
        <View
          style={{
            flexDirection: "column",
            paddingLeft: 10,
            paddingRight: 10,
            width: 170,
          }}
        >
          <Text>{`${fullName}`}</Text>
          <Text>{`@${userName}`}</Text>
        </View>
        {userName === name ? (
          <View></View>
        ) : (
          <Pressable
            style={{
              backgroundColor: "#3B82F6",
              width: 100,
              height: 30,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 12,
            }}
            onPress={() => handleFollowing(userName)}
          >
            <Text style={{ color: "white" }}>
              {isUserFollowing(userName) ? "Following" : "Follow"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
