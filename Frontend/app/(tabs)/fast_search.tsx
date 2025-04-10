import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from './styles/colors';

const FastSearch = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Nous bossons pour vous préparer cette page dans les plus brefs délais. Merci de votre patience !</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background_blue,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.main_blue,
    },
});

export default FastSearch;