import { Stack } from "expo-router";
import { COLORS } from "../(tabs)/styles/colors";

interface CustomStackScreenProps {
    title: string;
}

export default function CustomStackScreen({ title }: CustomStackScreenProps) {
    return (
        <Stack.Screen options={{
            title: title,
            headerTitleStyle: {
                color: COLORS.background_blue,
            },
            headerStyle: {
                backgroundColor: COLORS.main_blue
            },
        }}/>
    );
}
