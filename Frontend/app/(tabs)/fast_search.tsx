import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { COLORS } from './styles/colors'
import CustomStackScreen from '../components/CustomStackScreen'

const DEFAULT_AVATAR_URL =
  'https://e.sport.fr/wp-content/uploads/2024/06/Gentle_Mates_beyAz_at_VCT_2024_EMEA_Kickoff.jpg'
const DEFAULT_PSEUDO = 'beyAz'
const DEFAULT_TEAM = 'Gentlemates'
const DEFAULT_TEAM_COLOR = COLORS.gentle_mates
const DEFAULT_DESC_FIRST = 'Content Creator - VALORANT'
const DEFAULT_DESC_SECOND =
  'Ex-Joueur Professionnel dans la section VALORANT de l’équipe GentleMates'
const DEFAULT_DESC_THIRD =
  'Joueur déterminé et ex-chef d’équipe de la section VALORANT de GentleMates, je suis prêt à rendre vos parties exhaltantes tout en maintenant votre communauté vivante et amusée constamment !'
const HIGHLIGHT_IMAGE_URL =
  'https://cdn.arstechnica.net/wp-content/uploads/2020/04/FirstLook_Smoke_VALORANT-scaled.jpg'

const FastSearch = ({
  avatarUrl = DEFAULT_AVATAR_URL,
  pseudo = DEFAULT_PSEUDO,
  team = DEFAULT_TEAM,
  teamColor = DEFAULT_TEAM_COLOR,
  descFirst = DEFAULT_DESC_FIRST,
  descSecond = DEFAULT_DESC_SECOND,
  descThird = DEFAULT_DESC_THIRD
}) => {
  const router = useRouter()

  return (
    <>
      <CustomStackScreen title='Recherches rapides' />
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.push('/feed')}>
          <Text style={styles.topMessage}>Voir mes profils rapides</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.logoContainer}>
              <Image source={{ uri: avatarUrl }} style={styles.logo} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{pseudo}</Text>
              <Text style={styles.cardSubtitle}>
                <Text style={styles.bracket}>[</Text>
                <Text style={[styles.subtitleText, { color: teamColor }]}>
                  {team}
                </Text>
                <Text style={styles.bracket}>]</Text>
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          <Text style={styles.descUser}>{descFirst}</Text>
          <Text style={styles.descUser}>{descSecond}</Text>

          <View style={styles.separator} />

          <Text style={styles.descUser}>{descThird}</Text>

          <View style={styles.separator} />

          <Text style={styles.highlightTitle}>Highlight</Text>
          <View style={styles.highlightImageContainer}>
            <Image
              source={{ uri: HIGHLIGHT_IMAGE_URL }}
              style={styles.highlightImage}
            />
            <Image
              source={require('../../assets/icons/PLAYING-ICON.png')}
              style={styles.playIcon}
            />
          </View>
        </View>

        <View style={styles.navContainer}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Image
              source={require('../../assets/icons/CANCELLING_ARROW.png')}
              style={styles.navIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Image
              source={require('../../assets/icons/VALIDATING_ARROW.png')}
              style={styles.navIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLORS.background_blue,
    paddingTop: 15,
    paddingHorizontal: 20
  },
  topMessage: {
    marginBottom: 15,
    color: COLORS.link_yellow,
    fontSize: 20,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    alignSelf: 'center'
  },
  card: {
    width: '97.5%',
    minHeight: 350,
    backgroundColor: COLORS.background_blue,
    borderWidth: 1,
    borderColor: COLORS.main_blue,
    padding: 20,
    marginBottom: 20
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    backgroundColor: COLORS.link_yellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20
  },
  logo: {
    width: '100%',
    height: '100%'
  },
  textContainer: {
    justifyContent: 'flex-start'
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: COLORS.text_white,
    marginBottom: 4
  },
  cardSubtitle: {
    fontSize: 14,
    flexDirection: 'row'
  },
  bracket: {
    color: COLORS.text_white,
    fontSize: 14,
    fontStyle: 'italic'
  },
  subtitleText: {
    fontSize: 14,
    fontStyle: 'italic'
  },
  separator: {
    width: '75%',
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.main_blue,
    margin: 7.5
  },
  descUser: {
    color: COLORS.text_white
  },
  highlightTitle: {
    fontSize: 17.5,
    fontWeight: 'bold',
    color: COLORS.text_white,
    marginBottom: 4,
    alignSelf: 'center'
  },
  highlightImageContainer: {
    width: '100%',
    alignItems: 'center'
  },
  highlightImage: {
    width: '100%',
    height: 150,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.main_blue
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -20 }],
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 40
  },
  navIcon: {
    width: 150,
    height: 50,
    resizeMode: 'contain'
  }
})

export default FastSearch
