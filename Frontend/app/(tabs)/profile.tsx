import React from "react";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View, Text, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "./styles/colors";
import CustomStackScreen from "../components/CustomStackScreen";
import { BottomNavbar } from "../components/BottomNavbar";

const BANNER_URL =
  "https://i.ytimg.com/vi/Fxm2cUNas1k/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDAV7W1ADVrw5Vr9p3_v9zomhDIlw";
const AVATAR_URL =
  "https://e.sport.fr/wp-content/uploads/2024/06/Gentle_Mates_beyAz_at_VCT_2024_EMEA_Kickoff.jpg";

export default function ProfileScreen() {
  const router = useRouter();

  const logout = async () => {
    await AsyncStorage.clear();
    router.push("/");
  };

  return (
    <View style={styles.mainContainer}>
      <CustomStackScreen title="Profil" />
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

        <View style={styles.extraInfoContainer}>
          <Text style={styles.extraInfoTitle}>
            Peak Rank :{" "}
            <Text style={styles.extraInfoHighlight}>RADIANT #158</Text>
          </Text>
          <Text style={styles.extraInfoSubtitle}>
            Liens utiles :{" "}
            <Text style={styles.linkHighlight}>Valorant Tracker</Text>
          </Text>
        </View>
      </ScrollView>
      <BottomNavbar activeScreen="feed" logout={logout} />
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
  extraInfoContainer: {
    paddingHorizontal: 20,
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
});
