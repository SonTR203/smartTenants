import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { getRandomGradientColor } from "../../utils/Profile/profile.services";

function DynamicProfilePicture({ user, size, borderRadius }) {
  const [randomColor, setRandomColor] = useState(getRandomGradientColor());

  useEffect(() => {
    if (user && user.userProfileImage && user.userProfileImage === "") {
      setRandomColor(getRandomGradientColor());
    }
  }, [user.userProfileImage]);

  return (
    <View>
      {user.userProfileImage !== "" ? (
        <Image
          source={{ uri: user.userProfileImage }}
          style={styles.image(size, borderRadius)}
        />
      ) : (
        <View style={styles.image(size, borderRadius)}>
          <LinearGradient
            // Background Linear Gradient
            colors={[randomColor.first, randomColor.second]}
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
  image: (size, borderRadius) => ({
    width: size,
    height: size,
    borderRadius: borderRadius,
    backgroundColor: "rgba(0,0,0,0.1)",
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
