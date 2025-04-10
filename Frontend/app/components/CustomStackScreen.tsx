import React from "react";
import { Stack } from "expo-router";
import { COLORS } from "../(tabs)/styles/colors";
import { TouchableOpacity, View } from "react-native";

interface CustomStackScreenProps {
    title: string;
}

export default function CustomStackScreen({ title }: CustomStackScreenProps) {
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
                    >
                    </View>
                ),
            }}
        />
    
    );
}