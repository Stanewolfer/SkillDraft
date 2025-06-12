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
  const [mode, setMode] = useState<'regular' | 'offer'>('regular')
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [posterId, setPosterId] = useState<string | null>(null)
  const [isUserTeam, setIsUserTeam] = useState(false) // Vrai si l'utilisateur est une 'équipe', faux sinon
  const [imageList, setImageList] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<Error | null>(null)

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

  const createPost = async () => {
    if (!posterId) {
      Alert.alert('Erreur', 'ID utilisateur introuvable.')
      return
    }
    if (!postTitle || !postContent) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setUploadError(null)

    // Détermine le mode du post ('offer' ou 'regular')
    const postMode = isUserTeam ? 'offer' : 'regular'

    console.log('=== DEBUG UPLOAD ===')
    console.log('PosterId:', posterId)
    console.log('Title:', postTitle)
    console.log('Description:', postContent)
    console.log('Mode:', postMode)
    console.log('Images count:', imageList.length)
    console.log('Images URIs:', imageList)

    return new Promise((resolve, reject) => {
      try {
        const formData = new FormData()

        // Ajoute les données du post au FormData
        formData.append('posterId', posterId)
        formData.append('title', postTitle)
        formData.append('description', postContent)
        formData.append('type', postMode)

        // Ajoute chaque image au FormData
        imageList.forEach((imageUri, index) => {
          let cleanUri = imageUri
          // Prépare l'URI pour Android si nécessaire
          if (Platform.OS === 'android' && !imageUri.startsWith('file://')) {
            cleanUri = `file://${imageUri}`
          }

          // Détermine le type MIME de l'image
          const getTypeFromUri = (uri: string) => {
            const ext = uri.split('.').pop()?.toLowerCase()
            switch (ext) {
              case 'jpg':
              case 'jpeg':
                return 'image/jpeg'
              case 'png':
                return 'image/png'
              case 'gif':
                return 'image/gif'
              default:
                return 'image/jpeg'
            }
          }

          formData.append('images', {
            uri: cleanUri,
            type: getTypeFromUri(cleanUri),
            name: `image_${Date.now()}_${index}.${cleanUri.split('.').pop()}`
          } as any)
        })

        const xhr = new XMLHttpRequest()

        // Gère la progression de l'upload
        xhr.upload.onprogress = event => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100
            setUploadProgress(progress)
            console.log(`Progression: ${Math.round(progress)}%`)
          }
        }

        // Gère la réponse de la requête
        xhr.onload = () => {
          setIsUploading(false)

          if (xhr.status >= 200 && xhr.status < 300) {
            console.log('Upload terminé avec succès')
            setUploadProgress(100)
            Alert.alert('Succès', 'Votre post a été créé')
            router.push('/feed')
            resolve(xhr.response)
          } else {
            const error = new Error(`HTTP ${xhr.status}: ${xhr.responseText}`)
            setUploadError(error)
            Alert.alert('Erreur', 'Erreur lors de la création du post')
            reject(error)
          }
        }

        // Gère les erreurs réseau
        xhr.onerror = () => {
          setIsUploading(false)
          const error = new Error('Erreur réseau')
          setUploadError(error)
          Alert.alert('Erreur', "Erreur réseau lors de l'upload")
          reject(error)
        }

        // Gère les timeouts de requête
        xhr.ontimeout = () => {
          setIsUploading(false)
          const error = new Error('Timeout de la requête')
          setUploadError(error)
          Alert.alert('Erreur', 'La requête a pris trop de temps')
          reject(error)
        }

        // Ouvre la connexion et envoie la requête
        xhr.open('POST', `${process.env.EXPO_PUBLIC_API_URL}/posts/create`)
        xhr.timeout = 30000 // 30 secondes de timeout
        
        // Définit l'en-tête personnalisé pour le mode du post
        xhr.setRequestHeader('X-Post-Mode', postMode); 
        
        xhr.send(formData)
      } catch (error) {
        console.error('=== ERREUR COMPLÈTE ===')
        console.error(
          'Error message:',
          error instanceof Error ? error.message : 'Unknown error'
        )
        console.error('Full error:', error)

        setIsUploading(false)
        setUploadError(
          error instanceof Error ? error : new Error('Erreur inconnue')
        )
        Alert.alert('Erreur', 'Erreur lors de la création du post')
        reject(error)
      }
    })
  }

  const titleCharsCount = `${postTitle.length}/${TITLE_CHAR_LIMIT}`
  const descCharsCount = `${postContent.length}/${DESC_CHAR_LIMIT}`
  
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
              {imageList.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      const newList = [...imageList]
                      newList.splice(index, 1) // Supprime l'image à l'index
                      setImageList(newList)
                    }}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                  <Image source={{ uri: img }} style={styles.imageThumbnail} />
                </View>
              ))}
              {/* Bouton pour ajouter une image (visible si moins de 4 images) */}
              {imageList.length < 4 && (
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
                        quality: 0.8
                      })

                      if (!result.canceled && result.assets[0]) {
                        setImageList([...imageList, result.assets[0].uri]) // Ajoute la nouvelle URI d'image à la liste
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
