import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions
} from 'react-native'
import * as Unicons from '@iconscout/react-native-unicons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { COLORS } from '../(tabs)/styles/colors'

const { width } = Dimensions.get('window')

interface CompactPostCardProps {
  id?: string
  title: string
  description?: string
  imageUrl?: string
  poster: {
    id: string
    username: string
    avatarUrl: string
    isVerified?: boolean
  }
  stats?: {
    likes?: number
    views?: number
  }
  size?: 'small' | 'medium' // Taille du composant compact
}

export default function CompactPostCard({
  title,
  description,
  imageUrl,
  poster,
  stats,
  size = 'medium'
}: CompactPostCardProps) {
  const router = useRouter()

  const cardWidth = size === 'small' ? width * 0.4 : width * 0.6
  const cardHeight = size === 'small' ? 120 : 160

  const compactStyles = StyleSheet.create({
    cardContainer: {
      width: cardWidth,
      height: cardHeight,
      borderRadius: 12,
      overflow: 'hidden',
      marginHorizontal: 8,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84
    },
    backgroundImage: {
      flex: 1,
      justifyContent: 'space-between'
    },
    gradient: {
      flex: 1,
      padding: 8,
      justifyContent: 'space-between'
    },
    topSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    posterInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1
    },
    avatar: {
      width: size === 'small' ? 20 : 24,
      height: size === 'small' ? 20 : 24,
      borderRadius: size === 'small' ? 10 : 12,
      marginRight: 6,
      borderWidth: 1,
      borderColor: COLORS.main_blue
    },
    username: {
      color: COLORS.text_white,
      fontSize: size === 'small' ? 10 : 12,
      fontWeight: '600',
      marginRight: 4
    },
    verifiedIcon: {
      marginLeft: 2
    },
    updateBadge: {
      backgroundColor: COLORS.main_blue,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      flexDirection: 'row',
      alignItems: 'center'
    },
    updateText: {
      color: COLORS.text_white,
      fontSize: size === 'small' ? 8 : 10,
      fontWeight: 'bold',
      marginLeft: 2
    },
    bottomSection: {
      flex: 1,
      justifyContent: 'flex-end'
    },
    title: {
      color: COLORS.text_white,
      fontSize: size === 'small' ? 12 : 14,
      fontWeight: 'bold',
      marginBottom: 4,
      lineHeight: size === 'small' ? 14 : 16
    },
    stats: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 12
    },
    statText: {
      color: COLORS.text_white,
      fontSize: size === 'small' ? 10 : 11,
      marginLeft: 2,
      fontWeight: '500'
    },
    noImageContainer: {
      backgroundColor: COLORS.background_main_blue,
      flex: 1,
      padding: 8,
      justifyContent: 'space-between'
    },
    noImageTitle: {
      color: COLORS.text_white,
      fontSize: size === 'small' ? 12 : 14,
      fontWeight: 'bold',
      marginBottom: 4
    },
    noImageDescription: {
      color: COLORS.text_white,
      fontSize: size === 'small' ? 10 : 11,
      opacity: 0.8,
      lineHeight: size === 'small' ? 12 : 14
    }
  })

  const formatNumber = (num?: number) => {
    if (!num) return '0'
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  return (
    <TouchableOpacity
      style={compactStyles.cardContainer}
      onPress={() => router.push(`/profile/${poster.id}` as any)}
      activeOpacity={0.9}
    >
      {imageUrl ? (
        <ImageBackground
          source={{ uri: imageUrl }}
          style={compactStyles.backgroundImage}
          resizeMode='cover'
        >
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.8)']}
            style={compactStyles.gradient}
          >
            <View style={compactStyles.topSection}>
              <TouchableOpacity
                style={compactStyles.posterInfo}
                onPress={() => router.push(`/profile/${poster.id}` as any)}
              >
                <Image
                  source={{ uri: poster.avatarUrl }}
                  style={compactStyles.avatar}
                />
                <Text style={compactStyles.username}>{poster.username}</Text>
                {poster.isVerified && (
                  <View style={compactStyles.verifiedIcon}>
                    <Text
                      style={{
                        color: COLORS.main_blue,
                        fontSize: size === 'small' ? 10 : 12
                      }}
                    >
                      ✔
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={compactStyles.updateBadge}>
                <Unicons.UilSync
                  size={size === 'small' ? 10 : 12}
                  color={COLORS.text_white}
                />
                <Text style={compactStyles.updateText}>MAJ</Text>
              </View>
            </View>

            <View style={compactStyles.bottomSection}>
              <Text style={compactStyles.title}>
                {truncateText(title, size === 'small' ? 30 : 45)}
              </Text>

              {stats && (
                <View style={compactStyles.stats}>
                  <View style={compactStyles.statItem}>
                    <Unicons.UilHeart
                      size={size === 'small' ? 12 : 14}
                      color={COLORS.main_blue}
                    />
                    <Text style={compactStyles.statText}>
                      {formatNumber(stats.likes)}
                    </Text>
                  </View>
                  <View style={compactStyles.statItem}>
                    <Unicons.UilEye
                      size={size === 'small' ? 12 : 14}
                      color={COLORS.main_blue}
                    />
                    <Text style={compactStyles.statText}>
                      {formatNumber(stats.views)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </LinearGradient>
        </ImageBackground>
      ) : (
        <View style={compactStyles.noImageContainer}>
          <View style={compactStyles.topSection}>
            <TouchableOpacity
              style={compactStyles.posterInfo}
              onPress={() => router.push(`/profile/${poster.id}` as any)}
            >
              <Image
                source={{ uri: poster.avatarUrl }}
                style={compactStyles.avatar}
              />
              <Text style={compactStyles.username}>{poster.username}</Text>
              {poster.isVerified && (
                <View style={compactStyles.verifiedIcon}>
                  <Text
                    style={{
                      color: COLORS.main_blue,
                      fontSize: size === 'small' ? 10 : 12
                    }}
                  >
                    ✔
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={compactStyles.updateBadge}>
              <Unicons.UilSync
                size={size === 'small' ? 10 : 12}
                color={COLORS.text_white}
              />
              <Text style={compactStyles.updateText}>MAJ</Text>
            </View>
          </View>

          <View style={compactStyles.bottomSection}>
            <Text style={compactStyles.noImageTitle}>
              {truncateText(title, size === 'small' ? 30 : 45)}
            </Text>

            {description && (
              <Text style={compactStyles.noImageDescription}>
                {truncateText(description, size === 'small' ? 50 : 80)}
              </Text>
            )}

            {stats && (
              <View style={compactStyles.stats}>
                <View style={compactStyles.statItem}>
                  <Unicons.UilHeart
                    size={size === 'small' ? 12 : 14}
                    color={COLORS.main_blue}
                  />
                  <Text style={compactStyles.statText}>
                    {formatNumber(stats.likes)}
                  </Text>
                </View>
                <View style={compactStyles.statItem}>
                  <Unicons.UilEye
                    size={size === 'small' ? 12 : 14}
                    color={COLORS.main_blue}
                  />
                  <Text style={compactStyles.statText}>
                    {formatNumber(stats.views)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  )
}
