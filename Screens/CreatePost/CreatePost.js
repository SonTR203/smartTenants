// Modal: https://reactnative.dev/docs/modal

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  Modal,
  Platform,
  ActivityIndicator,
  ScrollView
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import React, { useState, useEffect } from 'react'
import { db } from '../../firebase-config'
import { addDoc, collection } from '@firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useTheme } from '../../ThemeContext'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const CreatePost = ({ navigation }) => {
  const [theme, styleVariables] = useTheme()
  const [postContent, setPostContent] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [modalText, setModalText] = useState('')
  const [image, setImage] = useState(null)
  const [imageURL, setImageURL] = useState('')
  const [isLoading, setIsloading] = useState(false)

  let userID = 1234 //replace with context userID

  let imageName = `newsfeedImages/${userID}/${Date.now() +
    Math.floor(Math.random() * 20)}.jpg`

  useEffect(() => {
    ;(async () => {
      if (Platform.OS !== 'web') {
        const {
          status
        } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    })()
  }, [])

  async function PostContent (imgUrl) {
    if (!imgUrl) {
      imgUrl = 'no image posted'
    }
    try {
      await addDoc(collection(db, 'Newsfeed'), {
        postContent: postContent,
        userID: userID,
        images: [imgUrl],
        peopleWhoLiked: [],
        comments: []
      })

      postSuccess()
    } catch (error) {
      console.log(error)
      postFailure()
    }
  }

  function postSuccess () {
    setIsloading(false)
    setModalText('Post Successful!')
    setModalVisible(true)
  }

  function postFailure () {
    setModalText('Post Failed')
    setModalVisible(true)
  }

  // ============================= IMAGE UPLOAD =============================

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    if (!result.cancelled) {
      setImage(result.uri)
    }
  }

  async function handleSelectedImage () {
    setIsloading(true)

    if (image == null) {
      console.log('no image found')
      PostContent()
    } else {
      try {
        if (!image.cancelled) {
          await uploadImage(image)
        }
      } catch (e) {
        console.log(e)
        alert('Upload failed, sorry :(')
      }
    }
  }

  async function uploadImage () {
    console.log('UPLOADING')
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = function () {
        resolve(xhr.response)
      }
      xhr.onerror = function (e) {
        console.log(e)
        reject(new TypeError('Network request failed'))
      }
      xhr.responseType = 'blob'
      xhr.open('GET', image, true)
      xhr.send(null)
    })

    const fileRef = ref(getStorage(), imageName)
    await uploadBytes(fileRef, blob)

    // blob.close();
    let imgUrl = await getDownloadURL(fileRef)
    setImageURL(imgUrl)

    //set postContent to ImageURl hook in future, for some reason ImageUrl keeps coming back empty
    PostContent(imgUrl)
    return imgUrl
  }

  return (
    <ScrollView style={theme.pageContainer}>
      <StatusBar style='auto' />
      {isLoading && <ActivityIndicator size='large' />}

      <Modal
        animationType='slide'
        transparent={false}
        statusBarTranslucent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
        onShow={() => {
          setTimeout(() => {
            setModalVisible(!modalVisible)
            navigation.navigate('Newsfeed')
          }, 2000)
        }}
      >
        <View style={theme.container}>
          <View style={theme.modalView}>
            <Text
              style={[
                styleVariables.fontSizes.body,
                styleVariables.colors.black
              ]}
            >
              {modalText}
            </Text>
          </View>
        </View>
      </Modal>

      <View id='statusInput'>
        <Text style={[theme.textInputLabel, styleVariables.fontSizes.body]}>
          What's on your mind?
        </Text>
        <TextInput
          onChangeText={text => {
            setPostContent(text)
          }}
          placeholder='280 characters maximum'
          numberOfLines={5}
          multiline={true}
          style={[theme.textInput, styleVariables.fontSizes.body]}
        ></TextInput>
      </View>

      <View id='imageUploadPreview' style={theme.container}>
        {image && (
          <Image source={{ uri: image }} style={theme.imageUploadPreview} />
        )}
      </View>

      <TouchableOpacity
        id='uploadImageButton'
        onPress={pickImage}
        style={theme.secondaryButton}
      >
        <Text
          style={[theme.secondaryButtonText, styleVariables.fontSizes.body]}
        >
          Upload image
          <MaterialCommunityIcons
            name='image-plus'
            size={24}
            color={styleVariables.colors.primary}
            style={{ marginLeft: 8 }}
          />
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        id='submitPostButton'
        onPress={handleSelectedImage}
        style={theme.primaryButton}
      >
        <Text
          style={[theme.primaryButtonText, styleVariables.fontSizes.bodyBold]}
        >
          Submit post
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default CreatePost
