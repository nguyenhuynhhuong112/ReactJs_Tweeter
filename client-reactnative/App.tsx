import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { SignupForm } from "./src/component/signup/SignupForm";
import { LoginForm } from "./src/component/login/LoginForm";
import Ionicons from "react-native-vector-icons/Ionicons";
import { EditProfile } from "./src/component/edit/EditProfile";
import MyTabs from "./src/component/home/Home";
import AppHeader from "./src/component/home/AppHeader";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { ProfileUser } from "./src/component/profile/ProfileUser";
import { io } from "socket.io-client";
import Tweet from "./src/component/home/tab/tweet/Tweet";
import { TweetDetail } from "./src/component/tweet/TweetDetail";

export default function App() {
  const Stack = createStackNavigator();
  useEffect(() => {
    const socket = io('http://localhost:8080', {
      autoConnect: false,
    });
    socket.on('connect', () => {
      console.log('Connected to socket server.');
      socket.emit('userConnected', 'User connected to the server.');
    });
    socket.on('serverMessage', (message) => {
      console.log('Message from server:', message);
    });
    socket.connect();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="login">
          <Stack.Screen
            name="login"
            component={LoginForm}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signup"
            component={SignupForm}
            options={{
              headerLeft: ({ onPress }) => (
                <Ionicons name="arrow-back-sharp" size={20} onPress={onPress} />
              ),
            }}
          />
          <Stack.Screen
            name="settings"
            component={EditProfile}
            options={{
              headerLeft: ({ onPress }) => (
                <Ionicons name="arrow-back-sharp" size={20} onPress={onPress} />
              ),
            }}
          />
          <Stack.Screen
            name="Tabs"
            component={MyTabs}
            options={{ header: () => <AppHeader /> }}
          />
          <Stack.Screen name="user" component={ProfileUser} />
          <Stack.Screen name="Tweet" component={Tweet} />
          <Stack.Screen name="tweetDetail" component={TweetDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
