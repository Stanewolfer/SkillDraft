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

enum Mode {
  Personne = 'personne',
  Organisation = 'organisation'
}

function CustomInput({
  placeholder,
  required = false,
  multiline = false,
  numberOfLines = 1,
  value = '',
  onChangeText = () => {}
}: {
  placeholder: string
  required?: boolean
  multiline?: boolean
  numberOfLines?: number
  value?: string
  onChangeText?: (text: string) => void
}) {
  return (
    <View style={styles.inputWrapper}>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.main_blue}
        multiline={multiline}
        numberOfLines={numberOfLines}
        value={value}
        onChangeText={onChangeText}
      />
      {required && <Text style={styles.required}>*</Text>}
    </View>
  )
}

export default function InscriptionScreen() {
  const [mode, setMode] = useState<Mode>(Mode.Personne)

  // State variables for "person" mode
  const [familyName, setFamilyName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [optionalTeam, setOptionalTeam] = useState('')

  // State variables for "organization" mode
  const [teamName, setTeamName] = useState('')
  const [managerLastName, setManagerLastName] = useState('')
  const [managerFirstName, setManagerFirstName] = useState('')
  const [orgEmail, setOrgEmail] = useState('')
  const [orgPassword, setOrgPassword] = useState('')
  const [orgBio, setOrgBio] = useState('')

  // Submit function that prepares data to be sent to the backend
  const handleSubmit = () => {
    if (mode == Mode.Personne) {
      const data = {
        familyName,
        firstName,
        username,
        email,
        password,
        bio,
        optionalTeam
      }
      console.log('Données inscription personne : ', data)
    } else {
      const data = {
        teamName,
        managerLastName,
        managerFirstName,
        email: orgEmail,
        password: orgPassword,
        bio: orgBio
      }
      console.log('Données inscription organisation : ', data)
    }
  }

  return (
    <>
      <CustomStackScreen title='Inscription' />
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
            <Text style={styles.formSubtitle}>
              (Les informations avec un <Text style={styles.required}>*</Text>{' '}
              sont obligatoires)
            </Text>

            {mode === Mode.Personne ? (
              <>
                <CustomInput
                  placeholder='Nom de famille'
                  required={true}
                  value={familyName}
                  onChangeText={setFamilyName}
                />
                <CustomInput
                  placeholder='Prénom'
                  required={true}
                  value={firstName}
                  onChangeText={setFirstName}
                />
                <CustomInput
                  placeholder='Pseudonyme'
                  required={true}
                  value={username}
                  onChangeText={setUsername}
                />
                <View style={{ height: 25 }} />
                <CustomInput
                  placeholder='Email'
                  required={true}
                  value={email}
                  onChangeText={setEmail}
                />
                <CustomInput
                  placeholder='Mot de passe'
                  required={true}
                  value={password}
                  onChangeText={setPassword}
                />
                <View style={styles.subTitleUnderline} />
                <CustomInput
                  placeholder='Description (biographie)'
                  multiline={true}
                  numberOfLines={4}
                  value={bio}
                  onChangeText={setBio}
                />
                <CustomInput
                  placeholder='Equipe dont vous faites partie (Optionnel)'
                  value={optionalTeam}
                  onChangeText={setOptionalTeam}
                />
              </>
            ) : (
              <>
                <CustomInput
                  placeholder="Nom de l'équipe"
                  required={true}
                  value={teamName}
                  onChangeText={setTeamName}
                />
                <View style={styles.subTitleUnderline} />
                <CustomInput
                  placeholder='Nom du gérant'
                  required={true}
                  value={managerLastName}
                  onChangeText={setManagerLastName}
                />
                <CustomInput
                  placeholder='Prénom du gérant'
                  required={true}
                  value={managerFirstName}
                  onChangeText={setManagerFirstName}
                />
                <CustomInput
                  placeholder='Email'
                  required={true}
                  value={orgEmail}
                  onChangeText={setOrgEmail}
                />
                <CustomInput
                  placeholder='Mot de passe'
                  required={true}
                  value={orgPassword}
                  onChangeText={setOrgPassword}
                />
                <View style={styles.subTitleUnderline} />
                <CustomInput
                  placeholder='Description (biographie)'
                  multiline={true}
                  numberOfLines={4}
                  value={orgBio}
                  onChangeText={setOrgBio}
                />
              </>
            )}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>S'inscrire</Text>
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
    marginBottom: 4,
    textAlign: 'center'
  },
  formSubtitle: {
    color: COLORS.main_blue,
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 16,
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
  }
})
