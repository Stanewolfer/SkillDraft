import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const styles = StyleSheet.create({

    cardWrapper: {
        backgroundColor: COLORS.dark_main_blue,
        borderRadius: 25,
        padding: 10,
        marginVertical: 10,
    },

    nameTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text_white,
    },

    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginHorizontal: 10,
    }

})