import { View, Text, Image } from "react-native";
interface INotifications {
  userName: string;
  imageUrl: string;
  message: string;
}
export const ListNotifications: React.FC<INotifications> = ({
  userName,
  imageUrl,
  message,
}) => {
  return (
    <View>
      <View style={{ flex: 1, justifyContent: "space-between", marginTop: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            style={{ height: 60, width: 60, borderRadius: 50 }}
            source={{ uri: imageUrl }}
          />
          <View style={{ flexDirection: "column", paddingLeft: 10 }}>
            <Text>{`${userName} ${message}`}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
