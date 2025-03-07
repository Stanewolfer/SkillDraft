import { Stack } from 'expo-router'
import React from 'react'
import { useRouter } from 'expo-router'
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { COLORS } from './styles/colors'
import CustomStackScreen from '../components/CustomStackScreen'

enum Mode {
  Personne = 'personne',
  Organisation = 'organisation'
}

export default function FeedScreen() {
  const router = useRouter()

  return (
    <>
      <CustomStackScreen title='Feed' />
      <View style={styles.screenContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.contentText}>Contenu du feed...</Text>
        </ScrollView>
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => router.push('/create_post')}
          >
            <Text style={styles.bottomButtonText}>Créer un post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => router.push('/messaging')}
          >
            <Text style={styles.bottomButtonText}>Messagerie</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background_blue,
    paddingBottom: 80
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 29,
    paddingBottom: 100
  },
  contentText: {
    color: COLORS.text_white,
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background_blue,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: COLORS.main_blue,
    zIndex: 999
  },
  bottomButton: {
    backgroundColor: COLORS.main_blue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  bottomButtonText: {
    color: COLORS.background_blue,
    fontWeight: 'bold',
    fontSize: 16
  }
})
