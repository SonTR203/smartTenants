import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getAuth } from "firebase/auth";
import * as Updates from "expo-updates";
import * as WebBrowser from "expo-web-browser";
import { useTheme } from "../../../ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { removeExpoPushToken } from "../../../utils/firebase.services";

function ProfileActions({ navigation }) {
  const { theme, styleVariables } = useTheme();
  const auth = getAuth();

  /*This function logs out the user of both the Firebase database cloud service and the user application
   *input: none
   *output: none
   */
  const logUserOut = async () => {
    console.log(auth.currentUser.uid);
    await removeExpoPushToken(auth.currentUser.uid);
    auth.signOut().then(console.log("Tenant signed out"));
    await Updates.reloadAsync();
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      {/* editInfo */}
      <TouchableOpacity
        id="editInfo"
        /*Navigate to the Edit Profile screen */
        onPress={() => {
          navigation.navigate("EditProfile");
        }}
        style={[theme.cardButton, { marginTop: 34 }]}
      >
        <View style={styles.iconHolderView}>
          <MaterialCommunityIcons
            name="account-edit"
            color={styleVariables.colors.primary}
            size={36}
            style={styles.materialIconRight}
          />
          <Text style={[styleVariables.fontSizes.title, styles.colorPrimary]}>
            Edit Info
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={styleVariables.colors.primary}
        />
      </TouchableOpacity>
      {/* residentPortal */}
      <TouchableOpacity
        id="residentPortal"
        /*Link to the Smart Living residential portal*/
        onPress={async () => {
          await WebBrowser.openBrowserAsync(
            "https://smartlivinggroup.securecafe.com/residentservices/apartmentsforrent/userlogin.aspx"
          );
        }}
        style={theme.cardButton}
      >
        <View style={styles.iconHolderView}>
          <MaterialCommunityIcons
            name="home-account"
            color={styleVariables.colors.primary}
            size={36}
            style={styles.materialIconRight}
          />
          <Text style={[styleVariables.fontSizes.title, styles.colorPrimary]}>
            Resident Portal
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={styleVariables.colors.primary}
        />
      </TouchableOpacity>
      {/* myPosts */}
      <TouchableOpacity
        id="myPosts"
        /*Navigate to the My Posts screen*/
        onPress={() => navigation.navigate("MyPosts")}
        style={theme.cardButton}
      >
        <View style={styles.iconHolderView}>
          <MaterialCommunityIcons
            name="view-list"
            color={styleVariables.colors.primary}
            size={36}
            style={styles.materialIconRight}
          />
          <Text style={[styleVariables.fontSizes.title, styles.colorPrimary]}>
            My Posts
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={styleVariables.colors.primary}
        />
      </TouchableOpacity>
      {/* logOut */}
      <TouchableOpacity
        id="logOut"
        /*Logs out the user*/
        onPress={logUserOut}
        style={theme.cardButton}
      >
        <View style={styles.iconHolderView}>
          <MaterialCommunityIcons
            name="logout"
            color={styleVariables.colors.primary}
            size={36}
            style={styles.materialIconRight}
          />
          <Text style={[styleVariables.fontSizes.title, styles.colorPrimary]}>
            Log Out
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={styleVariables.colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  materialIcon: { marginLeft: 8 },
  materialIconRight: { marginRight: 8 },
  iconHolderView: { flexDirection: "row", alignItems: "center" },
});

export default ProfileActions;
