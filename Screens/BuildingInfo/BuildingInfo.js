import React from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppContext } from "../../Context/AppContext";

// Import DB from Firestore config file
import { db } from "../../firebase-config";

// Import required functions
import { collection } from "@firebase/firestore";
// import { compact } from "lodash";

const BuildingInfo = () => {
  const { currentUserBuilding } = useAppContext();

  const { theme, styleVariables } = useTheme();

  // const makePhoneCall = () => {
  // 	let phoneNumber = "";
  // 	if (Platform.OS !== "android") {
  // 		phoneNumber = `telprompt:${phone}`;
  // 	} else {
  // 		phoneNumber = `tel:${phone}`;
  // 	}
  // 	Linking.canOpenURL(phoneNumber)
  // 		.then((supported) => {
  // 			if (!supported) {
  // 				Alert.alert("Phone number is not available");
  // 			} else {
  // 				return Linking.openURL(phoneNumber);
  // 			}
  // 		})
  // 		.catch((err) => console.log(err));
  // };
  return (
    <ScrollView style={theme.pageContainer}>
      <StatusBar style="dark" />
      <View style={theme.globalMargins}>
        <View
          id="buildingInfoCard"
          style={[
            theme.cardContainer,
            { alignItems: "center", marginHorizontal: 0 },
          ]}>
          <Image
            style={theme.buildingImagePreview}
            source={require("../../assets/icon.png")}
          />
          <View
            id="buildingInfoAddress"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: "row",
              width: "100%",
              marginTop: 17,
            }}>
            <Text
              style={[
                styleVariables.fontSizes.header,
                styles.buildingName,
                { color: styleVariables.colors.black },
              ]}>
              {currentUserBuilding.buildingName}
            </Text>
            <MaterialCommunityIcons
              name="arrow-top-right"
              size={32}
              style={{ height: 32 }}
              color={styleVariables.colors.primary}
            />
          </View>
          <View
            id="buildingInfoLocation"
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              width: "100%",
              marginTop: 6,
              marginBottom: 4,
            }}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={18}
              color={styleVariables.colors.primary}
              style={{ marginRight: 8, height: 18 }}
            />
            <Text
              style={[
                styleVariables.fontSizes.body,
                { color: styleVariables.colors.primary },
              ]}>
              {currentUserBuilding.buildingAddress.slice(-19, -1)}
            </Text>
          </View>
        </View>
        <View id="contacts" style={{ marginTop: 17, padding: 17 }}>
          <Text
            style={[
              styleVariables.fontSizes.secondaryHeader,
              { marginBottom: 14, color: styleVariables.colors.black },
            ]}>
            Contacts
          </Text>
          {/* TODO: build the list dynamically using admin data */}
          {/* <View style={{ display: "none" }}>
						<Text
							style={[styleVariables.fontSizes.title, { marginBottom: 10 }]}>
							{currentUserBuilding.fullName}
						</Text>
						<View
							style={{
								display: "flex",
								alignContent: "center",
								flexDirection: "row",
								width: "100%",
								marginTop: 6,
								marginBottom: 4,
								opacity: 0.66,
							}}>
							<MaterialCommunityIcons
								name="email-outline"
								size={18}
								color={styleVariables.colors.primary}
								style={{ marginRight: 8 }}
							/>
							<TouchableOpacity
								onPress={() => Linking.openURL(`mailto:${email}`)}>
								<Text
									style={[
										styleVariables.fontSizes.body,
										{ color: styleVariables.colors.primary },
									]}>
									{currentUserBuilding.email}
								</Text>
							</TouchableOpacity>
						</View>
						<View
							style={{
								display: "flex",
								alignContent: "center",
								flexDirection: "row",
								width: "100%",
								marginTop: 6,
								marginBottom: 4,
								opacity: 0.66,
							}}>
							<MaterialCommunityIcons
								name="phone-outline"
								size={18}
								color={styleVariables.colors.primary}
								style={{ marginRight: 8 }}
							/>
							<TouchableOpacity onPress={makePhoneCall}>
								<Text
									style={[
										styleVariables.fontSizes.body,
										{ color: styleVariables.colors.primary },
									]}>
									{currentUserBuilding.phone}
								</Text>
							</TouchableOpacity>
						</View>
					</View> */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buildingName: {
    // maxWidth: "80%",
    width: "auto",
  },
});

export default BuildingInfo;
