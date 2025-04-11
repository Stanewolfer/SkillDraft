import React from 'react'
import {
  ScrollView,
  View,
  Text,
  StyleSheet
} from 'react-native'
import { COLORS } from './styles/colors'
import CustomStackScreen from '../components/CustomStackScreen'
import OfferCard from '../components/OfferCard'

export default function Offers() {
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
            backgroundImageUrl='https://e.sport.fr/wp-content/uploads/2023/04/FtnAijAWABQQLnw.jpg'
            logoUrl='https://pbs.twimg.com/profile_images/1864400903316389888/61aizUvr_400x400.jpg'
            orgName='GentleMates'
            gameName='VALORANT'
            description='Notre équipe VALORANT recrute ! Nous avons besoin de créateurs de contenu afin de maintenir notre communauté occupée, même hors VCT. Nous cherchons un profil intéressant et motivé.'
            colorTeam={COLORS.gentle_mates}
          />

          <OfferCard
            backgroundImageUrl='https://reviewcentralme.com/wp-content/uploads/2023/12/BLAST-Winner-2023.png'
            logoUrl='https://fr.egw.news/_next/image?url=https%3A%2F%2Fegw.news%2Fuploads%2Fnews%2F1671207094992-16x9.webp&w=1920&q=75'
            orgName='Vitality'
            gameName='VALORANT'
            description='Notre équipe VALORANT recrute ! Nous avons besoin de créateurs de contenu afin de maintenir notre communauté occupée, même hors VCT. Nous cherchons un profil intéressant et motivé.'
            colorTeam={COLORS.vitality}
          />

          <OfferCard
            backgroundImageUrl='https://france3-regions.francetvinfo.fr/image/oodddmv6A4D7UcLd6Y0lNbjHK4Q/1200x675/regions/2022/06/21/62b1f8dcb46a3_image00001.jpeg'
            logoUrl='https://www.karminecorp.fr/cdn/shop/files/images.png?crop=center&height=600&v=1702995053&width=1200'
            orgName='Karmine Corp'
            gameName='VALORANT'
            description='Notre équipe VALORANT recrute ! Nous avons besoin de créateurs de contenu afin de maintenir notre communauté occupée, même hors VCT. Nous cherchons un profil intéressant et motivé.'
            colorTeam={COLORS.karmine_corp}
          />
        </ScrollView>
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
    paddingBottom: 80
  },
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
  }
})
