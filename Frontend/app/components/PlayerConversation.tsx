import React from "react";
import { View, Text, Image } from "react-native";
import { styles } from "@/app/(tabs)/styles/playerConversationStyles";

export default function PlayerConversation() {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Image source={require("@/assets/images/circle-placeholder.png")} style={styles.profilePicture}></Image>
          <View style={styles.informations}>
              <View style={styles.profile}>
                  <Text style={styles.title}>Pseudonyme</Text>
                  <Text style={styles.teamTitle}>[ Equipe (optionnel) ]</Text>
              </View>
              <Text style={styles.lastMessage}>Dernier message de la conversation</Text>
              <Text style={styles.dateText}>01/25</Text>
          </View>
        </View>
      </View>
    </>
  );
}