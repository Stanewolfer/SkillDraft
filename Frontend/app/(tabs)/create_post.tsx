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

  const logout = async () => {
    await AsyncStorage.clear()
    router.push('/')
  }

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

    console.log('=== DÉBUT DEBUG ===')
    console.log('imageList:', imageList)
    console.log('imageList.length:', imageList.length)

    const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/posts/create`

    try {
      // Créer un FormData
      const formData = new FormData()

      // Ajouter les données textuelles
      formData.append('type', mode)
      formData.append('posterId', posterId)
      formData.append('title', postTitle)
      formData.append('description', postContent)

      if (imageList.length > 0) {
        imageList.forEach((imageUri: string, index: number) => {
          // Obtenir le nom du fichier à partir de l'URI
          const fileName = imageUri.split('/').pop()

          // Déterminer le type MIME
          const match = /\.(\w+)$/.exec(imageUri)
          const type = match ? `image/${match[1]}` : 'image/jpeg'

          // Créer l'objet fichier pour chaque image
          const imageFile = {
            uri: imageUri,
            type: type,
            name: fileName || `image${index}.jpg`
          }

          // Ajouter au FormData avec la clé 'images'
          formData.append('images', imageFile as any)
        })
      }

      console.log('FormData:', Array.from(formData.entries()))
      console.log('FormData keys:', Array.from(formData.keys()))

      // Envoyer la requête POST avec le content-type multipart/form-data
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type':
            'multipart/form-data; boundary=<calculated when request is sent>'
        },
        body: formData
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Array.from(response.headers.entries()))

      const result = await response.json()
      console.log('Response result:', result)

      if (!response.ok) {
        throw new Error(result.message || 'Une erreur est survenue')
      }
      alert('Votre post a été créé')
      console.log('Post créé avec succès:', result)
      console.log("=== FIN DEBUG ===")
      router.push('/feed')
    } catch (error) {
      console.error('Erreur lors de la création du post :', error)
      alert('Erreur lors de la création du post, veuillez réessayer.')
      console.log("=== FIN DEBUG ===")
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
              {imageList.map((img: any, index: number) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: img }} style={styles.imageThumbnail} />
                  <TouchableOpacity
                    onPress={() => {
                      const newList = [...imageList]
                      newList.splice(index, 1)
                      setImageList(newList)
                    }}
                  >
                    <Text>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {imageList.length < 4 && (
                <TouchableOpacity
                  style={styles.addImageButton}
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
              )}
            </View>

            <View style={styles.sectionSpacer} />

            {
              isUserTeam && (
                <OffreCheckbox mode={mode} setMode={setMode} />
              ) /* to check because there are problems when putting the front on */
            }
            <TouchableOpacity onPress={createPost} style={styles.publishButton}>
              <Text style={styles.publishButtonText}>PUBLIER</Text>
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
  pageContainer: {
    flex: 1,
    backgroundColor: COLORS.background_blue
  },
  scrollWrapper: {
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.main_blue,
    borderRadius: 25,
    overflow: 'hidden'
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80
  },
  sectionSpacer: {
    height: 20
  },
  inputContainer: {
    marginBottom: 24
  },
  inputLabel: {
    color: COLORS.main_blue,
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: 8
  },
  inputWrapper: {
    position: 'relative'
  },
  inputField: {
    borderWidth: 1,
    borderColor: COLORS.main_blue,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: COLORS.main_blue,
    fontSize: 14,
    backgroundColor: hexToRgba(COLORS.main_blue, 0.3)
  },
  charCountAbsolute: {
    position: 'absolute',
    bottom: 4,
    right: 8,
    color: COLORS.main_blue,
    fontSize: 12
  },
  editorToolBar: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center'
  },
  editorButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderColor: COLORS.main_blue,
    borderWidth: 1,
    backgroundColor: 'transparent',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  editorButtonText: {
    color: COLORS.main_blue,
    fontWeight: '700',
    fontSize: 16
  },
  verticalSeparator: {
    width: 1,
    height: 35,
    backgroundColor: COLORS.main_blue,
    marginRight: 8
  },
  letterContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  superscript: {
    position: 'absolute',
    top: 2,
    right: 2,
    fontSize: 10,
    color: COLORS.main_blue
  },
  imagesContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center'
  },
  imageWrapper: {
    marginRight: 8,
    position: 'relative'
  },
  imageThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8
  },
  addImageButton: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.main_blue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addImageText: {
    color: COLORS.main_blue,
    fontSize: 24,
    fontWeight: 'bold'
  },
  publishButton: {
    backgroundColor: COLORS.main_blue,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 40
  },
  publishButtonText: {
    color: COLORS.background_blue,
    fontSize: 16,
    fontWeight: '700'
  },
  text: {
    color: COLORS.main_blue
  }
})
