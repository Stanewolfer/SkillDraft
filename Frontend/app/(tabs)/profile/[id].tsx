import { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import * as Unicons from '@iconscout/react-native-unicons'
import CustomStackScreen from '@/app/components/CustomStackScreen'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '../styles/colors'
import { color } from 'native-base/lib/typescript/theme/styled-system'
import AsyncStorage from '@react-native-async-storage/async-storage'

// TypeScript : structure de l'utilisateur
type User = {
    id: string
    username: string
    firstName: string
    lastName: string
    email: string
    avatarUrl?: string
    teamId?: string
    description?: string
}

export default function ProfileScreen() {
    const BANNER_URL =
        "https://i.ytimg.com/vi/Fxm2cUNas1k/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDAV7W1ADVrw5Vr9p3_v9zomhDIlw";
    const AVATAR_URL =
        "https://e.sport.fr/wp-content/uploads/2024/06/Gentle_Mates_beyAz_at_VCT_2024_EMEA_Kickoff.jpg";
    const VALO_THUMB_URL =
        "https://gamecover.fr/wp-content/uploads/Tejo-Act-1-Wallpaper.png";


    const [connectedUserId, setConnectedUserId] = useState<string | null>(null)


    const { id } = useLocalSearchParams()
    console.log('ID reçu dans profile page :', id)
    const [user, setUser] = useState<User | null>(null)
    const [teamName, setTeamName] = useState<string | null>(null)
    const [teamColor, setTeamColor] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            if (!id || typeof id !== 'string') return

            try {
            const storedUserId = await AsyncStorage.getItem('userId')
            setConnectedUserId(storedUserId)

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/get-user-by-id/${id}`)
            if (!response.ok) {
                throw new Error('User not found')
            }
            const data = await response.json()
            setUser(data)

            if (data.teamId) {
                try {
                const teamResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/teams/get-team-by-id/${data.teamId}`)
                if (teamResponse.ok) {
                    const teamData = await teamResponse.json()
                    setTeamName(teamData.teamname)
                    setTeamColor(teamData.teamColor)
                } else {
                    setTeamName(null)
                    setTeamColor(null)
                }
                } catch (teamError) {
                console.error("Erreur lors du chargement de l'équipe :", teamError)
                setTeamName(null)
                setTeamColor(null)
                }
            } else {
                setTeamName(null)
                setTeamColor(null)
            }
            } catch (error) {
            console.error("Erreur lors du chargement de l'utilisateur :", error)
            setUser(null)
            } finally {
            setLoading(false)
            }
        }

        fetchUser()
        }, [id])


    if (loading) {
        return (
        <View style={styles.container}>
            <CustomStackScreen title="profile" />
            <ActivityIndicator size="large" color="blue" />
            <Text>Chargement...</Text>
        </View>
        )
    }

    if (!user || !user.firstName) {
        return (
        <View style={styles.container}>
            <CustomStackScreen title="profile" />
            <Text>Utilisateur inconnu</Text>
        </View>
        )
    }

    return (
        <View style={styles.mainContainer}>
            <CustomStackScreen title="profile" />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.bannerContainer}>
                    <Image source={{ uri: user.avatarUrl }} style={styles.bannerImage} />
                    <View style={styles.bannerOverlay} />
                </View>
        
                <View style={styles.profileInfoContainer}>
                    <Image source={{ uri: user.avatarUrl }} style={styles.avatarLarge} />
                    <View style={styles.profileTextContainer}>
                        <Text style={styles.profileName}>{user.username}</Text>
                        <Text style={styles.profileTeam}>
                        Équipe : <Text style={[styles.highlightTeam, { color: teamColor }]}>{teamName ? teamName : "Aucune"}</Text>
                        </Text>
                        {connectedUserId && user.id !== connectedUserId && (
                            <TouchableOpacity
                                style={styles.followButton}
                                onPress={async () => {
                                    if (!connectedUserId) return;

                                    try {
                                    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/follow/create`, {
                                        method: 'POST',
                                        headers: {
                                        'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                        followerId: connectedUserId,
                                        followedId: user.id,
                                        }),
                                    });

                                    if (!response.ok) {
                                        const errorData = await response.json();
                                        console.log('Erreur follow :', errorData.message);
                                        alert(errorData.message);
                                        return;
                                    }

                                    const followData = await response.json();
                                    console.log('Suivi effectué :', followData);
                                    alert('Suivi effectué !');
                                    } catch (error) {
                                    console.error('Erreur lors du follow :', error);
                                    alert('Une erreur est survenue.');
                                    }
                                }}
                                >
                                <Text style={styles.followButtonText}>Suivre</Text>
                                </TouchableOpacity>
                        )}

                        {/*<Text style={styles.profileDescription}>
                        Content Creator - VALORANT{"\n"}
                        Ex-Joueur Professionnel dans la section VALORANT de l'équipe
                        GentleMates
                        </Text>*/}
                    </View>
                </View>
        
                <View style={styles.extraInfoContainer}>
                    <Text style={styles.extraInfoSubtitle}>
                        Description
                    </Text>
                    <Text style={styles.extraDescription}>
                        {user.description ?? "Aucune description."}
                    </Text>
                </View>
        
                {/*<View style={styles.postsContainer}>
                <Text style={styles.postsTitle}>Posts récents</Text>
                <View style={styles.postsRow}>
                    <View style={styles.postCard}>
                    <Image
                        source={{ uri: VALO_THUMB_URL }}
                        style={styles.postImageBackground}
                    />
                    <LinearGradient
                        colors={["rgba(184, 246, 0, 1)", "rgba(108, 194, 53, 0)"]}
                        start={[0.5, 0]}
                        end={[1, 0]}
                        style={styles.postGreenOverlay}
                    />
                    <View style={styles.postCornerIcon}>
                        <Unicons.UilRepeat size={25} color={COLORS.main_blue} />
                    </View>
                    <View style={styles.postContent}>
                        <Text style={styles.postTitle}>
                        Nouvelle mise à jour de VALORANT
                        </Text>
                        <View style={styles.postFooter}>
                        <View style={styles.postFooterLeft}>
                            <Image
                            source={{ uri: AVATAR_URL }}
                            style={styles.postAvatar}
                            />
                            <Text style={styles.postUserName}>beyAz</Text>
                        </View>
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                            <Text style={styles.postStats}>36K</Text>
                            <Unicons.UilHeart size={15} color={COLORS.text_white} />
                            </View>
                            <View style={[styles.statItem, { top: 10 }]}>
                            <Text style={styles.postStats}>154K</Text>
                            <Unicons.UilEye size={15} color={COLORS.text_white} />
                            </View>
                        </View>
                        </View>
                    </View>
                    </View>
        
                    <View style={styles.recruitCard}>
                    <Unicons.UilRepeat
                        size={15}
                        color={COLORS.main_blue}
                        style={styles.recruitBackground}
                    />
                    <View style={styles.recruitOverlay} />
                    <View style={styles.recruitContent}>
                        <Text style={styles.recruitTitle}>
                        Notre équipe VALORANT recrute !
                        </Text>
                        <TouchableOpacity style={styles.recruitButton}>
                        <Text style={styles.recruitButtonText}>CANDIDATER</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>
        
                <Text style={[styles.postsTitle, { marginTop: 20 }]}>
                    Candidatures récentes
                </Text>
                <View style={styles.postsRow}>
                    <View style={styles.recruitCard}>
                    <Unicons.UilRepeat
                        size={15}
                        color={COLORS.main_blue}
                        style={styles.recruitBackground}
                    />
                    <View style={styles.recruitOverlay} />
                    <View style={styles.recruitContent}>
                        <Text style={styles.recruitTitle}>
                        Notre équipe VALORANT recrute !
                        </Text>
                        <TouchableOpacity style={styles.recruitButton}>
                        <Text style={styles.recruitButtonText}>CANDIDATER</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>
                </View>*/}
            </ScrollView>
        </View>
      );
    }

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.background_blue,
    },
    container: {
        paddingBottom: 80,
    },
    bannerContainer: {
        width: "100%",
        height: 200,
        position: "relative",
        backgroundColor: "#000",
    },
    bannerImage: {
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.main_blue,
        resizeMode: "cover",
    },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    profileInfoContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: "center",
        marginTop: -75,
    },
    avatarLarge: {
        width: 125,
        height: 125,
        borderRadius: 75,
        marginRight: 15,
        marginTop: -25,
    },
    profileTextContainer: {
        flex: 1,
        paddingTop: 15,
    },
    profileName: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.text_white,
        marginVertical: 5,
    },
    profileTeam: {
        fontSize: 16,
        fontStyle: "italic",
        color: COLORS.text_white,
        marginVertical: -10,
    },
    highlightTeam: {
        fontStyle: "italic",
        textDecorationLine: "underline",
        fontWeight: "600",
    },
    profileDescription: {
        fontSize: 14,
        color: COLORS.text_white,
        lineHeight: 20,
        paddingTop: 20,
    },
    socialContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 15,
    },
    socialItemRed: {
        backgroundColor: "#FF0000",
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginRight: 10,
    },
    socialItemPurple: {
        backgroundColor: "#9146FF",
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginRight: 10,
    },
    socialItemTeal: {
        backgroundColor: COLORS.main_blue,
        width: 36,
        height: 36,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    socialItemText: {
        color: "#fff",
        fontWeight: "600",
        fontStyle: "italic",
        textDecorationLine: "underline",
        fontSize: 15,
    },
    socialItemTealText: {
        color: "#000",
        fontSize: 30,
        fontWeight: "700",
    },
    extraInfoContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 20,
    },
    extraInfoTitle: {
        fontSize: 14,
        color: COLORS.text_white,
        marginBottom: 4,
    },
    extraInfoHighlight: {
        fontWeight: "700",
        color: COLORS.text_white,
    },
    extraInfoSubtitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.text_white,
    },
    linkHighlight: {
        color: COLORS.link_yellow,
        fontWeight: "600",
        fontStyle: "italic",
        textDecorationLine: "underline",
    },
    extraDescription: {
        fontSize: 14,
        color: COLORS.text_white,
        lineHeight: 20,
        marginTop: 10,
    },
    postsContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    postsTitle: {
        fontSize: 18,
        color: COLORS.text_white,
        fontWeight: "700",
        marginBottom: 10,
    },
    postsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    postCard: {
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        width: "60%",
        height: 120,
    },
    postImageBackground: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: "cover",
    },
    postGreenOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        height: "40%",
        width: "100%",
    },
    postCornerIcon: {
        position: "absolute",
        top: 8,
        right: 8,
        width: 20,
        height: 20,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
    },
    postContent: {
        flex: 1,
        justifyContent: "space-between",
        padding: 10,
    },
    postTitle: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
        marginTop: 15,
    },
    postFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    postFooterLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    postAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 6,
    },
    postUserName: {
        color: "#fff",
        fontWeight: "700",
    },
    statsContainer: {
        position: "relative",
        width: 60,
        height: 30,
        marginLeft: 70,
    },
    statItem: {
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
    },
    postStats: {
        color: "#fff",
        fontSize: 12,
        marginRight: 4,
    },
    recruitCard: {
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        width: "48%",
        height: 120,
        backgroundColor: COLORS.gentle_mates,
        marginLeft: 8,
    },
    recruitBackground: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.2,
    },
    recruitOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.1)",
    },
    recruitContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    recruitTitle: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
        marginBottom: 12,
        textAlign: "center",
    },
    recruitButton: {
        backgroundColor: COLORS.main_blue,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    recruitButtonText: {
        color: "#000",
        fontWeight: "700",
        fontSize: 14,
    },
    followButton: {
        marginTop: 20,
        backgroundColor: COLORS.main_blue,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignSelf: 'flex-start',
    },

    followButtonText: {
        color: COLORS.background_blue,
        fontWeight: '700',
        fontSize: 14,
    },
});
