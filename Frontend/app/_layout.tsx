import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from '@react-navigation/native'
// eslint-disable-next-line import/no-unresolved
import '@/global.css'
// eslint-disable-next-line import/no-unresolved
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { useFonts } from 'expo-font'
import { Stack, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'

// eslint-disable-next-line import/no-unresolved
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { BottomNavbar } from './components/BottomNavbar'
import { NavScreen } from './components/BottomNavbar'
import { NativeBaseProvider, theme } from 'native-base'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { COLORS } from './(tabs)/styles/colors'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const segments: string[] = useSegments()
  const mustShow: string[] = [
    'feed',
    'fast_search',
    'create_post',
    'offers',
    'mailbox'
  ]

  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Montserrat: require('../assets/fonts/Montserrat-Regular.ttf'),
    MonserratBlack: require('../assets/fonts/Montserrat-Black.ttf'),
    MontserratBlackItalic: require('../assets/fonts/Montserrat-BlackItalic.ttf'),
    MontserratBold: require('../assets/fonts/Montserrat-Bold.ttf'),
    MontserratBoldItalic: require('../assets/fonts/Montserrat-BoldItalic.ttf'),
    MontserratExtraBold: require('../assets/fonts/Montserrat-ExtraBold.ttf'),
    MontserratExtraBoldItalic: require('../assets/fonts/Montserrat-ExtraBoldItalic.ttf'),
    MontserratExtraLight: require('../assets/fonts/Montserrat-ExtraLight.ttf'),
    MontserratExtraLightItalic: require('../assets/fonts/Montserrat-ExtraLightItalic.ttf'),
    MontserratItalic: require('../assets/fonts/Montserrat-Italic.ttf'),
    MontserratLight: require('../assets/fonts/Montserrat-Light.ttf'),
    MontserratLightItalic: require('../assets/fonts/Montserrat-LightItalic.ttf'),
    MontserratMedium: require('../assets/fonts/Montserrat-Medium.ttf'),
    MontserratMediumItalic: require('../assets/fonts/Montserrat-MediumItalic.ttf'),
    MontserratRegular: require('../assets/fonts/Montserrat-Regular.ttf'),
    MontserratSemiBold: require('../assets/fonts/Montserrat-SemiBold.ttf'),
    MontserratSemiBoldItalic: require('../assets/fonts/Montserrat-SemiBoldItalic.ttf'),
    MontserratThin: require('../assets/fonts/Montserrat-Thin.ttf'),
    MontserratThinItalic: require('../assets/fonts/Montserrat-ThinItalic.ttf')

  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  console.log('Segments:', segments)
  return (
    <SafeAreaProvider style={globalStyles.safeAreaStyle}>
      <NativeBaseProvider theme={theme}>
        <GluestackUIProvider mode='light'>
          <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
          >
            <Stack>
              <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            </Stack>
            <StatusBar style='auto' />

            {mustShow.some(item => segments.includes(item)) && (
              <BottomNavbar
                activeTab={
                  mustShow.includes(segments[1])
                    ? (segments[1] as NavScreen)
                    : undefined
                }
              />
            )}
          </ThemeProvider>
        </GluestackUIProvider>
      </NativeBaseProvider>
    </SafeAreaProvider>
  )
}

const globalStyles = {
  safeAreaStyle: {
    backgroundColor: COLORS.background_blue
  }
}
