import React, { useEffect, useState } from 'react'
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Linking
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { collection, getDocs } from '@firebase/firestore'
import { useTheme } from '../../ThemeContext'
import { Dimensions } from 'react-native'

// import Signup from '../Signup/Signup';

import { db } from '../../firebase-config'
import { useAppContext } from '../../Context/AppContext'

const auth = getAuth()
let globalSetCurrentUser
let globalCurrentUser

const Login = ({ navigation }) => {
  const [theme, styleVariables] = useTheme()
  const windowWidth = Dimensions.get('window').width
  const windowHeight = Dimensions.get('window').height
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { currentUser, setCurrentUser } = useAppContext()
  globalSetCurrentUser = setCurrentUser
  globalCurrentUser = currentUser

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async userCredentials => {
        console.log('Logged in with:', userCredentials.user.email)
        if (userCredentials.user.email) {
          findUser(userCredentials.user)
        }
      })
      .catch(error => alert(error.message))
  }

  const findUser = async user => {
    const colRef = collection(db, 'Users')
    const data = await getDocs(colRef)
    let loggedInUser

    data.docs.map(item => {
      let userUID = item._document.data.value.mapValue.fields.userID.stringValue
      if (userUID) {
        if (userUID == user.uid) {
          let object = item._document.data.value.mapValue.fields
          loggedInUser = {
            buildingID: object.buildingID.stringValue,
            email: object.email.stringValue,
            firstName: object.firstName.stringValue,
            lastName: object.lastName.stringValue,
            isAdmin: object.isAdmin.booleanValue,
            myMarketplacePosts: object.myMarketplacePosts.arrayValue,
            myPosts: object.myPosts.arrayValue,
            tenantAuthorized: object.tenantAuthorized.booleanValue,
            unitNumber: object.unitNumber.integerValue,
            userUID: object.userID.stringValue,
            userDocId: item._key.path.segments[6],
            visibleNotices: object.visibleNotices.arrayValue,
            visibleAnnouncements: object.visibleAnnouncements.arrayValue
          }
          globalSetCurrentUser(loggedInUser)
        }
      }
    })

    if (loggedInUser.tenantAuthorized) {
      navigation.navigate('Newsfeed')
    } else {
      navigation.navigate('AccountApprovalPending')
    }
  }

  return (
    <SafeAreaView>
      <View style={theme.pageContainer}>
        <StatusBar style='auto' />
        <KeyboardAvoidingView behavior='padding'>
          {/* Logo image */}
          <Image
            source={require('../../assets/SmartLiving_Logo.png')}
            style={{
              width: 187,
              height: 111,
              margin: 'auto'
            }}
            resizeMode='fill'
          />

          <View id='LoginContainer'>
            {/* textInput */}
            <View id='emailInput'>
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Email
              </Text>
              <TextInput
                placeholder='name@company.com'
                value={email}
                onChangeText={text => setEmail(text)}
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>
            <View id='passwordInput'>
              <Text
                style={[theme.textInputLabel, styleVariables.fontSizes.body]}
              >
                Password
              </Text>
              <TextInput
                placeholder='••••••••••'
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
                style={[theme.textInput, styleVariables.fontSizes.body]}
              />
            </View>

            {/* forgotPassword */}
            <View
              id='forgotPassword'
              style={[theme.container, { alignItems: 'flex-end' }]}
            >
              <Text
                style={[
                  styleVariables.fontSizes.callout,
                  {
                    color: styleVariables.colors.primary,
                    opacity: '66%',
                    marginBottom: 8
                  }
                ]}
              >
                Forgot password?
              </Text>
            </View>

            {/* loginButton */}
            <TouchableOpacity
              id='loginButton'
              onPress={handleLogin}
              style={theme.primaryButton}
            >
              <Text
                style={[
                  theme.primaryButtonText,
                  styleVariables.fontSizes.bodyBold
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>

            {/* no account CTA */}
            <View
              id='noAccountCTA'
              style={[
                theme.container,
                { flexDirection: 'row', marginBottom: 8 }
              ]}
            >
              <Text
                style={[
                  styleVariables.fontSizes.callout,
                  { color: styleVariables.colors.black, marginRight: 7 }
                ]}
              >
                Don't have an account?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Signup')
                }}
              >
                <Text
                  style={[
                    styleVariables.fontSizes.calloutBold,
                    { color: styleVariables.colors.primary }
                  ]}
                >
                  Signup here
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* BrowseListingsRedirect */}
          <View
            id='browseListingsRedirect'
            style={[theme.container, { marginTop: 34, marginBottom: 8 }]}
          >
            <Text
              style={[styleVariables.fontSizes.callout, { opacity: '66%' }]}
            >
              Looking to be one of our future tenants?
            </Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://www.smartlivingproperties.ca/')
              }}
            >
              <Text
                style={[
                  styleVariables.fontSizes.calloutBold,
                  { color: styleVariables.colors.primary }
                ]}
              >
                Browse our current listings
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
