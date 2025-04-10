import { Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Image,
  StyleProp,
  TextStyle,
} from "react-native";
import { COLORS } from "./styles/colors";
import CustomStackScreen from "../components/CustomStackScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BottomNavbar } from "../components/BottomNavbar";
import { Checkbox, HStack, NativeBaseProvider } from "native-base";

const TITLE_CHAR_LIMIT = 200;
const DESC_CHAR_LIMIT = 2000;

export default function CreatePost() {
  const router = useRouter();
  const [mode, setMode] = useState<"regular" | "offer">("regular");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [posterId, setPosterId] = useState<string | null>(null);
  const [isUserTeam, setIsUserTeam] = useState(false);

  const [imageList, setImageList] = useState<string[]>([
    "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/0fd808037b9c16d9f04cfee0b35b5b3be488f26e-1920x1080.jpg",
    "https://assets1.ignimgs.com/thumbs/userUploaded/2020/3/2/valorant-blog-1583142940384.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa_beocbERzy5FknsCjd705ecwxlvK6RPxJG5IfPufZANLEVRMkD2AyJxnNfrEVP4Bjow&usqp=CAU",
  ]);

  const logout = async () => {
    await AsyncStorage.clear();
    router.push("/");
  };

  // Load user ID and check if it is a "team"
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await AsyncStorage.getItem("userId");
      const userType = await AsyncStorage.getItem("type");
      setPosterId(userId);
      setIsUserTeam(userType === "team");
    };
    fetchUserData();
  }, []);

  const createPost = async () => {
    if (!posterId) {
      alert("ID utilisateur introuvable.");
      return;
    }
    const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/posts/create`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          type: mode,
        },
        body: JSON.stringify({
          posterId,
          title: postTitle,
          description: postContent,
          imageList,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Une erreur est survenue");
      }
      alert("Votre post a été créé");
      router.push("/feed");
    } catch (error) {
      console.error("Erreur lors de la création du post :", error);
      alert("Erreur lors de la création du post. Vérifiez votre connexion.");
    }
  };

  const titleCharsCount = `${postTitle.length}/${TITLE_CHAR_LIMIT}`;
  const descCharsCount = `${postContent.length}/${DESC_CHAR_LIMIT}`;

  const editorElements = [
    { id: "I", isSeparator: false },
    { id: "B", isSeparator: false },
    { id: "U", isSeparator: false },
    { id: "|", isSeparator: true },
    { id: "A▲", isSeparator: false },
    { id: "A▼", isSeparator: false },
  ];

  return (
    <>
      <View style={styles.pageContainer}>
        <CustomStackScreen title="Créer un post" />

        <View style={styles.scrollWrapper}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Titre de votre post</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Entrez le titre"
                  style={styles.inputField}
                  placeholderTextColor={COLORS.main_blue}
                  value={postTitle}
                  onChangeText={(text) => {
                    if (text.length <= TITLE_CHAR_LIMIT) setPostTitle(text);
                  }}
                />
                <Text style={styles.charCountAbsolute}>{titleCharsCount}</Text>
              </View>
            </View>

            <View style={styles.sectionSpacer} />

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <View style={styles.editorToolBar}>
                {editorElements.map((item, index) => {
                  if (item.isSeparator) {
                    return (
                      <View key={index} style={styles.verticalSeparator} />
                    );
                  }
                  if (item.id.startsWith("A")) {
                    const symbol = item.id.slice(1);
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.editorButton}
                      >
                        <View style={styles.letterContainer}>
                          <Text style={styles.editorButtonText}>A</Text>
                          <Text style={styles.superscript}>{symbol}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }
                  const flattenedTextStyle: StyleProp<TextStyle> =
                    StyleSheet.flatten([
                      styles.editorButtonText,
                      item.id === "I"
                        ? { fontStyle: "italic" }
                        : item.id === "B"
                        ? { fontWeight: "bold" }
                        : item.id === "U"
                        ? { textDecorationLine: "underline" }
                        : {},
                    ]);
                  return (
                    <TouchableOpacity key={item.id} style={styles.editorButton}>
                      <Text style={flattenedTextStyle}>{item.id}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={[styles.inputWrapper, { height: 100 }]}>
                <TextInput
                  placeholder="Commencez à écrire"
                  multiline
                  style={[styles.inputField, { height: "100%" }]}
                  placeholderTextColor={COLORS.main_blue}
                  value={postContent}
                  onChangeText={(text) => {
                    if (text.length <= DESC_CHAR_LIMIT) setPostContent(text);
                  }}
                />
                <Text style={styles.charCountAbsolute}>{descCharsCount}</Text>
              </View>
            </View>

            <View style={styles.sectionSpacer} />

            <View style={styles.imagesContainer}>
              {imageList.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: img }} style={styles.imageThumbnail} />
                </View>
              ))}
              <TouchableOpacity style={styles.addImageButton}>
                <Text style={styles.addImageText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionSpacer} />

            {
              isUserTeam && (
                <OffreCheckbox mode={mode} setMode={setMode} />
              ) /* to check because there are problems when putting the front on */
            }
            <TouchableOpacity onPress={createPost} style={styles.publishButton}>
              <Text style={styles.publishButtonText}>PUBLIER</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </>
  );
}

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace("#", "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const OffreCheckbox = ({
  mode,
  setMode,
}: {
  mode: "regular" | "offer";
  setMode: (mode: "regular" | "offer") => void;
}) => {
  const [isChecked, setIsChecked] = useState(mode === "offer");

  const handleCheckboxChange = () => {
    const newMode = isChecked ? "regular" : "offer";
    setIsChecked(!isChecked);
    setMode(newMode);
  };

  return (
    <HStack space={6} alignItems="center">
      <Checkbox isChecked={isChecked} onChange={handleCheckboxChange} value="">
        <Text style={styles.text}>Ce post est une offre.</Text>
      </Checkbox>
    </HStack>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: COLORS.background_blue,
  },
  scrollWrapper: {
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.main_blue,
    borderRadius: 25,
    overflow: "hidden",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  sectionSpacer: {
    height: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    color: COLORS.main_blue,
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "italic",
    marginBottom: 8,
  },
  inputWrapper: {
    position: "relative",
  },
  inputField: {
    borderWidth: 1,
    borderColor: COLORS.main_blue,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: COLORS.main_blue,
    fontSize: 14,
    backgroundColor: hexToRgba(COLORS.main_blue, 0.3),
  },
  charCountAbsolute: {
    position: "absolute",
    bottom: 4,
    right: 8,
    color: COLORS.main_blue,
    fontSize: 12,
  },
  editorToolBar: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "center",
  },
  editorButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderColor: COLORS.main_blue,
    borderWidth: 1,
    backgroundColor: "transparent",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  editorButtonText: {
    color: COLORS.main_blue,
    fontWeight: "700",
    fontSize: 16,
  },
  verticalSeparator: {
    width: 1,
    height: 35,
    backgroundColor: COLORS.main_blue,
    marginRight: 8,
  },
  letterContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  superscript: {
    position: "absolute",
    top: 2,
    right: 2,
    fontSize: 10,
    color: COLORS.main_blue,
  },
  imagesContainer: {
    flexDirection: "row",
    marginBottom: 24,
    alignItems: "center",
  },
  imageWrapper: {
    marginRight: 8,
    position: "relative",
  },
  imageThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  addImageButton: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.main_blue,
    alignItems: "center",
    justifyContent: "center",
  },
  addImageText: {
    color: COLORS.main_blue,
    fontSize: 24,
    fontWeight: "bold",
  },
  publishButton: {
    backgroundColor: COLORS.main_blue,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 40,
  },
  publishButtonText: {
    color: COLORS.background_blue,
    fontSize: 16,
    fontWeight: "700",
  },
  text: {
    color: COLORS.main_blue,
  },
});
