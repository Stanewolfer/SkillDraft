import React, { use, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { COLORS } from "../(tabs)/styles/colors";
import { View, TouchableOpacity, Image, Text, TextInput } from "react-native";
import * as Unicons from "@iconscout/react-native-unicons";
import { LinearGradient } from "expo-linear-gradient";
import { notificationData } from "../(tabs)/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [username, setUsername] = useState<string>("Chargement...");
  const [inTeam, setInTeam] = useState<string>("Chargement...");
  const [teamColor, setTeamColor] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");

  React.useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        const storedType = await AsyncStorage.getItem("type");

        if (storedUserId) {
          if (storedType == "user") {

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/get-user-by-id/${storedUserId}`);
            const data = await response.json();
            const teamResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/teams/get-team-by-id/${data.teamId}`);
            const teamData = await teamResponse.json();

            setUsername(data.username);
            if (teamData !== null && teamData.teamname) { 
              setInTeam(teamData.teamname);
              setTeamColor(teamData.teamColor);
            }
            else {
              setInTeam("Aucune équipe");
              setTeamColor(COLORS.main_blue);
            }

          } else if (storedType == "team") {

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/teams/get-team-by-id/${storedUserId}`);
            const data = await response.json();
            setUsername(data.teamname);
            setProfilePicture(data.avatarUrl);
            setInTeam("Équipe");
            setTeamColor(data.teamColor ? data.teamColor : COLORS.main_blue);

          }
        }
      } catch (error) {
        setUsername("Nom d'utilisateur introuvable");
        setInTeam("Aucune équipe trouvée");
        setTeamColor(COLORS.main_blue);
      }
    };
    fetchUsername();
  }, []);

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
                overflow: "hidden",
                zIndex: 999,
              }}
            />
          ) : (
            <LinearGradient
              colors={[teamColor, COLORS.main_blue]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{
                flex: 1,
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
                  color: teamColor,
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
                  uri: profilePicture,
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
                  {username}
                </Text>
                <Text
                  style={{
                    fontStyle: "italic",
                    fontSize: 12,
                    color: "#000",
                  }}
                >
                  [{inTeam}]
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
