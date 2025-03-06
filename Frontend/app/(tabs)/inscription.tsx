import { Stack } from 'expo-router'
import React, { useState, useEffect } from 'react'
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal
} from 'react-native'
import { COLORS } from './styles/colors'
import CustomStackScreen from '../components/CustomStackScreen'

// Hexadecimal → RGB conversion
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  hex = hex.replace('#', '')
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('')
  }
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return { r, g, b }
}

// RGB → Hexadecimal Conversion
function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  )
}

// User input parsing function (hex or RGB)
function parseColorInput(input: string): string | null {
  input = input.trim()
  if (input.startsWith('#')) {
    if (input.length === 4 || input.length === 7) {
      return input.toUpperCase()
    }
  } else {
    const parts = input.split(',')
    if (parts.length === 3) {
      const r = parseInt(parts[0].trim(), 10)
      const g = parseInt(parts[1].trim(), 10)
      const b = parseInt(parts[2].trim(), 10)
      if (
        !isNaN(r) &&
        !isNaN(g) &&
        !isNaN(b) &&
        r >= 0 &&
        r <= 255 &&
        g >= 0 &&
        g <= 255 &&
        b >= 0 &&
        b <= 255
      ) {
        return rgbToHex(r, g, b)
      }
    }
  }
  return null
}

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

  // State for "personne" mode
  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [description, setDescription] = useState('')
  const [teamId, setTeamId] = useState('')

  // State for "organisation" mode
  const [teamName, setTeamName] = useState('')
  const [ceoLastName, setCeoLastName] = useState('')
  const [ceoFirstName, setCeoFirstName] = useState('')
  const [orgEmail, setOrgEmail] = useState('')
  const [orgPassword, setOrgPassword] = useState('')
  const [orgDescription, setOrgDescription] = useState('')
  const [teamColor, setTeamColor] = useState('#FFFFFF')

  // States for color selection modal
  const [colorPickerVisible, setColorPickerVisible] = useState(false)
  const [colorInput, setColorInput] = useState(teamColor)

  // Update input when opening modal
  useEffect(() => {
    if (colorPickerVisible) {
      setColorInput(teamColor)
    }
  }, [colorPickerVisible, teamColor])

  // The preview updates in real time according to the input
  const previewColor = parseColorInput(colorInput) || teamColor
  const previewRGB = hexToRgb(previewColor)

  // Submit function that prepares data to be sent to the backend
  const handleSubmit = async () => {
    const apiUrl = 'http://localhost:5000/api/auth/register'
    try {
      const data =
        mode === Mode.Personne
          ? {
              username,
              firstName,
              lastName,
              email,
              password,
              description: description || null,
              teamId: teamId || null
            }
          : {
              username: teamName,
              ceoFirstName,
              ceoLastName,
              email: orgEmail,
              password: orgPassword,
              description: orgDescription || null,
              teamColor
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
      alert('Inscription réussie !')
    } catch (error) {
      console.error('Erreur lors de l’inscription :', error)
      alert('Erreur lors de l’inscription. Vérifie ta connexion et réessaie.')
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
                  value={lastName}
                  onChangeText={setLastName}
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
                  value={description}
                  onChangeText={setDescription}
                />
                <CustomInput
                  placeholder='Equipe dont vous faites partie (Optionnel)'
                  value={teamId}
                  onChangeText={setTeamId}
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
                  value={ceoLastName}
                  onChangeText={setCeoLastName}
                />
                <CustomInput
                  placeholder='Prénom du gérant'
                  required={true}
                  value={ceoFirstName}
                  onChangeText={setCeoFirstName}
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
                  value={orgDescription}
                  onChangeText={setOrgDescription}
                />
                <TouchableOpacity
                  style={[styles.colorPicker, { backgroundColor: teamColor }]}
                  onPress={() => setColorPickerVisible(true)}
                >
                  <Text style={styles.colorPickerText}>
                    Choisir la couleur de l'équipe
                  </Text>
                </TouchableOpacity>
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

      <Modal
        visible={colorPickerVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setColorPickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionnez une couleur</Text>
            <View style={styles.previewContainer}>
              <View
                style={[styles.colorPreview, { backgroundColor: previewColor }]}
              />
              <Text style={styles.previewText}>Hex: {previewColor}</Text>
              <Text style={styles.previewText}>
                RGB: ({previewRGB.r}, {previewRGB.g}, {previewRGB.b})
              </Text>
            </View>
            <TextInput
              style={styles.hexInput}
              placeholder='Hex (#FFFFFF) ou RGB (255,255,255)'
              placeholderTextColor='#000000'
              value={colorInput}
              onChangeText={setColorInput}
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  const newColor = parseColorInput(colorInput)
                  if (newColor) {
                    setTeamColor(newColor)
                    setColorPickerVisible(false)
                  } else {
                    alert('Valeur de couleur invalide. Veuillez réessayer.')
                  }
                }}
              >
                <Text style={styles.modalButtonText}>Valider</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setColorPickerVisible(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  colorPicker: {
    height: 50,
    width: '100%',
    borderWidth: 1.5,
    borderColor: COLORS.main_blue,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  colorPickerText: {
    fontWeight: 'bold'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: COLORS.text_white,
    width: '85%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  previewContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 15
  },
  colorPreview: {
    width: 60,
    height: 60,
    borderWidth: 1.5,
    borderRadius: 4,
    marginBottom: 10
  },
  colorValues: {
    alignItems: 'center'
  },
  previewText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  hexInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 15
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  },
  modalButton: {
    backgroundColor: COLORS.main_blue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5
  },
  modalButtonText: {
    fontWeight: 'bold'
  }
})
