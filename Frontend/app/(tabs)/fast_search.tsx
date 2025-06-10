import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from './styles/colors';
import * as Unicons from '@iconscout/react-native-unicons'
import CustomStackScreen from '../components/CustomStackScreen';

const FastSearch = () => {
    return (
        <>
        <CustomStackScreen title="Recherches rapides" />
        <View style={styles.container}>
            <Text style={styles.text}>Nous bossons pour vous préparer cette page dans les plus brefs délais. Merci de votre patience !</Text>
                <View style={{ position: 'absolute', bottom: 70, right: 10 }}>
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 50,
                            height: 50,
                            backgroundColor: COLORS.main_blue,
                            borderRadius: 50,
                        }}
                    >
                        <Unicons.UilSearch size={25} color={COLORS.background_blue} />
                    </TouchableOpacity>
                </View>
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