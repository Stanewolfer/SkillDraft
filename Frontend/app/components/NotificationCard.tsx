import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import * as Unicons from "@iconscout/react-native-unicons";
import { COLORS } from "../(tabs)/styles/colors";

export enum NotificationType {
  LIKE = "like",
  SHARE = "share",
  APPLY = "apply",
}

interface NotificationCardProps {
  id: number;
  type: NotificationType;
  avatars: string[];
  title: string;
  subtitle: string;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  id,
  type,
  avatars,
  title,
  subtitle,
}) => {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatarIconContainer}>
          {type === NotificationType.LIKE && (
            <TouchableOpacity style={styles.verticalIconButton}>
              <Unicons.UilHeart size={25} color={COLORS.main_blue} />
            </TouchableOpacity>
          )}
          {type === NotificationType.SHARE && (
            <TouchableOpacity style={styles.verticalIconButton}>
              <Unicons.UilRepeat size={25} color={COLORS.main_blue} />
            </TouchableOpacity>
          )}

          <View style={styles.avatarContainer}>
            {avatars.map((avatarUrl, index) => (
              <Image
                key={index}
                source={{ uri: avatarUrl }}
                style={[styles.avatar, { marginLeft: index === 0 ? 0 : -10 }]}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.textSection}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.separator} />
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.dark_main_blue,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: "flex-start",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  verticalIconButton: {
    marginRight: 8,
  },
  avatarContainer: {
    flexDirection: "row",
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  textSection: {
    marginTop: 2,
    width: "100%",
  },
  cardTitle: {
    color: COLORS.main_blue,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  separator: {
    width: "50%",
    alignSelf: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.main_blue,
    marginVertical: 2,
  },
  cardSubtitle: {
    color: COLORS.main_blue,
    fontSize: 12,
  },
});
