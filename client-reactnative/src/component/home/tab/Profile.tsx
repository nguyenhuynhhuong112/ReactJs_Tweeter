import * as React from 'react';
import { Text, View , TouchableOpacity} from 'react-native';

function Profile({navigation}: {navigation: any}) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Profile!</Text>
        {/* <TouchableOpacity onPress={navigation.navigate('login')}>
          <Text>Go to Profile</Text>
        </TouchableOpacity> */}
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('login')}>
            <Text>Go to Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  export default Profile