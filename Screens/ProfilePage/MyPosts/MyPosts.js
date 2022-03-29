import { View, Text } from 'react-native';
import { React, useEffect, useState } from 'react';
import { useAppContext } from '../../../Context/AppContext';

const MyPosts = () => {
  const { currentUser, setCurrentUser } = useAppContext();

  return (
    <View>
      <Text>MyPosts</Text>
    </View>
  );
};

export default MyPosts;
