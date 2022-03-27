import React from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useTheme } from '../ThemeContext.js'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Dimensions } from 'react-native'
const windowWidth = Dimensions.get('window').width

export default function CustomSubStackScreenHeader ({ ...props }) {
  const [theme, styleVariables] = useTheme()
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: styleVariables.colors.white,
          padding: 17
        }}
      >
        <MaterialCommunityIcons
          name='chevron-left'
          size={36}
          color={styleVariables.colors.black}
        />
        <Text>Testing Custom Header</Text>
        <MaterialCommunityIcons
          name='dots-horizontal'
          size={36}
          color={styleVariables.colors.black}
        />
      </View>
    </SafeAreaView>
  )
}
