// Modal: https://reactnative.dev/docs/modal 

import { StyleSheet, Text, View, TextInput, Button, Image, TouchableOpacity, Modal} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, {useState} from "react";
import { db } from '../../firebase-config';
import { addDoc, collection } from "@firebase/firestore"
import {useNavigation} from '@react-navigation/native';




const CreatePost = ({navigation}) => {
  const [postContent, setPostContent] = useState("")
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");



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
    setModalText("Posted Successfully")
    setModalVisible(true)
  }

  function postFailure(){
    setModalText("Post Failed")
    setModalVisible(true)
  }

  return (
    <>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
           <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalText}</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible)
                navigation.navigate("Newsfeed")
              }}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

