import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { db } from '../../firebase-config';

let user = {
  DOB: "01/12/1997",
  buildingID: "123CharmingAve",
  unitNumber: 7,
  firstName: "Eric",
  lastName: "Shantz",
  email: "",
  isAdmin: true,
  isAuthorized: false,
  myMarketplaccePosts: 0,
  myPosts: 0,
  userID: "fpgqEjeqXkZyZEMk5z2q",
  visibileNotices: 0,
  visibleAnnouncements: 0
}

const Signup = () => {

  const handleSignUp = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);
      })
      .catch(error => alert(error.message))
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
        >

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Name"
              value={user.name}
              onChangeText={text => user.name[text]}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Last Name"
              value={user.lastName}
              onChangeText={text => user.lastName[text]}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Unit Number"
              value={user.unitNumber}
              onChangeText={text => user.unitNumber[text]}
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Building Address"
              value={user.buildingID}
              onChangeText={text => user.buildingID[text]}
              style={styles.input}
            />

          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={text => setEmail(text)}
              style={styles.input}
            />
          </View>
          <View>
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
      </ScrollView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  title: {
    fontSize: 20,
    alignSelf: 'center',
  },
});

export default Signup;