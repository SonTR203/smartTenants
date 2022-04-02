import {
  View,
  Text,
  ActivityIndicator,
  Image,
  Alert,
  Button,
  FlatList,
  TextInput
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { TouchableOpacity } from 'react-native-gesture-handler'
import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../Context/AppContext'
import { db } from '../../firebase-config'
import { collection, getDocs, deleteDoc, addDoc } from '@firebase/firestore'
import { Component } from 'react/cjs/react.production.min'
import _ from 'lodash'
import { useTheme } from '../../ThemeContext'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Dimensions } from 'react-native'
const width = Dimensions.get('window').width

const IndividualPosts = ({ route, navigation }) => {
  const [theme, styleVariables] = useTheme()
  const { post } = useAppContext()
  const { currentUser } = useAppContext()

  const [textInputValue, setTextInputValue] = useState('')
  const [peoplePerson, setPeoplePerson] = useState('people')
  const [comments, setComments] = useState([])

  // Get all Comments
  const getComments = () => {
    const colRef = collection(db, `/Newsfeed/${post.id}/peopleWhoCommented`)

    // Get collections data
    getDocs(colRef).then(snapshot => {
      let commentsArray = []
      snapshot.docs.forEach(doc => {
        commentsArray.push({ ...doc.data(), id: doc.id })
      })

      let sortedComments = _.sortBy(commentsArray, 'timestamp')

      setComments(sortedComments)
    })
  }

  // execute function
  useEffect(() => {
    getComments()

    if (post.numberOfLikes == 1) {
      setPeoplePerson('person')
    } else {
      setPeoplePerson('people')
    }
  }, [post.id])

  {
    /* postComments */
  }
  const Comment = ({ item, theme, styleVariables, width }) => {
    return (
      <View id='userComment' style={theme.cardContainer}>
        <View
          className='commentOwnerInfo'
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 12
          }}
        >
          <View
            className='commentOwnerImageAndName'
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Image
              source={{ uri: item.userProfileImage }}
              style={{ width: 43, height: 43, borderRadius: 12 }}
            />
            <Text
              style={[
                styleVariables.fontSizes.bodyBold,
                { color: styleVariables.colors.black, marginLeft: 8 }
              ]}
            >{`${item.firstName} ${item.lastName}`}</Text>
          </View>
          <Text
            id='timeCommentPosted'
            style={[
              styleVariables.fontSizes.callout,
              { color: styleVariables.colors.black, opacity: 0.66 }
            ]}
          >
            {'26m'}
          </Text>
        </View>

        <View className='commentContent'>
          <Text
            style={[
              styleVariables.fontSizes.body,
              { color: styleVariables.colors.black, marginBottom: 17 }
            ]}
          >
            {item.commentContent}
          </Text>
        </View>
      </View>
    )
  }

  // Post Comments
  const postComment = () => {
    if (textInputValue != '') {
      const peopleWhoCommentedColRef = collection(
        db,
        `Newsfeed/${post.id}/peopleWhoCommented`
      )

      try {
        addDoc(peopleWhoCommentedColRef, {
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          userProfileImage: currentUser.userProfileImage,
          commentContent: textInputValue,
          postUserID: post.userID,
          timestamp: Date.now()
        }).then(() => {
          getComments()
          setTextInputValue('')
        })

        addCommentNotifications(post)
      } catch (err) {
        console.log(err)
      }
      navigation.push('Newsfeed')
    } else {
      alert('No Comment to Post')
    }
  }

  function addCommentNotifications (post) {
    const peopleWhoCommentedColRef = collection(
      db,
      `Users/${post.userID}/Notifications`
    )
    try {
      addDoc(peopleWhoCommentedColRef, {
        content: `${currentUser.firstName} ${currentUser.lastName} commented on your post.`,
        postID: post.id,
        userID: post.userID,
        wasSeen: false,
        timestamp: Date.now()
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View>
      <StatusBar style='auto' />
      <View style={theme.pageContainer}>
        <FlatList
          ListHeaderComponent={
            <ListHeader
              post={post}
              peoplePerson={peoplePerson}
              theme={theme}
              styleVariables={styleVariables}
            />
          }
          data={comments}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Comment
              item={item}
              navigation={navigation}
              theme={theme}
              styleVariables={styleVariables}
              width={width}
            />
          )}
          ListFooterComponent={
            <ListFooter
              post={post}
              textInputValue={textInputValue}
              postComment={postComment}
              theme={theme}
              styleVariables={styleVariables}
            />
          }
        />
      </View>
    </View>
  )
}

{
  /* userPost */
}
function ListHeader ({ post, peoplePerson, theme, styleVariables }) {
  return (
    <View id='userPost' style={[theme.cardContainer, { marginHorizontal: 0 }]}>
      {/* postOwnerInfo */}
      <View
        className='postOwnerInfo'
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: 12
        }}
      >
        <View
          className='ownerImageAndName'
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Image
            source={{ uri: `${post.userProfileImage}` }}
            style={{ width: 43, height: 43, borderRadius: 12 }}
          />
          <Text
            style={[
              styleVariables.fontSizes.bodyBold,
              { color: styleVariables.colors.black, marginLeft: 8 }
            ]}
          >
            {post.userFirstName} {post.userLastName}
          </Text>
        </View>
        <Text
          id='timePosted'
          style={[
            styleVariables.fontSizes.callout,
            { color: styleVariables.colors.black, opacity: 0.66 }
          ]}
        >
          {'2h'}
        </Text>
      </View>

      {/* postContent */}
      <View className='postContent'>
        {/* postTextContent */}
        <Text
          style={[
            styleVariables.fontSizes.body,
            { color: styleVariables.colors.black, marginBottom: 17 }
          ]}
        >
          {post.postContent}
        </Text>
        {/* postImageContent */}
        {post.image != 'no image posted' && (
          <View
            style={{
              width: width - 68,
              height: (width - 68) * 0.66,
              borderRadius: 16,
              marginBottom: 17,
              shadowColor: styleVariables.colors.black,
              shadowOffset: {
                width: 0,
                height: 8
              },
              shadowOpacity: 0.28,
              shadowRadius: 34,
              elevation: 20
            }}
          >
            <Image
              source={{
                uri: `${post.image}`
              }}
              style={{
                width: width - 68,
                height: (width - 68) * 0.66,
                borderRadius: 16,
                marginBottom: 17
              }}
            />
          </View>
        )}
      </View>

      {/* likeCount */}
      <View
        id='likeCount'
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          marginBottom: 5
        }}
      >
        <TouchableOpacity
          id='like'
          onPress={() => {
            alert('like post function')
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row'
          }}
        >
          <MaterialCommunityIcons
            name='heart-outline'
            size={24}
            color={styleVariables.colors.black}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styleVariables.fontSizes.callout,
              { color: styleVariables.colors.black }
            ]}
          >
            Liked by
          </Text>
          <Text
            style={[
              styleVariables.fontSizes.calloutBold,
              { color: styleVariables.colors.black }
            ]}
          >
            {` ${post.numberOfLikes} ${peoplePerson}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

{
  /* addComment */
}
function ListFooter ({
  post,
  textInputValue,
  setTextInputValue,
  postComment,
  theme,
  styleVariables
}) {
  return (
    <View>
      <TextInput
        placeholder='say something'
        onChangeText={text => setTextInputValue(text)}
        value={textInputValue}
      />
      {/* disable button class if no text input for comments */}

      <Button title='comment' onPress={postComment}></Button>
    </View>
  )
}

export default IndividualPosts
