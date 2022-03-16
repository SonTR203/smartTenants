import React, { useEffect, useState } from 'react'


import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView, TextInput, TouchableOpacity
} from 'react-native';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { addDoc, collection } from "@firebase/firestore"

const auth = getAuth();
console.log("Here is the auth, ", auth)

import { db } from '../../firebase-config';

const Signup = ({ navigation }) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [buildingID, setBuildingID] = useState("")
  const [unitNumber, setUnitNumber] = useState(0)
  const [userID, setUserID] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [tenantAuthorized, setTenantAuthorized] = useState(true)
  const [myMarketplacePosts, setMyMarketplacePosts] = useState([])
  const [myPosts, setMyPosts] = useState([])
  const [visibileNotices, setVisibileNotices] = useState([])
  const [visibleAnnouncements, setVisibleAnnouncements] = useState([])
 

  async function createNewUser(user) {
    try {
      await addDoc(collection(db, 'Users'),
        {
          userID: user.uid,
          firstName,
          lastName,
          buildingID,
          unitNumber,
          isAdmin: false,
          tenantAuthorized: true,
          myMarketplaccePosts: [],
          myPosts: [],
          visibileNotices: [],
          visibleAnnouncements: []
        })
    } catch (error) {
      console.log(error)
    }
  }

  function signUpSuccess(user) {
    //setModalText("Post Successful!")
    //setModalVisible(true)

    console.log('Registered with:', user.email);
    console.log('User Id: ', user.uid);
    createNewUser(user)

    navigation.navigate('AccountApprovalPending')
  }

  function signUpFailure() {
    //setModalText("SignUp Failed")
    //setModalVisible(true)
    console.log(`User ${newUser.lastName} Signup failed`)
  }



  const handleSignup = () => {

    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        signUpSuccess(user)
      })
      .catch(error => {
        console.log(error.message)
        signUpFailure()
      })
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={text => setFirstName(text)}
            style={styles.input}
          />

          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={text => setLastName(text)}
            style={styles.input}
          />

          <TextInput
            placeholder="Unit Number"
            value={unitNumber}
            onChangeText={text => setUnitNumber(text)}
            style={styles.input}
          />

          <TextInput
            placeholder="Building ID"
            value={buildingID}
            onChangeText={text => setBuildingID(text)}
            style={styles.input}
          />

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => {
              setEmail(text);
            }}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleSignup}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <View>
        <Text style={styles.title}>upon signup you accept our terms & conditions outlined in out terms of use and privacy policy</Text>
      </View>
    </SafeAreaView >

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
})

export default Signup;