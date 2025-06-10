import { COLORS } from './colors'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: COLORS.dark_main_blue,
        padding: 10,
        marginVertical: 6,
        justifyContent: 'space-between',
        alignItems: 'flex-start', // Added to ensure top alignment
        borderRadius: 12,
    },

    title: {
        color: COLORS.main_blue,
        fontWeight: 'bold',
        marginRight: 10, // Added to give some space on the right
    },

    subContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },

    informations: {
        justifyContent: 'center'
    },

    profile: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    teamTitle: {
        fontStyle: 'italic',
        color: COLORS.text_white,
        marginLeft: 5
    },

    lastMessage: {
        color: COLORS.main_blue
    },

    profilePicture: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderRadius: 25,
    },

    date: {
        justifyContent: 'flex-end'
    },

    dateText: {
        color: COLORS.text_white,
        fontSize: 12,
        alignItems: 'flex-end'
    }
})
