import React from "react";
import { Stack, useRouter } from "expo-router";
import { COLORS } from "../(tabs)/styles/colors";
import { View, TouchableOpacity, Image } from "react-native";
import * as Unicons from "@iconscout/react-native-unicons";

interface CustomStackScreenProps {
  title: string;
}

export default function CustomStackScreen({ title }: CustomStackScreenProps) {
  const router = useRouter();

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
        headerBackground: () => (
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
        ),
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            style={{ marginLeft: 15 }}
          >
            <Image
              source={{
                uri: "https://e.sport.fr/wp-content/uploads/2024/06/Gentle_Mates_beyAz_at_VCT_2024_EMEA_Kickoff-120x86.jpg",
              }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            style={{ marginRight: 15 }}
          >
            <Unicons.UilBell size={24} color={COLORS.background_blue} />
          </TouchableOpacity>
        ),
      }}
    />
  );
}
