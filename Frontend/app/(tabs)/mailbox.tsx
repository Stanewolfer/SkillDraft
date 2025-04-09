import React, { useEffect, useState } from 'react'
import CustomStackScreen from '../components/CustomStackScreen'
import { mailboxStyles } from '@/app/(tabs)/styles/mailboxStyles'
import { View } from 'react-native'
import PlayerConversation from '../components/PlayerConversation'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Mailbox = () => {
  const [convData, setConvData] = useState([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const fetchConversations = async () => {
    try {
      const type = await AsyncStorage.getItem('type')
      const userId = await AsyncStorage.getItem('userId')

      if (!type || !userId) {
        console.warn('Type ou userId non trouvé dans AsyncStorage')
        return
      }

      setCurrentUserId(userId) // on stocke ici pour le rendu plus tard

      const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/convs/get-${type}-convs/${userId}`
      console.log("URL de l'API :", apiUrl)

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      console.log('Réponse API :', result)
      setConvData(result)
    } catch (error) {
      console.error('Erreur lors de la récupération des conversations :', error)
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  return (
    <>
      <CustomStackScreen title='Mailbox' />
      <View style={mailboxStyles.container}>
        {currentUserId &&
          convData.map((conversation: any, index) => (
            <PlayerConversation
              key={index}
              pseudonym={
                conversation.user1?.id === currentUserId
                  ? conversation.user2?.username
                  : conversation.user1?.username
              }
              lastMessage={
                conversation.messages[conversation.messages.length - 1]
                  .content || ''
              }
              date={
                new Date(conversation.updatedAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) || ''
              }
              profilePicture={
                conversation.user1?.id === currentUserId
                  ? conversation.user2?.avatarUrl
                  : conversation.user1?.avatarUrl
              }
            />
          ))}
      </View>
      <BottomNavbar activeScreen="messaging" logout={() => {}} />
    </>
  )
}

export default Mailbox
