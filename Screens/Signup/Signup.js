//https://www.youtube.com/watch?v=aSOsfpsMriI
import React, { useState } from "react";
import {
  // StyleSheet,
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "@firebase/firestore";
import { db } from "../../firebase-config";
import ModalPicker from "../../components/ModalBuildingPicker";
import { useTheme } from "../../ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Dimensions } from "react-native";
const windowHeight = Dimensions.get("window").height;

const auth = getAuth();

/* New users sign up screen. Users get authorized by Firebase then
 * an admin approve their request before they are allowed to the
 * home screen (Newsfeed) */
const Signup = ({ navigation }) => {
  const [theme, styleVariables] = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [buildingAddress, setBuildingAddress] = useState("Select building");
  const [buildingID, setBuildingID] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [unitNumber, setUnitNumber] = useState("");
  const [isAdmin] = useState(false);
  const [tenantAuthorized] = useState(false);
  const [myMarketplacePosts] = useState([]);
  const [myPosts] = useState([]);
  const [visibleNotices] = useState([]);
  const [visibleAnnouncements] = useState([]);
  const defaultProfileImage =
    "https://firebasestorage.googleapis.com/v0/b/smarttenant-19566.appspot.com/o/userProfileImages%2FdefaultIcon.png?alt=media&token=38f0365b-cb36-4964-ab8c-7a600073c244";

  const changeModalVisibility = (bool) => {
    setModalVisible(bool);
  };

  /*This function extracts user's building address data and formats it for the user's object building address property
   *inputs:building object
   *outputs building ID property value
   */

  const setData = (building) => {
    building = building.buildingAddress.stringValue;
    setBuildingAddress(building);
    setBuildingID(building.replace(/\s/g, ""));
  };

  /* This function validates inputs of the sign up screen not to be  *empty and prompts the user to enter data into empty fields *inputs: none
   *outputs: alert messages for empty fields
   */
  const checkTextInputs = () => {
    if (!firstName.trim()) {
      alert("Please Enter Your First Name");
      return false;
    } else if (!lastName.trim()) {
      alert("Please Enter Your last Name");
      return false;
    } else if (!unitNumber.trim() || isNaN(unitNumber.trim())) {
      console.log(+unitNumber);
      alert("Please Enter a Unit Number");
      return false;
    } else if (!buildingID.trim()) {
      alert("Please Enter Your Building Id");
      return false;
    } else if (!email) {
      alert("Please Enter Your Email Address");
      return false;
    } else if (!password) {
      alert("Please Enter Your Password, at least 6 characters");
      return false;
    }
    return true;
  };

  /* This function stores new user object on Firebase database *inputs: user object
   *outputs: a user object document stored on Firebase
   */

  async function createNewUser(user) {
    try {
      await addDoc(collection(db, "Users"), {
        userID: user.uid,
        firstName,
        lastName,
        buildingID,
        buildingAddress,
        email,
        unitNumber: parseInt(unitNumber),
        isAdmin,
        tenantAuthorized,
        myMarketplacePosts,
        myPosts,
        visibleNotices,
        visibleAnnouncements,
        userProfileImage: defaultProfileImage,
      });
    } catch (error) {
      alert(error);
    }
  }

  /* This function is called upon successful authorization of the *user, and once the new user object is created and stored on *Firebase navigates the user to the AccountApprovalPending
   *inputs: user object
   *outputs: none
   */

  function signUpSuccess(user) {
    createNewUser(user);
    navigation.navigate("AccountApprovalPending");
  }

  /* This function alerts the user to failure of the sign up process *inputs: none
   *outputs: alert message
   */

  function signUpFailure() {
    alert("You have not been signed up, please try again");
  }

  /* This function handles the entire sign up process in conjunction *with the nested functions ensuring the user is registered on *Firebase
   *inputs: none
   *outputs: either undefined or an alert message depending on the *error
   */
  const handleSignup = () => {
    if (!checkTextInputs()) return;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        signUpSuccess(user);
      })
      .catch((error) => {
        alert(error.message);
        signUpFailure();
      });
  };

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{ backgroundColor: "white", minHeight: windowHeight }}
    >
      <ScrollView style={theme.pageContainer}>
        <View style={theme.globalMargins}>
          <StatusBar style="auto" />
          <KeyboardAvoidingView behavior="padding">
            <View id="signupInputs">
              <View id="firstNameInput">
                <Text
                  style={[theme.textInputLabel, styleVariables.fontSizes.body]}
                >
                  First name
                </Text>
                <TextInput
                  placeholder="John"
                  value={firstName}
                  onChangeText={(text) => setFirstName(text)}
                  style={[theme.textInput, styleVariables.fontSizes.body]}
                />
              </View>
              <View id="lastNameInput">
                <Text
                  style={[theme.textInputLabel, styleVariables.fontSizes.body]}
                >
                  Last Name
                </Text>
                <TextInput
                  placeholder="Doe"
                  value={lastName}
                  onChangeText={(text) => setLastName(text)}
                  style={[theme.textInput, styleVariables.fontSizes.body]}
                />
              </View>

              <View id="unitNumberInput">
                <Text
                  style={[theme.textInputLabel, styleVariables.fontSizes.body]}
                >
                  Unit number
                </Text>
                <TextInput
                  placeholder="1234"
                  value={unitNumber}
                  onChangeText={(text) => setUnitNumber(text)}
                  style={[theme.textInput, styleVariables.fontSizes.body]}
                />
              </View>

              <View id="buildingSelect">
                <Text
                  style={[theme.textInputLabel, styleVariables.fontSizes.body]}
                >
                  Building Address
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    changeModalVisibility(true);
                  }}
                >
                  <Text
                    style={[
                      theme.textInput,
                      styleVariables.fontSizes.body,
                      { color: "#00000080" },
                    ]}
                  >
                    {buildingAddress}
                  </Text>
                </TouchableOpacity>
              </View>

              <Modal
                id="buildingSelectModal"
                transparent={true}
                animationType="fade"
                visible={modalVisible}
                nRequestClose={() => {
                  changeModalVisibility(false);
                }}
              >
                <ModalPicker
                  changeModalVisibility={changeModalVisibility}
                  setData={setData}
                />
              </Modal>

              <View id="emailInput">
                <Text
                  style={[theme.textInputLabel, styleVariables.fontSizes.body]}
                >
                  Email
                </Text>
                <TextInput
                  placeholder="name@company.com"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                  }}
                  style={[theme.textInput, styleVariables.fontSizes.body]}
                />
              </View>
              <View id="passwordInput">
                <Text
                  style={[theme.textInputLabel, styleVariables.fontSizes.body]}
                >
                  Password
                </Text>
                <TextInput
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  secureTextEntry
                  style={[theme.textInput, styleVariables.fontSizes.body]}
                />
              </View>
            </View>

            <View id="signupCTA">
              <TouchableOpacity onPress={handleSignup}>
                <View style={[theme.primaryButton, { marginTop: 17 }]}>
                  <Text
                    style={[
                      theme.primaryButtonText,
                      styleVariables.fontSizes.bodyBold,
                    ]}
                  >
                    Signup
                  </Text>
                </View>
              </TouchableOpacity>

              <Text style={{ textAlign: "center" }}>
                <Text style={styleVariables.fontSizes.callout}>
                  Upon sign up, you accept our terms & conditions outlined in
                  our
                </Text>
                <Text
                  style={[
                    styleVariables.fontSizes.calloutBold,
                    { color: styleVariables.colors.primary },
                  ]}
                >
                  {" "}
                  terms of use and privacy policy
                </Text>
              </Text>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

export default Signup;
