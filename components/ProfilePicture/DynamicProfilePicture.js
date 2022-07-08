import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
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
          style={{
            width: size,
            height: size,
            borderRadius: borderRadius,
            backgroundColor: "rgba(0,0,0,0.1)",
          }}
        />
      ) : (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: borderRadius,
            backgroundColor: "rgba(0,0,0,0.1)",
          }}
        >
          <LinearGradient
            // Background Linear Gradient
            colors={[randomColor.first, randomColor.second]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: size,
              borderRadius: borderRadius,
              overflow: "hidden",
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontWeight: "500",
                fontSize: 20.25,
                lineHeight: 26,
                color: "#fff",
              }}
            >
              {user.firstName.substring(0, 1)}
              {user.lastName.substring(0, 1)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default DynamicProfilePicture;
