import React from 'react'
import { useRouter } from 'expo-router'
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LogBox
} from 'react-native'
import * as Unicons from '@iconscout/react-native-unicons'
import { COLORS } from './styles/colors'
import CustomStackScreen from '../components/CustomStackScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import OfferCard from '../components/OfferCard'
import MediaCard from '../components/MediaCard'

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

  const logout = async () => {
    await AsyncStorage.clear()
    router.push('/')
  }

  return (
    <>
      <CustomStackScreen title='Feed' />
      <ScrollView contentContainerStyle={styles.container}>
        <OfferCard />
        <MediaCard />

        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity
            style={[styles.bottomButton, styles.activeBottomButton]}
            //onPress={() => router.push('/news_feed')}
          >
            <View style={styles.bottomButtonContent}>
              <Unicons.UilNewspaper size={28} color={COLORS.background_blue} />
              <Text
                style={[
                  styles.bottomButtonLabel,
                  styles.activeBottomButtonLabel
                ]}
              >
                Fil d'actualité
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomButton}
            //onPress={() => router.push('/quick_search')}
          >
            <View style={styles.bottomButtonContent}>
              <Unicons.UilSearch size={28} color={COLORS.main_blue} />
              <Text style={styles.bottomButtonLabel}>Recherches rapides</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => router.push('/create_post')}
          >
            <View style={styles.bottomButtonContent}>
              <Unicons.UilPlusCircle size={28} color={COLORS.main_blue} />
              <Text style={styles.bottomButtonLabel}>Ajouter un post</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => router.push('/offers')}
          >
            <View style={styles.bottomButtonContent}>
              <Unicons.UilBag size={28} color={COLORS.main_blue} />
              <Text style={styles.bottomButtonLabel}>Offres</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => router.push('/messaging')}
          >
            <View style={styles.bottomButtonContent}>
              <Unicons.UilEnvelopeAlt size={28} color={COLORS.main_blue} />
              <Text style={styles.bottomButtonLabel}>Messagerie</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={logout}> // Tempory
            <View style={styles.bottomButtonContent}>
              <Unicons.UilSignout size={28} color={COLORS.main_blue} />
              <Text style={styles.bottomButtonLabel}>Déconnexion</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.background_blue
  },
  // -- Bottom navigation bar
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background_blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    margin: 0,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderColor: COLORS.main_blue,
    borderTopLeftRadius: 35,
    //borderTopRightRadius: 35,
    zIndex: 999
  },

  bottomButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    padding: 0
  },
  bottomButtonContent: {
    alignItems: 'center'
  },
  bottomButtonLabel: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.main_blue
  },
  activeBottomButton: {
    backgroundColor: COLORS.main_blue,
    paddingVertical: 10
  },
  activeBottomButtonLabel: {
    color: COLORS.background_blue
  }
})
