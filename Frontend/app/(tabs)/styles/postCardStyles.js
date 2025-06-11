import { ImageBackground, StyleSheet } from 'react-native'
import { COLORS } from './colors'

export const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: COLORS.dark_main_blue,
    borderRadius: 25,
    padding: 0,
    marginVertical: 10,
    overflow: 'hidden'
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
    fontSize: 20,
    fontWeight: '300',
    color: COLORS.main_blue,
    marginBottom: 2
  },

  imageBackground: {
    width: '100%',
    minHeight: 400,
    borderRadius: 25,
    overflow: 'hidden',
    position: 'relative'
  },

  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },

  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
    opacity: 0.8
  },

  watchImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    padding: 10
  },

  watchImageText: {
    fontSize: 16,
    color: COLORS.main_blue,
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: 10
  },

  buttonsContainer: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10
  }
})
