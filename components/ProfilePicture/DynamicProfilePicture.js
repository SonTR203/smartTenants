import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useTheme } from "../../ThemeContext";

function DynamicProfilePicture({ user, size, borderRadius }) {
  const [defaultColor, setDefaultColor] = useState(null);
  const { styleVariables } = useTheme();

  useEffect(() => {
    if (user && user.colors) {
      setDefaultColor(user.colors);
    }
  }, [user]);

  if (!defaultColor) {
    return null;
  }

  return (
    <View>
      {user.userProfileImage !== "" ? (
        <Image
          source={{ uri: user.userProfileImage }}
          style={[
            styles.image(
              size,
              borderRadius,
              styleVariables.colors.imageLoading
            ),
          ]}
        />
      ) : (
        <View style={styles.image(size, borderRadius)}>
          <LinearGradient
            // Background Linear Gradient
            colors={[defaultColor.start, defaultColor.end]}
            style={styles.linearGradient(size, borderRadius)}
          />
          <View style={styles.textContainer}>
            <Text style={styles.initials}>
              {user.firstName.substring(0, 1)}
              {user.lastName.substring(0, 1)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  image: (size, borderRadius, bgColor) => ({
    width: size,
    height: size,
    borderRadius: borderRadius,
    backgroundColor: `${bgColor}`,
  }),
  linearGradient: (size, borderRadius) => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: size,
    borderRadius: borderRadius,
    overflow: "hidden",
  }),
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontWeight: "500",
    fontSize: 20.25,
    lineHeight: 26,
    color: "#fff",
  },
});

export default DynamicProfilePicture;
