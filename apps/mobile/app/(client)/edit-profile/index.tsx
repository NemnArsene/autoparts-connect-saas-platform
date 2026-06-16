import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@autoparts/hooks';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { ScreenHeader } from '../../../src/components/ScreenHeader';

// ── Form Field ────────────────────────────────────────────────────────────────
function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Icon name={icon} size={20} color="#9CA3AF" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#CBD5E1"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      </View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function EditProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();

  const nameParts = (user?.name || '').split(' ');
  const [firstName, setFirstName] = useState(nameParts[0] || '');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatarUri || null);

  const initials = user?.avatar || (user?.name ? user.name.substring(0, 2).toUpperCase() : 'AP');

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        t('editProfile.permissionTitle'),
        t('editProfile.permissionMessage'),
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!firstName.trim()) {
      Alert.alert(t('editProfile.error'), t('editProfile.firstNameRequired'));
      return;
    }
    if (!email.trim()) {
      Alert.alert(t('editProfile.error'), t('editProfile.emailRequired'));
      return;
    }

    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
    const newInitials = fullName.substring(0, 2).toUpperCase();

    updateProfile({
      name: fullName,
      email: email.trim(),
      phone: phone.trim(),
      avatarUri: avatarUri ?? undefined,
      avatar: newInitials,
    });

    Alert.alert(t('editProfile.success'), t('editProfile.successMessage'), [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title={t('editProfile.title')} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Avatar Section ── */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handlePickImage} activeOpacity={0.8}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
            <View style={styles.cameraButton}>
              <Icon name="camera" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickImage} activeOpacity={0.7}>
            <Text style={styles.changePhotoText}>{t('editProfile.changePhoto')}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Form Card ── */}
        <View style={styles.formCard}>
          <FormField
            label={t('editProfile.firstName')}
            value={firstName}
            onChangeText={setFirstName}
            placeholder={t('editProfile.firstNamePlaceholder')}
            icon="account-outline"
            autoCapitalize="words"
          />
          <FormField
            label={t('editProfile.lastName')}
            value={lastName}
            onChangeText={setLastName}
            placeholder={t('editProfile.lastNamePlaceholder')}
            icon="account-outline"
            autoCapitalize="words"
          />
          <FormField
            label={t('editProfile.email')}
            value={email}
            onChangeText={setEmail}
            placeholder={t('editProfile.emailPlaceholder')}
            icon="email-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormField
            label={t('editProfile.phone')}
            value={phone}
            onChangeText={setPhone}
            placeholder={t('editProfile.phonePlaceholder')}
            icon="phone-outline"
            keyboardType="phone-pad"
          />
        </View>

        {/* ── Save Button ── */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Icon name="check" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>{t('editProfile.save')}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // ── Body ──
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 20 },

  // ── Avatar ──
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 24,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  changePhotoText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4F46E5',
  },

  // ── Form ──
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 24,
  },
  fieldContainer: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    paddingVertical: 4,
  },

  // ── Save ──
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    paddingVertical: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
});
