import React from "react";
import { Stack, useRouter } from "expo-router";
import { COLORS } from "../(tabs)/styles/colors";
import { View, TouchableOpacity } from "react-native";
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
