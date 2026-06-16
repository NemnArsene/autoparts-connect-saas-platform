import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAppStorageAdapter, useAuthStore, useOnboardingStore } from '@autoparts/hooks';
import { theme } from '../src/theme';
import { View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { I18nextProvider } from 'react-i18next';
import i18n, { initI18n } from '../src/i18n';

// Override default storage adapter for Zustand stores with AsyncStorage
setAppStorageAdapter({
  getItem: async (key) => {
    try { return await AsyncStorage.getItem(key); } catch { return null; }
  },
  setItem: async (key, value) => {
    try { await AsyncStorage.setItem(key, value); } catch {}
  },
  removeItem: async (key) => {
    try { await AsyncStorage.removeItem(key); } catch {}
  },
});

// ── Auth Guard ─────────────────────────────────────────────────────────────────
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const { hasSeenOnboarding } = useOnboardingStore();
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to allow stores to hydrate from AsyncStorage
    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inOnboarding = segments[0] === 'onboarding';
    const inAuth = segments[0] === 'login' || segments[0] === 'register';

    // 1. If not logged in and not already in auth screens, force login
    if (!user && !inAuth) {
      router.replace('/login');
      return;
    }

    // 2. If logged in but hasn't seen onboarding, and not already there, force onboarding
    if (user && !hasSeenOnboarding && !inOnboarding) {
      router.replace('/onboarding');
      return;
    }

    // 3. If logged in and has seen onboarding, but still in auth/onboarding, redirect to app
    if (user && hasSeenOnboarding && (inAuth || inOnboarding)) {
      router.replace('/(client)');
      return;
    }

  }, [isReady, hasSeenOnboarding, user, segments]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#6C3CE1' }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return <>{children}</>;
}

// ── Root Layout ────────────────────────────────────────────────────────────────
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Inter-ExtraBold': Inter_800ExtraBold,
  });
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    initI18n().then(() => setI18nReady(true));
  }, []);

  if (!fontsLoaded || !i18nReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#6C3CE1' }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <PaperProvider theme={theme}>
        <AuthGuard>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(client)" />
          </Stack>
        </AuthGuard>
      </PaperProvider>
    </I18nextProvider>
  );
}
