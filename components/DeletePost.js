import React from 'react'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase-config'
import { useAppContext } from '../Context/AppContext'
import { useTheme } from '../ThemeContext.js'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Alert } from 'react-native'

const DeletePost = () => {
  const [theme, styleVariables] = useTheme()

  const { post, setPost } = useAppContext()

  const optionsAlert = () => {
    console.log('Displaying Alert for options')

    Alert.alert('Delete Post', 'This will permanently delete your post', [
      {
        text: 'Delete',
        onPress: deletePost,
        style: 'cancel'
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancelled delete post')
      }
    ])
  }

  const deletePost = async () => {
    const singleDoc = doc(db, 'Newsfeed', post.id)
    await deleteDoc(singleDoc)
  }

  return (
    <TouchableOpacity onPress={optionsAlert}>
      <MaterialCommunityIcons
        name='dots-horizontal'
        size={36}
        color={styleVariables.colors.black}
      />
    </TouchableOpacity>
  )
}

export default DeletePost
