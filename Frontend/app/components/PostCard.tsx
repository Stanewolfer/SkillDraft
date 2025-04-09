import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import * as Unicons from '@iconscout/react-native-unicons'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '../(tabs)/styles/colors'

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
    <View style={styles.card2}>
      {backgroundImage && (
        <>
          <Image
            source={{ uri: backgroundImage }}
            style={styles.card2BackgroundImage}
            resizeMode='cover'
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.9)', 'transparent']}
            style={styles.linearGradient}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
          />
        </>
      )}
      <View style={styles.card2Content}>
        <View style={styles.card2UserRow}>
          <Image
            source={{ uri: poster.avatarUrl }}
            style={styles.card2UserAvatar}
          />
          <View style={styles.card2UserInfo}>
            <View style={styles.card2TitleRow}>
              <Text style={styles.card2UserName}>{poster.username}</Text>
              {poster.isVerified && (
                <View style={styles.card2VerifiedBadge}>
                  <Text style={styles.card2BadgeText}>✔</Text>
                </View>
              )}
            </View>
            {poster.teamName && (
              <Text style={styles.card2Team}>[{poster.teamName}]</Text>
            )}
          </View>
        </View>

        {backgroundImage && (
          <View style={styles.card2VideoLabelContainer}>
            <Unicons.UilAirplay
              size={18}
              color={COLORS.main_blue}
              style={styles.videoIcon}
            />
            <Text style={styles.card2VideoLabel}>Lire la vidéo</Text>
          </View>
        )}

        <Text style={styles.card2UpdateTitle}>{title}</Text>
        <Text style={styles.card2Description}>{description}</Text>
        <View style={styles.card2DescriptionRow}>
          {backgroundImage ? (
            <View style={styles.verticalIconsContainer}>
              <TouchableOpacity style={styles.iconButton}>
                <Unicons.UilHeart size={25} color={COLORS.main_blue} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Unicons.UilCommentAlt size={25} color={COLORS.main_blue} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Unicons.UilRepeat size={25} color={COLORS.main_blue} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Unicons.UilCornerUpRight size={25} color={COLORS.main_blue} />
              </TouchableOpacity>
            </View>
          ) : (
            // Boutons horizontaux en bas si pas d'image
            <View style={styles.horizontalIconsContainer}>
              <TouchableOpacity style={styles.iconButton}>
                <Unicons.UilHeart size={25} color={COLORS.main_blue} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Unicons.UilCommentAlt size={25} color={COLORS.main_blue} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Unicons.UilRepeat size={25} color={COLORS.main_blue} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Unicons.UilCornerUpRight size={25} color={COLORS.main_blue} />
              </TouchableOpacity>
            </View>
          )}
          
        </View>
      </View>
      <View style={styles.cardDivider} />
    </View>
  )
}
const styles = StyleSheet.create({
  card2: {
    position: 'relative',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden'
  },
  card2BackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  linearGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 750
  },
  card2Content: {
    position: 'relative',
    zIndex: 2,
    padding: 15
  },
  card2UserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  card2UserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8
  },
  card2UserInfo: {
    justifyContent: 'center'
  },
  card2TitleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  card2UserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text_white
  },
  card2VerifiedBadge: {
    backgroundColor: '#B8F600',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6
  },
  card2BadgeText: {
    color: COLORS.text_white,
    fontSize: 8,
    fontWeight: 'bold'
  },
  card2Team: {
    fontSize: 12,
    color: COLORS.text_white,
    fontStyle: 'italic'
  },
  card2VideoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8
  },
  videoIcon: {
    marginRight: 6
  },
  card2VideoLabel: {
    fontSize: 14,
    color: COLORS.main_blue,
    fontWeight: 'bold'
  },
  card2UpdateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text_white,
    marginBottom: 4
  },
  card2Description: {
    fontSize: 14,
    color: COLORS.text_white,
    flex: 1,
    lineHeight: 20
  },
  card2DescriptionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10
  },
  verticalIconsContainer: {
    flexDirection: 'column',
    marginRight: 10
  },
  verticalIconButton: {
    marginBottom: 10
  },
  cardDivider: {
    borderBottomWidth: 1,
    borderColor: COLORS.main_blue,
    marginTop: 10
  },
  horizontalIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10
  },
  iconButton: {
    marginRight: 15
  }
})
