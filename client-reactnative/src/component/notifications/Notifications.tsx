import { ScrollView, FlatList, Text, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ListNotifications } from "./ListNotification";
import { notificationsAction } from "../../redux/actions/notificationsAction";
import { customFetch } from "../../utilities/customFetch";
import { userSearchActions } from "../../redux/actions/userSearchActions";
export const Notifications = ({navigation}:{navigation:any}) => {
  const { data: notifications } = useSelector(
    (state: any) => state.notifications
  );
  const dispatch = useDispatch()
  console.log("object ", notifications.notifications);
  const handleUpdateNotifications = async(_id:string)=>{
    dispatch(notificationsAction.updateNotification.pending())
    const response = await customFetch({ method: 'PATCH' }, `/notification/${_id}`);
    if(response?.data){
      console.log("id ",_id)
      dispatch(notificationsAction.updateNotification.fulfill(response.data.notifications))
    }else dispatch(notificationsAction.updateNotification.errors(response?.error))
  }
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
  const imageAvatarAuthor = useSelector((state: any) => state.imageAuthor);
  return (
    <ScrollView style={{ marginLeft: 10, marginRight: 10, backgroundColor: "white", height:'100%' }}>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 15,
          color: "#3B82F6",
        }}
      >
        Notifications
      </Text>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <Pressable style={{backgroundColor:item.isRead ? 'white' :'#33CCFF'}} onPress={()=>{handleUpdateNotifications(item._id), item.type === 'follow' ? handleUser(item.fromUserName) : navigation.navigate('tweetDetail',{tweetId:item.tweetId})}}>
            <ListNotifications
              userName={item.fromUserName}
              message={item.message}
              imageUrl={
                Array.isArray(imageAvatarAuthor?.data)
                  ? imageAvatarAuthor.data.find(
                      (user: any) => user.userName === item.fromUserName
                    )?.imageAvatar
                  : null
              }
            />
          </Pressable>
        )}
      />
    </ScrollView>
  );
};
