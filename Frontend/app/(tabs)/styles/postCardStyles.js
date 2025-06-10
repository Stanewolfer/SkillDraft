import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const styles = StyleSheet.create({

    cardWrapper: {
        backgroundColor: COLORS.dark_main_blue,
        borderRadius: 25,
        padding: 10,
        marginVertical: 10,
    },

    posterInfo: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
    },

    nameTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text_white,
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 25,
        marginRight: 10,
    },

    postTitle: {
        fontSize: 16,
        color: COLORS.text_white,
        marginBottom: 5,
    },

    postDescription: {
        fontSize: 14,
        color: COLORS.text_white,
    },

    buttonsContainer: {
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    }
})