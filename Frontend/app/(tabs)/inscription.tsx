import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from 'react-native'

export default function InscriptionScreen() {
  const [mode, setMode] = useState<'personne' | 'organisation'>('personne')

  return (
    <View style={styles.container}>
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
            (Les informations avec un * sont obligatoires)
          </Text>

          {mode === 'personne' ? (
            <>
              <TextInput
                style={styles.input}
                placeholder='Nom *'
                placeholderTextColor='#A9F6CB80'
              />
              <TextInput
                style={styles.input}
                placeholder='Prénom *'
                placeholderTextColor='#A9F6CB80'
              />
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nom de l'équipe *"
                placeholderTextColor='#A9F6CB80'
              />
              <TextInput
                style={styles.input}
                placeholder='Nom du gérant *'
                placeholderTextColor='#A9F6CB80'
              />
              <TextInput
                style={styles.input}
                placeholder='Prénom du gérant *'
                placeholderTextColor='#A9F6CB80'
              />
              <TextInput
                style={styles.input}
                placeholder='Email *'
                placeholderTextColor='#A9F6CB80'
              />
              <TextInput
                style={styles.input}
                placeholder='Mot de passe *'
                placeholderTextColor='#A9F6CB80'
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder='Description (biographie)'
                placeholderTextColor='#A9F6CB80'
                multiline
                numberOfLines={4}
              />
            </>
          )}
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010017',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 100
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

  cardContainer: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#A9F6CB',
    backgroundColor: '#010017',
    padding: 20
  },

  switchContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: '#010017',
    marginBottom: 20,
    overflow: 'hidden'
  },
  switchButton: {
    flex: 1,
    backgroundColor: '#010017',
    paddingVertical: 12,
    alignItems: 'center'
  },
  switchButtonActive: {
    backgroundColor: '#A9F6CB'
  },
  switchButtonText: {
    color: '#A9F6CB',
    fontSize: 16,
    fontWeight: 'bold'
  },
  switchButtonTextActive: {
    color: '#010017'
  },

  formContainer: {
    marginTop: 10
  },
  formTitle: {
    color: '#A9F6CB',
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 4
  },
  formSubtitle: {
    color: '#A9F6CB',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#A9F6CB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: '#A9F6CB',
    marginBottom: 12
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
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
