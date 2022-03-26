//https://www.youtube.com/watch?v=aSOsfpsMriI
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  TextInput,
  TouchableOpacity,
  Modal
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, updateDoc } from '@firebase/firestore';

import { db } from '../../../firebase-config';
import ModalPicker from '../../../components/ModalBuildingPicker'
import { useTheme } from '../../../ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from '../../../Context/AppContext';
import { async } from '@firebase/util';
import { ProfileNavigator } from '../../customNavigator';

const auth = getAuth();

const EditProfile = ({ navigation }) => {
  const { currentUser, setCurrentUser } = useAppContext();
  console.log("CURRENT USER: ", currentUser)
  const [theme, styleVariables] = useTheme()
  const [email, setEmail] = useState(currentUser.email)
  const [userID, setUserID] = useState(currentUser.userID)
  // const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState(currentUser.firstName)
  const [lastName, setLastName] = useState(currentUser.lastName)
  const [buildingAddress, setBuildingAddress] = useState(currentUser.buildingAddress)
  const [buildingID, setBuildingID] = useState(currentUser.buildingID)
  const [modalVisible, setModalVisible] = useState(false)
  const [unitNumber, setUnitNumber] = useState(currentUser.unitNumber)

  console.log(unitNumber);

  const [isAdmin, setIsAdmin] = useState(currentUser.isAdmin)
  const [tenantAuthorized, setTenantAuthorized] = useState(currentUser.tenantAuthorized)
  const [myMarketplacePosts, setMyMarketplacePosts] = useState(currentUser.myMarketplacePosts)
  const [myPosts, setMyPosts] = useState(currentUser.myPosts)
  const [visibleNotices, setVisibileNotices] = useState(currentUser.visibleNotices)
  const [visibleAnnouncements, setVisibleAnnouncements] = useState(currentUser.visibleAnnouncements)
  const [userProfileImage, setUserProfileImage] = useState(currentUser.userProfileImage)


  const changeModalVisibility = bool => {
    setModalVisible(bool)
  }

  const setData = building => {
    building = building.buildingAddress.stringValue
    setBuildingAddress(building)
    setBuildingID(building.replace(/\s/g, ''))
  }

  const checkTextInputs = () => {
    if (!firstName.trim()) {
      alert('Please Enter Your First Name')
      return false
    } else if (!lastName.trim()) {
      alert('Please Enter Your last Name')
      return false
    } else if (!unitNumber.trim() || isNaN(unitNumber.trim())) {
      console.log(+unitNumber)
      alert('Please Enter a Unit Number')
      return false
    } else if (!buildingID.trim()) {
      alert('Please Enter Your Building Id')
      return false
    } else if (!email) {
      alert('Please Enter Your Email Address')
      return false
    }
    return true
  }

  function goToProfile(navigation) {
    navigation.navigate('ProfileGeneral');
  }

  async function saveProfileInfo() {
    console.log('save profile info')
    const userDocRef = doc(db, 'Users', currentUser.userDocId);

    try {
      await updateDoc(userDocRef, {
        userID,
        firstName,
        lastName,
        buildingID,
        buildingAddress,
        email,
        unitNumber,
      })
      navigation.navigate('ProfileGeneral');
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView>
      <ScrollView style={theme.pageContainer}>
        <StatusBar style='auto' />
        <KeyboardAvoidingView behavior='padding'>
          <View>
            <Image
              source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/smarttenant-19566.appspot.com/o/userProfileImages%2FdefaultIcon2.png?alt=media&token=88588d1f-3bc6-4edb-86a2-b0f3f769d3ce' }}
              style={{ height: 43, width: 43, borderRadius: 12 }}
            />
          </View>
          <View id='signupInputs'>
            <View id='firstNameInput'>
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Name
              </Text>
              <TextInput
                placeholder='John'
                defaultValue={currentUser.firstName}
                onChangeText={text => setFirstName(text)}
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>
            <View id='lastNameInput'>
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Last Name
              </Text>
              <TextInput
                placeholder='Doe'
                defaultValue={currentUser.lastName}
                onChangeText={text => setLastName(text)}
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>

            <View id='unitNumberInput'>
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Unit number
              </Text>
              <TextInput
                placeholder='1234'
                defaultValue={currentUser.unitNumber}
                onChangeText={text => setUnitNumber(text)}
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>

            <View id='buildingSelect'>
              <Text
                style={[
                  theme.textInputLabel,
                  styleVariables.fontSizes.body,
                  { zIndex: 2 }
                ]}
              >
                Building Address
              </Text>
              <TouchableOpacity
                onPress={() => {
                  changeModalVisibility(true)
                }}
              >
                <Text
                  style={[
                    theme.textInput,
                    styleVariables.fontSizes.body,
                    { color: '#00000080' }
                  ]}
                >
                  {currentUser.buildingAddress}

                </Text>
              </TouchableOpacity>
            </View>
            <Modal
              transparent={true}
              animationType='fade'
              visible={modalVisible}
              nRequestClose={() => {
                changeModalVisibility(false)
              }}
            >
              <ModalPicker
                changeModalVisibility={changeModalVisibility}
                setData={setData}
              />
            </Modal>
            <View id='emailInput'>
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Email
              </Text>
              <TextInput
                placeholder='name@company.com'
                defaultValue={currentUser.email}
                onChangeText={text => {
                  setEmail(text)
                }}
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>

          </View>

          <TouchableOpacity onPress={() => { navigation.navigate('Profile') }}>
            <View style={[theme.secondaryButton, { marginTop: 17 }]}>
              <Text
                style={[
                  theme.secondaryButtonText,
                  styleVariables.fontSizes.bodyBold
                ]}
              >
                Cancel
              </Text>
            </View>
          </TouchableOpacity>

          <View id='signupCTA'>
            <TouchableOpacity
              onPress={saveProfileInfo}
            >
              <View style={[theme.primaryButton, { marginTop: 17 }]}>
                <Text
                  style={[
                    theme.primaryButtonText,
                    styleVariables.fontSizes.bodyBold
                  ]}
                >
                  Save
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default EditProfile;