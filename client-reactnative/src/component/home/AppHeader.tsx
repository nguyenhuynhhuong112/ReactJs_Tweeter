import React from 'react';
import { View, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

function AppHeader() {
  return (
    <View style={{ height: 45, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
      <AntDesign name="twitter" size={24} color="#3B82F6" />
    </View>
  );
}

export default AppHeader;