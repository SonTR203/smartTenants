//https://www.youtube.com/watch?v=aSOsfpsMriI
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "../../../../ThemeContext";
import { StatusBar } from "expo-status-bar";
import {
  verifyPassword,
  updateUserPassword,
} from "../../../../utils/firebase.services";
import LoadingIndicator from "../../../../components/LoadingIndicator";
import ErrorArea from "../../../../components/SignUp/ErrorArea";
import PasswordToggle from "../../../../components/PasswordToggle";

const EditEmailInfo = ({ navigation }) => {
  const { theme, styleVariables } = useTheme();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [currentPasswordSecure, setCurrentPasswordSecure] = useState(true);
  const [newPasswordSecure, setNewPasswordSecure] = useState(true);
  const [confirmPasswordSecure, setConfirmPasswordSecure] = useState(true);

  // Check if passwords matches
  const checkPasswords = () => {
    return (
      newPassword === confirmPassword &&
      newPassword !== "" &&
      confirmPassword !== ""
    );
  };

  const handleSaveSuccess = () => {
    setIsLoading(false);
    navigation.navigate("EditProfile", {
      saveModal: true,
      modalType: "success",
      message: "Changes saved",
    });
  };

  const updatePassword = async () => {
    setIsLoading(true);
    const message = await updateUserPassword(newPassword);
    switch (message) {
      case "Firebase: Password should be at least 6 characters (auth/weak-password).":
        setErrorText("Password must be at least 6 characters");
        break;
      case "success":
        handleSaveSuccess();
        break;
    }
  };

  const styles = StyleSheet.create({
    profileLoading: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 85,
      width: 85,
      borderRadius: 18,
    },
    buttonDisabled: {
      backgroundColor: "#748E94",
    },
  });

  // Reset error message whenever the user starts typing the password again
  useEffect(() => {
    setErrorText("");
  }, [password]);

  useEffect(() => {
    if (checkPasswords() === true) return setButtonDisabled(false);
    setButtonDisabled(true);
  }, [newPassword, confirmPassword]);
  return (
    <SafeAreaView edges={["top"]}>
      <LoadingIndicator visible={isLoading} />
      <View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flex: 1,
            justifyContent: "space-between",
          }}
          style={[
            theme.pageContainer,
            theme.globalMargins,
            {
              height: "100%",
            },
          ]}
        >
          <StatusBar style="dark" />
          <View>
            <View>
              <ErrorArea errorText={errorText} />
              <View id="passwordCurrentInput">
                <Text
                  style={[
                    theme.textInputLabel,
                    styleVariables.fontSizes.calloutBold,
                  ]}
                >
                  Current password
                </Text>
                <View style={theme.passwordView}>
                  <TextInput
                    onChangeText={(text) => setPassword(text)}
                    placeholderTextColor={styleVariables.colors.placeholderText}
                    placeholder="*******"
                    secureTextEntry={currentPasswordSecure}
                    //================================= will need to research how to do this SAFELY ==========================
                    style={[theme.textInput, styleVariables.fontSizes.body]}
                  />
                  <PasswordToggle
                    passwordSecure={currentPasswordSecure}
                    setPasswordSecure={setCurrentPasswordSecure}
                  />
                </View>
              </View>
            </View>
            <View>
              <View id="passwordNewInput">
                <Text
                  style={[
                    theme.textInputLabel,
                    styleVariables.fontSizes.calloutBold,
                  ]}
                >
                  New password
                </Text>
                <View style={theme.passwordView}>
                  <TextInput
                    onChangeText={(text) => setNewPassword(text)}
                    placeholderTextColor={styleVariables.colors.placeholderText}
                    placeholder="*******"
                    secureTextEntry={newPasswordSecure}
                    //================================= will need to research how to do this SAFELY ==========================
                    style={[theme.textInput, styleVariables.fontSizes.body]}
                  />
                  <PasswordToggle
                    passwordSecure={newPasswordSecure}
                    setPasswordSecure={setNewPasswordSecure}
                  />
                </View>
              </View>
            </View>
            <View>
              <View id="passwordConfirmInput">
                <Text
                  style={[
                    theme.textInputLabel,
                    styleVariables.fontSizes.calloutBold,
                  ]}
                >
                  Confirm password
                </Text>
                <View style={theme.passwordView}>
                  <TextInput
                    onChangeText={(text) => setConfirmPassword(text)}
                    placeholderTextColor={styleVariables.colors.placeholderText}
                    placeholder="*******"
                    secureTextEntry={confirmPasswordSecure}
                    //================================= will need to research how to do this SAFELY ==========================
                    style={[theme.textInput, styleVariables.fontSizes.body]}
                  />
                  <PasswordToggle
                    passwordSecure={confirmPasswordSecure}
                    setPasswordSecure={setConfirmPasswordSecure}
                  />
                </View>
              </View>
            </View>
          </View>
          {/* save button */}
          <TouchableOpacity
            id="save"
            disabled={buttonDisabled}
            onPress={() => {
              verifyPassword(password, updatePassword, setErrorText);
            }}
          >
            <View
              style={[
                theme.primaryButton,
                { margin: 0, shadowColor: "#fff" },
                buttonDisabled === true ? styles.buttonDisabled : null,
              ]}
            >
              <Text
                style={[
                  theme.primaryButtonText,
                  styleVariables.fontSizes.bodyBold,
                ]}
              >
                Save
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EditEmailInfo;
