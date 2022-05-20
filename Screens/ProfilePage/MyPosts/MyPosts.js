import { View, Text, FlatList, Image, Dimensions } from "react-native";
import { React, useEffect, useState } from "react";
import { useAppContext } from "../../../Context/AppContext";
import { db } from "../../../firebase-config";
import { useTheme } from "../../../ThemeContext";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
// import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";
const windowWidth = Dimensions.get("window").width;

let setUserPost;

const MyPosts = ({ navigation }) => {
  const { currentUser, setPost } = useAppContext();
  const [theme, styleVariables] = useTheme();
  const [userPosts, setUserPosts] = useState([]);
  setUserPost = setPost;
  const colReference = collection(
    db,
    "Users",
    `${currentUser.userDocId}`,
    "myPosts"
  );

  function getPosts() {
    getDocs(colReference)
      .then((snapshot) => {
        let postList = [];
        snapshot.docs.forEach((doc) => {
          postList.push({ ...doc.data(), id: doc.id });
        });
        setUserPosts(postList);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: styleVariables.colors.white }}>
      <StatusBar style="auto" />

      {userPosts.length > 0 && (
        <FlatList
          data={userPosts}
          renderItem={({ item }) => (
            <MyPostItem
              userPosts={item}
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
    </View>
  );
};

function MyPostItem({
  userPosts,
  navigation,
  theme,
  styleVariables,
  windowWidth,
}) {
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [timeSincePost, setTimeSincePost] = useState("");

  const getLikes = async () => {
    const likesColReference = collection(
      db,
      "Newsfeed",
      `${userPosts.postID}`,
      "peopleWhoLiked"
    );

    const data = await getDocs(likesColReference);
    setNumberOfLikes(data.docs.length);
    setTime();
    getComments();
  };
  getLikes();

  const getComments = async () => {
    const likesColReference = collection(
      db,
      "Newsfeed",
      `${userPosts.postID}`,
      "peopleWhoCommented"
    );
    const data = await getDocs(likesColReference);
    setNumberOfComments(data.docs.length);
  };

  const setTime = () => {
    let time = userPosts.timestamp;
    if (time != undefined) {
      let timePosted = time;
      let currentTime = Date.now();
      let timeDifferenceMinutes = ((currentTime - timePosted) / 60000).toFixed(
        0
      );
      let timeDifferenceHours = (timeDifferenceMinutes / 60).toFixed(0);
      let timeDifferenceDays = (timeDifferenceHours / 24).toFixed(0);
      let timeDifferenceWeeks = (timeDifferenceDays / 7).toFixed(0);

      if (timeDifferenceMinutes <= 59) {
        setTimeSincePost(`${timeDifferenceMinutes} minutes ago`);
      } else if (timeDifferenceMinutes > 59 && timeDifferenceHours <= 23) {
        setTimeSincePost(`${timeDifferenceHours} hours ago`);
      } else if (
        timeDifferenceDays <= 6 &&
        timeDifferenceMinutes > 59 &&
        timeDifferenceHours > 23
      ) {
        setTimeSincePost(`${timeDifferenceDays} days ago`);
      } else if (
        timeDifferenceWeeks <= 10 &&
        timeDifferenceDays > 6 &&
        timeDifferenceMinutes > 59 &&
        timeDifferenceHours > 23
      ) {
        setTimeSincePost(timeDifferenceWeeks, " weeks ago");
      } else {
        setTimeSincePost("10+ weeks ago");
      }
    }
  };

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
            source={{ uri: `${userPosts.userProfileImage}` }}
            style={{ height: 43, width: 43, borderRadius: 12 }}
          />
          <Text
            style={[
              styleVariables.fontSizes.bodyBold,
              { color: styleVariables.colors.black, marginLeft: 8 },
            ]}
          >{`${userPosts.userFirstName} ${userPosts.userLastName}`}</Text>
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
        onPress={() => {
          navigation.navigate("IndividualPosts");
          viewUserPost(userPosts, numberOfLikes);
        }}
      >
        <Text
          style={[
            styleVariables.fontSizes.body,
            { color: styleVariables.colors.black, marginBottom: 17 },
          ]}
        >
          {userPosts.postContent}
        </Text>

        {userPosts.images[0] != "no image posted" && (
          <Image
            source={{ uri: `${userPosts.images[0]}` }}
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
          onPress={() => {
            navigation.navigate("IndividualPosts");
            viewUserPost(userPosts);
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

async function viewUserPost(userPosts, numberOfLikes) {
  const docRef = doc(db, "Newsfeed", `${userPosts.postID}`);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    let postData = docSnap;
    let post = {
      comments:
        postData._document.data.value.mapValue.fields.comments.arrayValue,
      id: docSnap.id,
      image:
        postData._document.data.value.mapValue.fields.images.arrayValue
          .values[0].stringValue,
      peopleWhoLiked:
        postData._document.data.value.mapValue.fields.peopleWhoLiked.arrayValue,
      postContent:
        postData._document.data.value.mapValue.fields.postContent.stringValue,
      userID: postData._document.data.value.mapValue.fields.userID.stringValue,
      userProfileImage:
        postData._document.data.value.mapValue.fields.userProfileImage
          .stringValue,
      userFirstName:
        postData._document.data.value.mapValue.fields.userFirstName.stringValue,
      userLastName:
        postData._document.data.value.mapValue.fields.userLastName.stringValue,
      numberOfLikes: numberOfLikes,
      timestamp:
        postData._document.data.value.mapValue.fields.timestamp.integerValue,
    };

    setUserPost(post);
  } else {
    console.log("No such document.");
  }
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
        Oh oh! Seems like you&apos;ve reached the end.
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
