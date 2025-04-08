import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const bottomNavbarStyles = StyleSheet.create({
    bottomButtonsContainer: {
        backgroundColor: COLORS.background_blue,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: COLORS.main_blue,
        zIndex: 999,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },
    bottomButton: {
        paddingVertical: 10,
        borderRadius: 8
    },
    bottomButtonContent: {
        alignItems: 'center'
    },
    bottomButtonLabel: {
        marginTop: 4,
        fontSize: 5,
        color: COLORS.main_blue
    }
})