import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore, useOnboardingStore } from '@autoparts/hooks';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

function AuthBackground() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="loginBgGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#6C3CE1" />
            <Stop offset="0.5" stopColor="#9333EA" />
            <Stop offset="1" stopColor="#F3F4F6" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#loginBgGrad)" />
      </Svg>
    </View>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { login } = useAuthStore();
  const { resetOnboarding } = useOnboardingStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // Reset onboarding state so it shows up for testing
    resetOnboarding();
    // Simulate API call
    setTimeout(async () => {
      await login(
        email || 'kouame@example.com',
        password || '123456',
        'client'
      );
      // The _layout AuthGuard will automatically redirect to onboarding or home
      setLoading(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AuthBackground />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
              <Circle cx="32" cy="32" r="32" fill="white" opacity={0.2} />
              <Circle cx="32" cy="32" r="24" fill="white" />
              <Path d="M32 18L35 27L44 27L36 32L39 42L32 36L25 42L28 32L20 27L29 27Z" fill="#6C3CE1" />
            </Svg>
          </View>
          <Text style={styles.title}>Bienvenue</Text>
          <Text style={styles.subtitle}>Connectez-vous pour continuer vers ASPS</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse e-mail</Text>
            <TextInput
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              placeholder="votre@email.com"
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

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <Text style={styles.loginBtnText}>Connexion en cours...</Text>
            ) : (
              <Text style={styles.loginBtnText}>Se connecter</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Vous n'avez pas de compte ?</Text>
          <TouchableOpacity onPress={() => router.push('/register')} activeOpacity={0.7}>
            <Text style={styles.registerLink}>Créer un compte</Text>
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
    justifyContent: 'center',
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoContainer: {
    marginBottom: 24,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
    borderRadius: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-ExtraBold',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: '#6C3CE1',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
  },
  loginBtn: {
    backgroundColor: '#6C3CE1',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    boxShadow: '0px 6px 16px rgba(108, 60, 225, 0.3)',
  },
  loginBtnText: {
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
  registerLink: {
    color: '#6C3CE1',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
});
