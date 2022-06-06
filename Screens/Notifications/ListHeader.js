import React from "react";
import { StyleSheet, View, Text, Pressable, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppContext } from "../../Context/AppContext";

function ListHeader({ navigation, styleVariables, theme }) {
  const { currentUser } = useAppContext();

  const styles = StyleSheet.create({
    pageTitle: {
      color: styleVariables.colors.white,
      marginBottom: 4,
    },
    buildingInfo: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      opacity: 0.66,
    },
    buildingInfoText: { color: styleVariables.colors.white },
    topCard: { elevation: Platform.OS === "android" ? 0 : 20 },
    cardButton: { marginTop: 17, marginBottom: 17 },
    cardButtonBottom: { marginTop: 0, marginBottom: 17 },
    dividerContainer: { width: "100%", alignItems: "center" },
    divider: {
      height: 1.5,
      width: "66%",
      backgroundColor: styleVariables.colors.primary,
      opacity: 0.33,
      borderRadius: 99,
      marginBottom: 17,
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <View id="header" style={theme.header}>
        {/* headerPageTitle */}
        <Text
          id="headerPageTitle"
          style={[styleVariables.fontSizes.header, styles.pageTitle]}
        >
          Notifications
        </Text>
        {/* buildingInfo */}
        <Pressable
          id="buildingInfo"
          onPress={() => {
            navigation.navigate("BuildingInfo");
          }}
          style={styles.buildingInfo}
        >
          <Text
            style={[styleVariables.fontSizes.body, styles.buildingInfoText]}
          >
            {currentUser.buildingAddress}
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={styleVariables.colors.white}
          />
        </Pressable>
      </View>

      {/* announcements */}
      <View style={theme.firstListItem}>
        <View id="topCard" style={[theme.topCard, styles.topCard]}>
          <Pressable
            id="announcements"
            onPress={() => {
              alert("navigate to announcements (not yet implemented)");
            }}
            style={[theme.cardButton, styles.cardButton]}
          >
            <Text
              style={[
                styleVariables.fontSizes.title,
                { color: styleVariables.colors.primary },
              ]}
            >
              Announcements
            </Text>
            <View id="counter" style={theme.counter}>
              <Text
                id="notificationCounter"
                style={[
                  theme.notificationCounter,
                  styleVariables.fontSizes.callout,
                  { color: styleVariables.colors.white },
                ]}
              >
                2
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={styleVariables.colors.primary}
              />
            </View>
          </Pressable>
        </View>
      </View>

      {/* notices */}
      <View id="secondTopCard">
        <Pressable
          id="notices"
          onPress={() => {
            alert("navigate to notices (not yet implemented)");
          }}
          style={[theme.cardButton, styles.cardButtonBottom]}
        >
          <Text
            style={[
              styleVariables.fontSizes.title,
              { color: styleVariables.colors.primary },
            ]}
          >
            Notices
          </Text>
          <View id="counter" style={theme.counter}>
            <Text
              id="notificationCounter"
              style={[
                theme.notificationCounter,
                styleVariables.fontSizes.callout,
                { color: styleVariables.colors.white },
              ]}
            >
              1
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={styleVariables.colors.primary}
            />
          </View>
        </Pressable>
      </View>

      {/* divider */}
      <View id="divider" style={styles.dividerContainer}>
        <View style={styles.divider} />
      </View>
    </View>
  );
}

export default ListHeader;
