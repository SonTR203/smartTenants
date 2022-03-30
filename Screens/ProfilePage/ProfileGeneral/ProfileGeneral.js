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

const ProfileGeneral = ({ navigation }) => {
  const [theme, styleVariables] = useTheme()

  const { currentUser, setCurrentUser } = useAppContext()
  console.log(currentUser.userProfileImage)

  const logUserOut = () => {
    console.log('logging user out')
    navigation.navigate('Login')
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: styleVariables.colors.primary }}
      edges={['top']}
    >
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
          <View style={theme.topCard}>
            <View style={theme.cardButton}>
              <Image
                source={{ uri: `${currentUser.userProfileImage}` }}
                style={{ width: 50, height: 50 }}
              />
              <Text>{currentUser.firstName + ' ' + currentUser.lastName}</Text>
              <View id='goToRewardsOrAdmin'>
                {currentUser.isAdmin ? (
                  <Pressable
                    id='goToAdmin'
                    onPress={() => {
                      navigation.navigate('AdminPanel')
                    }}
                  >
                    <Text>Admin Panel</Text>
                    <MaterialCommunityIcons
                      name='chevron-right'
                      size={24}
                      color={styleVariables.colors.primary}
                    />
                  </Pressable>
                ) : (
                  <Pressable
                    id='goToRewards'
                    onPress={() => {
                      navigation.navigate('Rewards')
                    }}
                  >
                    <FontAwesome5
                      name='coins'
                      size={24}
                      color={styleVariables.colors.primary}
                    />
                    <Text>12,531</Text>
                    <MaterialCommunityIcons
                      name='chevron-right'
                      size={24}
                      color={styleVariables.colors.primary}
                    />
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </View>

        <View>
          {/* editInfo */}
          <TouchableOpacity
            id='editInfo'
            onPress={() => {
              navigation.navigate('EditProfile')
            }}
          >
            <Text>Edit Info</Text>
          </TouchableOpacity>
          {/* residentPortal */}
          <TouchableOpacity
            id='residentPortal'
            onPress={() => {
              Linking.openURL(
                'https://smartlivinggroup.securecafe.com/residentservices/apartmentsforrent/userlogin.aspx'
              )
            }}
          >
            <Text>Resident Portal</Text>
          </TouchableOpacity>
          {/* myPosts */}
          <TouchableOpacity
            id='myPosts'
            onPress={() => navigation.navigate('MyPosts')}
          >
            <Text>My Posts</Text>
          </TouchableOpacity>
          {/* logOut */}
          <TouchableOpacity id='logOut' onPress={logUserOut}>
            <Text>Log Out</Text>
          </TouchableOpacity>

          <Text>Created by IntelliDev Solutions</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ProfileGeneral
