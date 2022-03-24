//https://www.youtube.com/watch?v=aSOsfpsMriI
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Modal
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, getDocs, deleteDoc } from '@firebase/firestore';
import { db } from '../../../firebase-config';
import ModalPicker from '../../../components/ModalBuildingPicker'
import { useTheme } from '../../../ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from '../../../Context/AppContext';
import { async } from '@firebase/util';
import ProfileGeneral from '../ProfileGeneral/ProfileGeneral';

const auth = getAuth()

const EditProfile = ({ navigation }) => {
  const [theme, styleVariables] = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [buildingAddress, setBuildingAddress] = useState('Select building')
  const [buildingID, setBuildingID] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [unitNumber, setUnitNumber] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [tenantAuthorized, setTenantAuthorized] = useState(false)
  const [myMarketplacePosts, setMyMarketplacePosts] = useState([])
  const [myPosts, setMyPosts] = useState([])
  const [visibleNotices, setVisibileNotices] = useState([])
  const [visibleAnnouncements, setVisibleAnnouncements] = useState([])
  const defaultProfileImage =
    'https://firebasestorage.googleapis.com/v0/b/smarttenant-19566.appspot.com/o/userProfileImages%2FdefaultIcon.png?alt=media&token=80cd4281-4842-42b6-90ca-0828f00ceb82'

  const { currentUser, setCurrentUser } = useAppContext();

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
    } else if (!password) {
      alert('Please Enter Your Password, at least 6 characters')
      return false
    }
    return true
  }

  function goToProfile(navigation) {
    navigation.navigate('ProfileGeneral');
  }

  function saveProfileInfo() {
    console.log('save profile info')
  }

  return (
    <SafeAreaView>
      <ScrollView style={theme.pageContainer}>
        <StatusBar style='auto' />
        <KeyboardAvoidingView behavior='padding'>
          <View id='signupInputs'>
            <View id='firstNameInput'>
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Name
              </Text>
              <TextInput
                placeholder='John'
                value={currentUser.firstName}
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
                value={currentUser.lastName}
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
                value={currentUser.unitNumber}
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
                value={currentUser.email}
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
