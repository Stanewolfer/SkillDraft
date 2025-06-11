import React from "react";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "./styles/colors";
import CustomStackScreen from "../components/CustomStackScreen";
import { BottomNavbar } from "../components/BottomNavbar";
import * as Unicons from "@iconscout/react-native-unicons";
import { LinearGradient } from "expo-linear-gradient";

const BANNER_URL =
  "https://i.ytimg.com/vi/Fxm2cUNas1k/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDAV7W1ADVrw5Vr9p3_v9zomhDIlw";
const AVATAR_URL =
  "https://e.sport.fr/wp-content/uploads/2024/06/Gentle_Mates_beyAz_at_VCT_2024_EMEA_Kickoff.jpg";
const VALO_THUMB_URL =
  "https://gamecover.fr/wp-content/uploads/Tejo-Act-1-Wallpaper.png";

export default function ProfileScreen() {
  const router = useRouter();

  const logout = async () => {
    await AsyncStorage.clear();
    router.push("/");
  };

  const openYouTube = () => {
    Linking.openURL("https://www.youtube.com/@beyAzkorpe");
  };

  const openTwitch = () => {
    Linking.openURL("https://www.twitch.tv/beyaz");
  };

  return (
    <View style={styles.mainContainer}>
      <CustomStackScreen title="profile" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.bannerContainer}>
          <Image source={{ uri: BANNER_URL }} style={styles.bannerImage} />
          <View style={styles.bannerOverlay} />
        </View>

        <View style={styles.profileInfoContainer}>
          <Image source={{ uri: AVATAR_URL }} style={styles.avatarLarge} />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>beyAz</Text>
            <Text style={styles.profileTeam}>
              Équipe : <Text style={styles.highlightTeam}>GentleMates</Text>
            </Text>
            <Text style={styles.profileDescription}>
              Content Creator - VALORANT{"\n"}
              Ex-Joueur Professionnel dans la section VALORANT de l'équipe
              GentleMates
            </Text>
          </View>
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialItemRed} onPress={openYouTube}>
            <Text style={styles.socialItemText}>YouTube</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialItemPurple}
            onPress={openTwitch}
          >
            <Text style={styles.socialItemText}>Twitch</Text>
          </TouchableOpacity>
          <View style={styles.socialItemTeal}>
            <Text style={styles.socialItemTealText}>+</Text>
          </View>
        </View>

        <View style={styles.extraInfoContainer}>
          <Text style={styles.extraInfoTitle}>
            Peak Rank :{" "}
            <Text style={styles.extraInfoHighlight}>RADIANT #158</Text>
          </Text>
          <Text style={styles.extraInfoSubtitle}>
            Liens utiles :{" "}
            <Text style={styles.linkHighlight}>Valorant Tracker</Text>
          </Text>
          <Text style={styles.extraDescription}>
            Joueur déterminé et ex-chef d’équipe de la section VALORANT de
            GentleMates, je suis prêt à rendre vos parties exhaltantes tout en
            maintenant votre communauté vivante et amusée constamment !
          </Text>
        </View>

        <View style={styles.postsContainer}>
          <Text style={styles.postsTitle}>Posts récents</Text>
          <View style={styles.postsRow}>
            <View style={styles.postCard}>
              <Image
                source={{ uri: VALO_THUMB_URL }}
                style={styles.postImageBackground}
              />
              <LinearGradient
                colors={["rgba(184, 246, 0, 1)", "rgba(108, 194, 53, 0)"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.postGreenOverlay}
              />
              <View style={styles.postCornerIcon}>
                <Unicons.UilRepeat size={25} color={COLORS.main_blue} />
              </View>
              <View style={styles.postContent}>
                <Text style={styles.postTitle}>
                  Nouvelle mise à jour de VALORANT
                </Text>
                <View style={styles.postFooter}>
                  <View style={styles.postFooterLeft}>
                    <Image
                      source={{ uri: AVATAR_URL }}
                      style={styles.postAvatar}
                    />
                    <Text style={styles.postUserName}>beyAz</Text>
                  </View>
                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <Text style={styles.postStats}>36K</Text>
                      <Unicons.UilHeart size={15} color={COLORS.text_white} />
                    </View>
                    <View style={[styles.statItem, { top: 10 }]}>
                      <Text style={styles.postStats}>154K</Text>
                      <Unicons.UilEye size={15} color={COLORS.text_white} />
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.recruitCard}>
              <Unicons.UilRepeat
                size={15}
                color={COLORS.main_blue}
                style={styles.recruitBackground}
              />
              <View style={styles.recruitOverlay} />
              <View style={styles.recruitContent}>
                <Text style={styles.recruitTitle}>
                  Notre équipe VALORANT recrute !
                </Text>
                <TouchableOpacity style={styles.recruitButton}>
                  <Text style={styles.recruitButtonText}>CANDIDATER</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text style={[styles.postsTitle, { marginTop: 20 }]}>
            Candidatures récentes
          </Text>
          <View style={styles.postsRow}>
            <View style={styles.recruitCard}>
              <Unicons.UilRepeat
                size={15}
                color={COLORS.main_blue}
                style={styles.recruitBackground}
              />
              <View style={styles.recruitOverlay} />
              <View style={styles.recruitContent}>
                <Text style={styles.recruitTitle}>
                  Notre équipe VALORANT recrute !
                </Text>
                <TouchableOpacity style={styles.recruitButton}>
                  <Text style={styles.recruitButtonText}>CANDIDATER</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background_blue,
  },
  container: {
    paddingBottom: 80,
  },
  bannerContainer: {
    width: "100%",
    height: 200,
    position: "relative",
    backgroundColor: "#000",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  profileInfoContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: -75,
  },
  avatarLarge: {
    width: 125,
    height: 125,
    borderRadius: 75,
    marginRight: 15,
    marginTop: -25,
  },
  profileTextContainer: {
    flex: 1,
    paddingTop: 15,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text_white,
    marginVertical: 5,
  },
  profileTeam: {
    fontSize: 16,
    fontStyle: "italic",
    color: COLORS.text_white,
    marginVertical: -10,
  },
  highlightTeam: {
    color: COLORS.gentle_mates,
    fontStyle: "italic",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  profileDescription: {
    fontSize: 14,
    color: COLORS.text_white,
    lineHeight: 20,
    paddingTop: 20,
  },
  socialContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 15,
  },
  socialItemRed: {
    backgroundColor: "#FF0000",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginRight: 10,
  },
  socialItemPurple: {
    backgroundColor: "#9146FF",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginRight: 10,
  },
  socialItemTeal: {
    backgroundColor: COLORS.main_blue,
    width: 36,
    height: 36,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  socialItemText: {
    color: "#fff",
    fontWeight: "600",
    fontStyle: "italic",
    textDecorationLine: "underline",
    fontSize: 15,
  },
  socialItemTealText: {
    color: "#000",
    fontSize: 30,
    fontWeight: "700",
  },
  extraInfoContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  extraInfoTitle: {
    fontSize: 14,
    color: COLORS.text_white,
    marginBottom: 4,
  },
  extraInfoHighlight: {
    fontWeight: "700",
    color: COLORS.text_white,
  },
  extraInfoSubtitle: {
    fontSize: 14,
    color: COLORS.text_white,
  },
  linkHighlight: {
    color: COLORS.link_yellow,
    fontWeight: "600",
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
  extraDescription: {
    fontSize: 14,
    color: COLORS.text_white,
    lineHeight: 20,
    marginTop: 10,
  },
  postsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  postsTitle: {
    fontSize: 18,
    color: COLORS.text_white,
    fontWeight: "700",
    marginBottom: 10,
  },
  postsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  postCard: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    width: "60%",
    height: 120,
  },
  postImageBackground: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  postGreenOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: "40%",
    width: "100%",
  },
  postCornerIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  postContent: {
    flex: 1,
    justifyContent: "space-between",
    padding: 10,
  },
  postTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 15,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postFooterLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 6,
  },
  postUserName: {
    color: "#fff",
    fontWeight: "700",
  },
  statsContainer: {
    position: "relative",
    width: 60,
    height: 30,
    marginLeft: 70,
  },
  statItem: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
  },
  postStats: {
    color: "#fff",
    fontSize: 12,
    marginRight: 4,
  },
  recruitCard: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    width: "48%",
    height: 120,
    backgroundColor: COLORS.gentle_mates,
    marginLeft: 8,
  },
  recruitBackground: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  recruitOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  recruitContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  recruitTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 12,
    textAlign: "center",
  },
  recruitButton: {
    backgroundColor: COLORS.main_blue,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  recruitButtonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 14,
  },
});
