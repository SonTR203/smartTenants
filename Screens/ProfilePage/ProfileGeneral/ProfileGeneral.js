import React from 'react'
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Image
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { useTheme } from '../../../ThemeContext'
import { useAppContext } from '../../../Context/AppContext'
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons/'
import { ScrollView } from 'react-native-gesture-handler'
import { getAuth } from 'firebase/auth'
import * as Updates from 'expo-updates'
import { Platform } from 'expo-modules-core'

const ProfileGeneral = ({ navigation }) => {
  const [theme, styleVariables] = useTheme()

  const { currentUser, setCurrentUser } = useAppContext()
  console.log(currentUser.userProfileImage)

  const auth = getAuth()

  const logUserOut = async () => {
    console.log('logging user out')
    auth.signOut().then(console.log('Tenant signed out'))
    await Updates.reloadAsync()
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: styleVariables.colors.primary }}
      edges={['top']}
    >
      <ScrollView>
        <StatusBar style='auto' />

        <View style={theme.pageContainer}>
          <View id='header' style={theme.header}>
            {/* headerPageTitle */}
            <Text
              id='headerPageTitle'
              style={[
                styleVariables.fontSizes.header,
                {
                  color: styleVariables.colors.white,
                  marginBottom: 4
                }
              ]}
            >
              Profile
            </Text>
            {/* buildingInfo */}
            <Pressable
              id='buildingInfo'
              onPress={() => {
                navigation.navigate('BuildingInfo')
              }}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                opacity: 0.66
              }}
            >
              <Text
                style={[
                  styleVariables.fontSizes.body,
                  { color: styleVariables.colors.white }
                ]}
              >
                {currentUser.buildingAddress}
              </Text>
              <MaterialCommunityIcons
                name='chevron-right'
                size={24}
                color={styleVariables.colors.white}
              />
            </Pressable>
          </View>

          {/* userHeader */}
          <View style={theme.firstListItem}>
            <View
              style={[
                theme.topCard,
                { elevation: Platform.OS === 'android' ? 0 : 20 }
              ]}
            >
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: 34
                }}
              >
                {/* userImage */}
                <View
                  id='userImage'
                  style={{
                    borderRadius: 99,
                    shadowColor: styleVariables.colors.black,
                    shadowOffset: {
                      width: 0,
                      height: 8
                    },
                    shadowOpacity: 0.14,
                    shadowRadius: 17,
                    elevation: 20,
                    backgroundColor: 'white'
                  }}
                >
                  <Image
                    source={{ uri: `${currentUser.userProfileImage}` }}
                    style={{
                      width: 85,
                      height: 85,
                      borderRadius: 99
                    }}
                  />
                </View>

                {/* userFullName */}
                <Text
                  id='userFullName'
                  style={[
                    styleVariables.fontSizes.header,
                    { paddingTop: 17, paddingBottom: 8 }
                  ]}
                >
                  {`${currentUser.firstName} ${currentUser.lastName}`}
                </Text>

                {/* goToRewardsOrAdmin */}
                <View id='goToRewardsOrAdmin'>
                  {currentUser.isAdmin ? (
                    <TouchableOpacity
                      id='goToAdmin'
                      onPress={() => {
                        navigation.navigate('AdminPanel')
                      }}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Text
                        style={[
                          styleVariables.fontSizes.bodyBold,
                          { color: styleVariables.colors.primary }
                        ]}
                      >
                        Admin Panel
                      </Text>
                      <MaterialCommunityIcons
                        name='chevron-right'
                        size={24}
                        color={styleVariables.colors.primary}
                        style={{ marginLeft: 8 }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      id='goToRewards'
                      onPress={() => {
                        // navigation.navigate('Rewards')
                        alert('navigate to rewards (not yet implemented)')
                      }}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <FontAwesome5
                        name='coins'
                        size={17}
                        color={styleVariables.colors.primary}
                        style={{ marginRight: 13 }}
                      />
                      <Text
                        style={[
                          styleVariables.fontSizes.bodyBold,
                          { color: styleVariables.colors.primary }
                        ]}
                      >
                        12,531
                      </Text>
                      <MaterialCommunityIcons
                        name='chevron-right'
                        size={24}
                        color={styleVariables.colors.primary}
                        style={{ marginLeft: 8 }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* editInfo */}
          <TouchableOpacity
            id='editInfo'
            onPress={() => {
              navigation.navigate('EditProfile')
            }}
            style={[theme.cardButton, { marginTop: 34 }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons
                name='account-edit'
                color={styleVariables.colors.primary}
                size={36}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styleVariables.fontSizes.title,
                  { color: styleVariables.colors.primary }
                ]}
              >
                Edit Info
              </Text>
            </View>
            <MaterialCommunityIcons
              name='chevron-right'
              size={24}
              color={styleVariables.colors.primary}
            />
          </TouchableOpacity>
          {/* residentPortal */}
          <TouchableOpacity
            id='residentPortal'
            onPress={() => {
              Linking.openURL(
                'https://smartlivinggroup.securecafe.com/residentservices/apartmentsforrent/userlogin.aspx'
              )
            }}
            style={theme.cardButton}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons
                name='home-account'
                color={styleVariables.colors.primary}
                size={36}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styleVariables.fontSizes.title,
                  { color: styleVariables.colors.primary }
                ]}
              >
                Resident Portal
              </Text>
            </View>
            <MaterialCommunityIcons
              name='chevron-right'
              size={24}
              color={styleVariables.colors.primary}
            />
          </TouchableOpacity>
          {/* myPosts */}
          <TouchableOpacity
            id='myPosts'
            onPress={() => navigation.navigate('MyPosts')}
            style={theme.cardButton}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons
                name='view-list'
                color={styleVariables.colors.primary}
                size={36}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styleVariables.fontSizes.title,
                  { color: styleVariables.colors.primary }
                ]}
              >
                My Posts
              </Text>
            </View>
            <MaterialCommunityIcons
              name='chevron-right'
              size={24}
              color={styleVariables.colors.primary}
            />
          </TouchableOpacity>
          {/* logOut */}
          <TouchableOpacity
            id='logOut'
            onPress={logUserOut}
            style={theme.cardButton}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons
                name='logout'
                color={styleVariables.colors.primary}
                size={36}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styleVariables.fontSizes.title,
                  { color: styleVariables.colors.primary }
                ]}
              >
                Log Out
              </Text>
            </View>
            <MaterialCommunityIcons
              name='chevron-right'
              size={24}
              color={styleVariables.colors.primary}
            />
          </TouchableOpacity>

          {/* footer */}
          <View
            id='footer'
            style={{
              paddingVertical: 17,
              paddingBottom: 68,
              paddingHorizontal: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row'
            }}
          >
            <Text
              style={[
                styleVariables.fontSizes.callout,
                {
                  color: styleVariables.colors.black,
                  opacity: 0.66
                }
              ]}
            >
              Created by{' '}
            </Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `https://google.com/search?q=intelidev+solutions`
                )
              }
            >
              <Text
                style={[
                  styleVariables.fontSizes.calloutBold,
                  {
                    color: styleVariables.colors.primary,
                    opacity: 0.66
                  }
                ]}
              >
                IntelliDev Solutions
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileGeneral
