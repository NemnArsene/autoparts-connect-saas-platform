import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore, useOnboardingStore } from '@autoparts/hooks';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

function AuthBackground() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="registerBgGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#6C3CE1" />
            <Stop offset="0.3" stopColor="#9333EA" />
            <Stop offset="1" stopColor="#F3F4F6" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#registerBgGrad)" />
      </Svg>
    </View>
  );
}

export default function RegisterScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { login } = useAuthStore();
  const { resetOnboarding } = useOnboardingStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    // Reset onboarding state so new users always see it
    resetOnboarding();
    setTimeout(async () => {
      await login(
        email || 'client@example.com',
        password || '123456',
        'client'
      );
      // The _layout AuthGuard will automatically redirect
      setLoading(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AuthBackground />
      
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Icon name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Créer un compte</Text>
          </View>
          <Text style={styles.subtitle}>Rejoignez System for Reserving Car Spare Parts</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet</Text>
            <TextInput
              mode="outlined"
              value={name}
              onChangeText={setName}
              placeholder="Jean Dupont"
              outlineColor="#E5E7EB"
              activeOutlineColor="#6C3CE1"
              style={styles.input}
              left={<TextInput.Icon icon="account-outline" color="#9CA3AF" />}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse e-mail</Text>
            <TextInput
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              placeholder="jean.dupont@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              outlineColor="#E5E7EB"
              activeOutlineColor="#6C3CE1"
              style={styles.input}
              left={<TextInput.Icon icon="email-outline" color="#9CA3AF" />}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
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
              J'accepte les <Text style={styles.termsLink}>Conditions d'utilisation</Text> et la{' '}
              <Text style={styles.termsLink}>Politique de confidentialité</Text>.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.registerBtn}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <Text style={styles.registerBtnText}>Création en cours...</Text>
            ) : (
              <Text style={styles.registerBtnText}>Créer mon compte</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Vous avez déjà un compte ?</Text>
          <TouchableOpacity onPress={() => router.push('/login')} activeOpacity={0.7}>
            <Text style={styles.loginLink}>Se connecter</Text>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
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
