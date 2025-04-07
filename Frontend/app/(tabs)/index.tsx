import React, { useEffect, useState } from 'react'
import {
  LogBox,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Unicons from '@iconscout/react-native-unicons'
import { useRouter } from 'expo-router'
import COLORS from './styles/colors'

import styles from './styles/indexStyles'
import CustomStackScreen from '../components/CustomStackScreen'

LogBox.ignoreLogs([
  'Warning: UilSignin: Support for defaultProps will be removed from function components',
  'Warning: UilUser: Support for defaultProps will be removed from function components'
])

const IconUser = Unicons.UilSignin
const IconSignIn = Unicons.UilUser

export default function HomeScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId')
        const type = (await AsyncStorage.getItem('type')) || ''

        if (userId) {
          console.log('Fast login instancié')
          const response = await fetch(
            `http://10.57.32.33:5000/api/auth/fast-login/${userId}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                type // Will never be `null`
              }
            }
          )

          const result = await response.json()
          console.log('Réponse API :', result)
          router.push('/feed')

          if (!response.ok) {
            throw new Error(result.message || 'Une erreur est survenue')
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de session :', error)
        setLoading(false)
      }
    }

    checkUserSession()
  }, [])

  return (
    <>
      <CustomStackScreen title='Bienvenue sur Skilldraft' />
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
            <IconUser size={100} color={COLORS.background_blue} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.cardInverted]}
            onPress={() => router.push('/connexion')}
          >
            <IconSignIn size={100} color={COLORS.main_blue} />
            <Text style={[styles.cardText, styles.cardTextInverted]}>
              Connexion
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}
