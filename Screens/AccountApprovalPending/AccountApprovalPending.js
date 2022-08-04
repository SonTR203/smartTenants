import React from "react";
import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../ThemeContext";
import { getAuth, signOut } from "firebase/auth";
const windowWidth = Dimensions.get("window").width;

function AccountApprovalPending({ navigation }) {
  const { theme, styleVariables } = useTheme();
  const auth = getAuth();

  // log out if user is unauthorized
  const handleGoBack = () => {
    navigation.navigate("Login");
    signOut(auth);
  };

  return (
    <View style={{ flex: 1, backgroundColor: styleVariables.colors.white }}>
      <StatusBar style="auto" />

      <View
        style={[
          theme.globalMargins,
          {
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 27,
            paddingBottom: 34,
            flex: 1,
          },
        ]}
      >
        {/* pageContent */}
        <View id="pageContent">
          <View id="textContent">
            <Text
              style={[
                styleVariables.fontSizes.header,
                { color: styleVariables.colors.primary, marginBottom: 17 },
              ]}
            >
              Account pending approval
            </Text>
            <Text
              style={[
                styleVariables.fontSizes.body,
                { color: styleVariables.colors.black, marginBottom: 68 },
              ]}
            >
              Your information has been received. Your account will be approved
              momentarily.
            </Text>
          </View>
          <Image
            source={require("../../assets/undraw_fill_form.png")}
            style={{
              width: windowWidth - 68,
              height: (windowWidth - 68) / 1.5,
              marginHorizontal: 17,
            }}
          />
        </View>

        {/* backButton */}
        <TouchableOpacity
          id="backButton"
          onPress={handleGoBack}
          style={[
            theme.secondaryButton,
            { borderColor: styleVariables.colors.primary },
          ]}
        >
          <Text
            style={[
              theme.secondaryButtonText,
              styleVariables.fontSizes.bodyBold,
            ]}
          >
            Back to Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default AccountApprovalPending;
