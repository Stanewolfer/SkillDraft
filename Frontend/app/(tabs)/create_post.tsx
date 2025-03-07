import { Stack } from 'expo-router'
import React, { useState } from 'react'
import { COLORS } from './styles/colors'
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import CustomStackScreen from '../components/CustomStackScreen'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Checkbox, HStack, NativeBaseProvider } from 'native-base'

export default function ConnexionScreen() {
  const router = useRouter()

  // const [mode, setMode] = useState<Mode>(Mode.Personne)

  return (
    <NativeBaseProvider>
        <CustomStackScreen title="Créer un post" />
        <ScrollView contentContainerStyle={styles.container}>
            <TextInput
                placeholder="Titre"
                style={ styles.inputWrapper }
                placeholderTextColor={COLORS.main_blue}
            />
            <TextInput
                placeholder="Contenu"
                multiline
                style={ styles.inputWrapper }
                placeholderTextColor={COLORS.main_blue}
            />
            <OffreCheckbox />
            <TouchableOpacity
                onPress={() => {
                    // Mettre la logique de création de post
                }}
                style={{ backgroundColor: COLORS.background_blue, padding: 10, alignItems: 'center' }}
            >
                <Text style={{ color: '#fff' }}>Créer</Text>
            </TouchableOpacity>
        </ScrollView>
    </NativeBaseProvider>
  )
}

const OffreCheckbox = () => {
    return <HStack space={6}>
        <Checkbox value="test" defaultIsChecked>
            <Text style={styles.text}>Ce post est une offre.</Text>
            </Checkbox>
      </HStack>;
  };

const checkboxStyle = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    checkbox: {
      alignSelf: 'center',
    },
    label: {
      margin: 8,
    },
  });

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background_blue,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: COLORS.main_blue
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.main_blue,
        color: COLORS.main_blue,
        borderRadius: 25,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 12
    },
})