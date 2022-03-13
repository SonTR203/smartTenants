import { View, Text, Pressable } from "react-native";
import React from "react";
import {useNavigation} from '@react-navigation/native';

//Get info about who is currently logged in, get user info
//loop through all and show posts with only that building ID in flatlist


const Newsfeed = ({navigation}) => {

  let user; // put in user object here

  return (
    <View>

      <Pressable onPress={()=>{navigation.navigate("BuildingInfo")}}>
        <Text>Building Info</Text>
      </Pressable>

      <Pressable onPress={()=>{navigation.navigate("CreatePost")}}>
        <Text>New Post</Text>
      </Pressable>

    </View>
  );
};

export default Newsfeed;
