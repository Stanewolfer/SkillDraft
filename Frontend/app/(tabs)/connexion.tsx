import { Stack } from 'expo-router'
import React, { useState } from 'react'
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from 'react-native'
import CustomStackScreen from '../components/CustomStackScreen'

export default function ConnexionScreen() {
  const [mode, setMode] = useState<'personne' | 'organisation'>('personne')

  // State variables for "person" mode
  const [userLogin, setUserLogin] = useState('')
  const [userPassword, setUserePassword] = useState('')

  // State variables for "organization" mode
  const [orgTeamName, setOrgTeamName] = useState('')
  const [orgEmail, setOrgEmail] = useState('')
  const [orgPassword, setOrgPassword] = useState('')

  // Submit function that prepares data to be sent to the backend
  const handleLogin = () => {
    if (mode === 'personne') {
      const data = {
        login: userLogin,
        password: userPassword
      }
      console.log('Données de connexion (personne) : ', data)
    } else {
      const data = {
        teamName: orgTeamName,
        email: orgEmail,
        password: orgPassword
      }
      console.log('Données de connexion (organisation) : ', data)
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
                mode === 'personne' && styles.switchButtonActive
              ]}
              onPress={() => setMode('personne')}
            >
              <Text
                style={[
                  styles.switchButtonText,
                  mode === 'personne' && styles.switchButtonTextActive
                ]}
              >
                Personne
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.switchButton,
                mode === 'organisation' && styles.switchButtonActive
              ]}
              onPress={() => setMode('organisation')}
            >
              <Text
                style={[
                  styles.switchButtonText,
                  mode === 'organisation' && styles.switchButtonTextActive
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

            {mode === 'personne' ? (
              <>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder='Email / Nom dutilisateur'
                    placeholderTextColor='#A9F6CB80'
                    value={userLogin}
                    onChangeText={setUserLogin}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder='Mot de passe'
                    placeholderTextColor='#A9F6CB80'
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
                    placeholderTextColor='#A9F6CB80'
                    value={orgTeamName}
                    onChangeText={setOrgTeamName}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder='Email'
                    placeholderTextColor='#A9F6CB80'
                    value={orgEmail}
                    onChangeText={setOrgEmail}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder='Mot de passe'
                    placeholderTextColor='#A9F6CB80'
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
            <Text style={[styles.linkText, { textAlign: 'center', marginTop: 10 }]}>
              Mot de passe oublié ?
            </Text>
            <Text style={styles.normalText}>
              Pas encore de compte ?{' '}
              <Text style={styles.linkText}>Inscrivez vous !</Text>
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
    backgroundColor: '#010017',
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
    color: '#FFFFFF',
    fontFamily: 'Montserrat',
    fontWeight: 'bold'
  },
  titleUnderline: {
    marginTop: 4,
    height: 3,
    width: 180,
    backgroundColor: '#A9F6CB',
    borderRadius: 2
  },
  subTitleUnderline: {
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 15,
    height: 3,
    width: 180,
    backgroundColor: '#A9F6CB',
    borderRadius: 2
  },
  cardContainer: {
    alignSelf: 'stretch',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#A9F6CB',
    backgroundColor: '#010017',
    padding: 20
  },
  switchContainer: {
    flexDirection: 'row',
    backgroundColor: '#010017',
    marginHorizontal: -20,
    marginTop: -20,
    marginBottom: 20,
    overflow: 'hidden',
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13
  },
  switchButton: {
    flex: 1,
    backgroundColor: '#A9F6CB',
    paddingVertical: 12,
    alignItems: 'center'
  },
  switchButtonActive: {
    backgroundColor: '#010017'
  },
  switchButtonText: {
    color: '#010017',
    fontSize: 16,
    fontWeight: 'normal'
  },
  switchButtonTextActive: {
    color: '#A9F6CB',
    fontWeight: 'bold'
  },
  formContainer: {
    marginTop: 10
  },
  formTitle: {
    color: '#A9F6CB',
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
    borderColor: '#A9F6CB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12
  },
  input: {
    flex: 1,
    color: '#A9F6CB'
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
    backgroundColor: '#A9F6CB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10
  },
  submitButtonText: {
    color: '#010017',
    fontWeight: 'bold',
    fontSize: 16
  },
  linkText: {
    color: '#FCC943',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    textDecorationColor: '#FCC943'
  },
  normalText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#A9F6CB'
  }
})