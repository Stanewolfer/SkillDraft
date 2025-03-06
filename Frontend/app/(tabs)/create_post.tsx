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

export default function ConnexionScreen() {
  const router = useRouter()

  // const [mode, setMode] = useState<Mode>(Mode.Personne)

  return (
    <>
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
            <TouchableOpacity
                onPress={() => {
                    // Handle post creation logic here
                }}
                style={{ backgroundColor: COLORS.background_blue, padding: 10, alignItems: 'center' }}
            >
                <Text style={{ color: '#fff' }}>Créer</Text>
            </TouchableOpacity>
        </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background_blue,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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