import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore, useOnboardingStore } from '@autoparts/hooks';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { Circle, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../src/i18n';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

function AuthBackground() {
  return (
    <LinearGradient
      colors={['#6C3CE1', '#9333EA', '#F3F4F6']}
      locations={[0, 0.55, 1]}
      style={StyleSheet.absoluteFill}
    />
  );
}

function LanguageToggle({ currentLang, onToggle }: { currentLang: string; onToggle: (lang: 'fr' | 'en') => void }) {
  return (
    <View style={langStyles.container}>
      <TouchableOpacity
        style={[langStyles.pill, currentLang === 'fr' && langStyles.pillActive]}
        onPress={() => onToggle('fr')}
        activeOpacity={0.8}
      >
        <Text style={[langStyles.pillText, currentLang === 'fr' && langStyles.pillTextActive]}>
          🇫🇷 FR
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[langStyles.pill, currentLang === 'en' && langStyles.pillActive]}
        onPress={() => onToggle('en')}
        activeOpacity={0.8}
      >
        <Text style={[langStyles.pillText, currentLang === 'en' && langStyles.pillTextActive]}>
          🇬🇧 EN
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const langStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pillActive: { backgroundColor: '#fff' },
  pillText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  pillTextActive: { color: '#6C3CE1' },
});

export default function LoginScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { login } = useAuthStore();
  const { resetOnboarding } = useOnboardingStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLanguageToggle = async (lang: 'fr' | 'en') => {
    await changeLanguage(lang);
  };

  const handleLogin = async () => {
    setLoading(true);
    resetOnboarding();
    setTimeout(async () => {
      await login(email || 'kouame@example.com', password || '123456', 'client');
      setLoading(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AuthBackground />

      {/* Fixed layout — no ScrollView */}
      <View style={styles.inner}>

        {/* Language toggle row */}
        <View style={styles.topRow}>
          <LanguageToggle currentLang={i18n.language} onToggle={handleLanguageToggle} />
        </View>

        {/* Logo + title */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Svg width={56} height={56} viewBox="0 0 64 64" fill="none">
              <Circle cx="32" cy="32" r="32" fill="white" opacity={0.2} />
              <Circle cx="32" cy="32" r="24" fill="white" />
              <Path d="M32 18L35 27L44 27L36 32L39 42L32 36L25 42L28 32L20 27L29 27Z" fill="#6C3CE1" />
            </Svg>
          </View>
          <Text style={styles.title}>{t('login.welcome')}</Text>
          <Text style={styles.subtitle}>{t('login.subtitle')}</Text>
        </View>

        {/* Card form */}
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('login.email')}</Text>
            <TextInput
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              placeholder={t('login.emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              outlineColor="#E5E7EB"
              activeOutlineColor="#6C3CE1"
              style={styles.input}
              left={<TextInput.Icon icon="email-outline" color="#9CA3AF" />}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('login.password')}</Text>
            <TextInput
              mode="outlined"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              outlineColor="#E5E7EB"
              activeOutlineColor="#6C3CE1"
              style={styles.input}
              left={<TextInput.Icon icon="lock-outline" color="#9CA3AF" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                  color="#9CA3AF"
                />
              }
            />
          </View>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>{t('login.forgotPassword')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>
              {loading ? t('login.loginLoading') : t('login.loginBtn')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('login.noAccount')}</Text>
          <TouchableOpacity onPress={() => router.push('/register')} activeOpacity={0.7}>
            <Text style={styles.registerLink}>{t('login.createAccount')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    justifyContent: 'space-between',
  },
  topRow: {
    alignItems: 'flex-end',
  },
  header: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 16,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
    borderRadius: 28,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-ExtraBold',
    color: '#fff',
    marginBottom: 6,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.05)',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotText: {
    color: '#6C3CE1',
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  loginBtn: {
    backgroundColor: '#6C3CE1',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    boxShadow: '0px 6px 16px rgba(108, 60, 225, 0.3)',
  },
  loginBtnText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Inter-Bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  registerLink: {
    color: '#6C3CE1',
    fontFamily: 'Inter-Bold',
    fontSize: 13,
  },
});
