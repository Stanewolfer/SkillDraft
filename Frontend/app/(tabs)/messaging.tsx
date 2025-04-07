import React from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import { COLORS } from './styles/colors'
import CustomStackScreen from '../components/CustomStackScreen'
import { Button, NativeBaseProvider } from 'native-base'

const Messaging = () => {
  return (
    <NativeBaseProvider>
      <CustomStackScreen title="Messages : GentleMates" />
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenue dans le début de votre conversation épique avec GentleMates.</Text>
        <Text>Aucun message pour le moment.</Text>
      </View>
      <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputWrapper}
            placeholder="Écrire un message..."
            placeholderTextColor={COLORS.main_blue}
          />
          <Button style={styles.sendButton}>
            <Text>Envoyer</Text>
          </Button>
        </View>
    </NativeBaseProvider>
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
    borderColor: COLORS.main_blue,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.main_blue,
    textAlign: 'center',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.background_blue,
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
    borderRadius: 8,
  },
})

export default Messaging
