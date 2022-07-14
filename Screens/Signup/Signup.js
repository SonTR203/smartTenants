//https://www.youtube.com/watch?v=aSOsfpsMriI
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { setDoc, doc, Timestamp } from "@firebase/firestore";
import { db } from "../../firebase-config";
import ModalPicker from "../../components/ModalBuildingPicker";
import { useTheme } from "../../ThemeContext";
import { StatusBar } from "expo-status-bar";
import { uploadExpoPushToken } from "../../utils/firebase.services";
import * as Progress from "react-native-progress";
import ErrorArea from "../../components/SignUp/ErrorArea";

const auth = getAuth();

/* New users sign up screen. Users get authorized by Firebase then
 * an admin approve their request before they are allowed to the
 * home screen (Newsfeed) */
const Signup = ({ navigation }) => {
  const scrollViewRef = useRef();
  const { theme, styleVariables } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [buildingAddress, setBuildingAddress] = useState("Select building");
  const [buildingName, setBuildingName] = useState("");
  const [buildingID, setBuildingID] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [unitNumber, setUnitNumber] = useState("");
  const [tenantAuthorized] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const changeModalVisibility = (bool) => {
    setModalVisible(bool);
  };

  /*This function extracts user's building address data and formats it for the user's object building address property
   *inputs:building object
   *outputs building ID property value
   */

  const setData = (building) => {
    setBuildingAddress(building.buildingAddress.stringValue);
    setBuildingName(building.buildingName.stringValue);
    setBuildingID(building.id);
  };

  /* This function validates inputs of the sign up screen not to be  *empty and prompts the user to enter data into empty fields *inputs: none
   *outputs: alert messages for empty fields
   */
  const checkTextInputs = () => {
    if (!firstName.trim()) {
      setErrorText("Please enter your First Name.");
      return false;
    } else if (!lastName.trim()) {
      setErrorText("Please enter your Last Name.");
      return false;
    } else if (!unitNumber.trim() || isNaN(unitNumber.trim())) {
      console.log(+unitNumber);
      setErrorText("Please enter a Unit Number.");
      return false;
    } else if (!buildingID.trim()) {
      setErrorText("Please enter your Building Id.");
      return false;
    } else if (!email) {
      setErrorText("Please enter your Email Address.");
      return false;
    } else if (!password) {
      setErrorText("Please enter your Password, at least 6 characters.");
      return false;
    }
    return true;
  };

  /* This function stores new user object on Firebase database *inputs: user object
   *outputs: a user object document stored on Firebase
   */

  async function createNewUser(user) {
    try {
      await setDoc(doc(db, "Tenants", user.uid), {
        userID: user.uid,
        firstName,
        lastName,
        buildingID,
        buildingAddress,
        buildingName,
        email,
        unitNumber: parseInt(unitNumber),
        tenantAuthorized,
        userProfileImage: "",
        isActive: true,
        timestamp: Timestamp.fromDate(new Date()),
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
    uploadExpoPushToken(user);
    navigation.navigate("AccountApprovalPending");
  }

  /* This function alerts the user to failure of the sign up process *inputs: none
   *outputs: alert message
   */

  function signUpFailure(message) {
    switch (message.code) {
      case "auth/email-already-in-use":
        setErrorText(
          "An account with this email address already exists. Please, go back to sign in instead."
        );
        break;
      case "auth/invalid-email":
        setErrorText("Invalid Email.");
        break;
      case "auth/too-many-requests":
        setErrorText("Too many requests. Please try again later.");
        break;
      case "auth/weak-password":
        setErrorText("Password needs to be more than 6 characters.");
        break;
      default:
        setErrorText("Sign Up Failed. Please try again later.");
        break;
    }

    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  }

  /* This function handles the entire sign up process in conjunction *with the nested functions ensuring the user is registered on *Firebase
   *inputs: none
   *outputs: either undefined or an alert message depending on the *error
   */
  const handleSignup = () => {
    if (!checkTextInputs()) {
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      return;
    }
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        signUpSuccess(user);
      })
      .catch((error) => {
        signUpFailure(error);
        signOut(auth);
      });
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          style={[theme.pageContainer, theme.globalMargins]}
        >
          <StatusBar style="auto" />
          <ErrorArea errorText={errorText} />
          <View id="signupInputs">
            <View id="firstNameInput">
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                First Name
              </Text>
              <TextInput
                placeholderTextColor={styleVariables.colors.placeholderText}
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
                placeholderTextColor={styleVariables.colors.placeholderText}
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
                placeholderTextColor={styleVariables.colors.placeholderText}
                keyboardType="numeric"
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
                placeholderTextColor={styleVariables.colors.placeholderText}
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
                placeholderTextColor={styleVariables.colors.placeholderText}
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
              <View
                style={[
                  theme.primaryButton,
                  {
                    marginTop: 17,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Text
                  style={[
                    theme.primaryButtonText,
                    styleVariables.fontSizes.bodyBold,
                  ]}
                >
                  Sign Up
                </Text>
                {loading && (
                  <Progress.CircleSnail
                    style={{
                      marginLeft: 17,
                    }}
                    strokeCap="square"
                    thickness={2.2}
                    size={20}
                    color={"white"}
                  />
                )}
              </View>
            </TouchableOpacity>

            <Text
              style={[
                styleVariables.fontSizes.callout,
                { textAlign: "center", marginBottom: 50 },
              ]}
            >
              Upon sign up, you accept our terms & conditions outlined in our
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;
