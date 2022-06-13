import React from "react";
import { StyleSheet, View, Text, Pressable, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function ListHeader({ styleVariables, theme, navigation }) {
  const styles = StyleSheet.create({
    container: { flex: 1 },
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
    <View style={styles.container}>
      {/* announcements */}
      <View style={theme.firstListItem}>
        <View id="topCard" style={[theme.topCard, styles.topCard]}>
          <Pressable
            id="announcements"
            onPress={() => {
              navigation.navigate("Announcements");
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
