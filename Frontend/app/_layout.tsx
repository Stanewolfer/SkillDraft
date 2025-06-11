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
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf')
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
