import { StyleSheet } from 'react-native'
import { createContext, useContext } from 'react'
import { Dimensions } from 'react-native'

const ThemeContext = createContext()
const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

function ThemeProvider (props) {
  return <ThemeContext.Provider value={[theme, styleVariables]} {...props} />
}

function useTheme () {
  const context = useContext(ThemeContext)
  if (!context) throw new Error(`Not inside the ThemeContext Provider`)
  return context //all state data and functions
}

let styleVariables = {
  colors: {
    primary: '#395E66',
    primary14: '#395E6624',
    white: '#FFF',
    black: '#191919'
  },
  fontSizes: {
    hero: { fontSize: 40, fontFamily: 'Roboto_400Regular' },
    header: { fontSize: 34, fontFamily: 'Roboto_500Medium' },
    secondaryHeader: { fontSize: 28, fontFamily: 'Roboto_500Medium' },
    title: { fontSize: 22, fontFamily: 'Roboto_400Regular' },
    body: { fontSize: 17, fontFamily: 'Roboto_400Regular' },
    bodyBold: { fontSize: 17, fontFamily: 'Roboto_500Medium' },
    callout: { fontSize: 15, fontFamily: 'Roboto_400Regular' },
    calloutBold: { fontSize: 15, fontFamily: 'Roboto_500Medium' }
  }
}

const theme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleVariables.colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: styleVariables.colors.black
  },
  pageContainer: {
    paddingHorizontal: 17,
    backgroundColor: styleVariables.colors.white
  },
  card: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 17,
    borderRadius: 24,
    shadowColor: styleVariables.colors.primary,
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.14,
    shadowRadius: 34,
    elevation: 20
  },
  modalView: {
    width: windowWidth - 34,
    marginVertical: 17,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#456326',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.14,
    shadowRadius: 34,
    elevation: 20
  },
  modalText: {
    fontSize: styleVariables.fontSizes.body.fontSize,
    fontFamily: 'Roboto_400Regular',
    color: '#395E66'
  },
  imageUploadPreview: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth - 68,
    height: windowWidth - 68,
    borderRadius: 18,
    marginBottom: 17
  },
  buildingImagePreview: {
    width: windowWidth - 68,
    height: (windowWidth - 68) * 0.66,
    borderRadius: 16,
    shadowColor: styleVariables.colors.black,
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.14,
    shadowRadius: 34,
    elevation: 20
  },
  textInputLabel: {
    backgroundColor: styleVariables.colors.white,
    paddingHorizontal: 8,
    marginTop: -9,
    marginLeft: 14,
    transform: [{ translateY: 9 }],
    alignSelf: 'flex-start'
  },
  textInput: {
    width: '100%',
    borderColor: '#395E6624',
    borderWidth: 2,
    backgroundColor: styleVariables.colors.white,
    borderRadius: 18,
    padding: 22,
    marginBottom: 17
  },
  primaryButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    backgroundColor: '#395E66',
    borderRadius: 18,
    marginBottom: 17
  },
  primaryButtonText: {
    color: styleVariables.colors.white
  },
  secondaryButton: {
    color: '#395E66',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    borderColor: '#395E6624',
    borderWidth: 2,
    borderRadius: 18,
    marginBottom: 17
  },
  secondaryButtonText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: styleVariables.fontSizes.body.fontSize,
    fontFamily: 'Roboto_400Regular',
    color: '#395E66'
  }
})

//primary color (navy/dark green): #395E66
//primary color A14% : #395E6624

export { useTheme, ThemeProvider }
