//https://www.youtube.com/watch?v=aSOsfpsMriI
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from '@firebase/firestore';
import { db } from '../../../firebase-config';
import ModalPicker from '../../../components/ModalBuildingPicker';
import { useTheme } from '../../../ThemeContext';
import { StatusBar } from 'expo-status-bar';

const auth = getAuth();

const ManageBuilding = ({ route, navigation }) => {
  const { building } = route.params;
  const [theme, styleVariables] = useTheme();
  const [buildingAddress, setBuildingAddress] = useState(
    building.buildingAddress
  );
  const [buildingName, setBuildingName] = useState(building.buildingName);
  const [buildingLocation, setBuildingLocation] = useState(
    building.buildingLocation
  );
  // const [buildingID, setBuildingID] = useState(building.buildingID);
  const [modalVisible, setModalVisible] = useState(false);

  const changeModalVisibility = (bool) => {
    setModalVisible(bool);
  };

  const setData = (building) => {
    building = building.buildingAddress.stringValue;
    setBuildingAddress(building);
    setBuildingID(building.replace(/\s/g, ''));
  };

  const checkTextInputs = () => {
    if (!firstName.trim()) {
      alert('Please Enter Your First Name');
      return false;
    } else if (!lastName.trim()) {
      alert('Please Enter Your last Name');
      return false;
    } else if (!unitNumber.trim() || isNaN(unitNumber.trim())) {
      console.log(+unitNumber);
      alert('Please Enter a Unit Number');
      return false;
    } else if (!buildingID.trim()) {
      alert('Please Enter Your Building Id');
      return false;
    } else if (!email) {
      alert('Please Enter Your Email Address');
      return false;
    }
    return true;
  };

  async function confirmBuilding() {
    setTenantAuthorized(true);
    console.log('save profile info');
    const buildingDocRef = doc(db, 'buildings', building.buildingDocId);
    console.log(building.buildingDocId);

    //   try {
    //     await updateDoc(buildingDocRef, {
    //
    //       buildingName,
    //       buildingLocation,
    //       buildingID,
    //       buildingAddress,
    //     });
    //     navigation.goBack();
    //   } catch (error) {
    //     console.log(error);
    //   }
  }

  function uploadBuildingPic() {
    console.log('Change building pic');
  }

  return (
    <SafeAreaView>
      <ScrollView style={theme.pageContainer}>
        <StatusBar style="auto" />
        <KeyboardAvoidingView behavior="padding">
          <View>
            {/* <Image
              source={{ uri: buildingProfileImage }}
              style={{ height: 43, width: 43, borderRadius: 12 }}
            /> */}
            <Text>{building.buildingName}</Text>
            <Text>{building.buildingAddress}</Text>
            <TouchableOpacity onPress={uploadBuildingPic}>
              <Text>Upload new picture</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text>Location</Text>
          </View>
          <View id="signupInputs">
            <View id="firstNameInput">
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Address
              </Text>
              <TextInput
                placeholder="253 York St. Ottawa, Ontario, K1N 1C6"
                defaultValue={building.buildingAddress}
                onChangeText={(text) => setBuildingAddress(text)}
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>
            <View>
              <Text>Contacts</Text>
            </View>
            <View id="lastNameInput">
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Name
              </Text>
              <TextInput
                placeholder="Mike Smith"
                defaultValue={building.buildingName}
                onChangeText={(text) => setLastName(text)}
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <View style={[theme.secondaryButton, { marginTop: 17 }]}>
              <Text
                style={[
                  theme.secondaryButtonText,
                  styleVariables.fontSizes.bodyBold,
                ]}
              >
                Cancel
              </Text>
            </View>
          </TouchableOpacity>

          <View id="signupCTA">
            <TouchableOpacity onPress={confirmbuilding}>
              <View style={[theme.primaryButton, { marginTop: 17 }]}>
                <Text
                  style={[
                    theme.primaryButtonText,
                    styleVariables.fontSizes.bodyBold,
                  ]}
                >
                  Confirm
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ManageBuilding;
