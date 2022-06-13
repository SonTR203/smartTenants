//https://www.youtube.com/watch?v=aSOsfpsMriI
import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { doc, updateDoc, collection, getDocs } from "@firebase/firestore";
import { db } from "../../../firebase-config";
import { useTheme } from "../../../ThemeContext";
import { StatusBar } from "expo-status-bar";
import { useAppContext } from "../../../Context/AppContext";

const ManageBuilding = ({ route, navigation }) => {
  const { building } = route.params;
  const { theme, styleVariables } = useTheme();
  const [buildingAddress, setBuildingAddress] = useState(
    building.buildingAddress
  );
  const [buildingName, setBuildingName] = useState(building.buildingName);
  const [buildingLocation, setBuildingLocation] = useState(
    building.buildingLocation
  );
  const [fullName, setFullName] = useState(building.fullName);
  const [email, setEmail] = useState(building.email);
  const [phone, setPhone] = useState(building.phone);
  //   const [modalVisible, setModalVisible] = useState(false);
  const { setBuildings } = useAppContext();

  async function confirmBuilding() {
    const buildingDocRef = doc(db, "Buildings", building.buildingDocId);

    try {
      await updateDoc(buildingDocRef, {
        fullName,
        buildingName,
        buildingAddress,
        buildingLocation,
        email,
        phone,
      });
      fetchUpdatedListOfBuildings();
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchUpdatedListOfBuildings() {
    const colRef = collection(db, "Buildings");
    const data = await getDocs(colRef);
    const buildings = data.docs.map((building) => {
      let buildingDocId = building._key.path.segments[6];

      return (building = {
        ...building.data(),
        buildingDocId,
      });
    });
    setBuildings(buildings);
  }

  function uploadBuildingPic() {
    //allow the admin to upload a building image
  }

  return (
    <SafeAreaView>
      <StatusBar style="auto" />
      <KeyboardAvoidingView behavior="padding">
        <ScrollView style={theme.pageContainer}>
          <View>
            <Text>{building.buildingName}</Text>
            <Text>{building.buildingAddress}</Text>
            <TouchableOpacity onPress={uploadBuildingPic}>
              <Text>Upload new picture</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text>Location</Text>
          </View>
          <View id="firstNameInput">
            <Text style={[theme.textInputLabel, styleVariables.fontSizes.body]}>
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
            <View>
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Name
              </Text>
              <TextInput
                placeholder="253 York St. Ottawa, Ontario, K1N 1C6"
                defaultValue={building.buildingName}
                onChangeText={(text) => setBuildingName(text)}
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>
            <View>
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Location
              </Text>
              <TextInput
                placeholder="253 York St. Ottawa, Ontario, K1N 1C6"
                defaultValue={building.buildingLocation}
                onChangeText={(text) => setBuildingLocation(text)}
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>
            <View>
              <Text>Contact</Text>
            </View>
            <View>
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Full name
              </Text>
              <TextInput
                placeholder="Mike Smith"
                defaultValue={building.fullName}
                onChangeText={(text) => setFullName(text)}
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>
            <View>
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Email
              </Text>
              <TextInput
                placeholder="mike@email.com"
                defaultValue={building.email}
                onChangeText={(text) => setEmail(text)}
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>
            <View>
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Phone
              </Text>
              <TextInput
                placeholder="(555)555-5555"
                defaultValue={building.phone}
                onChangeText={(text) => setPhone(text)}
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
            <TouchableOpacity onPress={confirmBuilding}>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ManageBuilding;
