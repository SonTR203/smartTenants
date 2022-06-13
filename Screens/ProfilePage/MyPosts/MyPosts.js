import { View, Text, FlatList, Image, Dimensions } from "react-native";
import { React, useEffect, useState } from "react";
import { useAppContext } from "../../../Context/AppContext";
import { db } from "../../../firebase-config";
import { useTheme } from "../../../ThemeContext";
import { doc, getDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { setTime } from "../../../utils/setTime";
import { getMyPosts } from "../../../utils/Profile/profile.services";
const windowWidth = Dimensions.get("window").width;

const MyPosts = ({ navigation }) => {
  const { currentUser } = useAppContext();
  const { theme, styleVariables } = useTheme();
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    (async function fetchMyPosts() {
      const list = await getMyPosts(currentUser);
      setUserPosts(list);
    })();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: styleVariables.colors.white }}
    >
      <StatusBar style="auto" />

      {userPosts.length > 0 && (
        <FlatList
          data={userPosts}
          renderItem={({ item }) => (
            <MyPostItem
              userPost={item}
              navigation={navigation}
              theme={theme}
              styleVariables={styleVariables}
              windowWidth={windowWidth}
            />
          )}
          keyExtractor={(item) => item.id}
          ListFooterComponent={
            <ListFooter styleVariables={styleVariables} theme={theme} />
          }
        />
      )}
    </SafeAreaView>
  );
};

function MyPostItem({
  userPost,
  navigation,
  theme,
  styleVariables,
  windowWidth,
}) {
  const { setPost } = useAppContext();
  const [numberOfLikes] = useState(0);
  const [numberOfComments] = useState(0);
  const [timeSincePost, setTimeSincePost] = useState("");

  useEffect(() => {
    // setNumberOfLikes(userPost.peopleWhoLiked.length);
    // setNumberOfComments(userPost.commentCount);
    // getLikes();
    // getComments();
    let time = setTime(userPost.timestamp);
    setTimeSincePost(time);
  }, [userPost]);

  // const getLikes = async () => {
  //   const likesColReference = collection(
  //     db,
  //     "Newsfeed",
  //     `${userPost.postID}`,
  //     "peopleWhoLiked"
  //   );

  //   const data = await getDocs(likesColReference);
  //   data.forEach((doc) => {
  //     // doc.data() is never undefined for query doc snapshots
  //     console.log(doc.id, " => ", doc.data());
  //   });
  //   // setNumberOfLikes(data.docs.length);
  // };

  // const getComments = async () => {
  //   let commentCount = userPost.commentCount;
  //   if (commentCount) {
  //     setNumberOfComments(commentCount);
  //   }
  // };

  async function viewUserPost(userPosts) {
    const docRef = doc(db, "Newsfeed", `${userPosts.postID}`);
    const docSnap = await getDoc(docRef);
    const postData = docSnap.data();
    const formattedPost = {
      ...postData,
      id: docSnap.id,
    };
    if (docSnap.exists()) {
      // let postData = docSnap;
      // let post = {
      //   comments:
      //     postData._document.data.value.mapValue.fields.comments.arrayValue,
      //   id: docSnap.id,
      //   image:
      //     postData._document.data.value.mapValue.fields.images.arrayValue
      //       .values[0].stringValue,
      //   peopleWhoLiked:
      //     postData._document.data.value.mapValue.fields.peopleWhoLiked.arrayValue,
      //   postContent:
      //     postData._document.data.value.mapValue.fields.postContent.stringValue,
      //   userID: postData._document.data.value.mapValue.fields.userID.stringValue,
      //   userProfileImage:
      //     postData._document.data.value.mapValue.fields.userProfileImage
      //       .stringValue,
      //   userFirstName:
      //     postData._document.data.value.mapValue.fields.userFirstName.stringValue,
      //   userLastName:
      //     postData._document.data.value.mapValue.fields.userLastName.stringValue,
      //   numberOfLikes: numberOfLikes,
      //   timestamp:
      //     postData._document.data.value.mapValue.fields.timestamp.integerValue,
      // };

      setPost(formattedPost);
    } else {
      console.log("No such document.");
    }
  }

  return (
    <View id="post" style={theme.cardContainer}>
      {/* ownerInfo */}
      <View
        id="ownerInfo"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: 12,
        }}
      >
        {/* ownerImageAndName */}
        <View
          className="ownerImageAndName"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: `${userPost.userProfileImage}` }}
            style={{ height: 43, width: 43, borderRadius: 12 }}
          />
          <Text
            style={[
              styleVariables.fontSizes.bodyBold,
              { color: styleVariables.colors.black, marginLeft: 8 },
            ]}
          >{`${userPost.userFirstName} ${userPost.userLastName}`}</Text>
        </View>

        {/* timePosted */}
        <Text
          id="timePosted"
          style={[
            styleVariables.fontSizes.callout,
            { color: styleVariables.colors.black, opacity: 0.66 },
          ]}
        >
          {timeSincePost}
        </Text>
      </View>

      {/* postContent */}
      <TouchableOpacity
        id="postContent"
        onPress={async () => {
          await viewUserPost(userPost);
          navigation.navigate("IndividualPosts");
        }}
      >
        <Text
          style={[
            styleVariables.fontSizes.body,
            { color: styleVariables.colors.black, marginBottom: 17 },
          ]}
        >
          {userPost.postContent}
        </Text>

        {userPost.images[0] != "no image posted" && (
          <Image
            source={{ uri: `${userPost.images[0]}` }}
            style={{
              height: windowWidth - 68,
              width: windowWidth - 68,
              borderRadius: 16,
              marginBottom: 17,
            }}
          />
        )}
      </TouchableOpacity>

      {/* likeAndComment */}
      <View
        id="likeAndComment"
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          marginBottom: 5,
        }}
      >
        {/* like */}
        <View
          id="like"
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <MaterialCommunityIcons
            name="heart-outline"
            size={24}
            color={styleVariables.colors.black}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styleVariables.fontSizes.body,
              { color: styleVariables.colors.black },
            ]}
          >
            {numberOfLikes}
          </Text>
        </View>

        {/* comment */}
        <TouchableOpacity
          id="comment"
          onPress={async () => {
            await viewUserPost(userPost);
            navigation.navigate("IndividualPosts");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            marginLeft: 17,
          }}
        >
          <MaterialCommunityIcons
            name="message-outline"
            size={24}
            color={styleVariables.colors.black}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styleVariables.fontSizes.body,
              { color: styleVariables.colors.black },
            ]}
          >
            {numberOfComments}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ListFooter({ styleVariables }) {
  return (
    <View
      style={{
        height: 204,
        paddingVertical: 17,
        paddingHorizontal: 34,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={[
          styleVariables.fontSizes.callout,
          {
            color: styleVariables.colors.black,
            opacity: 0.66,
            paddingBottom: 8,
          },
        ]}
      >
        Oh oh! Seems like you've reached the end.
      </Text>
      <Text
        style={[
          styleVariables.fontSizes.callout,
          {
            color: styleVariables.colors.black,
            opacity: 0.66,
            paddingBottom: 102,
          },
        ]}
      >
        Refresh at the top for new posts!
      </Text>
    </View>
  );
}

export default MyPosts;
