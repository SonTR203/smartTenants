import React from "react";
import { useNavigation } from "@react-navigation/native";
import { FlatList, Text, View } from "react-native";
import { useAppContext } from "../../../Context/AppContext";

import MarketplaceFirstItem from "../MarketplaceItem/MarketplaceFirstItem";
import CustomBottomModal from "../../../components/CustomBottomModal";
import ModalActionConfirm from "../../../components/CustomBottomModal/ModalActionConfirm";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "../../../ThemeContext";

function DynamicListingDisplay({ data, available, handleSetListingSold }) {
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(undefined);
  const navigation = useNavigation();
  const { setCurrentMarketplacePost } = useAppContext();
  const { styleVariables, theme } = useTheme();

  const handleOpenSoldModal = (item) => {
    if (available) {
      setModalVisible(true);
      setSelectedItem(item);
    } else {
      setCurrentMarketplacePost(item);
      navigation.navigate("MarketplaceItemInfo", {
        title: item.userFirstName,
        itemUserId: item.userID,
        item: item,
        openModal: true,
        // open the bottom modal by default
      });
    }
  };

  const handleCreateNewPost = () => {
    navigation.navigate("CreateMarketplaceItem");
  };

  const renderMyListings = ({ item }) => {
    return (
      <MarketplaceFirstItem
        handleOpenSoldModal={handleOpenSoldModal}
        sold={available ? false : true}
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
      <CustomBottomModal
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        // options={setModalOptions()}
      >
        <ModalActionConfirm
          title={"Mark listing as sold?"}
          subtitle={"You will be able to restore it"}
          confirmText="Confirm"
          onConfirm={() => {
            handleSetListingSold(selectedItem);
            setModalVisible(false);
          }}
          onCancel={() => setModalVisible(false)}
        />
      </CustomBottomModal>
      <FlatList
        data={data}
        renderItem={renderMyListings}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <View style={{ paddingHorizontal: 17 }}>
            <Text
              style={{
                marginTop: 20,
                textAlign: "center",
                color: "#9D9D9D",
              }}
            >
              You don't have any listings yet
            </Text>
            {available ? (
              <TouchableOpacity
                onPress={handleCreateNewPost}
                style={[theme.primaryButton, { marginTop: 24 }]}
              >
                <Text
                  style={[
                    theme.primaryButtonText,
                    styleVariables.fontSizes.bodyBold,
                  ]}
                >
                  Create a Listing
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      />
    </>
  );
}

export default DynamicListingDisplay;
