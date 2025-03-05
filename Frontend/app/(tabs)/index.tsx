import React from 'react';
import { LogBox, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Unicons from '@iconscout/react-native-unicons';
import { Stack, useRouter } from 'expo-router';

LogBox.ignoreLogs([
  "Warning: UilSignin: Support for defaultProps will be removed from function components",
  "Warning: UilUser: Support for defaultProps will be removed from function components"
]);

const IconUser = Unicons.UilSignin;
const IconSignIn = Unicons.UilUser;

export default function HomeScreen() {
  const router = useRouter();

  return (
    <>
    <Stack.Screen options={{title: "Bienvenue sur Skilldraft"}} />
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Bienvenue sur Skilldraft !</Text>
        <View style={styles.titleUnderline} />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/inscription')}
        >
          <Text style={styles.cardText}>Inscription</Text>
          {IconUser ? (
            <IconUser size={100} color="#010017" />
          ) : (
            <Text style={{ color: 'red' }}>Icon User introuvable</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardInverted]}
          onPress={() => router.push('/connexion')}
        >
          {IconSignIn ? (
            <IconSignIn size={100} color="#A9F6CB" />
          ) : (
            <Text style={{ color: 'red' }}>Icon SignIn introuvable</Text>
          )}
          <Text style={[styles.cardText, styles.cardTextInverted]}>Connexion</Text>
        </TouchableOpacity>
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010017',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 150,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
  },
  titleUnderline: {
    marginTop: 4,
    height: 3,
    width: 150,
    backgroundColor: '#A9F6CB',
    borderRadius: 2,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 100,
  },
  card: {
    flex: 1,
    marginHorizontal: 10,
    height: 150,
    backgroundColor: '#A9F6CB',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    color: '#010017',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardInverted: {
    backgroundColor: '#010017',
    borderWidth: 5,
    borderColor: '#A9F6CB',
  },
  cardTextInverted: {
    color: '#A9F6CB',
  },
});
