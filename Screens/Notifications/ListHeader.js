import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import ChevronRightSVG from "../../components/Icons/ChevronRightSVG";

function ListHeader({
  styleVariables,
  theme,
  navigation,
  noticeCount,
  announcementCount,
}) {
  const styles = StyleSheet.create({
    dividerContainer: { width: "100%", alignItems: "center" },
    divider: {
      height: 1.5,
      width: "50%",
      backgroundColor: "#B0BFC2",
      opacity: 1,
      marginBottom: 16,
    },
  });

  return (
    <View>
      {/* announcements */}
      <View
        style={{
          marginTop: 16,
        }}
      >
        <Pressable
          onPress={() => {
            navigation.navigate("Announcements", {
              announcementId: null,
            });
          }}
          style={theme.cardButton}
        >
          <Text
            style={[
              styleVariables.fontSizes.title,
              { color: styleVariables.colors.primary },
            ]}
          >
            Announcements
          </Text>
          <View
            id="counter"
            // style={}
          >
            {announcementCount > 0 && (
              <Text
                id="notificationCounter"
                style={[
                  theme.notificationCounter,
                  styleVariables.fontSizes.callout,
                  { color: styleVariables.colors.white },
                ]}
              >
                {announcementCount}
              </Text>
            )}
            <ChevronRightSVG stroke="#395E66" />
          </View>
        </Pressable>
      </View>

      {/* notices */}
      <View id="secondTopCard">
        <Pressable
          id="notices"
          onPress={() => {
            navigation.navigate("Notices", {
              noticeId: null,
            });
          }}
          style={theme.cardButton}
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
            {noticeCount > 0 && (
              <Text
                id="notificationCounter"
                style={[
                  theme.notificationCounter,
                  styleVariables.fontSizes.callout,
                  { color: styleVariables.colors.white },
                ]}
              >
                {noticeCount}
              </Text>
            )}
            <ChevronRightSVG stroke="#395E66" />
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
