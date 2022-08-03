import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../ThemeContext";

// Import Required functions from FireStore
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const auth = getAuth();

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      alert("Password reset link sent!");
      navigation.goBack();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const { theme, styleVariables } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: styleVariables.colors.white }}>
      <StatusBar style="auto" />

      <View
        style={[
          theme.globalMargins,
          {
            display: "flex",
            justifyContent: "flex-start",
            paddingTop: 27,
            paddingBottom: 34,
            flex: 1,
          },
        ]}
      >
        {/* pageContent */}
        <View id="pageContent">
          <Text
            style={[
              styleVariables.fontSizes.body,
              { color: styleVariables.colors.black, marginBottom: 34 },
            ]}
          >
            Enter your email address and we'll send you a link to reset your
            password.
          </Text>

          {/* textInput */}
          <View id="emailInput">
            <Text style={[theme.textInputLabel, styleVariables.fontSizes.body]}>
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
        </View>

        {/* submitEmailButton */}
        <TouchableOpacity
          id="sendResetEmail"
          onPress={handleReset}
          style={theme.primaryButton}
        >
          <Text
            style={[theme.primaryButtonText, styleVariables.fontSizes.bodyBold]}
          >
            Send link
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPassword;
