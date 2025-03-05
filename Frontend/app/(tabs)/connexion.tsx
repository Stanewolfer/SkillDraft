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

function CustomInput({
  placeholder,
  required = false,
  multiline = false,
  numberOfLines = 1
}: {
  placeholder: string
  required?: boolean
  multiline?: boolean
  numberOfLines?: number
}) {
  return (
    <View style={styles.inputWrapper}>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        placeholder={placeholder}
        placeholderTextColor='#A9F6CB80'
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {required && <Text style={styles.required}>*</Text>}
    </View>
  )
}

export default function ConnexionScreen() {
  const [mode, setMode] = useState<'personne' | 'organisation'>('personne')

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
            <Text style={styles.formSubtitle}>
              (Les informations avec un <Text style={styles.required}>*</Text>{' '}
              sont obligatoires)
            </Text>

            {mode === 'personne' ? (
              <>
                <CustomInput placeholder='Nom' required={true} />
                <CustomInput placeholder='Prénom' required={true} />
              </>
            ) : (
              <>
                <CustomInput placeholder="Nom de l'équipe" required={true} />
                <View style={styles.subTitleUnderline} />
                <CustomInput placeholder='Nom du gérant' required={true} />
                <CustomInput placeholder='Prénom du gérant' required={true} />
                <CustomInput placeholder='Email' required={true} />
                <CustomInput placeholder='Mot de passe' required={true} />
                <View style={styles.subTitleUnderline} />
                <CustomInput
                  placeholder='Description (biographie)'
                  multiline={true}
                  numberOfLines={4}
                />
              </>
            )}
            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Se Connecter</Text>
            </TouchableOpacity>
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
    marginBottom: 4,
    textAlign: 'center'
  },
  formSubtitle: {
    color: '#A9F6CB',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 16,
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
  }
})
