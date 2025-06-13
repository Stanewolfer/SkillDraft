import React from 'react'
import { useRouter } from 'expo-router'
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLORS } from './styles/colors'
import CustomStackScreen from '../components/CustomStackScreen'
import { BottomNavbar } from '../components/BottomNavbar'
import * as Unicons from '@iconscout/react-native-unicons'
import { LinearGradient } from 'expo-linear-gradient'
import CompactPostCard from '../components/CompactPostCard'

const AVATAR_URL =
  'https://e.sport.fr/wp-content/uploads/2024/06/Gentle_Mates_beyAz_at_VCT_2024_EMEA_Kickoff.jpg'

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

interface UserData {
  id: string
  username: string
  description?: string
  teamId?: string
  avatarUrl?: string
}

interface TeamData {
  teamname?: string
  teamColor?: string
}

export default function ProfileScreen() {
  const [username, setUsername] = React.useState('Chargement...')
  const [userDescription, setUserDescription] = React.useState('Chargement...')
  const [inTeam, setInTeam] = React.useState('Chargement...')
  const [teamColor, setTeamColor] = React.useState(COLORS.main_blue)
  const [profilePicture, setProfilePicture] = React.useState(AVATAR_URL)
  const [userId, setUserId] = React.useState<string | null>(null)

  // États pour les posts
  const [userPosts, setUserPosts] = React.useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = React.useState(true)
  const [postsError, setPostsError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId')
        if (storedUserId) {
          setUserId(storedUserId)

          const response = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/users/get-user-by-id/${storedUserId}`
          )
          const data: UserData = await response.json()

          const teamResponse = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/teams/get-team-by-id/${data.teamId}`
          )
          const teamData: TeamData = await teamResponse.json()

          setUsername(data.username)
          setUserDescription(
            data.description ? data.description : 'Aucune description'
          )
          setInTeam(teamData.teamname ? teamData.teamname : 'Aucune équipe')
          setTeamColor(
            teamData.teamColor ? teamData.teamColor : COLORS.main_blue
          )
          setProfilePicture(data.avatarUrl ? data.avatarUrl : AVATAR_URL)
        }
      } catch (error) {
        console.error('Erreur lors du fetch des données utilisateur:', error)
        setUsername("Nom d'utilisateur introuvable")
        setInTeam('Aucune équipe trouvée')
      }
    }
    fetchUsername()
  }, [])

  // Fetch des posts de l'utilisateur
  React.useEffect(() => {
    const fetchUserPosts = async () => {
      if (!userId) return

      try {
        setLoadingPosts(true)
        setPostsError(null)

        // Adaptez cette URL selon votre API
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/posts/get-post-of/${userId}`
        )

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }

        const posts: Post[] = await response.json()
        setUserPosts(posts)
      } catch (error) {
        console.error('Erreur lors du fetch des posts:', error)
        setPostsError('Impossible de charger les posts')
        setUserPosts([])
      } finally {
        setLoadingPosts(false)
      }
    }

    fetchUserPosts()
  }, [userId])

  const renderPostsSection = () => {
    if (loadingPosts) {
      return (
        <View style={styles.postsContainer}>
          <Text style={styles.postsTitle}>Mes Publications</Text>
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
          <Text style={styles.postsTitle}>Mes Publications</Text>
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
          <Text style={styles.postsTitle}>Mes Publications</Text>
          <View style={styles.emptyContainer}>
            <Unicons.UilDocumentLayoutLeft size={48} color={COLORS.main_blue} />
            <Text style={styles.emptyText}>
              Aucune publication pour le moment
            </Text>
            <Text style={styles.emptySubText}>
              Commencez à partager vos moments !
            </Text>
          </View>
        </View>
      )
    }

    return (
      <View style={styles.postsContainer}>
        <Text style={styles.postsTitle}>
          Mes Publications ({userPosts.length})
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.postsScrollContent}
        >
          {userPosts.map((post, index) => (
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
                id: userId || '',
                username: username,
                avatarUrl: profilePicture,
                isVerified: false // Vous pouvez ajouter cette info dans votre userData
              }}
              stats={{
                likes: post.likes || 0,
                views: post.views || 0
              }}
              size={index === 0 ? 'medium' : 'small'} // Premier post en medium, les autres en small
            />
          ))}
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={styles.mainContainer}>
      <CustomStackScreen title='profile' />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.bannerContainer}>
          <Image source={{ uri: profilePicture }} style={styles.bannerImage} />
          <View style={styles.bannerOverlay} />
        </View>

        <View style={styles.profileInfoContainer}>
          <Image source={{ uri: profilePicture }} style={styles.avatarLarge} />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>{username}</Text>
            <Text style={styles.profileTeam}>
              Équipe :{' '}
              <Text style={[styles.highlightTeam, { color: teamColor }]}>
                {inTeam}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.extraInfoContainer}>
          <Text style={styles.extraInfoSubtitle}>Description</Text>
          <Text style={styles.extraDescription}>{userDescription}</Text>
        </View>

        {/* Section des posts */}
        {renderPostsSection()}
      </ScrollView>

      <BottomNavbar />
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
  extraInfoContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20
  },
  extraInfoSubtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text_white
  },
  extraDescription: {
    fontSize: 14,
    color: COLORS.text_white,
    lineHeight: 20,
    marginTop: 10
  },
  // Nouveaux styles pour la section posts
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
