import React from "react";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, LogBox } from "react-native";
import { COLORS } from "./styles/colors";
import CustomStackScreen from "../components/CustomStackScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OfferPostCard from "../components/OfferPostCard";
import MediaCard from "../components/MediaCard";
import { BottomNavbar } from "../components/BottomNavbar";

LogBox.ignoreLogs([
  "Warning: UilHeart: Support for defaultProps will be removed",
  "Warning: UilCommentAlt: Support for defaultProps will be removed",
  "Warning: UilRepeat: Support for defaultProps will be removed",
  "Warning: UilCornerUpRight: Support for defaultProps will be removed",

  "Warning: UilAirplay: Support for defaultProps will be removed",

  "Warning: UilPlusCircle: Support for defaultProps will be removed",
  "Warning: UilBag: Support for defaultProps will be removed",
  "Warning: UilEnvelopeAlt: Support for defaultProps will be removed",
  "Warning: UilSignout: Support for defaultProps will be removed",
]);

export default function FeedScreen() {
  const router = useRouter();

  const logout = async () => {
    await AsyncStorage.clear();
    router.push("/");
  };

  return (
    <>
      <CustomStackScreen title="Feed" />
      <ScrollView contentContainerStyle={styles.container}>
        <OfferPostCard />
        <MediaCard />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.background_blue,
  },
});
