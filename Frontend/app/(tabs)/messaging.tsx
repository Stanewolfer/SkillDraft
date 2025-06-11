import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { COLORS } from './styles/colors'
import { Button, NativeBaseProvider } from 'native-base'
import { useSearchParams } from 'expo-router/build/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CustomStackScreen from '../components/CustomStackScreen'
import { messageStyles as styles } from './styles/messageStyles'

interface Message {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  sender: {
    id: string
    username: string
    avatarUrl: string
  }
}

const Messaging: React.FC = () => {
  const conversationId = useSearchParams().get('conversationId')
  const otherUsername = useSearchParams().get('otherUsername')

  const [messages, setMessages] = useState<Message[]>([])
  const [messageContent, setMessageContent] = useState<string>('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    const loadUserData = async () => {
      const userId = await AsyncStorage.getItem('userId')
      setCurrentUserId(userId)
    }
    loadUserData()
  }, [])

  const fetchMessages = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/messages/get-messages/${conversationId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const data = await response.json()
      if (response.ok) {
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setMessages([])
      console.error(
        'Failed to fetch messages, setting messages to empty array.'
      )
      console.error(
        'Error details:',
        error instanceof Error ? error.message : error
      )
    }
  }

  const groupMessagesByDate = (
    messagesToGroup: Message[]
  ): { [key: string]: Message[] } => {
    return messagesToGroup.reduce((groups, message) => {
      const date = new Date(message.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
      return groups
    }, {} as Record<string, Message[]>)
  }

  const sendMessage = async (): Promise<void> => {
    if (!messageContent.trim() || !conversationId || !currentUserId) return

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/messages/send/${currentUserId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            conversationId,
            content: messageContent
          })
        }
      )

      if (response.ok) {
        setMessageContent('')
        fetchMessages()
      } else {
        console.error('Error sending message:', response.statusText)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 30000)
    return () => clearInterval(interval)
  }, [conversationId])

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  const messageGroups = groupMessagesByDate(messages)

  return (
    <>
      <CustomStackScreen title={otherUsername || 'Utilisateur inconnu'} />
      <NativeBaseProvider>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.container}>
            <Text style={styles.title}>
              Bienvenue dans le début de votre conversation épique avec{' '}
              {otherUsername} !
            </Text>

            {messages.length === 0 ? (
              <Text
                style={{
                  color: COLORS.main_blue,
                  textAlign: 'center',
                  marginTop: 20
                }}
              >
                Aucun message pour le moment.
              </Text>
            ) : (
              <ScrollView
                style={styles.messagesContainer}
                ref={scrollViewRef}
                onContentSizeChange={() =>
                  scrollViewRef.current?.scrollToEnd({ animated: true })
                }
              >
                {Object.entries(messageGroups).map(([date, dateMessages]) => (
                  <View key={date} style={styles.dateGroup}>
                    <View style={styles.dateHeader}>
                      <Text style={styles.dateText}>{date}</Text>
                    </View>

                    {dateMessages.map(message => (
                      <View
                        key={message.id}
                        style={
                          message.sender.username === otherUsername
                            ? styles.messageWrapperOther
                            : styles.messageWrapperMe
                        }
                      >
                        <Image
                          source={{ uri: message.sender.avatarUrl }}
                          style={styles.profilePic}
                        />
                        <View
                          style={
                            message.sender.username === otherUsername
                              ? styles.messageContentOther
                              : styles.messageContentMe
                          }
                        >
                          <Text
                            style={
                              message.sender.username === otherUsername
                                ? {
                                    color: COLORS.main_blue,
                                    fontSize: 15,
                                    paddingHorizontal: 10
                                  }
                                : {
                                    color: COLORS.background_blue,
                                    fontSize: 15,
                                    paddingHorizontal: 10
                                  }
                            }
                          >
                            {message.content}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: COLORS.main_blue,
                            fontSize: 12,
                            marginTop: 5,
                            marginHorizontal: 5
                          }}
                        >
                          {new Date(message.createdAt).toLocaleTimeString(
                            'fr-FR',
                            {
                              hour: '2-digit',
                              minute: '2-digit'
                            }
                          )}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputWrapper}
              placeholder='Écrire un message...'
              placeholderTextColor={COLORS.main_blue}
              value={messageContent}
              onChangeText={(text: string) => setMessageContent(text)}
              multiline={true}
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
              onKeyPress={e => {
                if (e.nativeEvent.key === 'Enter') {
                  e.preventDefault()
                  sendMessage()
                }
              }}
            />
            <Button style={styles.sendButton} onPress={sendMessage}>
              <Text>Envoyer</Text>
            </Button>
          </View>
        </KeyboardAvoidingView>
      </NativeBaseProvider>
    </>
  )
}

export default Messaging
