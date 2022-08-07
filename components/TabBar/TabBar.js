import React, { useState } from "react";
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
  return (
    <View style={[style.tabContainer, { width: totalWidth }]}>
      <View style={{ flexDirection: "row" }}>
        <Animated.View
          style={[
            style.slider,
            {
              transform: [{ translateX: translateValue }],
              width: 40,
            },
          ]}
        />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          console.log("label: ", label);
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }

            Animated.spring(translateValue, {
              toValue: index * tabWidth,
              velocity: 10,
              useNativeDriver: true,
            }).start();
          };
          const onLongPress = () => {
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
            <GestureDetector gesture={tap} key={index}>
              <TouchableOpacity
                activeOpacity={1}
                accessibilityRole="button"
                accessibilityStates={isFocused ? ["selected"] : []}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{ flex: 1 }}
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
    height: 70,
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.0,
    backgroundColor: "white",
    elevation: 10,
  },
  slider: {
    height: 4,
    position: "absolute",
    top: 0,
    left: 26,
    backgroundColor: "#395E66",
    borderRadius: 2,
  },
});
