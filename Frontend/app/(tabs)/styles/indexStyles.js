import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#010017',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 72,
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 20,
      color: COLORS.text_white,
      fontFamily: 'Montserrat',
      fontWeight: 'bold',
    },
    titleUnderline: {
      marginTop: 4,
      height: 3,
      width: 150,
      backgroundColor: COLORS.main_blue,
      borderRadius: 2,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingTop: 100,
    },
    card: {
      flex: 1,
      marginHorizontal: 10,
      height: 150,
      backgroundColor: COLORS.main_blue,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardText: {
      color: COLORS.background_blue,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    cardInverted: {
      backgroundColor: COLORS.background_blue,
      borderWidth: 5,
      borderColor: COLORS.main_blue,
    },
    cardTextInverted: {
      color: COLORS.main_blue,
    },
  });
