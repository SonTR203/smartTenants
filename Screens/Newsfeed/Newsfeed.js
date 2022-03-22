import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import React, { useState, useEffect, useContext } from 'react'
import { collection, getDocs, deleteDoc, addDoc } from '@firebase/firestore'
import { db } from '../../firebase-config'
import { useAppContext } from '../../Context/AppContext'
import { useTheme } from '../../ThemeContext'
import { MaterialCommunityIcons } from '@expo/vector-icons'

let globalPost
let setGlobalPost
let globalCurrentUser

const Newsfeed = ({ navigation }) => {
  const [theme, styleVariables] = useTheme()
  const [posts, setPosts] = useState([])
  const { post, setPost } = useAppContext()
  const { currentUser, setCurrentUser } = useAppContext()
  const colRef = collection(db, 'Newsfeed')
  const [refreshing, setRefreshing] = useState(true)

  globalPost = post
  setGlobalPost = setPost
  globalCurrentUser = currentUser

  useEffect(() => {
    getPosts()
  }, [])

  const getPosts = async () => {
    const data = await getDocs(colRef)
    setPosts(
      data.docs.map(item => ({
        ...item._document.data.value.mapValue.fields,
        id: item._key.path.segments[6]
      }))
    )
    setRefreshing(false)
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: styleVariables.colors.primary }}
      edges={['top']}
    >
      <StatusBar style='auto' />
      <View style={theme.pageContainer}>
        {refreshing ? <ActivityIndicator /> : null}

        {posts.length > 0 && (
          <FlatList
            ListHeaderComponent={
              <ListHeader
                navigation={navigation}
                styleVariables={styleVariables}
                theme={theme}
              />
            }
            data={posts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Post posts={item} navigation={navigation} />
            )}
            refreshControl={
              <RefreshControl
                onRefresh={getPosts}
                refreshing={refreshing}
                style={{ backgroundColor: styleVariables.colors.primary }}
                tintColor={'white'}
              />
            }
            ListFooterComponent={ListFooter}
          />
        )}

        {posts.length < 1 && (
          <View>
            <Text>no items to show</Text>
          </View>
        )}

        {/* FAB */}
        <Pressable
          id='FAB'
          onPress={() => {
            navigation.navigate('CreatePost')
          }}
          style={theme.fab}
        >
          <MaterialCommunityIcons
            name='plus'
            size={24}
            color={styleVariables.colors.white}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

//============================== Individual Post Cards ==========================
function Post ({ posts, navigation }) {
  posts = {
    comments: posts.comments.arrayValue,
    id: posts.id,
    image: posts.images.arrayValue.values[0].stringValue,
    peopleWhoLiked: posts.peopleWhoLiked.arrayValue,
    postContent: posts.postContent.stringValue,
    userID: posts.userID.stringValue,
    userProfileImage: posts.userProfileImage.stringValue,
    userFirstName: posts.userFirstName.stringValue,
    userLastName: posts.userLastName.stringValue
  }

  const likePost = async () => {
    const notificationColRef = collection(
      db,
      `Users/${posts.userID}/Notifications`
    )

    try {
      await addDoc(notificationColRef, {
        content: `${globalCurrentUser.firstName} ${globalCurrentUser.lastName} liked your post.`,
        notificationID: 2,
        postID: posts.id,
        userID: posts.userID,
        wasSeen: false
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={{ borderColor: 'black', borderWidth: 1, margin: 20 }}>
      <View className='postOwnerInfo' style={{ flexDirection: 'row' }}>
        <Image
          source={{ uri: `${posts.userProfileImage}` }}
          style={{ width: 25, height: 25, borderRadius: 50 }}
        />
        <Text style={{ marginTop: 3, marginLeft: 5 }}>
          {posts.userFirstName} {posts.userLastName}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('IndividualPosts')
          setGlobalPost(posts)
        }}
      >
        <View className='postTextContent' style={{ margin: 10 }}>
          <Text>{posts.postContent}</Text>
        </View>

        {posts.image != 'no image posted' && (
          <Image
            source={{
              uri: `${posts.image}`
            }}
            style={{ width: 330, height: 300 }}
          />
        )}
      </TouchableOpacity>

      <View
        className='likeAndComment'
        style={{ display: 'flex', flexDirection: 'row' }}
      >
        <TouchableOpacity onPress={likePost}>
          <Text>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('IndividualPosts')
            setGlobalPost(posts)
          }}
        >
          <Text>Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function ListHeader ({ navigation, styleVariables, theme }) {
  return (
    <>
      <View id='header' style={theme.header}>
        <Text
          style={[
            styleVariables.fontSizes.header,
            { color: styleVariables.colors.white, marginBottom: 4 }
          ]}
        >
          Newsfeed
        </Text>
        <Pressable
          onPress={() => {
            navigation.navigate('BuildingInfo')
          }}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            opacity: 0.66
          }}
        >
          <Text
            style={[
              styleVariables.fontSizes.body,
              { color: styleVariables.colors.white }
            ]}
          >
            Building Info
          </Text>
          <MaterialCommunityIcons
            name='chevron-right'
            size={24}
            color={styleVariables.colors.white}
          />
        </Pressable>
      </View>

      <View style={theme.firstListItem}>
        <View id='topCard' style={theme.topCard}>
          <Pressable
            id='announcements'
            onPress={() => {
              alert('navigate to announcements (not yet implemented)')
            }}
            style={theme.cardButton}
          >
            <Text
              style={[
                styleVariables.fontSizes.title,
                { color: styleVariables.colors.primary }
              ]}
            >
              Announcements
            </Text>
            <View id='counter' style={theme.counter}>
              <Text
                id='notificationCounter'
                style={[
                  theme.notificationCounter,
                  styleVariables.fontSizes.callout,
                  { color: styleVariables.colors.white }
                ]}
              >
                99+
              </Text>
              <MaterialCommunityIcons
                name='chevron-right'
                size={24}
                color={styleVariables.colors.primary}
              />
            </View>
          </Pressable>
        </View>
      </View>
    </>
  )
}

function ListFooter () {
  return <View style={{ backgroundColor: 'red', height: 34 }}></View>
}

export default Newsfeed
