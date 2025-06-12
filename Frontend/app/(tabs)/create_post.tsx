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
  TextStyle,
  Platform,
  Alert
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
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [posterId, setPosterId] = useState<string | null>(null)
  const [isUserTeam, setIsUserTeam] = useState(false) // Vrai si l'utilisateur est une 'équipe', faux sinon
  const [images, setImages] = useState<string[]>([])

  // Récupère l'ID et le type de l'utilisateur depuis AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await AsyncStorage.getItem('userId')
      const userType = await AsyncStorage.getItem('type')
      setPosterId(userId)
      setIsUserTeam(userType === 'team')
    }
    fetchUserData()
  }, [])

  const titleCharsCount = `${postTitle.length}/${TITLE_CHAR_LIMIT}`
  const descCharsCount = `${postContent.length}/${DESC_CHAR_LIMIT}`

  const apiUrlPost = `${process.env.EXPO_PUBLIC_API_URL}/posts/create`
  const mode = isUserTeam ? 'offer' : 'regular' // Détermine le mode en fonction du type d'utilisateur

  // Fonction pour créer un post
  const createPost = async () => {
    try {
      let response = await fetch(apiUrlPost, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          title: postTitle,
          description: postContent,
          posterId: posterId,
          type: mode // Envoie le type de post (offre ou régulier)
        })
      })
      const result = await response.json()

      console.log('Résultat de la création du post:', result)
      console.log("Ajout d'images:", images)

      const formData = new FormData()
      if (images) {
        images.forEach((uri, index) => {
          formData.append('images', {
            uri,
            name: `image_${index}.jpg`,
            type: 'image/jpeg'
          } as any)
        })
      }

      response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/posts/update/${result.id}`,
        {
          method: 'PUT',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        }
      )

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la création du post')
      }

      Alert.alert('Succès', 'Post créé avec succès !')
      console.log('reponse:', response)
      // Réinitialise les champs après la création du post
      setPostTitle('')
      setPostContent('')
      setImages([])
      router.push('/feed')
    } catch (error) {
      console.error('Erreur lors de la création du post:', error)
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la création du post.'
      )
    }
  }

  return (
    <>
      <View style={styles.pageContainer}>
        {/* En-tête personnalisé */}
        <CustomStackScreen title='Créer un post' />

        <View style={styles.scrollWrapper}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Section de saisie du titre */}
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

            {/* Section de saisie de la description */}
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

            {/* Section de sélection et d'affichage des images */}
            <View style={styles.imagesContainer}>
              {images.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      const newList = [...images]
                      newList.splice(index, 1) // Supprime l'image à l'index
                      setImages(newList)
                    }}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                  <Image source={{ uri: img }} style={styles.imageThumbnail} />
                </View>
              ))}
              {/* Bouton pour ajouter une image (visible si moins de 4 images) */}
              {images.length < 4 && (
                <View style={styles.imageWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.addImageButton,
                      { width: '100%', height: '100%' }
                    ]}
                    onPress={async () => {
                      // Lance la bibliothèque d'images pour choisir une image
                      const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 0.8,
                        base64: false
                      })

                      if (!result.canceled && result.assets[0]) {
                        setImages([...images, result.assets[0].uri]) // Ajoute la nouvelle URI d'image à la liste
                      }
                    }}
                  >
                    <Text style={styles.addImageText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.sectionSpacer} />

            {/* Bouton de publication */}
            <TouchableOpacity onPress={createPost} style={styles.publishButton}>
              {isUserTeam ? (
                <Text style={styles.publishButtonText}>Publier l'offre</Text> // Texte pour une offre
              ) : (
                <Text style={styles.publishButtonText}>Publier le post</Text> // Texte pour un post régulier
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      <BottomNavbar />
    </>
  )
}
