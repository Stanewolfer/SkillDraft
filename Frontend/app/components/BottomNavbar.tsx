import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import * as Unicons from "@iconscout/react-native-unicons";
import { useRouter } from "expo-router";
import { COLORS } from "../(tabs)/styles/colors";
import { Circle } from "native-base";

export type NavScreen =
  | "feed"
  | "quick_search"
  | "create_post"
  | "offers"
  | "messaging";

type RouteType =
  | "/feed"
  | "/quick_search"
  | "/create_post"
  | "/offers"
  | "/mailbox";

interface BottomNavbarProps {
  activeScreen: NavScreen;
  logout: () => void;
}

interface NavButton {
  id: NavScreen;
  label?: string;
  route: RouteType;
  icon: JSX.Element;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({
  activeScreen,
  logout,
}) => {
  const router = useRouter();

  const navButtons: NavButton[] = [
    {
      id: "feed",
      label: "Fil d'actualité",
      route: "/feed",
      icon: <Unicons.UilHome size={28} />,
    },
    {
      id: "quick_search",
      label: "Recherches rapides",
      route: "/quick_search",
      icon: <Unicons.UilSearch size={28} />,
    },
    {
      id: "create_post",
      route: "/create_post",
      icon: <Unicons.UilPlus size={40} />,
    },
    {
      id: "offers",
      label: "Offres",
      route: "/offers",
      icon: <Unicons.UilBag size={28} />,
    },
    {
      id: "messaging",
      label: "Messagerie",
      route: "/mailbox",
      icon: <Unicons.UilEnvelopeAlt size={28} />,
    },
  ];

  return (
    <>
      <View style={styles.bottomButtonsContainer}>
        {navButtons.map((button) => {
          const isActive = button.id === activeScreen;
          const iconColor = isActive ? COLORS.background_blue : COLORS.main_blue;
          return (
            <TouchableOpacity
              key={button.id}
              style={[styles.bottomButton, isActive && styles.activeBottomButton]}
              onPress={() => router.push(button.route as any)}
            >
              <View style={styles.bottomButtonContent}>
                {React.cloneElement(button.icon, { color: iconColor })}
                <Text
                  style={[
                    styles.bottomButtonLabel,
                    isActive && styles.activeBottomButtonLabel,
                  ]}
                >
                  {button.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  bottomButtonsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background_blue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.main_blue,
    zIndex: 999,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  bottomButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
  bottomButtonContent: {
    alignItems: "center",
  },
  bottomButtonLabel: {
    marginTop: 4,
    fontSize: 8,
    color: COLORS.main_blue,
  },
  activeBottomButton: {
    backgroundColor: COLORS.main_blue,
    paddingVertical: 10,
  },
  activeBottomButtonLabel: {
    color: COLORS.background_blue,
  },
});
