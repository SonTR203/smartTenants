import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Linking,
  Alert,
  StyleSheet,
  Keyboard,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { collection, getDocs, addDoc, Timestamp } from "@firebase/firestore";
import { useTheme } from "../../ThemeContext";
import { db } from "../../firebase-config";
import { getItemById, handleSignIn } from "../../utils/firebase.services";
import { getAuth, signOut } from "firebase/auth";
import LoadingIndicator from "../../components/LoadingIndicator";

/* The login screen allows registered users to login to app as well directing prospective tenants to the Smart Living  residential portal to browse its current listings */
const Login = ({ navigation, route }) => {
  const auth = getAuth();
  const { theme, styleVariables } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // clear the text inputs when the screen is navigated to
  useEffect(() => {
    if (route.params && route.params.reload) {
      setEmail("");
      setPassword("");
    }
  }, [route.params]);

  useEffect(() => {
    const showKeyboard = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardOpen(true);
    });
    const hideKeyboard = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardOpen(false);
    });

    return () => {
      showKeyboard.remove();
      hideKeyboard.remove();
    };
  }, []);

  /* This function logs the user to the application only if he/she * is registered on Firebase as an authenticated registered user.
   * inputs: none
   * outputs: return the undefined (the default for JS functions)
   */
  const handleLogin = async () => {
    setLoading(true);
    const userUID = await handleSignIn(email, password);
    if (userUID) {
      findUser(userUID);
    } else {
      setLoading(false);
    }
  };

  /* This function gets the logged in user data from Firebase and  * navigates him/her to to the Newsfeed screen (Home screen) if * * authorized or to the Account Approval Pending screen if not
   * yet approved by an Admin.
   * inputs: authenticated user object From Firebase
   * outputs: sets the current user object as the Logged in user as stored as per stored data on Firebase
   */
  const findUser = async (uid) => {
    const userData = await getItemById("Tenants", uid);
    if (userData) {
      setLoading(false);
      if (userData.isActive !== true) {
        Alert.alert(
          "Your account has been deactivated. Please contact your administrator for more information."
        );
        signOut(auth);
      } else {
        if (userData.tenantAuthorized === true) {
          navigation.navigate("Newsfeed");
        } else {
          createNotificationCollection(userData);
          navigation.navigate("AccountApprovalPending");
        }
      }
    } else {
      alert("User not found");
    }
  };

  /* This function creates notifications for the logged in user   * and stores them on Firebase
   *inputs: logged in user object
   *outputs: notification doc object on Firebase
   */
  const createNotificationCollection = async (loggedInUser) => {
    const colRef = collection(
      db,
      `Tenants/${loggedInUser.userID}/Notifications`
    );
    let data = await getDocs(colRef);
    if (data.docs.length == 0) {
      await addDoc(colRef, {
        content:
          "Thanks for signing up! On behalf of the Smart Living Properties Team: Welcome.",
        postID: "",
        userID: loggedInUser.userID,
        wasSeen: true,
        timestamp: Timestamp.fromDate(new Date()),
      });
    }
  };

  const styles = StyleSheet.create({
    buttonActive: {
      opacity: 1,
    },
    buttonInactive: {
      opacity: 0.5,
    },
    logoShrunk: {
      transform: [{ scale: 0.5 }],
    },
  });

  return (
    <SafeAreaView style={{ backgroundColor: styleVariables.colors.white }}>
      <LoadingIndicator visible={loading} />
      <View style={theme.pageContainer}>
        <StatusBar style="auto" />
        <KeyboardAvoidingView
          behavior="padding"
          style={[theme.fullHeight, { justifyContent: "space-evenly" }]}
        >
          {/* Logo image */}
          <View style={[theme.container, {}]}>
            <Image
              source={require("../../assets/SmartLiving_Logo.png")}
              style={[
                {
                  width: 187,
                  height: 111,
                  margin: "auto",
                },
                keyboardOpen && styles.logoShrunk,
              ]}
              resizeMode="contain"
            />
          </View>

          <View id="LoginContainer" style={theme.globalMargins}>
            {/* textInput */}
            <View id="emailInput">
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Email
              </Text>
              <TextInput
                placeholderTextColor={styleVariables.colors.placeholderText}
                placeholder="name@email.com"
                value={email}
                onChangeText={(text) => setEmail(text)}
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
                placeholder="••••••••••"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>

            {/* forgotPassword */}
            <View
              id="forgotPassword"
              style={[
                theme.container,
                { alignItems: "flex-start", marginBottom: 32 },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ForgotPassword");
                }}
              >
                <Text
                  style={[
                    styleVariables.fontSizes.calloutBold,
                    {
                      color: styleVariables.colors.primary,
                    },
                  ]}
                >
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* loginButton */}
            <View
              style={[
                email && password ? styles.buttonActive : styles.buttonInactive,
              ]}
            >
              <TouchableOpacity
                id="loginButton"
                onPress={handleLogin}
                style={[
                  theme.primaryButton,
                  {
                    flexDirection: "row",
                  },
                ]}
              >
                <Text
                  style={[
                    theme.primaryButtonText,
                    styleVariables.fontSizes.bodyBold,
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>

            {/* no account CTA */}
            <View
              id="noAccountCTA"
              style={[
                theme.container,
                { flexDirection: "row", marginBottom: 8 },
              ]}
            >
              <Text
                style={[
                  styleVariables.fontSizes.callout,
                  { color: styleVariables.colors.black },
                ]}
              >
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Signup");
                }}
              >
                <Text
                  style={[
                    styleVariables.fontSizes.calloutBold,
                    { color: styleVariables.colors.primary },
                  ]}
                >
                  Sign up here
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* BrowseListingsRedirect */}
          <View
            id="browseListingsRedirect"
            style={[
              theme.container,
              theme.globalMargins,
              { marginTop: 34, marginBottom: 8 },
            ]}
          >
            <Text style={[styleVariables.fontSizes.callout, { opacity: 0.66 }]}>
              Looking to be one of our future tenants?
            </Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL("https://www.smartlivingproperties.ca/");
              }}
            >
              <Text
                style={[
                  styleVariables.fontSizes.calloutBold,
                  { color: styleVariables.colors.primary },
                ]}
              >
                Browse our current listings
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default Login;
