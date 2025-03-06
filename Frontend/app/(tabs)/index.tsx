import React from 'react';
import { LogBox, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Unicons from '@iconscout/react-native-unicons';
import { Stack, useRouter } from 'expo-router';
import { COLORS } from './styles/colors';

import { styles } from './styles/indexStyle';
import CustomStackScreen from '../components/CustomStackScreen';

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
      <CustomStackScreen title="Bienvenue sur Skilldraft" />
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
              <IconUser size={100} color = { COLORS.background_blue} />
            ) : (
              <Text style={{ color: 'red' }}>Icon User introuvable</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.cardInverted]}
            onPress={() => router.push('/connexion')}
          >
            {IconSignIn ? (
              <IconSignIn size={100} color={ COLORS.main_blue } />
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