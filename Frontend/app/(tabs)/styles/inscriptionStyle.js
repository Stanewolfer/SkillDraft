import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: COLORS.background_blue,
      paddingHorizontal: 20,
      paddingTop: 29,
      paddingBottom: 100
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: 40
    },
    title: {
      fontSize: 24,
      color: COLORS.text_white,
      fontFamily: 'Montserrat',
      fontWeight: 'bold'
    },
    titleUnderline: {
      marginTop: 4,
      height: 3,
      width: 180,
      backgroundColor: COLORS.main_blue,
      borderRadius: 2
    },
    subTitleUnderline: {
      alignSelf: 'center',
      marginTop: 4,
      marginBottom: 15,
      height: 3,
      width: 180,
      backgroundColor: COLORS.main_blue,
      borderRadius: 2
    },
    cardContainer: {
      alignSelf: 'stretch',
      borderRadius: 16,
      borderWidth: 2,
      borderColor: COLORS.main_blue,
      backgroundColor: COLORS.background_blue,
      padding: 20
    },
    switchContainer: {
      flexDirection: 'row',
      backgroundColor: COLORS.background_blue,
      marginHorizontal: -20,
      marginTop: -20,
      marginBottom: 20,
      overflow: 'hidden',
      borderTopLeftRadius: 13,
      borderTopRightRadius: 13
    },
    switchButton: {
      flex: 1,
      backgroundColor: COLORS.main_blue,
      paddingVertical: 12,
      alignItems: 'center'
    },
    switchButtonActive: {
      backgroundColor: COLORS.background_blue
    },
    switchButtonText: {
      color: COLORS.background_blue,
      fontSize: 16,
      fontWeight: 'normal'
    },
    switchButtonTextActive: {
      color: COLORS.main_blue,
      fontWeight: 'bold'
    },
    formContainer: {
      marginTop: 10
    },
    formTitle: {
      color: COLORS.main_blue,
      fontSize: 13,
      fontStyle: 'italic',
      fontWeight: 'bold',
      marginBottom: 4,
      textAlign: 'center'
    },
    formSubtitle: {
      color: COLORS.main_blue,
      fontSize: 14,
      fontStyle: 'italic',
      marginBottom: 16,
      textAlign: 'center'
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: COLORS.main_blue,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginBottom: 12
    },
    input: {
      flex: 1,
      color: COLORS.main_blue
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top'
    },
    required: {
      color: 'red',
      marginLeft: 4
    },
    submitButton: {
      backgroundColor: COLORS.main_blue,
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 10
    },
    submitButtonText: {
      color: COLORS.background_blue,
      fontWeight: 'bold',
      fontSize: 16
    }
  })
  