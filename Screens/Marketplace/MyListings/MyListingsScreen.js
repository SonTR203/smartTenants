import React, { useState, useEffect } from "react";
import { Alert, View } from "react-native";
import ScreenSelector from "./ScreenSelector";
import { useAppContext } from "../../../Context/AppContext";
import {
  getMarketplaceItems,
  updateItemInFirestore,
} from "../../../utils/firebase.services";
import DynamicListingDisplay from "./DynamicListingDisplay";
import { Timestamp, deleteField } from "@firebase/firestore";
import PopupModal from "../../../components/PopupModal";
import Modal from "react-native-modal";

function MyListingsScreen() {
  const [available, setAvailable] = useState(true);
  const [availableListings, setAvailableListings] = useState(undefined);
  const [soldListings, setSoldListings] = useState(undefined);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const { currentUser } = useAppContext();

  useEffect(() => {
    async function setMarketplaceListings() {
      const list = await getMarketplaceItems();
      const myListingList = list.filter(
        (item) => item.userID === currentUser.userID && !item.isSold
      );
      const mySoldListingList = list.filter(
        (item) => item.userID === currentUser.userID && item.isSold
      );

      myListingList
        ? setAvailableListings(myListingList)
        : setAvailableListings([]);

      mySoldListingList
        ? setSoldListings(mySoldListingList)
        : setSoldListings([]);
    }
    setMarketplaceListings();
  }, []);

  // Updated handler to include re-listing
  const handleSetListingSold = async (selectedItem) => {
    const res = await updateItemInFirestore("Marketplace", selectedItem.id, {
      isSold: selectedItem.isSold ? false : true,
      soldDate: selectedItem.isSold
        ? deleteField()
        : Timestamp.fromDate(new Date()),
    });

    if (!res) {
      Alert.alert("Something went wrong. Please try again later.");
      return;
    }

    const updatedItem = {
      ...selectedItem,
      isSold: selectedItem.isSold ? false : true,
    };

    const newDataList = selectedItem.isSold
      ? soldListings.filter((item) => item.id !== selectedItem.id)
      : availableListings.filter((item) => item.id !== selectedItem.id);

    if (selectedItem.isSold) {
      const newAvailableListings = availableListings
        ? [...availableListings, updatedItem]
        : [updatedItem];

      setSoldListings(newDataList);
      setAvailableListings(newAvailableListings);
      setToastMessage("Your item was listed!");
    } else {
      const newSoldListings = soldListings
        ? [...soldListings, updatedItem]
        : [updatedItem];

      setSoldListings(newSoldListings);
      setAvailableListings(newDataList);
      setToastMessage("Item marked as sold!");
    }

    setToastType("success");
    window.setTimeout(() => {
      setToastVisible(true);
    }, 400);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Modal
        animationType="slide"
        transparent={true}
        // statusBarTranslucent={true}
        visible={toastVisible}
        onRequestClose={() => {
          setToastVisible(false);
        }}
        onShow={() => {
          setTimeout(() => {
            setToastVisible(false);
          }, 2000);
        }}
      >
        <PopupModal
          modalType={toastType}
          message={toastMessage}
          hideModal={() => {
            setToastVisible(false);
          }}
        />
      </Modal>
      <ScreenSelector available={available} setAvailable={setAvailable} />
      <DynamicListingDisplay
        handleSetListingSold={handleSetListingSold}
        available={available}
        setData={available ? setAvailableListings : setSoldListings}
        data={available ? availableListings : soldListings}
      />
    </View>
  );
}

export default MyListingsScreen;
