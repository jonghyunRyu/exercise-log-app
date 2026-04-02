import { useEffect, useState, useCallback } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ExerciseLogProvider } from '@/contexts/exercise-log-context';
import { Splash } from '@/components/splash';

// 네이티브 스플래시를 자동으로 숨기지 않도록 설정
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // 앱 준비 완료 시 네이티브 스플래시 숨기기
    async function prepare() {
      // 약간의 딜레이 후 네이티브 스플래시 숨기고 커스텀 스플래시 표시
      await SplashScreen.hideAsync();
      setAppReady(true);
    }
    prepare();
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (!appReady) {
    return null;
  }

  if (showSplash) {
    return (
      <>
        <StatusBar style="light" />
        <Splash onFinish={handleSplashFinish} />
      </>
    );
  }

  return (
    <ExerciseLogProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ExerciseLogProvider>
  );
}
