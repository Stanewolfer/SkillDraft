import React from 'react'
import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, LogBox } from 'react-native'
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
  'Warning: UilSignout: Support for defaultProps will be removed'
])

export default function FeedScreen() {
  const router = useRouter()
  const [feed, setFeed] = React.useState<{ posts: any[] }>({ posts: [] })

  const logout = async () => {
    await AsyncStorage.clear()
    router.push('/')
  }

  const generateFeed = async () => {
    try {
      const response = await fetch(
        `${
          process.env.EXPO_PUBLIC_API_URL
        }/feed/generate/${await AsyncStorage.getItem('userId')}`,
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

  React.useEffect(() => {
    generateFeed()
  }, [])

  return (
    <>
      <CustomStackScreen title='Feed' />
      <ScrollView contentContainerStyle={styles.container}>
        {feed.posts &&
          feed.posts.map((post, index) => {
            if (post.type === 'regular') {
              return (
                <PostCard
                  key={index}
                  id={post.id}
                  title={post.title}
                  description={post.description}
                  poster={post.poster}
                />
              )
            } else if (post.type === 'offer') {
              return <OfferPostCard key={index} />
            }
          })}
        <BottomNavbar activeScreen='feed' logout={logout} />
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.background_blue
  }
})
