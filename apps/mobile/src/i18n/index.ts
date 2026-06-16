import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import fr from './locales/fr.json';
import en from './locales/en.json';

const LANGUAGE_KEY = '@autoparts/language';

// ── Detect & persist language ─────────────────────────────────────────────────
export const getStoredLanguage = async (): Promise<string> => {
  try {
    const lang = await AsyncStorage.getItem(LANGUAGE_KEY);
    return lang || 'fr';
  } catch {
    return 'fr';
  }
};

export const setStoredLanguage = async (lang: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch {}
};

// ── Change language at runtime ────────────────────────────────────────────────
export const changeLanguage = async (lang: 'fr' | 'en'): Promise<void> => {
  await i18n.changeLanguage(lang);
  await setStoredLanguage(lang);
};

// ── Init ──────────────────────────────────────────────────────────────────────
export const initI18n = async (): Promise<void> => {
  const savedLanguage = await getStoredLanguage();

  await i18n
    .use(initReactI18next)
    .init({
      resources: {
        fr: { translation: fr },
        en: { translation: en },
      },
      lng: savedLanguage,
      fallbackLng: 'fr',
      interpolation: {
        escapeValue: false, // React already escapes values
      },
      compatibilityJSON: 'v4',
    });
};

export default i18n;
