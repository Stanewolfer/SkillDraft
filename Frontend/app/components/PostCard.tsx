import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import * as Unicons from '@iconscout/react-native-unicons'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '../(tabs)/styles/colors'
// eslint-disable-next-line import/no-unresolved
import { styles } from '@/app/(tabs)/styles/postCardStyles'

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
  const backgroundImage =
    imageList && imageList.length > 0 ? imageList[0] : undefined

  return (
    <View>
      {backgroundImage && (
      <>
        <Image
        source={{ uri: backgroundImage }}
        resizeMode='cover'
        />
      </>
      )}
      <View style={styles.cardWrapper}>
      {/* Display poster information */}
      <View style={styles.posterInfo}>
        <Image
        source={{ uri: poster.avatarUrl }}
        style={styles.avatar} // Style for the avatar image
        />
        <View>
        <View>
          <Text style={styles.nameTitle}>{poster.username}</Text> 
          {poster.isVerified && (
          <View>
            <Text>✔</Text>
          </View>
          )}
        </View>
        {poster.teamName && (
          <Text>[{poster.teamName}]</Text>
        )}
        </View>
      </View>

      {backgroundImage && (
        <View>
        <Unicons.UilAirplay
          size={18}
          color={COLORS.main_blue}
        />
        <Text>Regarder les images</Text>
        </View>
      )}

      {/* Display the post title and description */}
      <Text style={styles.postTitle}>{title}</Text>
      <Text style={styles.postDescription}>{description}</Text>

      <View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity>
          <Unicons.UilHeart size={25} color={COLORS.main_blue} /> {/* Like button */}
          </TouchableOpacity>
          <TouchableOpacity>
          <Unicons.UilCommentAlt size={25} color={COLORS.main_blue} /> {/* Comment button */}
          </TouchableOpacity>
          <TouchableOpacity>
          <Unicons.UilRepeat size={25} color={COLORS.main_blue} /> {/* Repost button */}
          </TouchableOpacity>
          <TouchableOpacity>
          <Unicons.UilCornerUpRight size={25} color={COLORS.main_blue} /> {/* Share button */}
          </TouchableOpacity>
        </View>
      </View>
      </View>
      <View />
    </View>
  )
}