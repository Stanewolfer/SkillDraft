import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { COLORS } from "../(tabs)/styles/colors";
import { View, TouchableOpacity, Image, Text, TextInput } from "react-native";
import * as Unicons from "@iconscout/react-native-unicons";
import { LinearGradient } from "expo-linear-gradient";
import { notificationData } from "../(tabs)/notifications";

interface CustomStackScreenProps {
  title: string;
}

const minimalHeaderTitlesMap: { [key: string]: string } = {
  connexion: "Connexion",
  inscription: "Inscription",
  fast_search: "Recherche rapide",
  notifications: "Notifications",
  profile: "Mon Profil",
  messaging: "Messagerie",
  skilldraft: "Bienvenue sur Skilldraft !",
};

export default function CustomStackScreen({ title }: CustomStackScreenProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const isMinimalHeader = minimalHeaderTitlesMap.hasOwnProperty(
    title.toLowerCase()
  );

  const displayTitle = isMinimalHeader
    ? minimalHeaderTitlesMap[title.toLowerCase()]
    : title;

  const notificationsCount = notificationData.length;

  return (
    <Stack.Screen
      options={{
        title: title,
        headerTitleStyle: {
          color: COLORS.background_blue,
        },
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerBackground: () =>
          isMinimalHeader ? (
            <View
              style={{
                flex: 1,
                backgroundColor: COLORS.main_blue,
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                overflow: "hidden",
                zIndex: 999,
              }}
            />
          ) : (
            <LinearGradient
              colors={[COLORS.gentle_mates, COLORS.main_blue]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{
                flex: 1,
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                overflow: "hidden",
                zIndex: 999,
              }}
            />
          ),
        headerTitle: () =>
          isMinimalHeader ? (
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: COLORS.background_blue,
              }}
            >
              {displayTitle}
            </Text>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.background_blue,
                borderRadius: 25,
                paddingHorizontal: 10,
                paddingVertical: 1,
              }}
            >
              <Unicons.UilSearch color={COLORS.main_blue} size={20} />
              <TextInput
                style={{
                  color: COLORS.main_blue,
                  fontSize: 14,
                  flex: 1,
                }}
                placeholder="Rechercher..."
                placeholderTextColor={COLORS.main_blue}
                value={search}
                onChangeText={(text) => setSearch(text)}
              />
            </View>
          ),
        headerLeft: () =>
          title.toLowerCase() === "skilldraft" ? null : isMinimalHeader ? (
            null
          ) : (
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 5,
              }}
            >
              <Image
                source={{
                  uri: "https://e.sport.fr/wp-content/uploads/2024/06/Gentle_Mates_beyAz_at_VCT_2024_EMEA_Kickoff-120x86.jpg",
                }}
                style={{ width: 32, height: 32, borderRadius: 16 }}
              />
              <View style={{ marginLeft: 8, marginRight: 12 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: "#000",
                  }}
                >
                  beyAz
                </Text>
                <Text
                  style={{
                    fontStyle: "italic",
                    fontSize: 12,
                    color: "#000",
                  }}
                >
                  [GentleMates]
                </Text>
              </View>
            </TouchableOpacity>
          ),
        headerRight: () =>
          isMinimalHeader ? null : (
            <TouchableOpacity
              onPress={() => router.push("/notifications")}
              style={{ marginRight: 5 }}
            >
              <View style={{ position: "relative", marginLeft: 12 }}>
                <Unicons.UilBell size={24} color={COLORS.background_blue} />
                {notificationsCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      backgroundColor: "red",
                      borderRadius: 8,
                      width: 16,
                      height: 16,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {notificationsCount > 1 && (
                      <Text style={{ color: "white", fontSize: 10 }}>
                        {notificationsCount > 9 ? "9+" : notificationsCount}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ),
      }}
    />
  );
}
