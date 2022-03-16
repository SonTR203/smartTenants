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

let user = {
  DOB: "01/12/1997",
  buildingID: "123CharmingAve",
  unitNumber: 7,
  firstName: "Eric",
  lastName: "Shantz",
  email: "shantz.eric@gmail.com",
  userID: "number",
  isAdmin: true,
  tenantAuthorized: true,
  myMarketplaccePosts: [],
  myPosts: [],
  visibileNotices: [],
  visibleAnnouncements: []
}

const Signup = ({navigation}) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')



  const handleSignup = () => {

    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);
        console.log('User Id: ', user.userID);
        navigation.navigate('AccountApprovalPending')
      })
      .catch(error => alert(error.message))
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Nameeeee"
            value={user.firstName}
            onChangeText={text => user.firstName[text]}
            style={styles.input}
          />

          <TextInput
            placeholder="Last Name"
            value={user.lastName}
            onChangeText={text => user.lastName[text]}
            style={styles.input}
          />

          <TextInput
            placeholder="Unit Number"
            value={user.unitNumber}
            onChangeText={text => user.unitNumber[text]}
            style={styles.input}
          />

          <TextInput
            placeholder="Building Address"
            value={user.buildingID}
            onChangeText={text => user.buildingID[text]}
            style={styles.input}
          />

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => {
              setEmail(text);
              user.email;
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