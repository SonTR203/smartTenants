import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme } from "../ThemeContext";
import DynamicProfilePicture from "./ProfilePicture/DynamicProfilePicture";

function PeopleWhoLikedModal({ setLikesModalVisible, peopleWhoLiked }) {
  const { styleVariables, theme } = useTheme();

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 0.4,
      marginTop: "auto",
      backgroundColor: "#ffffff",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      display: "flex",
      flexDirection: "column",
      paddingTop: 24,
      paddingHorizontal: 24,
      shadowRadius: "16, 16, 0, 0",
      justifyContent: "space-around",
    },
    modalHeader: {
      fontSize: 17,
      fontWeight: "500",
      lineHeight: 22,
      color: "#395E66",
      marginBottom: 8,
    },
    person: {
      display: "flex",
      flexDirection: "row",
      marginTop: 16,
    },
    personName: {
      alignSelf: "center",
      marginHorizontal: 8,
      color: "#4D4D4D",
      fontSize: 17,
      lineHeight: 22,
    },
    closeButton: {
      alignSelf: "center",
      marginBottom: 34,
    },
    modalScrollView: {
      display: "flex",
    },
  });

  return (
    <View style={styles.modalContainer}>
      <View>
        <Text style={styles.modalHeader}>People who liked</Text>
      </View>

      <View style={{ minHeight: "25%" }}>
        <ScrollView style={styles.modalScrollView}>
          {peopleWhoLiked.map((person) => {
            return (
              <View key={person.userID} style={styles.person}>
                <DynamicProfilePicture
                  user={{
                    userProfileImage: person.userProfileImage,
                    firstName: person.firstName,
                    lastName: person.lastName,
                    colors: person.colors,
                  }}
                  size={43}
                  borderRadius={12}
                ></DynamicProfilePicture>
                <Text style={styles.personName}>
                  {person.firstName + " " + person.lastName}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View style={{ backgroundColor: "white", marginTop: 8 }}>
        <TouchableOpacity
          setLikesModalVisible={setLikesModalVisible}
          activeOpacity={1}
          style={[theme.secondaryButton, styles.closeButton]}
          onPress={() => setLikesModalVisible(false)}
        >
          <Text
            style={[
              theme.secondaryButtonText,
              styleVariables.fontSizes.bodyBold,
            ]}
          >
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default PeopleWhoLikedModal;
