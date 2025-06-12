import React, { useEffect, useState } from 'react'
import CustomStackScreen from '../components/CustomStackScreen'
import { mailboxStyles } from '@/app/(tabs)/styles/mailboxStyles'
import { TouchableOpacity, View, Text } from 'react-native'
import PlayerConversation from '../components/PlayerConversation'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BottomNavbar } from '../components/BottomNavbar'
import { router } from 'expo-router'
import { COLORS } from './styles/colors'

const Mailbox = () => {
  const [convData, setConvData] = useState([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [otherUsers, setOtherUsers] = useState<Record<string, any>>({})

  const fetchConversations = async () => {
    try {
      const type = await AsyncStorage.getItem('type')
      const userId = await AsyncStorage.getItem('userId')

      if (!type || !userId) return

      setCurrentUserId(userId)

      const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/convs/get-${type}-convs/${userId}`
      const response = await fetch(apiUrl)
      const conversations = await response.json()
      console.log('Conversations récupérées:', conversations)

      setConvData(conversations)

      const usersToFetch = conversations.map((conv: any) =>
        conv.user1Id === userId ? conv.user2Id : conv.user1Id
      )

      const uniqueUserIds: string[] = [...new Set(usersToFetch as string[])]

      const usersData: Record<string, any> = {}

      await Promise.all(
        uniqueUserIds.map(async (id: string) => {
          const res = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/users/get-user-by-id/${id}`
          )
          const data = await res.json()
          usersData[id] = data
        })
      )

      setOtherUsers(usersData)
    } catch (error) {
      console.error('Erreur dans fetchConversations :', error)
    }
  }

  useEffect(() => {
    fetchConversations()
    const timer = setInterval(fetchConversations, 30000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <CustomStackScreen title='Mailbox' />
      <View style={mailboxStyles.container}>
        {currentUserId &&
          convData.map((conversation: any, index) => {
            const otherUserId =
              conversation.user1Id === currentUserId
                ? conversation.user2Id
                : conversation.user1Id

            const otherUser = otherUsers[otherUserId]

            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  console.log('ID de conversation envoyé:', conversation.id)
                  router.push({
                    pathname: '/(tabs)/messaging',
                    params: {
                      conversationId: conversation.id,
                      otherUsername: otherUser.username
                    }
                  })
                }}
              >
                <PlayerConversation
                  key={index}
                  pseudonym={otherUser?.username || 'Utilisateur inconnu'}
                  lastMessage={
                    conversation.lastMessage?.content || 'Aucun message'
                  }
                  date={
                    new Date(conversation.updatedAt).toLocaleDateString(
                      'fr-FR',
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }
                    ) || ''
                  }
                  profilePicture={otherUser?.avatarUrl}
                />
              </TouchableOpacity>
            )
          })}
          <TouchableOpacity
            style={mailboxStyles.floatingButton}
            onPress={() => router.push('/create_conversation')}
          >
            <View style={mailboxStyles.floatingButtonInner}>
              <Text style={{ color: COLORS.background_blue, fontSize: 24 }}>+</Text>
            </View>
          </TouchableOpacity>
      </View>
    </>
  )
}

export default Mailbox
