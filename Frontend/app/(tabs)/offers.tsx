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

export default function Offers() {
  const router = useRouter()

  const logout = async () => {
    await AsyncStorage.clear()
    router.push('/')
  }

  return (
    <>
      <CustomStackScreen title='Feed' />
      <View style={styles.pageContainer}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleListe}>Liste d'offres</Text>
            <View style={styles.blueBar} />
          </View>

          <OfferCard 
            backgroundImageUrl="https://e.sport.fr/wp-content/uploads/2023/04/FtnAijAWABQQLnw.jpg"
            logoUrl="https://pbs.twimg.com/profile_images/1864400903316389888/61aizUvr_400x400.jpg"
            orgName="GentleMates"
            gameName="VALORANT"
            description="Notre équipe VALORANT recrute ! Nous avons besoin de créateurs de contenu afin de maintenir notre communauté occupée, même hors VCT. Nous cherchons un profil intéressant et motivé."
          />

          <OfferCard 
            backgroundImageUrl="https://reviewcentralme.com/wp-content/uploads/2023/12/BLAST-Winner-2023.png"
            logoUrl="https://fr.egw.news/_next/image?url=https%3A%2F%2Fegw.news%2Fuploads%2Fnews%2F1671207094992-16x9.webp&w=1920&q=75"
            orgName="Vitality"
            gameName="VALORANT"
            description="Notre équipe VALORANT recrute ! Nous avons besoin de créateurs de contenu afin de maintenir notre communauté occupée, même hors VCT. Nous cherchons un profil intéressant et motivé."
          />

          <OfferCard 
            backgroundImageUrl="https://france3-regions.francetvinfo.fr/image/oodddmv6A4D7UcLd6Y0lNbjHK4Q/1200x675/regions/2022/06/21/62b1f8dcb46a3_image00001.jpeg"
            logoUrl="https://www.karminecorp.fr/cdn/shop/files/images.png?crop=center&height=600&v=1702995053&width=1200"
            orgName="GentleMates"
            gameName="VALORANT"
            description="Notre équipe VALORANT recrute ! Nous avons besoin de créateurs de contenu afin de maintenir notre communauté occupée, même hors VCT. Nous cherchons un profil intéressant et motivé."
          />
        </ScrollView>

        {/* Barre de navigation fixe en bas */}
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => router.push('/feed')}
          >
            <View style={styles.bottomButtonContent}>
              <Unicons.UilNewspaper size={28} color={COLORS.main_blue} />
              <Text style={styles.bottomButtonLabel}>Fil d'actualité</Text>
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
            style={[styles.bottomButton, styles.activeBottomButton]}
            onPress={() => router.push('/offers')}
          >
            <View style={styles.bottomButtonContent}>
              <Unicons.UilBag size={28} color={COLORS.background_blue} />
              <Text style={[styles.bottomButtonLabel, styles.activeBottomButtonLabel]}>
                Offres
              </Text>
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
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1
  },
  container: {
    padding: 10,
    backgroundColor: COLORS.background_blue,
    paddingBottom: 80 // espace suffisant pour que le contenu ne soit pas caché derrière la navbar
  },
  // Titre et barre bleue
  titleContainer: {
    alignItems: 'center',
    marginBottom: 15
  },
  titleListe: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text_white
  },
  blueBar: {
    marginTop: 5,
    width: '50%',
    height: 2,
    backgroundColor: COLORS.main_blue
  },
  // Barre de navigation fixe en bas
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
    //borderTopLeftRadius: 35,
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
