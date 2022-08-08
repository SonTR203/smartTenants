import { Dimensions } from "react-native";

export const constants = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};

export const maxImages = 5;

export const refreshDelay = 2000;
