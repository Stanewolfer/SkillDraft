import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, LogBox, Text } from 'react-native'
import { COLORS } from './styles/colors'
import CustomStackScreen from '../components/CustomStackScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import OfferPostCard from '../components/OfferPostCard'
import PostCard from '../components/PostCard'
import { BottomNavbar } from '../components/BottomNavbar'

LogBox.ignoreLogs([
  'Warning: UilHeart: Support for defaultProps will be removed',
  'Warning: UilCommentAlt: Support for defaultProps will be removed',
  'Warning: UilRepeat: Support for defaultProps will be removed',
  'Warning: UilCornerUpRight: Support for defaultProps will be removed',

  'Warning: UilAirplay: Support for defaultProps will be removed',

  'Warning: UilPlusCircle: Support for defaultProps will be removed',
  'Warning: UilBag: Support for defaultProps will be removed',
  'Warning: UilEnvelopeAlt: Support for defaultProps will be removed',
  'Warning: UilSignout: Support for defaultProps will be removed',
  'Warning: UilHome: Support for defaultProps will be removed',
  'Warning: UilPlus: Support for defaultProps will be removed',

  'Warning: UilBell: Support for defaultProps will be removed',
  'Warning: UilNewspaper: Support for defaultProps will be removed',
  'Warning: UilSearch: Support for defaultProps will be removed',
  'Warning: UilArrowLeft: Support for defaultProps will be removed'
])

export default function FeedScreen() {
  const router = useRouter()
  const [feed, setFeed] = React.useState<{ posts: any[] }>({ posts: [] })

  const generateFeed = async () => {
    try {
      const response = await fetch(
        `${
          process.env.EXPO_PUBLIC_API_URL
        }/feed/fetch/${await AsyncStorage.getItem('userId')}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const data = await response.json()
      console.log('Feed data:', data)
      setFeed(data)
    } catch (error) {
      console.error('Error fetching feed:', error)
    }
  }

  useEffect(() => {
    generateFeed()
  }, [])

  return (
    <>
      <CustomStackScreen title='feed' />
      <ScrollView contentContainerStyle={styles.container}>
        {feed.posts &&
          feed.posts.map((post, index) => {
            if (post.type === 'regular') {
              return (
                <PostCard
                  key={index}
                  id={post.id}
                  title={post.post.title}
                  description={post.post.description}
                  imageList={post.post.imageList}
                  poster={post.poster}
                />
              )
            } else if (post.type === 'offer') {
              return <OfferPostCard key={index} />
            }
          })}
        {feed.posts.length === 0 && (
          <>
            <Text style={styles.title}>
              Bienvenue sur SkillDraft, voici votre fil d'actualité !
            </Text>
            <Text
              style={{
                height: 1,
                backgroundColor: COLORS.main_blue,
                marginHorizontal: 20
              }}
            />
            <Text
              style={{
                color: COLORS.main_blue,
                textAlign: 'center',
                marginTop: 20
              }}
            >
              Aucun post pour le moment.
            </Text>
          </>
        )}
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.background_blue,
    overflowY: 'scroll',
    paddingBottom: 60
  },
  title: {
    color: COLORS.main_blue,
    fontWeight: 'bold',
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20
  }
})
