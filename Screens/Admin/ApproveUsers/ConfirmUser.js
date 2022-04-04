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

const ConfirmUser = ({ route, navigation }) => {
  const { user } = route.params;
  console.log(user.userDocId);
  const [theme, styleVariables] = useTheme();
  const [email, setEmail] = useState(user.email);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [buildingAddress, setBuildingAddress] = useState(user.buildingAddress);
  const [buildingID, setBuildingID] = useState(user.buildingID);
  const [modalVisible, setModalVisible] = useState(false);
  const [unitNumber, setUnitNumber] = useState(user.unitNumber);
  const [tenantAuthorized, setTenantAuthorized] = useState(
    user.tenantAuthorized
  );
  const [userProfileImage, setUserProfileImage] = useState(
    user.userProfileImage
  );

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

  async function confirmUser() {
    setTenantAuthorized(true);
    console.log('save profile info');
    const userDocRef = doc(db, 'Users', user.userDocId);
    console.log(user.userDocId);

    //   try {
    //     await updateDoc(userDocRef, {
    //       //userID,
    //       firstName,
    //       lastName,
    //       buildingID,
    //       buildingAddress,
    //       email,
    //       unitNumber,
    //       tenantAuthorized,
    //     });
    //     navigation.goBack();
    //   } catch (error) {
    //     console.log(error);
    //   }
  }

  function removeProfilePic() {
    console.log('Change profile pic');
  }

  return (
    <SafeAreaView>
      <ScrollView style={theme.pageContainer}>
        <StatusBar style="auto" />
        <KeyboardAvoidingView behavior="padding">
          <View>
            <Image
              source={{ uri: userProfileImage }}
              style={{ height: 43, width: 43, borderRadius: 12 }}
            />
            <Text>
              {user.firstName} {user.lastName}
            </Text>
            <TouchableOpacity onPress={removeProfilePic}>
              <Text>Remove Profile Picture</Text>
            </TouchableOpacity>
          </View>
          <View id="signupInputs">
            <View id="firstNameInput">
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Name
              </Text>
              <TextInput
                placeholder="John"
                defaultValue={user.firstName}
                onChangeText={(text) => setFirstName(text)}
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>
            <View id="lastNameInput">
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Last Name
              </Text>
              <TextInput
                placeholder="Doe"
                defaultValue={user.lastName}
                onChangeText={(text) => setLastName(text)}
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>

            <View id="unitNumberInput">
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Unit number
              </Text>
              <TextInput
                placeholder="1234"
                defaultValue={user.unitNumber.toString()}
                onChangeText={(text) => setUnitNumber(text)}
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>

            <View id="buildingSelect">
              <Text
                style={[
                  theme.textInputLabel,
                  styleVariables.fontSizes.body,
                  { zIndex: 2 },
                ]}
              >
                Building Address
              </Text>
              <TouchableOpacity
                onPress={() => {
                  changeModalVisibility(true);
                }}
              >
                <Text
                  style={[
                    theme.textInput,
                    styleVariables.fontSizes.body,
                    { color: '#00000080' },
                  ]}
                >
                  {buildingAddress}
                </Text>
              </TouchableOpacity>
            </View>
            <Modal
              transparent={true}
              animationType="fade"
              visible={modalVisible}
              nRequestClose={() => {
                changeModalVisibility(false);
              }}
            >
              <ModalPicker
                changeModalVisibility={changeModalVisibility}
                setData={setData}
              />
            </Modal>
            <View id="emailInput">
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                {/* ================== will need to research to see if we can set this email to change the one in the authentication tab in firebase========== */}
                Email
              </Text>
              <TextInput
                placeholder="name@company.com"
                defaultValue={user.email}
                onChangeText={(text) => {
                  setEmail(text);
                }}
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>
            <View id="passwordInput">
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Password
              </Text>
              <TextInput
                placeholder="*******"
                secureTextEntry={true}
                //================================= will need to research how to do this SAFELY ==========================
                // defaultValue={user.ema}
                // onChangeText={text => {
                //   setEmail(text)
                // }}
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
            <TouchableOpacity onPress={confirmUser}>
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

export default ConfirmUser;
