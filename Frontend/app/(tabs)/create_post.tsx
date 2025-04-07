import { Stack } from 'expo-router'
import React, { useState, useEffect } from 'react'
import COLORS from './styles/colors'
import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from 'react-native'
import CustomStackScreen from '../components/CustomStackScreen'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Checkbox, HStack, NativeBaseProvider } from 'native-base'

export default function CreatePost() {
  const router = useRouter()
  const [mode, setMode] = useState<'regular' | 'offer'>('regular')
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [posterId, setPosterId] = useState<string | null>(null)
  const [isUserTeam, setIsUserTeam] = useState(false)

  // Charger l'ID utilisateur et vérifier s'il est une "team"
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await AsyncStorage.getItem('userId')
      const userType = await AsyncStorage.getItem('type')

      setPosterId(userId)
      setIsUserTeam(userType === 'team')
    }

    fetchUserData()
  }, [])

  const createPost = async () => {
    if (!posterId) {
      alert('ID utilisateur introuvable.')
      return
    }

    const apiUrl = 'http://10.57.32.33:5000/api/posts/create'
    console.log(mode)
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          type: mode
        },
        body: JSON.stringify({
          posterId,
          title: postTitle,
          description: postContent,
          imageList: []
        })
      })

      const result = await response.json()
      console.log('Réponse API :', result)

      if (!response.ok) {
        throw new Error(result.message || 'Une erreur est survenue')
      }

      alert('Votre post a été créé')
      router.push('/feed')
    } catch (error) {
      console.error('Erreur lors de la création du post :', error)
      alert('Erreur lors de la création du post. Vérifiez votre connexion.')
    }
  }

  return (
    <NativeBaseProvider>
      <CustomStackScreen title='Créer un post' />
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          placeholder='Titre'
          style={styles.inputWrapper}
          placeholderTextColor={COLORS.main_blue}
          value={postTitle}
          onChangeText={setPostTitle}
        />
        <TextInput
          placeholder='Contenu'
          multiline
          style={styles.inputWrapper}
          placeholderTextColor={COLORS.main_blue}
          value={postContent}
          onChangeText={setPostContent}
        />
        {isUserTeam && <OffreCheckbox mode={mode} setMode={setMode} />}
        <TouchableOpacity onPress={createPost} style={styles.createButton}>
          <Text style={{ color: '#fff' }}>Créer</Text>
        </TouchableOpacity>
      </ScrollView>
    </NativeBaseProvider>
  )
}

const OffreCheckbox = ({
  mode,
  setMode
}: {
  mode: 'regular' | 'offer'
  setMode: (mode: 'regular' | 'offer') => void
}) => {
  const [isChecked, setIsChecked] = useState(mode === 'offer')

  const handleCheckboxChange = () => {
    const newMode = isChecked ? 'regular' : 'offer'
    setIsChecked(!isChecked)
    setMode(newMode)
  }

  return (
    <HStack space={6} alignItems='center'>
      <Checkbox isChecked={isChecked} onChange={handleCheckboxChange} value=''>
        <Text style={styles.text}>Ce post est une offre.</Text>
      </Checkbox>
    </HStack>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background_blue,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
    marginBottom: 12,
    width: '80%'
  },
  createButton: {
    backgroundColor: COLORS.main_blue,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 12
  }
})
