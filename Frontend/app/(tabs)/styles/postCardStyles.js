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
        fontWeight: '300',
        color: COLORS.main,
        marginBottom: 2,
    },

    buttonsContainer: {
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    }
})