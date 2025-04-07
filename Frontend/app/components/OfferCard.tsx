import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import * as Unicons from '@iconscout/react-native-unicons'
import { COLORS } from '../(tabs)/styles/colors'

export default function OfferCard() {
  return (
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
            Notre équipe VALORANT recrute ! Nous avons besoin de créateurs de contenu afin de maintenir notre communauté occupée, même hors VCT. Nous cherchons un profil intéressant
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
  )
}

const styles = StyleSheet.create({
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
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6
  },
  badgeText: {
    color: COLORS.text_white,
    fontSize: 8,
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
    justifyContent: 'flex-start'
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
  }
})
