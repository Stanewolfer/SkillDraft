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

import { styles } from './styles/inscriptionStyle'

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

export default function InscriptionScreen() {
  const [mode, setMode] = useState<'personne' | 'organisation'>('personne')

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
              <Text style={styles.submitButtonText}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  )
}