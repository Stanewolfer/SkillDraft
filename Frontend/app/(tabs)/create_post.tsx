import { Stack } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Image,
  StyleProp,
  TextStyle
} from 'react-native'
import { COLORS } from './styles/colors'
import CustomStackScreen from '../components/CustomStackScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BottomNavbar } from '../components/BottomNavbar'
import { styles } from './styles/createPostStyles'
import { Checkbox, HStack, NativeBaseProvider } from 'native-base'

const TITLE_CHAR_LIMIT = 200
const DESC_CHAR_LIMIT = 2000

export default function CreatePost() {
  const router = useRouter()
  const [mode, setMode] = useState<'regular' | 'offer'>('regular')
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [posterId, setPosterId] = useState<string | null>(null)
  const [isUserTeam, setIsUserTeam] = useState(false)
  const [imageList, setImageList] = useState<string[]>([])

  // Load user ID and check if it is a "team"
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
    if (!postTitle || !postContent) {
      alert('Veuillez remplir tous les champs.')
      return
    }

    if (isUserTeam) {
      setMode('offer')
    } else {
      setMode('regular')
    }

    const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/posts/create`

    try {
      const formData = new FormData()

      formData.append('posterId', posterId)
      formData.append('title', postTitle)
      formData.append('description', postContent)

      imageList.forEach((imageUri, index) => {
        formData.append(
          'images',
          JSON.stringify({
            uri: imageUri,
            type: 'image/jpeg',
            name: `image_${index}.jpg`
          })
        )
      })

      // Générer un boundary unique
      const boundary = `----formdata-react-native-${Date.now()}`

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          type: mode
        },
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Une erreur est survenue')
      }

      alert('Votre post a été créé')
      router.push('/feed')
    } catch (error) {
      console.error('Erreur lors de la création du post :', error)
      alert('Erreur lors de la création du post, veuillez réessayer.')
    }
  }

  const titleCharsCount = `${postTitle.length}/${TITLE_CHAR_LIMIT}`
  const descCharsCount = `${postContent.length}/${DESC_CHAR_LIMIT}`

  return (
    <>
      <View style={styles.pageContainer}>
        <CustomStackScreen title='Créer un post' />

        <View style={styles.scrollWrapper}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Titre de votre post</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder='Entrez le titre'
                  style={styles.inputField}
                  placeholderTextColor={COLORS.main_blue}
                  value={postTitle}
                  onChangeText={text => {
                    if (text.length <= TITLE_CHAR_LIMIT) setPostTitle(text)
                  }}
                />
                <Text style={styles.charCountAbsolute}>{titleCharsCount}</Text>
              </View>
            </View>

            <View style={styles.sectionSpacer} />

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>

              <View style={[styles.inputWrapper, { height: 100 }]}>
                <TextInput
                  placeholder='Commencez à écrire'
                  multiline
                  style={[styles.inputField, { height: '100%' }]}
                  placeholderTextColor={COLORS.main_blue}
                  value={postContent}
                  onChangeText={text => {
                    if (text.length <= DESC_CHAR_LIMIT) setPostContent(text)
                  }}
                />
                <Text style={styles.charCountAbsolute}>{descCharsCount}</Text>
              </View>
            </View>

            <View style={styles.sectionSpacer} />

            <View style={styles.imagesContainer}>
              {imageList.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      const newList = [...imageList]
                      newList.splice(index, 1)
                      setImageList(newList)
                    }}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                  <Image source={{ uri: img }} style={styles.imageThumbnail} />
                </View>
              ))}
              {imageList.length < 4 && (
                <View style={styles.imageWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.addImageButton,
                      { width: '100%', height: '100%' }
                    ]}
                    onPress={async () => {
                      const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 0.1
                      })

                      if (!result.canceled && result.assets[0]) {
                        setImageList([...imageList, result.assets[0].uri])
                      }
                    }}
                  >
                    <Text style={styles.addImageText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.sectionSpacer} />

            <TouchableOpacity onPress={createPost} style={styles.publishButton}>
              {isUserTeam ? (
                <Text style={styles.publishButtonText}>Publier l'offre</Text>
              ) : (
                <Text style={styles.publishButtonText}>Publier le post</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </>
  )
}

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '')
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
