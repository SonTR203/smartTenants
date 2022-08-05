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
  StyleSheet,
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
import ErrorArea from "../../components/SignUp/ErrorArea";
import { getRandomGradientColor } from "../../utils/Profile/profile.services";
import LoadingIndicator from "../../components/LoadingIndicator";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const auth = getAuth();

/* New users sign up screen. Users get authorized by Firebase then
 * an admin approve their request before they are allowed to the
 * home screen (Newsfeed) */
const Signup = ({ navigation }) => {
  const scrollViewRef = useRef();
  const { theme, styleVariables } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [buildingAddress, setBuildingAddress] = useState("Select building");
  const [buildingName, setBuildingName] = useState("");
  const [buildingID, setBuildingID] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [unitNumber, setUnitNumber] = useState("");
  const [tenantAuthorized] = useState(false);
  const [signupPressed, setSignupPressed] = useState(false);
  const [checkboxState, setCheckboxState] = useState(false);

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
    setBuildingAddress(building.buildingAddress);
    setBuildingName(building.buildingName);
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
    } else if (!password || password.length < 6) {
      setErrorText("Please enter your Password, at least 6 characters.");
      return false;
    } else if (password != passwordConfirm) {
      setErrorText("Your passwords do not match.");
      return false;
    } else if (!checkboxState) {
      setErrorText("Please accept the terms & conditions.");
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
        colors: getRandomGradientColor(),
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
      setSignupPressed(true);
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

  const styles = StyleSheet.create({
    inputFieldEmpty: {
      borderColor: "hsla(348, 92%, 35%, 0.5)",
    },
    inputFieldFilled: {
      borderColor: styleVariables.colors.primary14,
    },
    inputLabelEmpty: {
      color: "#AB0728",
    },
    inputLabelFilled: {
      color: styleVariables.colors.black,
    },
    buildingInput: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    terms: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 20,
    },
    termsLink: {
      color: styleVariables.colors.primary,
    },
    signUpButtonActive: {
      opacity: 1,
    },
    signUpButtonInactive: {
      opacity: 0.5,
    },
  });

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <LoadingIndicator visible={loading} />
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
                style={[
                  theme.textInputLabel,
                  styleVariables.fontSizes.body,
                  signupPressed && !firstName
                    ? styles.inputLabelEmpty
                    : styles.inputLabelFilled,
                ]}
              >
                First Name
              </Text>
              <TextInput
                placeholderTextColor={styleVariables.colors.placeholderText}
                placeholder="John"
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
                style={[
                  theme.textInput,
                  styleVariables.fontSizes.body,
                  signupPressed && !firstName
                    ? styles.inputFieldEmpty
                    : styles.inputFieldFilled,
                ]}
              />
            </View>
            <View id="lastNameInput">
              <Text
                style={[
                  theme.textInputLabel,
                  styleVariables.fontSizes.body,
                  signupPressed && !lastName
                    ? styles.inputLabelEmpty
                    : styles.inputLabelFilled,
                ]}
              >
                Last Name
              </Text>
              <TextInput
                placeholderTextColor={styleVariables.colors.placeholderText}
                placeholder="Doe"
                value={lastName}
                onChangeText={(text) => setLastName(text)}
                style={[
                  theme.textInput,
                  styleVariables.fontSizes.body,
                  signupPressed && !lastName
                    ? styles.inputFieldEmpty
                    : styles.inputFieldFilled,
                ]}
              />
            </View>

            <View id="unitNumberInput">
              <Text
                style={[
                  theme.textInputLabel,
                  styleVariables.fontSizes.body,
                  signupPressed && !unitNumber
                    ? styles.inputLabelEmpty
                    : styles.inputLabelFilled,
                ]}
              >
                Unit number
              </Text>
              <TextInput
                placeholderTextColor={styleVariables.colors.placeholderText}
                keyboardType="numeric"
                placeholder="123"
                value={unitNumber}
                onChangeText={(text) => setUnitNumber(text)}
                style={[
                  theme.textInput,
                  styleVariables.fontSizes.body,
                  signupPressed && !unitNumber
                    ? styles.inputFieldEmpty
                    : styles.inputFieldFilled,
                ]}
              />
            </View>

            <View id="buildingSelect">
              <Text
                style={[
                  theme.textInputLabel,
                  styleVariables.fontSizes.body,
                  signupPressed && !buildingID.trim()
                    ? styles.inputLabelEmpty
                    : styles.inputLabelFilled,
                ]}
              >
                Building Address
              </Text>
              <TouchableOpacity
                onPress={() => {
                  changeModalVisibility(true);
                }}
              >
                <View
                  style={[
                    theme.textInput,
                    styles.buildingInput,
                    signupPressed && !buildingID.trim()
                      ? styles.inputFieldEmpty
                      : styles.inputFieldFilled,
                  ]}
                >
                  <Text
                    style={[
                      styleVariables.fontSizes.body,
                      { color: "#00000080" },
                    ]}
                  >
                    {buildingAddress}
                  </Text>
                  <MaterialCommunityIcons
                    name={"chevron-down"}
                    size={20}
                    color={"#00000080"}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <Modal
              id="buildingSelectModal"
              transparent={true}
              animationType="slide"
              visible={modalVisible}
              onRequestClose={() => {
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
                style={[
                  theme.textInputLabel,
                  styleVariables.fontSizes.body,
                  signupPressed && !email
                    ? styles.inputLabelEmpty
                    : styles.inputLabelFilled,
                ]}
              >
                Email
              </Text>
              <TextInput
                placeholderTextColor={styleVariables.colors.placeholderText}
                placeholder="name@email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                }}
                style={[
                  theme.textInput,
                  styleVariables.fontSizes.body,
                  signupPressed && !email
                    ? styles.inputFieldEmpty
                    : styles.inputFieldFilled,
                ]}
              />
            </View>
            <View id="passwordInput">
              <Text
                style={[
                  theme.textInputLabel,
                  styleVariables.fontSizes.body,
                  signupPressed && !password
                    ? styles.inputLabelEmpty
                    : styles.inputLabelFilled,
                ]}
              >
                Password
              </Text>
              <TextInput
                placeholderTextColor={styleVariables.colors.placeholderText}
                placeholder="Minimum 6 characters"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
                style={[
                  theme.textInput,
                  styleVariables.fontSizes.body,
                  signupPressed && !password
                    ? styles.inputFieldEmpty
                    : styles.inputFieldFilled,
                ]}
              />
            </View>
            <View id="passwordConfirm">
              <Text
                style={[
                  theme.textInputLabel,
                  styleVariables.fontSizes.body,
                  signupPressed &&
                  (!passwordConfirm || password != passwordConfirm)
                    ? styles.inputLabelEmpty
                    : styles.inputLabelFilled,
                ]}
              >
                Confirm Password
              </Text>
              <TextInput
                placeholderTextColor={styleVariables.colors.placeholderText}
                placeholder="Enter new password again"
                value={passwordConfirm}
                onChangeText={(text) => setPasswordConfirm(text)}
                secureTextEntry
                style={[
                  theme.textInput,
                  styleVariables.fontSizes.body,
                  signupPressed &&
                  (!passwordConfirm || password != passwordConfirm)
                    ? styles.inputFieldEmpty
                    : styles.inputFieldFilled,
                ]}
              />
            </View>
          </View>
          <View id="termsCheckbox" style={styles.terms}>
            <BouncyCheckbox
              size={25}
              fillColor={styleVariables.colors.primary}
              iconStyle={{
                borderRadius: 4,
                borderColor: styleVariables.colors.primary,
                borderWidth: 2,
              }}
              innerIconStyle={{
                borderRadius: 4,
              }}
              isChecked={checkboxState}
              onPress={() => {
                setCheckboxState(!checkboxState);
              }}
            />
            <Text style={styleVariables.fontSizes.callout}>
              I agree with the{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("TermsAndConditions");
              }}
            >
              <Text
                style={[styleVariables.fontSizes.calloutBold, styles.termsLink]}
              >
                Terms & Conditions
              </Text>
            </TouchableOpacity>
          </View>

          <View
            id="signupCTA"
            style={[
              checkboxState
                ? styles.signUpButtonActive
                : styles.signUpButtonInactive,
            ]}
          >
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
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;
