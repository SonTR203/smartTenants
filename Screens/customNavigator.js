import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import Newsfeed from './Newsfeed/Newsfeed'
import BuildingInfo from "./BuildingInfo/BuildingInfo"
import CreatePost from './CreatePost/CreatePost'

const Stack  = createStackNavigator()

const NewsfeedNavigator = () => {
return (
  <Stack.Navigator>
    <Stack.Screen name="Newsfeed" component={Newsfeed} options={{title: "Newsfeed"}}/>
    <Stack.Screen name="BuildingInfo" component={BuildingInfo} options={{title: "Building Info"}}/>
    <Stack.Screen name="CreatePost" component={CreatePost} options={{title: "Create Post"}}/>
  </Stack.Navigator>
)
}

export {NewsfeedNavigator}
