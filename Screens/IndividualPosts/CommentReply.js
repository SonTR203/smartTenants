import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { setTime } from "../../utils/setTime";
import { useAppContext } from "../../Context/AppContext";
import { deleteReply } from "../../utils/IndividualPosts/individualPosts.services";
import DynamicProfilePicture from "../../components/ProfilePicture/DynamicProfilePicture";
import CustomBottomModal from "../../components/CustomBottomModal/index";
import ModalActionConfirm from "../../components/CustomBottomModal/ModalActionConfirm/index.js";
import HorizontalDotsSVG from "../../components/Icons/HorizontalDotsSVG";

function CommentReply({
  post,
  item,
  theme,
  styleVariables,
  styles,
  currentUser,
  setComments,
}) {
  const { setPost } = useAppContext();
  const [timeSincePost, setTimeSincePost] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function convertTime() {
      let time = setTime(item.timestamp.seconds * 1000);
      setTimeSincePost(time);
    }
    convertTime();
  }, []);

  const handleDeleteReply = async () => {
    const updatedComment = await deleteReply(
      post,
      item,
      currentUser,
      setModalVisible,
      setComments
    );
    if (updatedComment) {
      setPost({
        ...updatedComment,
        updated: true,
      });
    }
  };

  const options = [
    {
      content: `Edit`,
      onPress: () => {},
      iconName: "pencil",
      iconColor: "#4D4D4D",
    },
    {
      content: `Delete`,
      onPress: () => {},
      iconName: "trash-can-outline",
      iconColor: "#4D4D4D",
      renderSubscreen: () => {
        return (
          <ModalActionConfirm
            destructive={true}
            title={`Delete your comment?`}
            subtitle={"You won't be able to restore it"}
            confirmText="Delete"
            onConfirm={() => {
              handleDeleteReply();
            }}
            onCancel={() => setModalVisible(false)}
          />
        );
      },
    },
    {
      content: "Turn off notifications",
      onPress: () => {},
      iconName: "bell-off-outline",
      iconColor: "#4D4D4D",
      renderSubscreen: () => {
        return (
          <ModalActionConfirm
            title={"Turn off notifications for this post?"}
            subtitle={"You will be able to undo this action"}
            confirmText="Confirm"
            // onConfirm={handleTurnOffNotifications}
            onCancel={() => setModalVisible(false)}
          />
        );
      },
    },
  ];

  return (
    <View style={styles.replyContainer}>
      <View id="replyLine" style={styles.replyLine}></View>
      <View
        id="userReply"
        style={[
          theme.individualPostCardContainer,
          styles.container,
          styles.reply,
          { marginTop: 8 },
        ]}
      >
        <View className="commentOwnerInfo" style={styles.ownerInfo}>
          <View
            className="commentOwnerImageAndName"
            style={styles.ownerImageAndName}
          >
            <DynamicProfilePicture user={item} size={43} borderRadius={12} />

            <View
              style={[{ flexDirection: "column" }, { marginHorizontal: 8 }]}
            >
              <Text
                style={[styleVariables.fontSizes.bodyBold, styles.fullName]}
              >
                {`${item.firstName} ${item.lastName}`}
              </Text>
              <Text
                id="timeCommentPosted"
                style={[styleVariables.fontSizes.callout, styles.timestamp]}
              >
                {timeSincePost}
              </Text>
            </View>
          </View>
          {currentUser.userID == item.userID ? (
            <View style={styles.HorizontalDots}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                <HorizontalDotsSVG />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <View className="commentContent">
          <Text style={[styleVariables.fontSizes.body]}>
            {item.commentContent}
          </Text>
        </View>
      </View>
      <CustomBottomModal
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        options={options}
      ></CustomBottomModal>
    </View>
  );
}

export default CommentReply;
