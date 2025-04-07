import { Stack } from 'expo-router'
import React, { useState } from 'react'
import { COLORS } from './styles/colors'
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from 'react-native'
import CustomStackScreen from '../components/CustomStackScreen'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

enum Mode {
  Personne = 'personne',
  Organisation = 'organisation'
}

export default function ConnexionScreen() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>(Mode.Personne)

  // State variables for "person" mode
  const [userLogin, setUserLogin] = useState('')
  const [userPassword, setUserePassword] = useState('')

  // State variables for "organization" mode
  const [orgTeamName, setOrgTeamName] = useState('')
  const [orgEmail, setOrgEmail] = useState('')
  const [orgPassword, setOrgPassword] = useState('')

  // Submit function that prepares data to be sent to the backend
  const handleLogin = async () => {
    const apiUrl = 'http://10.57.32.33:5000/api/auth/login'

    try {
      const data =
        mode === Mode.Personne
          ? {
              login: userLogin,
              password: userPassword
            }
          : {
              login: orgTeamName,
              email: orgEmail,
              password: orgPassword
            }

      console.log('Données envoyées :', data)
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          type: mode === Mode.Personne ? 'user' : 'team'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()
      console.log('Réponse API :', result)

      if (!response.ok) {
        throw new Error(result.message || 'Une erreur est survenue')
      }

      // Store user ID and token in AsyncStorage
      await AsyncStorage.setItem('userId', result.entity.id)
      await AsyncStorage.setItem('token', result.token)
      await AsyncStorage.setItem('type', mode === 'personne' ? 'user' : 'team')

      router.push('/feed')
    } catch (error) {
      console.error('Erreur lors de la connexion :', error)
      alert('Erreur lors de l’inscription. Vérifie ta connexion et réessaie.')
    }
  }

  return (
    <>
      <CustomStackScreen title='Connexion' />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Bienvenue sur Skilldraft !</Text>
          <View style={styles.titleUnderline} />
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.switchContainer}>
            <TouchableOpacity
              style={[
                styles.switchButton,
                mode === Mode.Personne && styles.switchButtonActive
              ]}
              onPress={() => setMode(Mode.Personne)}
            >
              <Text
                style={[
                  styles.switchButtonText,
                  mode === Mode.Personne && styles.switchButtonTextActive
                ]}
              >
                Personne
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.switchButton,
                mode === Mode.Organisation && styles.switchButtonActive
              ]}
              onPress={() => setMode(Mode.Organisation)}
            >
              <Text
                style={[
                  styles.switchButtonText,
                  mode === Mode.Organisation && styles.switchButtonTextActive
                ]}
              >
                Organisation
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              Veuillez renseigner les informations ci-dessous
            </Text>

            {mode === Mode.Personne ? (
              <>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email / Nom d'utilisateur"
                    placeholderTextColor={COLORS.main_blue}
                    value={userLogin}
                    onChangeText={setUserLogin}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder='Mot de passe'
                    placeholderTextColor={COLORS.main_blue}
                    secureTextEntry={true}
                    value={userPassword}
                    onChangeText={setUserePassword}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Nom de l'équipe"
                    placeholderTextColor={COLORS.main_blue}
                    value={orgTeamName}
                    onChangeText={setOrgTeamName}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder='Email'
                    placeholderTextColor={COLORS.main_blue}
                    value={orgEmail}
                    onChangeText={setOrgEmail}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder='Mot de passe'
                    placeholderTextColor={COLORS.main_blue}
                    secureTextEntry={true}
                    value={orgPassword}
                    onChangeText={setOrgPassword}
                  />
                </View>
              </>
            )}

            <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
              <Text style={styles.submitButtonText}>Se Connecter</Text>
            </TouchableOpacity>
            <Text
              style={[styles.linkText, { textAlign: 'center', marginTop: 10 }]}
            >
              Mot de passe oublié ?
            </Text>
            <Text style={styles.normalText}>
              Pas encore de compte ?{' '}
              <Text
                style={styles.linkText}
                onPress={() => router.push('/inscription')}
              >
                Inscrivez vous !
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background_blue,
    paddingHorizontal: 20,
    paddingTop: 29,
    paddingBottom: 100
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  title: {
    fontSize: 24,
    color: COLORS.text_white,
    fontFamily: 'Montserrat',
    fontWeight: 'bold'
  },
  titleUnderline: {
    marginTop: 4,
    height: 3,
    width: 180,
    backgroundColor: COLORS.main_blue,
    borderRadius: 2
  },
  subTitleUnderline: {
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 15,
    height: 3,
    width: 180,
    backgroundColor: COLORS.main_blue,
    borderRadius: 2
  },
  cardContainer: {
    alignSelf: 'stretch',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.main_blue,
    backgroundColor: COLORS.background_blue,
    padding: 20
  },
  switchContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background_blue,
    marginHorizontal: -20,
    marginTop: -20,
    marginBottom: 20,
    overflow: 'hidden',
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13
  },
  switchButton: {
    flex: 1,
    backgroundColor: COLORS.main_blue,
    paddingVertical: 12,
    alignItems: 'center'
  },
  switchButtonActive: {
    backgroundColor: COLORS.background_blue
  },
  switchButtonText: {
    color: COLORS.background_blue,
    fontSize: 16,
    fontWeight: 'normal'
  },
  switchButtonTextActive: {
    color: COLORS.main_blue,
    fontWeight: 'bold'
  },
  formContainer: {
    marginTop: 10
  },
  formTitle: {
    color: COLORS.main_blue,
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.main_blue,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12
  },
  input: {
    flex: 1,
    color: COLORS.main_blue
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  required: {
    color: 'red',
    marginLeft: 4
  },
  submitButton: {
    backgroundColor: COLORS.main_blue,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10
  },
  submitButtonText: {
    color: COLORS.background_blue,
    fontWeight: 'bold',
    fontSize: 16
  },
  linkText: {
    color: COLORS.link_yellow,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    textDecorationColor: COLORS.link_yellow
  },
  normalText: {
    textAlign: 'center',
    marginTop: 10,
    color: COLORS.main_blue
  }
})
