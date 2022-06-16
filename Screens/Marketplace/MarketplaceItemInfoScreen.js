import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { setTime } from "../../utils/setTime";

function MarketplaceItemInfoScreen({ navigation, route }) {
  const [item, setItem] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [hoursAgo, setHoursAgo] = useState(null);
  useEffect(() => {
    if (route.params && route.params.item) {
      const time = setTime(route.params.item.timestamp.seconds * 1000);
      setHoursAgo(time);
      if (route.params.item.images.length > 0) {
        setImageList(route.params.item.images);
      }
      setItem(route.params.item);
    }
  }, [route]);

  if (item === null) {
    return null;
  }

  return (
    // CONTAINER
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <StatusBar style="dark" />
      {/* BODY SECTION  */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: "white",
          marginTop: 20,
          marginLeft: 17,
          marginRight: 17,
        }}
      >
        {/* IMAGE LIST  */}
        <FlatList
          contentContainerStyle={{
            backgroundColor: "white",
            marginBottom: 17,
          }}
          data={imageList}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index }) => {
            return (
              <Image
                style={{
                  backgroundColor: "black",
                  marginLeft: index === 0 ? 0 : 17,
                  height: Dimensions.get("window").height * 0.3,
                  borderRadius: 24,
                  width: Dimensions.get("window").width * 0.7,
                }}
                source={{ uri: item }}
              />
            );
          }}
        />
        {/* ITEM HEADER INFO  */}
        <View
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              maxWidth: Dimensions.get("window").width * 0.76,
              fontSize: 28,
              fontWeight: "600",
              lineHeight: 33,
              color: "#191919",
            }}
            numberOfLines={2}
            ellipsizeMode={"tail"}
          >
            {item.postTitle}
          </Text>
          <Text
            style={{
              marginTop: 5,
              marginLeft: 11,
              color: "#395E66",
              fontSize: 22,
              fontWeight: "400",
              lineHeight: 26,
            }}
          >
            ${item.price}
          </Text>
        </View>
        {/* ITEM CONTENT  */}
        <View
          style={{
            marginTop: 11,
          }}
        >
          <Text
            style={{
              color: "#191919",
              opacity: 0.66,
              fontSize: 17,
              fontWeight: "400",
              lineHeight: 20,
            }}
            // numberOfLines={6}
            // ellipsizeMode={"tail"}
          >
            {item.postContent}
          </Text>
        </View>
        {/* PROFILE SECTION */}
        <View
          style={{
            marginTop: 24,
            marginBottom: 50,
            flexDirection: "row",
          }}
        >
          <Image
            style={{
              backgroundColor: "black",
              width: 43,
              height: 43,
              borderRadius: 12,
            }}
            source={{ uri: item.userProfileImage }}
          />
          <View
            style={{
              flex: 1,
              marginLeft: 8,
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                fontWeight: "500",
                fontSize: 17,
                lineHeight: 24,
                color: "#191919",
              }}
            >
              {item.userFirstName}
              {item.userLastName}
            </Text>
            {hoursAgo ? (
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: 15,
                  lineHeight: 18,
                  color: "#191919",
                  opacity: 0.66,
                }}
              >
                Posted {hoursAgo}
              </Text>
            ) : null}
          </View>
        </View>
        {/* SEND A MESSAGE BOX  */}
        <TouchableOpacity
          style={{
            backgroundColor: "#395E66",
            borderRadius: 18,
            marginBottom: 45,
            height: 60,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "600",
              fontSize: 17,
              lineHeight: 20,
              color: "white",
            }}
          >
            Send a message
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default MarketplaceItemInfoScreen;
