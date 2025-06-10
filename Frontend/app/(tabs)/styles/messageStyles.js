import { COLORS } from './colors'
import { StyleSheet } from 'react-native'

export const messageStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background_blue,
    paddingBottom: 60,
    borderWidth: 1,
    borderColor: COLORS.main_blue
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.main_blue,
    paddingBottom: 10,
    textAlign: 'center',
    borderBottomColor: COLORS.main_blue,
    borderBottomWidth: 1
  },

  messagesContainer: {
    flex: 1,
    width: '100%',
    padding: 10,
    marginTop: 10
  },

  messageWrapperOther: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: COLORS.background_blue
  },

  messageWrapperMe: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: COLORS.background_blue
  },

  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginHorizontal: 5
  },

  messageContentOther: {
    backgroundColor: COLORS.secondary_blue,
    color: COLORS.main_blue,
    flexDirection: 'column', // Corrected from 'col' to 'column'
    justifyContent: 'center',
    alignSelf: 'flex-start',
    maxWidth: '70%',
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginVertical: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50
  },

  messageContentMe: {
    backgroundColor: COLORS.main_blue,
    flexDirection: 'column', // Corrected from 'col' to 'column'
    justifyContent: 'center',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    maxWidth: '70%',
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginVertical: 5,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50
  },

  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.background_blue
  },

  inputWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.main_blue,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
    color: COLORS.main_blue
  },

  sendButton: {
    backgroundColor: COLORS.main_blue,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8
  },

  dateGroup: {
    marginBottom: 15
  },

  dateHeader: {
    alignItems: 'center',
    marginVertical: 10
  },

  dateText: {
    backgroundColor: COLORS.secondary_blue,
    color: COLORS.main_blue,
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    overflow: 'hidden'
  }
})
