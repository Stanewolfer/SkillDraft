import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '../(tabs)/styles/colors'

export default function OfferCard({
  backgroundImageUrl = 'https://c1.wallpaperflare.com/preview/595/1003/783/code-coder-coding-computer.jpg',
  logoUrl = 'https://pbs.twimg.com/profile_images/1864400903316389888/61aizUvr_400x400.jpg',
  orgName = 'Team Name',
  gameName = 'Game',
  description = `Text Description`
}) {
  return (
    <ImageBackground
      source={{ uri: backgroundImageUrl }}
      style={styles.offerCardContainer}
      imageStyle={styles.imageStyle}
    >
      <LinearGradient
        colors={['rgba(0,0,0,1)', 'transparent']}
        style={styles.linearGradient}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
      />
      <View style={styles.contentContainer}>
        <View style={styles.offerCardHeader}>
          <Image source={{ uri: logoUrl }} style={styles.offerCardLogo} />
          <View style={styles.offerCardInfo}>
            <View style={styles.offerCardTitleRow}>
              <Text style={styles.offerCardTitle}>{orgName}</Text>
              <View style={styles.offerCardVerified}>
                <Text style={styles.offerCardVerifiedText}>✔</Text>
              </View>
            </View>
            <Text style={styles.offerCardSubtitle}>{gameName}</Text>
          </View>
        </View>
        <Text style={styles.offerCardDescription}>{description}</Text>
        <TouchableOpacity
          style={styles.offerCardButton}
          onPress={() => console.log('Candidater pressed')}
        >
          <Text style={styles.offerCardButtonText}>CANDIDATER</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  offerCardContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    padding: 15,
    marginBottom: 20
  },
  imageStyle: {
    borderRadius: 10
  },
  linearGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1500
  },
  contentContainer: {
    zIndex: 2
  },
  offerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  offerCardLogo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10
  },
  offerCardInfo: {
    flex: 1
  },
  offerCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  offerCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text_white
  },
  offerCardVerified: {
    backgroundColor: '#B8F600',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6
  },
  offerCardVerifiedText: {
    color: COLORS.background_blue,
    fontSize: 10,
    fontWeight: 'bold'
  },
  offerCardSubtitle: {
    fontSize: 14,
    color: COLORS.text_white,
    marginTop: 2
  },
  offerCardDescription: {
    fontSize: 14,
    color: COLORS.text_white,
    marginTop: 4,
    lineHeight: 18
  },
  offerCardButton: {
    marginTop: 15,
    backgroundColor: COLORS.main_blue,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center'
  },
  offerCardButtonText: {
    color: COLORS.background_blue,
    fontWeight: 'bold',
    fontSize: 16
  }
})
