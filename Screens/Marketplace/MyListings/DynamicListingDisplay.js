import React from "react";
import { useNavigation } from "@react-navigation/native";
import { FlatList, Text } from "react-native";
import { useAppContext } from "../../../Context/AppContext";

import MarketplaceFirstItem from "../MarketplaceItem/MarketplaceFirstItem";
import CustomBottomModal from "../../../components/CustomBottomModal";
import ModalActionConfirm from "../../../components/CustomBottomModal/ModalActionConfirm";

function DynamicListingDisplay({ data, available, handleSetListingSold }) {
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(undefined);
  const navigation = useNavigation();
  const { setCurrentMarketplacePost } = useAppContext();

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
          <Text
            style={{
              marginTop: 20,
              textAlign: "center",
            }}
          >
            You have no listing
          </Text>
        )}
      />
    </>
  );
}

export default DynamicListingDisplay;
