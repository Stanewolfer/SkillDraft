import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Animated,
  Dimensions
} from 'react-native'
import * as Unicons from '@iconscout/react-native-unicons'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '../(tabs)/styles/colors'
// eslint-disable-next-line import/no-unresolved
import { styles } from '@/app/(tabs)/styles/postCardStyles'

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
  poster,
  likes,
  reposts,
  comments
}: RegularPostCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const fadeAnim = React.useRef(new Animated.Value(1)).current
  const slideAnim = React.useRef(new Animated.Value(0)).current

  const backgroundImage =
    imageList && imageList.length > 0 ? imageList[currentImageIndex] : undefined

  const animateImageChange = React.useCallback(() => {
    if (!imageList || imageList.length <= 1) return

    // Animation de sortie
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
      )

      // Reset position pour l'animation d'entrée
      slideAnim.setValue(50)

      // Animation d'entrée
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
    if (imageList && imageList.length > 1) {
      const interval = setInterval(animateImageChange, 4000)
      return () => clearInterval(interval)
    }
  }, [imageList, animateImageChange])

  console.log('PostCard rendered with backgroundImage:', backgroundImage)

  return (
    <View>
      {backgroundImage ? (
        <View style={styles.cardWrapper}>
          <View style={styles.imageBackground}>
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

            <View
              style={{ padding: 10, flex: 1, justifyContent: 'space-between' }}
            >
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
                <View style={styles.watchImageContainer}>
                  <Unicons.UilAirplay size={18} color={COLORS.main_blue} />
                  <Text style={styles.watchImageText}>Regarder les images</Text>
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
          <View>
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
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
