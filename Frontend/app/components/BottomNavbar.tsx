import React from "react";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Text, Image } from "react-native";
import { COLORS } from "@/app/(tabs)/styles/colors";
import * as Unicons from "@iconscout/react-native-unicons";
import { bottomNavbarStyles } from "../(tabs)/styles/bottomNavbarStyles";
import { router, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BottomNavbar() {

    const router = useRouter()

    const logout = async () => {
        await AsyncStorage.clear()
        router.push('/')
    }

    return (
        <View style={bottomNavbarStyles.bottomButtonsContainer}>
            <TouchableOpacity
            style={bottomNavbarStyles.bottomButton}
            onPress={() => router.push('/feed')}
            >
            <View style={bottomNavbarStyles.bottomButtonContent}>
                <Unicons.UilHome size={28} color={COLORS.main_blue} />
                <Text style={bottomNavbarStyles.bottomButtonLabel}>Fil d'actualité</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity style={bottomNavbarStyles.bottomButton} onPress={logout}>
            <View style={bottomNavbarStyles.bottomButtonContent}>
                <Unicons.UilSignout size={28} color={COLORS.main_blue} />
                <Text style={bottomNavbarStyles.bottomButtonLabel}>Déconnexion</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity
            style={bottomNavbarStyles.bottomButton}
            onPress={() => router.push('/create_post')}
            >
                <View style={bottomNavbarStyles.bottomButtonContent}>
                    <Unicons.UilPlus size={32} color={COLORS.main_blue} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={bottomNavbarStyles.bottomButton}
                onPress={() => router.push('/offers')}
            >
            <View style={bottomNavbarStyles.bottomButtonContent}>
                <Unicons.UilBag size={28} color={COLORS.main_blue} />
                <Text style={bottomNavbarStyles.bottomButtonLabel}>Offres</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={bottomNavbarStyles.bottomButton}
                onPress={() => router.push('/mailbox')}
            >
            <View style={bottomNavbarStyles.bottomButtonContent}>
                <Unicons.UilEnvelopeAlt size={36} color={COLORS.main_blue} />
                <Text style={bottomNavbarStyles.bottomButtonLabel}>Messagerie</Text>
            </View>
            </TouchableOpacity>
        </View>
    )}