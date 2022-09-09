import React, { useState } from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BottomMenuItem } from "./BottomMenuItem";

export const TabBar = ({ state, descriptors, navigation }) => {
  const totalWidth = Dimensions.get("window").width;
  const tabWidth = totalWidth / state.routes.length;
  const [translateValue] = useState(new Animated.Value(0));

  const getRouteName = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName?.includes("Login") ||
      routeName?.includes("Signup") ||
      routeName?.includes("AccountApprovalPending") ||
      routeName?.includes("ForgotPassword") ||
      routeName?.includes("TermsAndConditions") ||
      routeName?.includes("IndividualPosts")
    ) {
      return "none";
    } else if (routeName == undefined) {
      return "none";
    }
    return "flex";
  };

  const onPress = (route, isFocused) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };
  const onLongPress = (route) => {
    navigation.emit({
      type: "tabLongPress",
      target: route.key,
    });
  };

  const tap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      console.log("Yay, double tap!");
    });

  return (
    <View
      style={[
        style.tabContainer,
        { width: totalWidth, display: getRouteName(state.routes[0]) },
      ]}
    >
      <View style={{ flexDirection: "row" }}>
        <Animated.View
          style={[
            style.slider,
            {
              transform: [{ translateX: translateValue }],
              width: 42,
            },
          ]}
        />
        {state.routes.map((item, index) => {
          const { options } = descriptors[item.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : item.name;
          const isFocused = state.index === index;
          if (isFocused) {
            Animated.spring(translateValue, {
              toValue: index * tabWidth,
              velocity: 10,
              useNativeDriver: true,
            }).start();
          }

          return (
            <GestureDetector gesture={tap} key={index}>
              <TouchableOpacity
                activeOpacity={1}
                accessibilityRole="button"
                accessibilityStates={isFocused ? ["selected"] : []}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={() => onPress(item, isFocused)}
                onLongPress={() => onLongPress(item)}
                style={{
                  flex: 1,
                  marginBottom: 28,
                  marginTop: 8,
                }}
              >
                <BottomMenuItem
                  label={label.toString()}
                  isCurrent={isFocused}
                />
              </TouchableOpacity>
            </GestureDetector>
          );
        })}
      </View>
    </View>
  );
};
const style = StyleSheet.create({
  tabContainer: {
    height: "10%", // change to percentage of window height
    backgroundColor: "white",
    shadowColor: "#4D4D4D", // color: #4D4D4D
    shadowOffset: {
      // no offset x, y
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15, // opacity: 0.15
    shadowRadius: 24, // radius: 24
    elevation: 5, // elevation: 5
  },
  slider: {
    height: 4,
    position: "absolute",
    top: 0,
    left: 32,
    backgroundColor: "#395E66",
    borderRadius: 2,
  },
});
