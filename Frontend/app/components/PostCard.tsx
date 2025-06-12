import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Animated,
  Dimensions,
  Modal
} from 'react-native'
import * as Unicons from '@iconscout/react-native-unicons'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '../(tabs)/styles/colors'
// eslint-disable-next-line import/no-unresolved
import { styles } from '../(tabs)/styles/postCardStyles'

const { width } = Dimensions.get('window')

interface RegularPostCardProps {
  id?: string
  type?: 'regular' | 'offer'
  title: string
  description: string
  imageList?: string[]
  poster: {
    username: string
    avatarUrl: string
    teamName?: string
    isVerified?: boolean
  }
  likes?: number
  reposts?: number
  comments?: any[] // ou nombre
}

export default function PostCard({
  title,
  description,
  imageList,
  poster
}: RegularPostCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const fadeAnim = React.useRef(new Animated.Value(1)).current
  const slideAnim = React.useRef(new Animated.Value(0)).current
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [modalVisible, setModalVisible] = React.useState(false)

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  const backgroundImage =
    imageList && imageList.length > 0 ? imageList[currentImageIndex] : undefined

  const animateImageChange = React.useCallback(() => {
    if (!imageList || imageList.length <= 1) return // Animation de sortie

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      // Changer l'image
      setCurrentImageIndex(prevIndex =>
        prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
      ) // Reset position pour l'animation d'entrée

      slideAnim.setValue(50) // Animation d'entrée

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ]).start()
    })
  }, [imageList, fadeAnim, slideAnim])

  React.useEffect(() => {
    if (imageList && imageList.length > 1 && !modalVisible) {
      // Démarrer l'intervalle pour changer les images toutes les 4 secondes
      const interval = setInterval(animateImageChange, 4000)
      return () => clearInterval(interval)
    }
  }, [imageList, animateImageChange, modalVisible])

  const ImagesModal = (
    <Modal
      animationType='slide'
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        onPress={() => setModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={e => e.stopPropagation()}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          {imageList && imageList.length > 1 && (
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.background_main_blue,
                padding: 10,
                borderRadius: 25,
                marginRight: -30,
                zIndex: 1
              }}
              onPress={e => {
                e.stopPropagation()
                setCurrentImageIndex(prev =>
                  prev === 0 ? imageList.length - 1 : prev - 1
                )
              }}
            >
              <Unicons.UilAngleLeft size={40} color={COLORS.dark_main_blue} />
            </TouchableOpacity>
          )}

          <Image
            source={{ uri: imageList?.[currentImageIndex] }}
            style={[
              styles.modalImage,
              { width: width - 80, height: width - 80 }
            ]}
            resizeMode='contain'
          />

          {imageList && imageList.length > 1 && (
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.background_main_blue,
                padding: 10,
                borderRadius: 25,
                marginLeft: -30,
                zIndex: 1
              }}
              onPress={e => {
                e.stopPropagation()
                setCurrentImageIndex(prev =>
                  prev === imageList.length - 1 ? 0 : prev + 1
                )
              }}
            >
              <Unicons.UilAngleRight size={40} color={COLORS.dark_main_blue} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  )

  const ImagesCarousel = (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }]
        }
      ]}
    >
      <ImageBackground
        source={{ uri: backgroundImage }}
        resizeMode='cover'
        style={StyleSheet.absoluteFillObject}
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.6)', 'rgba(0,0,0,1)']}
          style={StyleSheet.absoluteFillObject}
        />
      </ImageBackground>
    </Animated.View>
  )

  const PosterInfos = (
    <View style={styles.posterInfo}>
      <Image source={{ uri: poster.avatarUrl }} style={styles.avatar} />
      <Text style={styles.nameTitle}>{poster.username}</Text>
      {poster.isVerified && (
        <View>
          <Text>✔</Text>
        </View>
      )}
    </View>
  )

  const PostActions = (
    <View style={styles.buttonsContainer}>
      <TouchableOpacity>
        <Unicons.UilHeart size={25} color={COLORS.main_blue} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Unicons.UilCommentAlt size={25} color={COLORS.main_blue} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Unicons.UilRepeat size={25} color={COLORS.main_blue} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Unicons.UilCornerUpRight size={25} color={COLORS.main_blue} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Unicons.UilRepeat size={25} color={COLORS.main_blue} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Unicons.UilCornerUpRight size={25} color={COLORS.main_blue} />
      </TouchableOpacity>
    </View>
  )

  return (
    <View>
      {backgroundImage ? (
        <View style={styles.cardWrapper}>
          <View style={styles.imageBackground}>
            {ImagesCarousel}
            <View
              style={{ padding: 10, flex: 1, justifyContent: 'space-between' }}
            >
              <View>
                <View>
                  {PosterInfos}
                  {poster.teamName && (
                    <Text style={{ color: COLORS.text_white }}>
                      [{poster.teamName}]
                    </Text>
                  )}
                </View>
                {/* Indicateurs de carousel */}
                {imageList && imageList.length > 1 && (
                  <View style={styles.carouselIndicators}>
                    {imageList.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.indicator,

                          {
                            backgroundColor:
                              index === currentImageIndex
                                ? COLORS.main_blue
                                : 'rgba(255,255,255,0.3)'
                          }
                        ]}
                      />
                    ))}
                  </View>
                )}
              </View>
              <View>
                <TouchableOpacity
                  style={styles.watchImageContainer}
                  onPress={() => setModalVisible(true)}
                >
                  <Unicons.UilAirplay size={18} color={COLORS.main_blue} />
                  <Text style={styles.watchImageText}>
                    {(imageList?.length ?? 0) > 1
                      ? `Voir ${imageList?.length} images`
                      : "Voir l'image"}
                  </Text>
                </TouchableOpacity>
                {ImagesModal}
                <View
                  style={{
                    height: 1,
                    backgroundColor: COLORS.main_blue,
                    marginVertical: 10
                  }}
                />
                <Text
                  style={{
                    color: COLORS.text_white,
                    fontWeight: 'bold',
                    fontSize: 20,
                    marginBottom: 5
                  }}
                >
                  {title}
                </Text>
                <Text style={{ color: COLORS.text_white, marginBottom: 5 }}>
                  {isExpanded ? description : truncateText(description, 200)}
                  {description.length > 200 && (
                    <Text
                      onPress={() => setIsExpanded(!isExpanded)}
                      style={{ color: COLORS.main_blue, fontWeight: 'bold' }}
                    >
                      {isExpanded ? ' Voir moins' : ' Voir plus'}
                    </Text>
                  )}
                </Text>
                <View>
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity>
                      <Unicons.UilHeart size={25} color={COLORS.main_blue} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Unicons.UilCommentAlt
                        size={25}
                        color={COLORS.main_blue}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Unicons.UilRepeat size={25} color={COLORS.main_blue} /> 
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Unicons.UilCornerUpRight
                        size={25}
                        color={COLORS.main_blue}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={[styles.cardWrapper, { padding: 10 }]}>
          <View>
            <View>
              <View style={styles.posterInfo}>
                <Image
                  source={{ uri: poster.avatarUrl }}
                  style={styles.avatar}
                />
                <Text style={styles.nameTitle}>{poster.username}</Text>
                {poster.isVerified && (
                  <View>
                    <Text>✔</Text>
                  </View>
                )}
              </View>
              {poster.teamName && <Text>[{poster.teamName}]</Text>}
            </View>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: COLORS.main_blue,
              marginVertical: 10
            }}
          />
          <Text
            style={{
              color: COLORS.text_white,
              fontWeight: 'bold',
              fontSize: 20,
              marginBottom: 5
            }}
          >
            {title}
          </Text>
          <Text style={{ color: COLORS.text_white, marginBottom: 5 }}>
            {description}
          </Text>
          <View>{PostActions}</View>
        </View>
      )}
    </View>
  )
}
