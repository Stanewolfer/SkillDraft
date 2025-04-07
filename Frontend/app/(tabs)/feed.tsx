import { Stack } from 'expo-router'
import React from 'react'
import { useRouter } from 'expo-router'
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  LogBox
} from 'react-native'
import * as Unicons from '@iconscout/react-native-unicons'
import { LinearGradient } from 'expo-linear-gradient'
import COLORS from './styles/colors'
// import CustomStackScreen from '../components/CustomStackScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
      {/*<CustomStackScreen title='Feed' />*/}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Image
              source={{
                uri: 'https://pbs.twimg.com/profile_images/1864400903316389888/61aizUvr_400x400.jpg'
              }}
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>GentleMates</Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.badgeText}>✔</Text>
                </View>
              </View>
              <Text style={styles.subtitle}>VALORANT</Text>
              <Text style={styles.description}>
                Notre équipe VALORANT recrute ! Nous avons besoin de créateurs
                de contenu afin de maintenir notre communauté occupée, même hors
                VCT. Nous cherchons un profil intéressant
                <Text style={{ color: COLORS.main_blue }}> … plus</Text>
              </Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <View style={styles.iconsContainer}>
              <TouchableOpacity style={styles.iconButton}>
                <Unicons.UilHeart size={25} color={COLORS.main_blue} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Unicons.UilCommentAlt size={25} color={COLORS.main_blue} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Unicons.UilRepeat size={25} color={COLORS.main_blue} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Unicons.UilCornerUpRight size={25} color={COLORS.main_blue} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.candidaterButton}
              onPress={() => console.log('Candidater pressed')}
            >
              <Text style={styles.candidaterButtonText}>Candidater</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardDivider} />
        </View>

        <View style={styles.card2}>
          <Image
            source={{
              uri: 'https://gamecover.fr/wp-content/uploads/Tejo-Act-1-Wallpaper.png'
            }}
            style={styles.card2BackgroundImage}
            resizeMode='cover'
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.9)', 'transparent']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 750
            }}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
          />
          <View style={styles.card2Content}>
            <View style={styles.card2UserRow}>
              <Image
                source={{
                  uri: 'https://cdn-s-www.ledauphine.com/images/C13899F4-D63A-44EC-80B6-A9B6736E9AC8/NW_raw/squeezie-ici-en-2023-a-roland-garros-compte-19-millions-d-abonnes-sur-sa-chaine-youtube-photo-sipa-laurent-vu-1718376151.jpg'
                }}
                style={styles.card2UserAvatar}
              />
              <View style={styles.card2UserInfo}>
                <View style={styles.card2TitleRow}>
                  <Text style={styles.card2UserName}>Squeezie</Text>
                  <View style={styles.card2VerifiedBadge}>
                    <Text style={styles.card2BadgeText}>✔</Text>
                  </View>
                </View>
                <Text style={styles.card2Team}>[GentleMates]</Text>
              </View>
            </View>

            <View style={styles.card2VideoLabelContainer}>
              <Unicons.UilAirplay
                size={18}
                color={COLORS.main_blue}
                style={styles.videoIcon}
              />
              <Text style={styles.card2VideoLabel}>Lire la vidéo</Text>
            </View>

            <Text style={styles.card2UpdateTitle}>Nouvelle mise à jour !</Text>
            <View style={styles.card2DescriptionRow}>
              <View style={styles.verticalIconsContainer}>
                <TouchableOpacity style={styles.verticalIconButton}>
                  <Unicons.UilHeart size={25} color={COLORS.main_blue} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.verticalIconButton}>
                  <Unicons.UilCommentAlt size={25} color={COLORS.main_blue} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.verticalIconButton}>
                  <Unicons.UilRepeat size={25} color={COLORS.main_blue} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.verticalIconButton}>
                  <Unicons.UilCornerUpRight
                    size={25}
                    color={COLORS.main_blue}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.card2Description}>
                Le patch 10.01 de VALORANT vient d’arriver. En plus d’introduire
                un nouvel agent, beaucoup d’équilibrage d’anciens agents et la
                nouvelle map pool. Andy et l’équipe des devs vous accueillent
                pour cette nouvelle … Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Exercitationem minus nobis veniam, sed dolores
                consequuntur?
              </Text>
            </View>
          </View>
          <View style={styles.cardDivider} />
        </View>

        <View style={styles.bottomButtonsContainer}>
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
          <TouchableOpacity style={styles.bottomButton} onPress={logout}>
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
    padding: 18,
    backgroundColor: COLORS.background_blue
  },
  // -- First card
  card: {
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: COLORS.background_blue
  },
  cardRow: {
    flexDirection: 'row'
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text_white
  },
  verifiedBadge: {
    backgroundColor: '#B8F600',
    borderRadius: 50,
    marginLeft: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
    justifyContent: 'center'
  },
  badgeText: {
    color: COLORS.text_white,
    fontSize: 7.5,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text_white,
    marginTop: 4
  },
  description: {
    fontSize: 14,
    color: COLORS.text_white,
    marginTop: 8
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  iconsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    gap: 15
  },
  iconButton: {
    marginRight: 15
  },
  candidaterButton: {
    backgroundColor: COLORS.main_blue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 'auto'
  },
  candidaterButtonText: {
    color: COLORS.background_blue,
    fontWeight: 'bold',
    fontSize: 16
  },
  cardDivider: {
    borderBottomWidth: 1,
    borderColor: COLORS.main_blue,
    marginTop: 10
  },

  // -- Second card
  card2: {
    position: 'relative',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden'
  },
  card2BackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  card2Content: {
    position: 'relative',
    zIndex: 2,
    padding: 15
  },
  card2UserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  card2UserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8
  },
  card2UserInfo: {
    justifyContent: 'center'
  },
  card2TitleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  card2UserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text_white
  },
  card2VerifiedBadge: {
    backgroundColor: '#B8F600',
    borderRadius: 50,
    marginLeft: 4,
    paddingHorizontal: 3,
    paddingVertical: 1,
    justifyContent: 'center'
  },
  card2BadgeText: {
    color: COLORS.text_white,
    fontSize: 7,
    fontWeight: 'bold'
  },
  card2Team: {
    fontSize: 12,
    color: COLORS.text_white,
    fontStyle: 'italic'
  },
  card2VideoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8
  },
  videoIcon: {
    marginRight: 6
  },
  card2VideoLabel: {
    fontSize: 14,
    color: COLORS.main_blue,
    fontWeight: 'bold'
  },
  card2UpdateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text_white,
    marginBottom: 4
  },
  card2Description: {
    fontSize: 14,
    color: COLORS.text_white,
    flex: 1,
    lineHeight: 20
  },
  card2DescriptionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10
  },
  verticalIconsContainer: {
    flexDirection: 'column',
    marginRight: 10
  },
  verticalIconButton: {
    marginBottom: 10
  },

  // -- Bottom navigation bar
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8
  },
  bottomButtonContent: {
    alignItems: 'center'
  },
  bottomButtonLabel: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.main_blue
  }
})
