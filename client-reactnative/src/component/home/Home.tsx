import * as React from "react";
import { Text, View } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import Feed from "./tab/Feed";
import Bookmark from "./tab/Bookmark";
import Search from "./tab/Search";
import { Profile } from "../profile/Profile";
import { Notifications } from "../notifications/Notifications";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { customFetch } from "../../utilities/customFetch";
import { notificationsAction } from "../../redux/actions/notificationsAction";
import { tweetAction } from "../../redux/actions/tweetAction";
import { userActions } from "../../redux/actions/userAction";
import { bookmarkAction } from "../../redux/actions/bookmarkAction";
const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  const dispatch = useDispatch();
  const { data: notifications } = useSelector((state: any) => state.notifications);
  const unreadNotifications = notifications && notifications.filter((notification: any) => !notification?.isRead);
  const unreadCount = unreadNotifications ? unreadNotifications.length : 0;
  const socket = io('http://localhost:8080', {
    autoConnect: false,
  });
  const {data:user} = useSelector((state:any)=>state.user)
  const name = user && user?.userName
  const loadNotifications = async () => {
    dispatch(notificationsAction.getNotification.pending());
    const response = await customFetch({}, "/notification");
    if (response?.data) {
      dispatch(
        notificationsAction.getNotification.fulfill(response.data.notifications)
      );
    } else
    dispatch(notificationsAction.getNotification.errors(response?.error));
  };
  const loadBookmark = async ()=>{
    dispatch(bookmarkAction.getBookmarkByUserName.pending())
    const response = await customFetch({},`/bookmark`)
    if(response?.data) {
      console.log("object bookmarks ", response.data)
      dispatch(bookmarkAction.getBookmarkByUserName.fulfill(response.data))
    }
    else dispatch(bookmarkAction.getBookmarkByUserName.errors(response?.error))
  }
  const loadDataUser = async ()=>{
    dispatch(userActions.getProfileUser.pending())
    const response = await customFetch({},'/profile')
    if(response?.data){
      dispatch(userActions.getProfileUser.fulfill(response.data))
    }else{
      dispatch(userActions.getProfileUser.error(response?.error))
    }
  }
  React.useEffect(()=>{
    loadDataUser()
    loadNotifications()
    loadBookmark()
  },[])
  React.useEffect(() => {
    socket.connect();
    socket.emit('joinRoom', { room: name });
    socket.on('follow', (data) => {
      dispatch(notificationsAction.createNotification.fulfill(data.notification.notifications));
    });
    socket.on('like', (data) => {
      if(data.flag){
        console.log("falg ", data.flag)
        console.log("noti ", data.notification)
        dispatch(notificationsAction.getNotification.fulfill(data.notification.notifications));
        dispatch(tweetAction.updateTweet.fulfill(data.data))
        console.log("data data ",data.data)
      }else {
        console.log("falg ", data.flag)
        dispatch(tweetAction.updateTweet.fulfill(data.data))
      }
    });
    socket.on('comment', (data) => {
      dispatch(notificationsAction.getNotification.fulfill(data.notification.notifications));
      dispatch(tweetAction.updateTweet.fulfill(data.data))
      console.log("data ",data.data)
    });
    return () => {
      socket.disconnect();
    };
  }, [socket, name]);
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      activeColor="#3B82F6"
      //    labelStyle={{ fontSize: 12 }}
      style={{ backgroundColor: "tomato" }}
    >
     <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: "Updates",
          tabBarIcon: ({ color }) => (
            <View>
              <MaterialCommunityIcons name="bell" color={color} size={26} />
              {unreadCount > 0 && <Text style={{ color: "white", backgroundColor: "red", borderRadius: 10, paddingHorizontal: 6, position: "absolute", top: 0, right: 0 }}>{unreadCount}</Text>}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="search"
        component={Search}
        options={{
          tabBarLabel: "search",
          tabBarIcon: ({ color }) => (
            <Feather name="search" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookmark"
        component={Bookmark}
        options={{
          tabBarLabel: "Bookmark",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="star" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarLabel: "profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;
