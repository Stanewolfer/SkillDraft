import React from "react";
import { View, Text, Image } from "react-native";
import { styles } from "@/app/(tabs)/styles/playerConversationStyles";

interface PlayerConversationProps {
  pseudonym: string;
  team?: string;
  lastMessage: string;
  date: string;
  profilePicture: any; // Replace `any` with the appropriate type for your image source
}

export default function PlayerConversation(PlayerConversationProps: PlayerConversationProps) {
  const { pseudonym, team, lastMessage, date, profilePicture } = PlayerConversationProps;
  return (
    <>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Image source={profilePicture} style={styles.profilePicture}></Image>
          <View style={styles.informations}>
              <View style={styles.profile}>
                  <Text style={styles.title}>{pseudonym || 'Pseudonyme'}</Text>
                  <Text style={styles.teamTitle}>[ {team || 'Aucune équipe'} ]</Text>
              </View>
              <Text style={styles.lastMessage}>{lastMessage || 'Lorem Ipsum'}</Text>
              <Text style={styles.dateText}>{date || '01/12'}</Text>
          </View>
        </View>
      </View>
    </>
  );
}