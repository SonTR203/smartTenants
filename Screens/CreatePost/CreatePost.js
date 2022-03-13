import { StyleSheet, Text, View, TextInput, Button, Image, TouchableOpacity} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, {useState} from "react";
import { db } from '../../firebase-config';
import { addDoc, collection } from "@firebase/firestore"



const CreatePost = () => {
  const [postContent, setPostContent] = useState("")


  let user; // this will hold the user object
  // replace these with the user object 
  let userID = 1234
  let buildingID = 5678
  let postUserID = 12345678



  async function postText(){
    try {
      await addDoc(collection(db,'Newsfeed'),
      {
        buildingID: buildingID,
        postContent: postContent,
        postID: String.fromCharCode(Math.floor(Math.random() * 20) + 97)+ Math.random().toString(16).slice(2)+ Date.now().toString(16).slice(4),    
        postUserID: userID,
        images: [],
        peopleWhoLiked: [],
        comments: []
      })  
      postSuccess()
    } catch (error) {
      console.log(error)
      postFailure()
    }
  }

  function postSuccess(){

  }

  function postFailure(){

  }

  return (
    <>
      <View>
        <TextInput onChangeText= { text => {setPostContent(text)} } placeholder='Write your post here'></TextInput>
        <StatusBar style="auto" />
      </View>
    <TouchableOpacity>
      <Text onPress={postText}>Post</Text>
    </TouchableOpacity>
  
    </>
  );
};

export default CreatePost;
