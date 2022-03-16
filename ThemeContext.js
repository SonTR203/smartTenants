import { StyleSheet } from 'react-native'
import { createContext, useContext } from 'react'

const ThemeContext = createContext()

function ThemeProvider (props) {
  return <ThemeContext.Provider value={[theme]} {...props} />
}

function useTheme () {
  const context = useContext(ThemeContext)
  if (!context) throw new Error(`Not inside the ThemeContext Provider`)
  return context //all state data and functions
}

const theme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export { useTheme, ThemeProvider }
