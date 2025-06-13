import { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import React from 'react'
import * as Unicons from '@iconscout/react-native-unicons'
import CustomStackScreen from '@/app/components/CustomStackScreen'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '../styles/colors'
import { color } from 'native-base/lib/typescript/theme/styled-system'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CompactPostCard from '../../components/CompactPostCard'

// TypeScript : structure de l'utilisateur
type User = {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  avatarUrl?: string
  teamId?: string
  description?: string
}

// TypeScript : structure des posts
interface Post {
  id: string
  title: string
  description?: string
  imageList?: string[]
  likes?: number
  views?: number
  comments?: any[]
  createdAt?: string
}

export default function ProfileScreen() {
  const BANNER_URL =
    'https://i.ytimg.com/vi/Fxm2cUNas1k/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDAV7W1ADVrw5Vr9p3_v9zomhDIlw'
  const AVATAR_URL =
    'https://e.sport.fr/wp-content/uploads/2024/06/Gentle_Mates_beyAz_at_VCT_2024_EMEA_Kickoff.jpg'
  const VALO_THUMB_URL =
    'https://gamecover.fr/wp-content/uploads/Tejo-Act-1-Wallpaper.png'

  const [connectedUserId, setConnectedUserId] = useState<string | null>(null)

  const { id } = useLocalSearchParams()
  console.log('ID reçu dans profile page :', id)
  const [user, setUser] = useState<User | null>(null)
  const [teamName, setTeamName] = useState<string | null>(null)
  const [teamColor, setTeamColor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // États pour les posts
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [postsError, setPostsError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (!id || typeof id !== 'string') return

      try {
        const storedUserId = await AsyncStorage.getItem('userId')
        setConnectedUserId(storedUserId)

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/users/get-user-by-id/${id}`
        )
        if (!response.ok) {
          throw new Error('User not found')
        }
        const data = await response.json()
        setUser(data)

        if (data.teamId) {
          try {
            const teamResponse = await fetch(
              `${process.env.EXPO_PUBLIC_API_URL}/teams/get-team-by-id/${data.teamId}`
            )
            if (teamResponse.ok) {
              const teamData = await teamResponse.json()
              setTeamName(teamData.teamname)
              setTeamColor(teamData.teamColor)
            } else {
              setTeamName(null)
              setTeamColor(null)
            }
          } catch (teamError) {
            console.error("Erreur lors du chargement de l'équipe :", teamError)
            setTeamName(null)
            setTeamColor(null)
          }
        } else {
          setTeamName(null)
          setTeamColor(null)
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur :", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id])

  // Fetch des posts de l'utilisateur
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!id || typeof id !== 'string') return

      try {
        setLoadingPosts(true)
        setPostsError(null)

        // Fetch des posts de l'utilisateur
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/posts/get-post-of/${id}`
        )

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }

        const data = await response.json()
        console.log("Données reçues de l'API posts:", data)
        console.log('Type des données:', typeof data)
        console.log('Est-ce un tableau?', Array.isArray(data))

        setUserPosts(data.regularPosts)
      } catch (error) {
        console.error('Erreur lors du fetch des posts:', error)
        setPostsError('Impossible de charger les posts')
        setUserPosts([])
      } finally {
        setLoadingPosts(false)
      }
    }

    fetchUserPosts()
  }, [id])

  const renderPostsSection = () => {
    if (loadingPosts) {
      return (
        <View style={styles.postsContainer}>
          <Text style={styles.postsTitle}>Publications</Text>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color={COLORS.main_blue} />
            <Text style={styles.loadingText}>Chargement des posts...</Text>
          </View>
        </View>
      )
    }

    if (postsError) {
      return (
        <View style={styles.postsContainer}>
          <Text style={styles.postsTitle}>Publications</Text>
          <View style={styles.errorContainer}>
            <Unicons.UilExclamationTriangle
              size={24}
              color={COLORS.text_white}
            />
            <Text style={styles.errorText}>{postsError}</Text>
          </View>
        </View>
      )
    }

    if (userPosts.length === 0) {
      return (
        <View style={styles.postsContainer}>
          <Text style={styles.postsTitle}>Publications</Text>
          <View style={styles.emptyContainer}>
            <Unicons.UilDocumentLayoutLeft size={48} color={COLORS.main_blue} />
            <Text style={styles.emptyText}>Aucune publication</Text>
            <Text style={styles.emptySubText}>
              Cet utilisateur n'a pas encore publié de contenu
            </Text>
          </View>
        </View>
      )
    }

    return (
      <View style={styles.postsContainer}>
        <Text style={styles.postsTitle}>Publications ({userPosts.length})</Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.postsScrollContent}
        >
          {Array.isArray(userPosts) &&
            userPosts.map((post, index) => (
              <CompactPostCard
                key={post.id}
                id={post.id}
                title={post.title}
                description={post.description}
                imageUrl={
                  post.imageList && post.imageList.length > 0
                    ? post.imageList[0]
                    : undefined
                }
                poster={{
                  id: user?.id || '',
                  username: user?.username || '',
                  avatarUrl: user?.avatarUrl || AVATAR_URL,
                  isVerified: false
                }}
                stats={{
                  likes: post.likes || 0,
                  views: post.views || 0
                }}
                size='medium'
              />
            ))}
        </ScrollView>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <CustomStackScreen title='profile' />
        <ActivityIndicator size='large' color='blue' />
        <Text>Chargement...</Text>
      </View>
    )
  }

  if (!user || !user.firstName) {
    return (
      <View style={styles.container}>
        <CustomStackScreen title='profile' />
        <Text>Utilisateur inconnu</Text>
      </View>
    )
  }

  return (
    <View style={styles.mainContainer}>
      <CustomStackScreen title='profile' />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.bannerContainer}>
          <Image source={{ uri: user.avatarUrl }} style={styles.bannerImage} />
          <View style={styles.bannerOverlay} />
        </View>

        <View style={styles.profileInfoContainer}>
          <Image source={{ uri: user.avatarUrl }} style={styles.avatarLarge} />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>{user.username}</Text>
            <Text style={styles.profileTeam}>
              Équipe :{' '}
              <Text style={[styles.highlightTeam, { color: teamColor }]}>
                {teamName ? teamName : 'Aucune'}
              </Text>
            </Text>
            {connectedUserId && user.id !== connectedUserId && (
              <TouchableOpacity
                style={styles.followButton}
                onPress={async () => {
                  if (!connectedUserId) return

                  try {
                    const response = await fetch(
                      `${process.env.EXPO_PUBLIC_API_URL}/follow/create`,
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          followerId: connectedUserId,
                          followedId: user.id
                        })
                      }
                    )

                    if (!response.ok) {
                      const errorData = await response.json()
                      console.log('Erreur follow :', errorData.message)
                      alert(errorData.message)
                      return
                    }

                    const followData = await response.json()
                    console.log('Suivi effectué :', followData)
                    alert('Suivi effectué !')
                  } catch (error) {
                    console.error('Erreur lors du follow :', error)
                    alert('Une erreur est survenue.')
                  }
                }}
              >
                <Text style={styles.followButtonText}>Suivre</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.extraInfoContainer}>
          <Text style={styles.extraInfoSubtitle}>Description</Text>
          <Text style={styles.extraDescription}>
            {user.description ?? 'Aucune description.'}
          </Text>
        </View>

        {/* Section des posts */}
        {renderPostsSection()}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background_blue
  },
  container: {
    paddingBottom: 80
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    backgroundColor: '#000'
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.main_blue,
    resizeMode: 'cover'
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  profileInfoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: -75
  },
  avatarLarge: {
    width: 125,
    height: 125,
    borderRadius: 75,
    marginRight: 15,
    marginTop: -25
  },
  profileTextContainer: {
    flex: 1,
    paddingTop: 15
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text_white,
    marginVertical: 5
  },
  profileTeam: {
    fontSize: 16,
    fontStyle: 'italic',
    color: COLORS.text_white,
    marginVertical: -10
  },
  highlightTeam: {
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    fontWeight: '600'
  },
  profileDescription: {
    fontSize: 14,
    color: COLORS.text_white,
    lineHeight: 20,
    paddingTop: 20
  },
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 15
  },
  socialItemRed: {
    backgroundColor: '#FF0000',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginRight: 10
  },
  socialItemPurple: {
    backgroundColor: '#9146FF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginRight: 10
  },
  socialItemTeal: {
    backgroundColor: COLORS.main_blue,
    width: 36,
    height: 36,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  socialItemText: {
    color: '#fff',
    fontWeight: '600',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    fontSize: 15
  },
  socialItemTealText: {
    color: '#000',
    fontSize: 30,
    fontWeight: '700'
  },
  extraInfoContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20
  },
  extraInfoTitle: {
    fontSize: 14,
    color: COLORS.text_white,
    marginBottom: 4
  },
  extraInfoHighlight: {
    fontWeight: '700',
    color: COLORS.text_white
  },
  extraInfoSubtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text_white
  },
  linkHighlight: {
    color: COLORS.link_yellow,
    fontWeight: '600',
    fontStyle: 'italic',
    textDecorationLine: 'underline'
  },
  extraDescription: {
    fontSize: 14,
    color: COLORS.text_white,
    lineHeight: 20,
    marginTop: 10
  },
  followButton: {
    marginTop: 20,
    backgroundColor: COLORS.main_blue,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start'
  },
  followButtonText: {
    color: COLORS.background_blue,
    fontWeight: '700',
    fontSize: 14
  },
  // Styles pour la section posts
  postsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20
  },
  postsTitle: {
    fontSize: 18,
    color: COLORS.text_white,
    fontWeight: '700',
    marginBottom: 15
  },
  postsScrollContent: {
    paddingRight: 20
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40
  },
  loadingText: {
    color: COLORS.text_white,
    marginTop: 10,
    fontSize: 14
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40
  },
  errorText: {
    color: COLORS.text_white,
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40
  },
  emptyText: {
    color: COLORS.text_white,
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  emptySubText: {
    color: COLORS.text_white,
    marginTop: 5,
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center'
  }
})
