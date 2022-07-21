import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "../../ThemeContext";
import { useAppContext } from "../../Context/AppContext";

function TermsAndConditions({ navigation }) {
  const { theme, styleVariables } = useTheme();
  const { termsRead, setTermsRead } = useAppContext();

  const hasReachedBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const bottomPadding = 30;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - bottomPadding
    );
  };

  return (
    <View
      style={[
        theme.globalMargins,
        { flex: 1, backgroundColor: styleVariables.colors.white },
      ]}
    >
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (hasReachedBottom(nativeEvent) && !termsRead) {
            console.log("user has reached bottom of page");
            setTermsRead(true);
          }
        }}
        scrollEventThrottle={400}
      >
        <Text style={[styleVariables.fontSizes.header, { marginBottom: 20 }]}>
          Lorem Ipsum
        </Text>
        <Text style={[styleVariables.fontSizes.body, { marginBottom: 40 }]}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>
        <Text style={[styleVariables.fontSizes.body, { marginBottom: 40 }]}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>
        <Text style={[styleVariables.fontSizes.body, { marginBottom: 40 }]}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>
        <Text style={[styleVariables.fontSizes.body, { marginBottom: 40 }]}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Signup");
          }}
          style={{
            paddingBottom: 30,
          }}
        >
          {termsRead ? (
            <View
              style={[
                theme.primaryButton,
                {
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <Text
                style={[
                  styleVariables.fontSizes.bodyBold,
                  theme.primaryButtonText,
                ]}
              >
                I Understand
              </Text>
            </View>
          ) : (
            <View
              style={[
                theme.primaryButton,
                {
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.5,
                },
              ]}
            >
              <Text
                style={[
                  styleVariables.fontSizes.bodyBold,
                  theme.primaryButtonText,
                ]}
              >
                I Understand
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default TermsAndConditions;
