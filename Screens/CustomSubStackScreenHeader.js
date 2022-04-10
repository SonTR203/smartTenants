import React from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useTheme } from '../ThemeContext.js'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Dimensions } from 'react-native'
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable'

export default function CustomSubStackScreenHeader ({ ...props }) {
  const [theme, styleVariables] = useTheme()
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
      <View style={[theme.stackHeader, { paddingHorizontal: 17 }]}>
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
        <View style={{ minWidth: 36 }}>
          {props.headerFunc && props.headerFunc}
        </View>
      </View>
    </SafeAreaView>
  )
}
