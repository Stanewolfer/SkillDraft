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

const SAMPLE_ACCEPTED_USERS = [
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

const SAMPLE_REFUSED_USERS = [
  {
    id: '4',
    avatar:
      'https://e.sport.fr/wp-content/uploads/2024/06/Gentle_Mates_beyAz_at_VCT_2024_EMEA_Kickoff.jpg',
    pseudo: 'Epsilon',
    team: 'Gentlemates',
    desc1: 'Commentateur - Dota 2',
    desc2: 'Blogueur e-sport'
  },
  {
    id: '5',
    avatar:
      'https://e.sport.fr/wp-content/uploads/2024/06/Gentle_Mates_beyAz_at_VCT_2024_EMEA_Kickoff.jpg',
    pseudo: 'Zeta',
    team: 'Gentlemates',
    desc1: 'Analyste - Overwatch',
    desc2: 'Ex-Pro Gamer'
  },
  {
    id: '6',
    avatar:
      'https://e.sport.fr/wp-content/uploads/2024/06/Gentle_Mates_beyAz_at_VCT_2024_EMEA_Kickoff.jpg',
    pseudo: 'Theta',
    team: 'Gentlemates',
    desc1: 'Caster - Rainbow Six',
    desc2: 'Coach Junior'
  }
]

const acceptedActions = [
  { icon: require('../../assets/icons/HEART-ICON.png'), action: 'like' },
  { icon: require('../../assets/icons/DASH-GRAY-ICON.png'), action: 'skip' }
]
const refusedActions = [
  { icon: require('../../assets/icons/CHECK-GRAY-ICON.png'), action: 'undo' },
  { icon: require('../../assets/icons/DASH-RED-ICON.png'), action: 'reject' }
]

export default function FastSearchList() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>(Mode.Accepted)

  const handleAction = (userId: string, actionType: string) => {
    console.log(`Action: ${actionType} sur utilisateur ${userId}`)
  }

  const renderActions = (userId: string) => {
    const actions = mode === Mode.Accepted ? acceptedActions : refusedActions
    return (
      <View style={styles.cardActions}>
        {actions.map(({ icon, action }, idx) => (
          <TouchableOpacity
            key={`${userId}-${action}-${idx}`}
            onPress={() => handleAction(userId, action)}
          >
            <Image source={icon} style={styles.icon} />
          </TouchableOpacity>
        ))}
      </View>
    )
  }

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
            <View style={styles.listContainer}>
              {(mode === Mode.Accepted
                ? SAMPLE_ACCEPTED_USERS
                : SAMPLE_REFUSED_USERS
              ).length === 0 ? (
                <Text style={styles.emptyText}>
                  Aucun utilisateur dans cette catégorie.
                </Text>
              ) : (
                (mode === Mode.Accepted
                  ? SAMPLE_ACCEPTED_USERS
                  : SAMPLE_REFUSED_USERS
                ).map(user => (
                  <View key={user.id} style={styles.userCard}>
                    <Image
                      source={{ uri: user.avatar }}
                      style={styles.avatar}
                    />
                    <View style={styles.userInfo}>
                      <View style={styles.userHeader}>
                        <Text style={styles.pseudo}>{user.pseudo}</Text>
                        <Text style={styles.bracket}>[</Text>
                        <Text style={styles.team}>{user.team}</Text>
                        <Text style={styles.bracket}>]</Text>
                      </View>
                      <Text style={styles.desc}>{user.desc1}</Text>
                      <Text style={styles.desc}>{user.desc2}</Text>
                    </View>
                    {renderActions(user.id)}
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push('./fast_search')}>
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
    color: COLORS.main_blue,
    marginRight: 6
  },
  bracket: {
    fontSize: 14,
    fontStyle: 'italic',
    color: COLORS.main_blue
  },
  team: {
    fontSize: 14,
    fontStyle: 'italic',
    color: COLORS.gentle_mates
  },
  desc: {
    fontSize: 12,
    color: COLORS.main_blue
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
