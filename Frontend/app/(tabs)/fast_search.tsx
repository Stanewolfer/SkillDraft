import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from './styles/colors';
import CustomStackScreen from '../components/CustomStackScreen';

const FastSearch = () => {
    return (
        <>
        <CustomStackScreen title="Recherches rapides" />
        <View style={styles.container}>
            <Text style={styles.text}>Nous bossons pour vous préparer cette page dans les plus brefs délais. Merci de votre patience !</Text>
        </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background_blue,
        padding: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: COLORS.main_blue,
    },
});

export default FastSearch;