import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAppStorageAdapter } from '@autoparts/hooks';
import { theme } from '../src/theme';

// Override default storage adapter for Zustand stores with MMKV/AsyncStorage
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

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(client)" />
      </Stack>
    </PaperProvider>
  );
}
