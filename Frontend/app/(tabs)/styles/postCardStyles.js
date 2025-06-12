import { StyleSheet } from 'react-native'
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
    fontSize: 18,
    fontWeight: '300',
    color: COLORS.main,
    marginBottom: 2
  },

  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.main_blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5
  },

  nameTitle: {
    fontSize: 20,
    fontWeight: '300',
    color: COLORS.main_blue,
    marginBottom: 2
  },

  imageBackground: {
    width: '100%',
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

  modalContainer: {
    flex: 1,
    backdropFilter: 'blur(10px)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },

  modalImage: {
    width: '100%',
    height: 300,
    borderRadius: 25,
    marginBottom: 20
  },

  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20
  },

  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    backgroundColor: COLORS.dark_main_blue,
    borderRadius: 50
  },

  buttonsContainer: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10
  }
})
