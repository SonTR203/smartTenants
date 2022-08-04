import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import ChevronRightSVG from "../../components/Icons/ChevronRightSVG";

function ListHeader({
  styleVariables,
  theme,
  navigation,
  noticeCount,
  announcementCount,
  setNoticeCount,
  setAnnouncementCount,
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
    marginTop: {
      marginTop: 16,
    },
  });

  const handlePressAnnouncements = () => {
    navigation.navigate("Announcements", {
      announcementId: null,
      setAnnouncementCount: setAnnouncementCount,
    });
  };

  const handlePressNotices = () => {
    navigation.navigate("Notices", {
      noticeId: null,
      setNoticeCount: setNoticeCount,
    });
  };

  return (
    <View>
      {/* announcements */}
      <View style={styles.marginTop}>
        <Pressable onPress={handlePressAnnouncements} style={theme.cardButton}>
          <Text
            style={[
              styleVariables.fontSizes.title,
              { color: styleVariables.colors.primary },
            ]}
          >
            Announcements
          </Text>
          <View id="counter" style={theme.counter}>
            {announcementCount > 0 && (
              <View style={theme.notificationCounter}>
                <Text
                  id="notificationCounter"
                  style={[
                    styleVariables.fontSizes.callout,
                    { color: styleVariables.colors.white },
                  ]}
                >
                  {announcementCount}
                </Text>
              </View>
            )}
            <ChevronRightSVG stroke="#395E66" />
          </View>
        </Pressable>
      </View>

      {/* notices */}
      <View id="secondTopCard">
        <Pressable
          id="notices"
          onPress={handlePressNotices}
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
              <View style={theme.notificationCounter}>
                <Text
                  id="notificationCounter"
                  style={[
                    styleVariables.fontSizes.callout,
                    { color: styleVariables.colors.white },
                  ]}
                >
                  {noticeCount}
                </Text>
              </View>
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
