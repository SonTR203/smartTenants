import React from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useTheme } from '../ThemeContext.js'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Dimensions } from 'react-native'
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable'
const windowWidth = Dimensions.get('window').width

export default function CustomSubStackScreenHeader ({ ...props }) {
  const [theme, styleVariables] = useTheme()
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
      <View style={theme.stackHeader}>
        <Pressable
          onPress={() => {
            props.navigation && props.navigation.goBack()
          }}
        >
          <MaterialCommunityIcons
            name='chevron-left'
            size={36}
            color={styleVariables.colors.black}
          />
        </Pressable>
        <Text style={styleVariables.fontSizes.title}>
          {props.title && props.title}
        </Text>
        {/* {console.log(props.navigation)} */}
        <MaterialCommunityIcons
          name='dots-horizontal'
          size={36}
          color={styleVariables.colors.black}
        />
      </View>
    </SafeAreaView>
  )
}
