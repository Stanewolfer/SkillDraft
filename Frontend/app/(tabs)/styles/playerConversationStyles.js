import { COLORS } from './colors'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: COLORS.dark_main_blue,
        padding: 10,
        justifyContent: 'space-between',
    },
    title: {
        color: COLORS.main_blue,
        fontWeight: 'bold',
    },
    subContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    informations: {
        justifyContent: 'center',
    },
    profile: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    teamTitle: {
        fontStyle: 'italic',
        color: COLORS.text_white,
        marginLeft: 5,
    },
    lastMessage: {
        color: COLORS.text_white,
    },
    profilePicture: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    date: {
        justifyContent: 'flex-end',
    },
    dateText: {
        color: COLORS.text_white,
        fontSize: 12,
        alignItems: 'flex-end',
    },
})