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
import { collection, getDocs, addDoc } from '@firebase/firestore'
import { useTheme } from '../../ThemeContext'
import { db } from '../../firebase-config'
import { useAppContext } from '../../Context/AppContext'
import { Dimensions } from 'react-native'
const windowHeight = Dimensions.get('window').height

const auth = getAuth()
let globalSetCurrentUser
let globalCurrentUser

/* The login screen allows registered users to login to app as well directing prospective tenants to the Smart Living  residential portal to browse its current listings */
const Login = ({ navigation }) => {
  const [theme, styleVariables] = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { currentUser, setCurrentUser } = useAppContext()
  const { notifications, setNotifications } = useAppContext()

  globalSetCurrentUser = setCurrentUser
  globalCurrentUser = currentUser

  /* This function logs the user to the application only if he/she * is registered on Firebase as an authenticated registered user.
   * inputs: none
   * outputs: return the undefined (the default for JS functions)
   */
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

  /* This function gets the logged in user data from Firebase and  * navigates him/her to to the Newsfeed screen (Home screen) if * * authorized or to the Account Approval Pending screen if not
   * yet approved by an Admin.
   * inputs: authenticated user object From Firebase
   * outputs: sets the current user object as the Logged in user as stored as per stored data on Firebase
   */
  const findUser = async user => {
    const colRef = collection(db, 'Users')
    const data = await getDocs(colRef)
    let loggedInUser

    data.docs.map(item => {
      let userID = item._document.data.value.mapValue.fields.userID.stringValue

      if (userID) {
        if (userID == user.uid) {
          let object = item._document.data.value.mapValue.fields
          console.log('KARIM: ', object)
          loggedInUser = {
            buildingID: object.buildingID.stringValue,
            buildingAddress: object.buildingAddress.stringValue,
            email: object.email.stringValue,
            firstName: object.firstName.stringValue,
            lastName: object.lastName.stringValue,
            isAdmin: object.isAdmin.booleanValue,
            myMarketplacePosts: object.myMarketplacePosts.arrayValue,
            myPosts: object.myPosts.arrayValue,
            tenantAuthorized: object.tenantAuthorized.booleanValue,
            unitNumber: object.unitNumber.integerValue,
            userID: object.userID.stringValue,
            userDocId: item._key.path.segments[6],
            visibleNotices: object.visibleNotices.arrayValue,
            visibleAnnouncements: object.visibleAnnouncements.arrayValue,
            userProfileImage: object.userProfileImage.stringValue
          }
          globalSetCurrentUser(loggedInUser)
          createNotificationCollection(loggedInUser)
          //setNotificationsContext(loggedInUser);
        }
      }
    })

    if (loggedInUser.tenantAuthorized) {
      navigation.navigate('Newsfeed')
    } else {
      navigation.navigate('AccountApprovalPending')
    }
  }

  /* This function creates notifications for the logged in user   * and stores them on Firebase
   *inputs: logged in user object
   *outputs: notification doc object on Firebase
   */
  const createNotificationCollection = async loggedInUser => {
    const colRef = collection(
      db,
      `Users/${loggedInUser.userDocId}/Notifications`
    )
    let data = await getDocs(colRef)
    if (data.docs.length > 0) {
      console.log('Notifications Subcollection already exists')
    } else {
      console.log('creating notification doc')
      await addDoc(colRef, {
        content:
          'Thanks for signing up! On behalf of the Smart Living Properties Team: Welcome.',
        postID: '',
        userID: loggedInUser.userDocId,
        wasSeen: true,
        timestamp: 0
      })
    }
  }

  // This function to be fully implemented in phase two of the app
  function forgotPassword () {
    console.log('forgot password')
  }

  return (
    <SafeAreaView style={{ backgroundColor: styleVariables.colors.white }}>
      <View style={theme.pageContainer}>
        <StatusBar style='auto' />
        <KeyboardAvoidingView
          behavior='padding'
          style={[theme.fullHeight, { justifyContent: 'space-evenly' }]}
        >
          {/* Logo image */}
          <View style={[theme.container, {}]}>
            <Image
              source={require('../../assets/SmartLiving_Logo.png')}
              style={{
                width: 187,
                height: 111,
                margin: 'auto'
              }}
              resizeMode='contain'
            />
          </View>

          <View id='LoginContainer' style={theme.globalMargins}>
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
                onPress={forgotPassword}
                style={[
                  styleVariables.fontSizes.callout,
                  {
                    color: styleVariables.colors.primary,
                    opacity: 0.66,
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
                  { color: styleVariables.colors.black }
                ]}
              >
                Don't have an account?{' '}
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
                  Sign up here
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* BrowseListingsRedirect */}
          <View
            id='browseListingsRedirect'
            style={[
              theme.container,
              theme.globalMargins,
              { marginTop: 34, marginBottom: 8 }
            ]}
          >
            <Text style={[styleVariables.fontSizes.callout, { opacity: 0.66 }]}>
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
