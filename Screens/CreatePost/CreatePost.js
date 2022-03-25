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
import { addDoc, collection, getDocs } from '@firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useTheme } from '../../ThemeContext'
import { useAppContext } from '../../Context/AppContext'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const CreatePost = ({ navigation }) => {
  const [theme, styleVariables] = useTheme()
  const [postContent, setPostContent] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [modalText, setModalText] = useState('')
  const [image, setImage] = useState(null)
  const [isLoading, setIsloading] = useState(false)
  const { currentUser, setCurrentUser } = useAppContext()

  let imageName = `newsfeedImages/${currentUser.userDocId}/${Date.now() +
    Math.floor(Math.random() * 20)}.jpg`

  useEffect(() => {
    (async () => {
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

    let specificPostID;

    if (!imgUrl) {
      imgUrl = 'no image posted'
    }
    try {

      const {id} = await addDoc(collection(db, 'Newsfeed'), {
        postContent: postContent,
        userID: currentUser.userDocId,
        userFirstName: currentUser.firstName,
        userLastName: currentUser.lastName,
        userProfileImage: currentUser.userProfileImage,
        images: [imgUrl],
        timestamp: Date.now(),
        peopleWhoLiked: [],
        comments: []
      })
      postSuccess()
      specificPostID = id;
      createMyPostsCollection(specificPostID)
    } catch (error) {
      console.log(error)
      postFailure()
    }
  }

  async function createMyPostsCollection(specificPostID){
      const colRef = collection(
        db,
        `Users/${currentUser.userDocId}/myPosts`
      )
      let data = await getDocs(colRef)
      if (data.docs.length > 0) {
        console.log('myPosts Subcollection already exists')
      } else {
        console.log('creating myPosts doc')
        await addDoc(colRef, {
          postID: specificPostID
        })
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

    //set postContent to ImageURl hook in future, for some reason ImageUrl keeps coming back empty
    PostContent(imgUrl)
    return imgUrl
  }

  return (
    <ScrollView style={theme.pageContainer}>
      <View style={theme.globalMargins}>
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
                //had to do style inline, theme provider caused an issue on post
                style={{
                  fontSize: 17,
                  fontFamily: 'Roboto_400Regular',
                  color: '#191919'
                }}
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
            // numberOfLines={5}
            multiline={true}
            maxLength={280}
            style={[
              theme.textInput,
              styleVariables.fontSizes.body,
              { minHeight: 68 + 44, paddingTop: 22 }
            ]}
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
            Upload image{' '}
            <MaterialCommunityIcons
              name='image-plus'
              size={18}
              color={styleVariables.colors.primary}
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
      </View>
    </ScrollView>
  )
}

export default CreatePost
