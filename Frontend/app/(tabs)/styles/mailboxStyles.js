import { COLORS } from './colors'
import { StyleSheet } from 'react-native'

export const mailboxStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background_blue,
  },

  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 125,
  },

  floatingButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.main_blue,
    justifyContent: 'center',
    alignItems: 'center',
  },

})
