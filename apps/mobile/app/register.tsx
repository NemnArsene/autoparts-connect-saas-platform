import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore, useOnboardingStore } from '@autoparts/hooks';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

function AuthBackground() {
  return (
    <LinearGradient
      colors={['#6C3CE1', '#9333EA', '#F3F4F6']}
      locations={[0, 0.3, 1]}
      style={StyleSheet.absoluteFill}
    />
  );
}

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login } = useAuthStore();
  const { resetOnboarding } = useOnboardingStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    resetOnboarding();
    setTimeout(async () => {
      await login(email || 'client@example.com', password || '123456', 'client');
      setLoading(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AuthBackground />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Icon name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>{t('register.title')}</Text>
          </View>
          <Text style={styles.subtitle}>{t('register.subtitle')}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('register.fullName')}</Text>
            <TextInput
              mode="outlined"
              value={name}
              onChangeText={setName}
              placeholder={t('register.fullNamePlaceholder')}
              outlineColor="#E5E7EB"
              activeOutlineColor="#6C3CE1"
              style={styles.input}
              left={<TextInput.Icon icon="account-outline" color="#9CA3AF" />}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('register.email')}</Text>
            <TextInput
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              placeholder={t('register.emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              outlineColor="#E5E7EB"
              activeOutlineColor="#6C3CE1"
              style={styles.input}
              left={<TextInput.Icon icon="email-outline" color="#9CA3AF" />}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('register.password')}</Text>
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

          <View style={styles.termsBox}>
            <Icon name="check-circle" size={20} color="#10B981" />
            <Text style={styles.termsText}>
              {t('register.terms')}{' '}
              <Text style={styles.termsLink}>{t('register.termsLink')}</Text>
              {' '}{t('register.and')}{' '}
              <Text style={styles.termsLink}>{t('register.privacyLink')}</Text>.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.registerBtn}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.registerBtnText}>
              {loading ? t('register.registerLoading') : t('register.registerBtn')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('register.hasAccount')}</Text>
          <TouchableOpacity onPress={() => router.push('/login')} activeOpacity={0.7}>
            <Text style={styles.loginLink}>{t('register.loginLink')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scroll: {
    flexGrow: 1,
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  header: {
    marginBottom: 32,
    marginTop: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-ExtraBold',
    color: '#fff',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.05)',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    fontFamily: 'Inter-Regular',
  },
  termsBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 12,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
    lineHeight: 18,
  },
  termsLink: {
    color: '#6C3CE1',
    fontFamily: 'Inter-Bold',
  },
  registerBtn: {
    backgroundColor: '#6C3CE1',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    boxShadow: '0px 6px 16px rgba(108, 60, 225, 0.3)',
  },
  registerBtnText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    gap: 8,
  },
  footerText: {
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  loginLink: {
    color: '#6C3CE1',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
});
