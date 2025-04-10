import React, { useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image
} from 'react-native'
import { COLORS } from './styles/colors'
import { Button, NativeBaseProvider } from 'native-base'
import { useSearchParams } from 'expo-router/build/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CustomStackScreen from '../components/CustomStackScreen'

const Messaging = () => {
  const conversationId = useSearchParams().get('conversationId')
  const otherUsername = useSearchParams().get('otherUsername')
  console.log('Messaging route params:', conversationId)
  console.log('Other user :', otherUsername)
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

  const [messages, setMessages] = React.useState<Message[]>([])
  const [messageContent, setMessageContent] = React.useState('')
  const fetchMessages = async () => {
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
      console.log('Messages data:', data)
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async () => {
    try {
      const response = await fetch(
        `${
          process.env.EXPO_PUBLIC_API_URL
        }/messages/send/${await AsyncStorage.getItem('userId')}`,
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
  }, [])

  return (
    <>
      <CustomStackScreen title={otherUsername || 'Utilisateur inconnu'} />
      <NativeBaseProvider>
        <View style={styles.container}>
          <Text style={styles.title}>
            Bienvenue dans le début de votre conversation épique avec{' '}
            {otherUsername} !
          </Text>
          {messages.length === 0 ? (
            <Text>Aucun message pour le moment.</Text>
          ) : (
            <ScrollView style={styles.messagesContainer}>
              {messages.map(message => (
                <View key={message.id} style={styles.message}>
                  <Text>{message.content}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 5
                    }}
                  >
                    <Image
                      source={{ uri: message.sender.avatarUrl }}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        marginRight: 5
                      }}
                    />
                    <Text style={{ fontSize: 10, color: COLORS.background_blue }}>
                      {message.sender.username}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        color: COLORS.background_blue,
                        marginLeft: 5
                      }}
                    >
                      {new Date(message.createdAt).toLocaleDateString(
                        'fr-FR',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }
                      )}
                    </Text>
                  </View>
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
            onChangeText={text => setMessageContent(text)}
            multiline={true}
            onKeyPress={(e) => {
              if (e.nativeEvent.key === 'Enter') {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button style={styles.sendButton} onPress={sendMessage}>
            <Text>Envoyer</Text>
          </Button>
        </View>
      </NativeBaseProvider>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background_blue,
    paddingBottom: 60,
    borderWidth: 1,
    borderColor: COLORS.main_blue
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.main_blue,
    textAlign: 'center'
  },
  messagesContainer: {
    flex: 1,
    width: '100%',
    padding: 10,
    marginTop: 10
  },
  message: {
    backgroundColor: COLORS.main_blue,
    padding: 10,
    marginVertical: 5,
    borderRadius: 8
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.background_blue
  },
  inputWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.main_blue,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
    color: COLORS.main_blue
  },
  sendButton: {
    backgroundColor: COLORS.main_blue,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8
  }
})

export default Messaging
