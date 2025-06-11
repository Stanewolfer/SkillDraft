import { StyleSheet } from 'react-native'
import { COLORS } from './colors'

export const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: COLORS.dark_main_blue,
    borderRadius: 25,
    padding: 10,
    marginVertical: 10
  },

  posterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10
  },

  nameTitle: {
    fontSize: 18,
    fontWeight: '300',
    color: COLORS.main_blue,
    marginBottom: 2
  },

  buttonsContainer: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10
  }
})
