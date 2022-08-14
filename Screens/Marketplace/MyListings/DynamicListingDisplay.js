import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import { useAppContext } from "../../../Context/AppContext";

import MarketplaceFirstItem from "../MarketplaceItem/MarketplaceFirstItem";

function DynamicListingDisplay({
  data,
  setData,
  avaialble,
  handleSetListingSold,
}) {
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(undefined);
  const navigation = useNavigation();
  const { setCurrentMarketplacePost } = useAppContext();

  const handleOpenSoldModal = (item) => {
    if (avaialble) {
      setModalVisible(true);
      setSelectedItem(item.id);
    } else {
      setCurrentMarketplacePost(item);
      navigation.navigate("MarketplaceItemInfo", {
        title: item.userFirstName,
        itemUserId: item.userID,
        item: item,
      });
    }
  };

  const renderMyListings = ({ item }) => {
    return (
      <MarketplaceFirstItem
        handleOpenSoldModal={handleOpenSoldModal}
        sold={avaialble ? false : true}
        own={true}
        item={item}
        navigation={navigation}
      />
    );
  };

  if (!data) {
    return (
      <Text
        style={{
          textAlign: "center",
        }}
      >
        Loading...
      </Text>
    );
  }

  return (
    <>
      <Modal
        style={{ margin: 0, justifyContent: "flex-end" }}
        coverScreen={true}
        onBackdropPress={() => setModalVisible(false)}
        isVisible={isModalVisible}
      >
        <View
          style={{
            height: 181,
            backgroundColor: "white",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 24,
            paddingBottom: 34,
          }}
        >
          <View
            style={{
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Roboto_500Medium",
                fontSize: 20,
                lineHeight: 25,
                color: "#4D4D4D",
                marginBottom: 8,
              }}
            >
              Mark listing as sold?
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Roboto_400Regular",
                fontSize: 15,
                lineHeight: 20,
                color: "#4D4D4D",
              }}
            >
              You will be able to restore it.
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                handleSetListingSold(selectedItem);
                setModalVisible(false);
              }}
              style={{
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#EBEFF0",
                borderRadius: 16,
                paddingVertical: 12,
                paddingHorizontal: 51.75,
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto_400Regular",
                  color: "#395E66",
                  fontSize: 17,
                  lineHeight: 22,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                setModalVisible(false);
              }}
              style={{
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#395E66",
                borderRadius: 16,
                paddingVertical: 12,
                paddingHorizontal: 51.75,
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto_500Medium",
                  color: "#FFFFFF",
                  fontSize: 17,
                  lineHeight: 22,
                }}
              >
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FlatList
        data={data}
        renderItem={renderMyListings}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => <Text>You have no listing available</Text>}
      />
    </>
  );
}

export default DynamicListingDisplay;
