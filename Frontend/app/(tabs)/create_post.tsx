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
  Platform
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
  const [mode, setMode] = useState<'regular' | 'offer'>('regular') // Mode will be determined by user type
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [posterId, setPosterId] = useState<string | null>(null)
  const [isUserTeam, setIsUserTeam] = useState(false) // True if user is a 'team', false otherwise
  const [imageList, setImageList] = useState<string[]>([])

  // Fetch user ID and user type to determine if it's a team or an individual user
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await AsyncStorage.getItem('userId')
      const userType = await AsyncStorage.getItem('type')
      setPosterId(userId)
      setIsUserTeam(userType === 'team')
    }
    fetchUserData()
  }, [])

  // Function to create FormData for the API request
  const createFormData = (images: string[], postData: any) => {
    const formData = new FormData()

    // Add post data fields
    formData.append('posterId', postData.posterId)
    formData.append('title', postData.title)
    formData.append('description', postData.description)

    // Add each image with the correct field name ('images')
    images.forEach((imageUri, index) => {
      console.log(`Processing image ${index}: ${imageUri}`)

      // Clean the URI based on the platform (especially for Android)
      let cleanUri = imageUri
      if (Platform.OS === 'android' && !imageUri.startsWith('file://')) {
        cleanUri = `file://${imageUri}`
      }

      // Determine the image type from its extension
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
            return 'image/jpeg' // Default to jpeg if type is unknown
        }
      }

      // Create the file object for FormData
      const imageFile = {
        uri: cleanUri,
        type: getTypeFromUri(cleanUri),
        name: `image_${Date.now()}_${index}.${cleanUri.split('.').pop()}` // Unique name to avoid conflicts
      } as any

      // Append the image file to FormData
      formData.append('images', imageFile)
    })

    return formData
  }

  const createPost = async () => {
    if (!posterId) {
      alert('ID utilisateur introuvable.') // User ID not found
      return
    }
    if (!postTitle || !postContent) {
      alert('Veuillez remplir tous les champs.') // Please fill in all fields
      return
    }

    // Determine the post mode BEFORE making the request
    const postMode = isUserTeam ? 'offer' : 'regular'
    const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/posts/create`

    console.log('=== DEBUG UPLOAD ===')
    console.log('PosterId:', posterId)
    console.log('Title:', postTitle)
    console.log('Description:', postContent)
    console.log('Mode:', postMode)
    console.log('Images count:', imageList.length)
    console.log('Images URIs:', imageList)
    console.log('API URL:', apiUrl)

    try {
      const postData = {
        posterId,
        title: postTitle,
        description: postContent
      }

      const formData = createFormData(imageList, postData)

      // Detailed FormData debug (note: FormData.entries() might not work on React Native)
      console.log('=== FORMDATA DEBUG ===')
      console.log('FormData created with images count:', imageList.length)

      console.log('=== SENDING REQUEST ===')
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          // IMPORTANT: Do NOT set 'Content-Type': 'multipart/form-data'.
          // fetch will automatically set it correctly, including the boundary,
          // when the body is a FormData object.
          type: postMode // Custom header for post type
        },
        body: formData // The FormData object
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response error text:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log('Success result:', result)
      alert('Votre post a été créé') // Your post has been created
      router.push('/feed') // Navigate to feed after successful post
    } catch (error) {
      console.error('=== ERREUR COMPLÈTE ===') // Full Error
      console.error(
        'Error message:',
        error instanceof Error ? error.message : 'Unknown error'
      )
      console.error(
        'Error stack:',
        error instanceof Error ? error.stack : 'No stack trace'
      )
      console.error('Full error:', error)
      alert('Erreur lors de la création du post, veuillez réessayer.') // Error creating post, please try again.
    }
  }

  const titleCharsCount = `${postTitle.length}/${TITLE_CHAR_LIMIT}`
  const descCharsCount = `${postContent.length}/${DESC_CHAR_LIMIT}`

  return (
    <>
      <View style={styles.pageContainer}>
        {/* Custom stack screen for header */}
        <CustomStackScreen title='Créer un post' />

        <View style={styles.scrollWrapper}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Title input section */}
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

            {/* Description input section */}
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

            {/* Image selection and display section */}
            <View style={styles.imagesContainer}>
              {imageList.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      const newList = [...imageList]
                      newList.splice(index, 1) // Remove image at index
                      setImageList(newList)
                    }}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                  <Image source={{ uri: img }} style={styles.imageThumbnail} />
                </View>
              ))}
              {/* Add image button (only if less than 4 images) */}
              {imageList.length < 4 && (
                <View style={styles.imageWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.addImageButton,
                      { width: '100%', height: '100%' }
                    ]}
                    onPress={async () => {
                      // Launch image library to pick an image
                      const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 0.8 // Increased quality for better results
                      })

                      if (!result.canceled && result.assets[0]) {
                        setImageList([...imageList, result.assets[0].uri]) // Add new image URI to list
                      }
                    }}
                  >
                    <Text style={styles.addImageText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.sectionSpacer} />

            {/* Publish button */}
            <TouchableOpacity onPress={createPost} style={styles.publishButton}>
              {isUserTeam ? (
                <Text style={styles.publishButtonText}>Publier l'offre</Text> // Publish offer
              ) : (
                <Text style={styles.publishButtonText}>Publier le post</Text> // Publish post
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      <BottomNavbar />
    </>
  )
}
