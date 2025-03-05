import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomStackScreen from '../components/CustomStackScreen';
import { COLORS } from './styles/colors';

export default function ConnexionScreen() {
  return (
    <>
    <CustomStackScreen title="Connexion" />
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Bienvenue sur Skilldraft !</Text>
        <View style={styles.titleUnderline} />
      </View>

    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background_blue,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 29,
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
});
