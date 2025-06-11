import React, { useState } from 'react'
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native'
import { COLORS } from './styles/colors'
import CustomStackScreen from '../components/CustomStackScreen'
import { useRouter } from 'expo-router'

enum Mode {
  Accepted = 'accept',
  Refused = 'refus'
}

const SAMPLE_USERS = [
  {
    id: '1',
    avatar:
      'https://e.sport.fr/wp-content/uploads/2024/06/Gentle_Mates_beyAz_at_VCT_2024_EMEA_Kickoff.jpg',
    pseudo: 'beyAz',
    team: 'Gentlemates',
    desc1: 'Content Creator - VALORANT',
    desc2: 'Ex-Joueur Professionnel'
  },
  {
    id: '2',
    avatar:
      'https://e.sport.fr/wp-content/uploads/2024/06/Gentle_Mates_beyAz_at_VCT_2024_EMEA_Kickoff.jpg',
    pseudo: 'Alpha',
    team: 'Gentlemates',
    desc1: 'Streamer - CS:GO',
    desc2: 'Ex-Joueur Semi-Pro'
  },
  {
    id: '3',
    avatar:
      'https://e.sport.fr/wp-content/uploads/2024/06/Gentle_Mates_beyAz_at_VCT_2024_EMEA_Kickoff.jpg',
    pseudo: 'Nova',
    team: 'Gentlemates',
    desc1: 'Coach - LoL',
    desc2: 'Analyste Senior'
  }
]

export default function FastSearchList() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>(Mode.Accepted)

  return (
    <>
      <CustomStackScreen title='fast_search_list' />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.cardContainer}>
          <View style={styles.switchContainer}>
            <TouchableOpacity
              style={[
                styles.switchButton,
                mode === Mode.Accepted && styles.switchButtonActive
              ]}
              onPress={() => setMode(Mode.Accepted)}
            >
              <Text
                style={[
                  styles.switchButtonText,
                  mode === Mode.Accepted && styles.switchButtonTextActive
                ]}
              >
                Acceptés
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.switchButton,
                mode === Mode.Refused && styles.switchButtonActive
              ]}
              onPress={() => setMode(Mode.Refused)}
            >
              <Text
                style={[
                  styles.switchButtonText,
                  mode === Mode.Refused && styles.switchButtonTextActive
                ]}
              >
                Refusés
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            {mode === Mode.Accepted ? (
              <View style={styles.listContainer}>
                {SAMPLE_USERS.map(user => (
                  <View key={user.id} style={styles.userCard}>
                    <Image
                      source={{ uri: user.avatar }}
                      style={styles.avatar}
                    />
                    <View style={styles.userInfo}>
                      <View style={styles.userHeader}>
                        <Text style={styles.pseudo}>{user.pseudo}</Text>
                        <Text style={styles.team}>{`[${user.team}]`}</Text>
                      </View>
                      <Text style={styles.desc}>{user.desc1}</Text>
                      <Text style={styles.desc}>{user.desc2}</Text>
                    </View>
                    <View style={styles.cardActions}>
                      <TouchableOpacity>
                        <Image
                          source={require('../../assets/icons/HEART-ICON.png')}
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Image
                          source={require('../../assets/icons/DASH-GRAY-ICON.png')}
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>Aucun refusé</Text>
            )}
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push('/fast_search')}>
          <Text
            style={[styles.linkText, { textAlign: 'center', marginTop: 20 }]}
          >
            Revenir à la recherche rapide
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background_blue,
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 40
  },
  cardContainer: {
    alignSelf: 'stretch',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.main_blue,
    backgroundColor: COLORS.background_blue,
    padding: 20
  },
  switchContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background_blue,
    marginHorizontal: -20,
    marginTop: -20,
    marginBottom: 20,
    overflow: 'hidden',
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13
  },
  switchButton: {
    flex: 1,
    backgroundColor: COLORS.main_blue,
    paddingVertical: 12,
    alignItems: 'center'
  },
  switchButtonActive: {
    backgroundColor: COLORS.background_blue
  },
  switchButtonText: {
    color: COLORS.background_blue,
    fontSize: 16,
    fontWeight: 'normal'
  },
  switchButtonTextActive: {
    color: COLORS.main_blue,
    fontWeight: 'bold'
  },
  formContainer: {
    marginTop: 5
  },
  listContainer: {
    flex: 1,
    width: '100%'
  },
  userCard: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.main_blue,
    backgroundColor: COLORS.dark_main_blue,
    alignItems: 'center'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10
  },
  userInfo: {
    flex: 1
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  pseudo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text_white,
    marginRight: 6
  },
  team: {
    fontSize: 14,
    fontStyle: 'italic',
    color: COLORS.gentle_mates
  },
  desc: {
    fontSize: 13,
    color: COLORS.text_white
  },
  cardActions: {
    flexDirection: 'row'
  },
  icon: {
    width: 27,
    height: 27,
    marginRight: 10
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.main_blue,
    marginVertical: 20
  },
  linkText: {
    color: COLORS.link_yellow,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    textDecorationColor: COLORS.link_yellow
  }
})
