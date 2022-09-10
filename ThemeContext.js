import { StyleSheet } from "react-native";
import { createContext, useContext } from "react";
import { Dimensions } from "react-native";

const ThemeContext = createContext();
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

function ThemeProvider(props) {
  return <ThemeContext.Provider value={{ theme, styleVariables }} {...props} />;
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error(`Not inside the ThemeContext Provider`);
  return context; //all state data and functions
}

let styleVariables = {
  colors: {
    primary: "#395E66",
    primary14: "#395E6624",
    white: "#FFF",
    black: "#4d4d4d",
    placeholderText: "rgba(157, 157, 157, 1)",
    listFooterText: "rgba(176, 191, 194, 1)",
    notificationBadge: "#E84855",
    imageLoading: "#EDEDED",
    popularOrange: "#F17300",
  },
  shadow: {
    shadowColor: "#4D4D4D", // color: #4D4D4D
    shadowOffset: {
      // no offset x, y
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15, // opacity: 0.15
    shadowRadius: 24, // radius: 24
    elevation: 5, // elevation: 5

    // the code above should be similar to the box shadow of
    //box-shadow: 0px 0px 24px rgba(77, 77, 77, 0.15);
  },
  fontSizes: {
    header: {
      fontSize: 34,
      fontFamily: "Roboto_500Medium",
      lineHeight: 41, //added line height
    },
    secondaryHeader: {
      fontSize: 28,
      fontFamily: "Roboto_500Medium",
      lineHeight: 34, //added line height
    },
    title: {
      fontSize: 22,
      fontFamily: "Roboto_500Medium",
      lineHeight: 28, //added line height
    },
    body: {
      fontSize: 17,
      fontFamily: "Roboto_400Regular",
      lineHeight: 22, //added line height
    },
    bodyBold: {
      fontSize: 17,
      fontFamily: "Roboto_500Medium",
      lineHeight: 22, //added line height
    },
    callout: {
      fontSize: 15,
      fontFamily: "Roboto_400Regular",
      opacity: 1,
      color: "#9D9D9D",
      lineHeight: 20, //added line height
    },
    calloutBold: {
      fontSize: 15,
      fontFamily: "Roboto_500Medium",
      lineHeight: 20, //added line height
    },
    cardUserName: {
      fontSize: 17,
      fontFamily: "Roboto_500Medium",
      lineHeight: 20, //added line height
      color: "#4d4d4d",
    },
  },
};

const theme = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: styleVariables.colors.black,
  },
  pageContainer: {
    backgroundColor: styleVariables.colors.white,
  },
  fullHeight: {
    display: "flex",
    minHeight: windowHeight,
  },
  globalMargins: { paddingHorizontal: 17 },
  // padding instead of margin to keep the  background color styling
  header: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: styleVariables.colors.primary,
    paddingHorizontal: 16,
    marginBottom: -24,
    paddingTop: 52,
  },
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: styleVariables.colors.white,
    padding: 17,
    borderRadius: 16,
  },
  cardContainer: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: styleVariables.colors.white,
    padding: 17,
    marginHorizontal: 17,
    marginTop: 17,
    borderRadius: 16,
    ...styleVariables.shadow,
  },
  marketplaceItemContainer: {
    backgroundColor: styleVariables.colors.white,
    marginBottom: 17,
    borderRadius: 24,
    ...styleVariables.shadow,
  },
  modalView: {
    width: windowWidth - 34,
    marginVertical: 17,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#456326",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.14,
    shadowRadius: 34,
    elevation: 20,
  },
  modalText: {
    fontSize: styleVariables.fontSizes.body.fontSize,
    fontFamily: "Roboto_400Regular",
    color: styleVariables.colors.primary,
  },
  fab: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 17,
    right: 0,
    bottom: 0,
    backgroundColor: styleVariables.colors.primary,
    height: 60,
    width: 60,
    borderRadius: 16,
    shadowColor: styleVariables.colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.33,
    shadowRadius: 21,
    elevation: 20,
  },
  imageUploadPreview: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: windowWidth - 68,
    height: windowWidth - 68,
    borderRadius: 18,
    marginBottom: 17,
  },
  buildingImagePreview: {
    width: windowWidth - 68,
    height: (windowWidth - 68) * 0.66,
    borderRadius: 16,
    shadowColor: styleVariables.colors.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.14,
    shadowRadius: 34,
  },
  textInputLabel: {
    color: "#4d4d4d",
    backgroundColor: styleVariables.colors.white,
    paddingHorizontal: 8,
    marginTop: -9,
    marginLeft: 14,
    transform: [{ translateY: 9 }],
    alignSelf: "flex-start",
    zIndex: 2,
  },
  textInput: {
    color: "#4D4D4D",
    width: "100%",
    borderColor: styleVariables.colors.primary14,
    borderWidth: 2,
    backgroundColor: styleVariables.colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 17,
    zIndex: 1,
  },
  primaryButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 16,
    backgroundColor: styleVariables.colors.primary,
    borderRadius: 18,
    marginBottom: 17,
    shadowColor: styleVariables.colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.14,
    shadowRadius: 34,
    elevation: 20,
  },
  primaryButtonText: {
    color: styleVariables.colors.white,
  },
  secondaryButton: {
    color: styleVariables.colors.primary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
    borderColor: styleVariables.colors.primary14,
    borderWidth: 2,
    borderRadius: 18,
    marginBottom: 17,
  },
  secondaryButtonText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: styleVariables.fontSizes.body.fontSize,
    fontFamily: "Roboto_400Regular",
    color: styleVariables.colors.primary,
  },
  cardButton: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "white",
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,

    ...styleVariables.shadow,
  },
  postButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
    backgroundColor: styleVariables.colors.primary,
    borderRadius: 8,
    marginBottom: 17,
    shadowColor: styleVariables.colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.14,
    shadowRadius: 34,
    elevation: 20,
  },
  postButtonIcon: {},
  counter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  notificationCounter: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: styleVariables.colors.primary,
    borderRadius: 20,
    marginRight: 14,
  },
  stackHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: styleVariables.colors.white,
    padding: 17,
  },
});

//primary color (navy/dark green): #395E66
//primary color A14% : #395E6624

export { useTheme, ThemeProvider };
