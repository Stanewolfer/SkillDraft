import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "./styles/colors";
import CustomStackScreen from "../components/CustomStackScreen";
import { BottomNavbar } from "../components/BottomNavbar";
import {
  NotificationCard,
  NotificationType,
} from "../components/NotificationCard";

export const notificationData = [
  {
    id: 1,
    type: NotificationType.LIKE,
    avatars: [
      "https://e.sport.fr/wp-content/uploads/2024/06/Gentle_Mates_beyAz_at_VCT_2024_EMEA_Kickoff-120x86.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoAXfuBrHJk24xJbfH846R3goJGbgR-to_Ng&s",
    ],
    title: "beyAz et 1 autre personne ont liké votre post",
    subtitle: "Nouvelle mise à jour de VALORANT",
  },
  {
    id: 2,
    type: NotificationType.SHARE,
    avatars: [
      "https://e.sport.fr/wp-content/uploads/2024/06/Gentle_Mates_beyAz_at_VCT_2024_EMEA_Kickoff-120x86.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoAXfuBrHJk24xJbfH846R3goJGbgR-to_Ng&s",
    ],
    title: "beyAz et 1 autre personne ont republié votre post",
    subtitle: "Nouvelle mise à jour de VALORANT",
  },
  {
    id: 3,
    type: NotificationType.APPLY,
    avatars: [
      "https://e.sport.fr/wp-content/uploads/2024/06/Gentle_Mates_beyAz_at_VCT_2024_EMEA_Kickoff-120x86.jpg",
    ],
    title: "beyAz a postulé à votre offre",
    subtitle: "L'équipe GentleMates recrute !",
  },
];

export default function Notification() {
  const router = useRouter();

  const logout = async () => {
    await AsyncStorage.clear();
    router.push("/");
  };

  return (
    <>
      <CustomStackScreen title="Notifications" />
      <ScrollView contentContainerStyle={styles.container}>
        {notificationData.map((item) => (
          <NotificationCard
            key={item.id}
            id={item.id}
            type={item.type}
            avatars={item.avatars}
            title={item.title}
            subtitle={item.subtitle}
          />
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: COLORS.background_blue,
  },
});
