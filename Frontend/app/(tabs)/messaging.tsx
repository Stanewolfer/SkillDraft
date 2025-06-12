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
import { useLocalSearchParams } from 'expo-router'
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
  const { conversationId, otherUsername } = useLocalSearchParams<{
    conversationId: string
    otherUsername: string
  }>()

  const [messages, setMessages] = useState<Message[]>([])
  const [messageContent, setMessageContent] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    const loadUser = async () => {
      const id = await AsyncStorage.getItem('userId')
      if (id) setCurrentUserId(id)
    }
    loadUser()
  }, [])

  const fetchMessages = async () => {
    if (!conversationId) return
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/messages/get-messages/${conversationId}`
      )
      const data = await response.json()
      if (response.ok) {
        setMessages(data.messages || [])
      } else {
        console.error('Erreur API messages:', data.message)
        setMessages([])
      }
    } catch (error) {
      console.error('Erreur réseau messages:', error)
      setMessages([])
    }
  }

  const groupMessagesByDate = (
    messagesToGroup: Message[]
  ): { [key: string]: Message[] } => {
    return messagesToGroup.reduce((groups, msg) => {
      const date = new Date(msg.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
      if (!groups[date]) groups[date] = []
      groups[date].push(msg)
      return groups
    }, {} as Record<string, Message[]>)
  }

  const sendMessage = async () => {
    const trimmed = messageContent.trim()
    if (!trimmed || !currentUserId || !conversationId) return

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/messages/send/${currentUserId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId, content: trimmed })
        }
      )

      if (response.ok) {
        setMessageContent('')
        fetchMessages()
      } else {
        const error = await response.json()
        console.error('Erreur envoi message:', error.message)
      }
    } catch (error) {
      console.error('Erreur réseau envoi message:', error)
    }
  }

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 30000)
    return () => clearInterval(interval)
  }, [conversationId])

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [messages])

  const messageGroups = groupMessagesByDate(messages)

  return (
    <>
      <CustomStackScreen title={otherUsername || 'Utilisateur'} />
      <NativeBaseProvider>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.container}>
            <Text style={styles.title}>
              Bienvenue dans la conversation avec {otherUsername} !
            </Text>

            {messages.length === 0 ? (
              <Text style={{ color: COLORS.main_blue, textAlign: 'center', marginTop: 20 }}>
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
                {Object.entries(messageGroups).map(([date, group]) => (
                  <View key={date} style={styles.dateGroup}>
                    <View style={styles.dateHeader}>
                      <Text style={styles.dateText}>{date}</Text>
                    </View>

                    {group.map(msg => {
                      const isOther = msg.sender.username === otherUsername
                      return (
                        <View
                          key={msg.id}
                          style={isOther ? styles.messageWrapperOther : styles.messageWrapperMe}
                        >
                          <Image source={{ uri: msg.sender.avatarUrl }} style={styles.profilePic} />
                          <View style={isOther ? styles.messageContentOther : styles.messageContentMe}>
                            <Text
                              style={{
                                color: isOther ? COLORS.main_blue : COLORS.background_blue,
                                fontSize: 15,
                                paddingHorizontal: 10
                              }}
                            >
                              {msg.content}
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
                            {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Text>
                        </View>
                      )
                    })}
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
              onChangeText={setMessageContent}
              multiline
              blurOnSubmit={false}
              onSubmitEditing={sendMessage}
              onKeyPress={e => {
                if (e.nativeEvent.key === 'Enter') {
                  e.preventDefault?.()
                  sendMessage()
                }
              }}
            />
            <Button style={styles.sendButton} onPress={sendMessage}>
              <Text style={{ color: 'white' }}>Envoyer</Text>
            </Button>
          </View>
        </KeyboardAvoidingView>
      </NativeBaseProvider>
    </>
  )
}

export default Messaging