import React, { memo } from "react";
import { View, Text, Pressable, Platform, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function ListHeader({ styleVariables, theme }) {
  const styles = StyleSheet.create({
    container: { flex: 1, marginTop: 0 },
    topCard: {
      elevation: Platform.OS == "android" ? 0 : 20,
    },
    announcementLink: {
      marginTop: 17,
      marginBottom: 22,
    },
    announcementText: { color: styleVariables.colors.primary },
    notificationCounter: {
      color: styleVariables.colors.white,
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
              alert("navigate to announcements (not yet implemented)");
            }}
            style={[theme.cardButton, styles.announcementLink]}
          >
            <Text
              style={[styleVariables.fontSizes.title, styles.announcementText]}
            >
              Announcements
            </Text>
            <View id="counter" style={theme.counter}>
              <Text
                id="notificationCounter"
                style={[
                  theme.notificationCounter,
                  styleVariables.fontSizes.callout,
                  styles.notificationCounter,
                ]}
              >
                99+
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
    </View>
  );
}

export default memo(ListHeader);
