import { React, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { useTheme } from "../../ThemeContext";

const NoticeItem = ({
  noticeContent,
  theme,
  styleVariables,
  styles,
  navigation,
}) => (
  <View id="post" style={theme.cardContainer}>
    {/* Notice Info */}
    <View id="noticeInfo" style={styles.noticeInfo}>
      <View className="imageAndName" style={styles.imageAndName}>
        <Image
          source={require("../../assets/icon.png")}
          style={styles.profileIcon}
        />
        <Text style={[styleVariables.fontSizes.bodyBold, styles.profileName]}>
          {"Smart Living Properties"}
        </Text>
      </View>
    </View>

    {/* Notice content */}
    <TouchableOpacity
      id="noticeContent"
      onPress={() => {
        navigation.navigate("IndividualNotice");
      }}
    >
      <View className="noticeTextContent">
        <Text style={[styleVariables.fontSizes.body, styles.noticeContent]}>
          {noticeContent}
        </Text>
      </View>
    </TouchableOpacity>
  </View>
);

function Notices({ navigation }) {
  const [notices, setNotices] = useState([]);
  const { theme, styleVariables } = useTheme();

  const styles = StyleSheet.create({
    noticeInfo: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 12,
    },
    imageAndName: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    profileIcon: {
      height: 43,
      width: 43,
      borderRadius: 12,
    },
    profileName: {
      color: styleVariables.colors.black,
      marginLeft: 8,
    },
    noticeContent: {
      color: styleVariables.colors.black,
      marginBottom: 17,
    },
  });

  useEffect(() => {
    getNotices();
  }, []);

  async function getNotices() {
    const colReference = collection(db, "Notices");

    getDocs(colReference).then((snapshot) => {
      let noticeList = [];
      snapshot.docs.forEach((doc) => {
        noticeList.push({ ...doc.data(), id: doc.id });
      });
      console.log(noticeList);
      setNotices(noticeList);
    });
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: styleVariables.colors.white }}
    >
      <FlatList
        data={notices}
        renderItem={({ item }) => {
          return (
            <NoticeItem
              noticeContent={item.noticeContent}
              theme={theme}
              styleVariables={styleVariables}
              styles={styles}
              navigation={navigation}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

export default Notices;
