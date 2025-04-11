import React, { useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image
} from 'react-native'
import { COLORS } from './styles/colors'
import { Button, NativeBaseProvider } from 'native-base'
import { useSearchParams } from 'expo-router/build/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CustomStackScreen from '../components/CustomStackScreen'
import { styles } from './styles/messageStyles'

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

  const groupMessagesByDate = (messages: Message[]) => {
    const groups = messages.reduce((acc: { [key: string]: Message[] }, message) => {
      const date = new Date(message.createdAt).toLocaleDateString('fr-FR');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {});
    return groups;
  };

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

  const messageGroups = groupMessagesByDate(messages);

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
                        {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
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
            onChangeText={text => setMessageContent(text)}
            multiline={true}
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
      </NativeBaseProvider>
    </>
  )
}

export default Messaging