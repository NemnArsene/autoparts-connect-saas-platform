import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../../src/i18n';
import { ScreenHeader } from '../../../src/components/ScreenHeader';

// ── Toggle Row ─────────────────────────────────────────────────────────────────
function ToggleRow({
  label,
  value,
  onValueChange,
  isLast = false,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#CBD5E1', true: '#4F46E5' }}
        thumbColor="#fff"
        ios_backgroundColor="#CBD5E1"
        style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
      />
    </View>
  );
}

// ── Value Row ──────────────────────────────────────────────────────────────────
function ValueRow({
  label,
  value,
  onPress,
  isLast = false,
  arrow = false,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
  arrow?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowBorder]}
      onPress={onPress}
      activeOpacity={onPress ? 0.6 : 1}
      disabled={!onPress}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        {arrow && <Icon name="arrow-right" size={16} color="#64748B" />}
      </View>
    </TouchableOpacity>
  );
}

// ── Language Selector Row ──────────────────────────────────────────────────────
function LanguageSelectorRow({
  label,
  currentLang,
  onChange,
  isLast = false,
}: {
  label: string;
  currentLang: string;
  onChange: (lang: 'fr' | 'en') => void;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.langPills}>
        <TouchableOpacity
          style={[styles.langPill, currentLang === 'fr' && styles.langPillActive]}
          onPress={() => onChange('fr')}
          activeOpacity={0.8}
        >
          <Text style={[styles.langPillText, currentLang === 'fr' && styles.langPillTextActive]}>
            FR
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langPill, currentLang === 'en' && styles.langPillActive]}
          onPress={() => onChange('en')}
          activeOpacity={0.8}
        >
          <Text style={[styles.langPillText, currentLang === 'en' && styles.langPillTextActive]}>
            EN
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const { t, i18n } = useTranslation();

  const [darkMode, setDarkMode] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('settings.title')} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <ToggleRow
            label={t('settings.darkMode')}
            value={darkMode}
            onValueChange={setDarkMode}
          />
          <ToggleRow
            label={t('settings.pushNotif')}
            value={pushNotif}
            onValueChange={setPushNotif}
          />
          <ToggleRow
            label={t('settings.emailNotif')}
            value={emailNotif}
            onValueChange={setEmailNotif}
          />
          <ToggleRow
            label={t('settings.smsNotif')}
            value={smsNotif}
            onValueChange={setSmsNotif}
            isLast
          />
        </View>

        <View style={styles.card}>
          <LanguageSelectorRow
            label={t('settings.language')}
            currentLang={i18n.language}
            onChange={(lang) => changeLanguage(lang)}
          />
          <ValueRow
            label={t('settings.currency')}
            value={t('settings.currencyValue')}
          />
          <ValueRow
            label={t('settings.privacy')}
            onPress={() => { }}
            isLast
            arrow
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // ── Header ──
  headerWrapper: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 26 : 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBack: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
    marginRight: 4,
  },
  headerIcon: {
    position: 'relative',
    padding: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },

  // ── Body ──
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 20 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
  },

  // ── Row ──
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    minHeight: 56,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowValue: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },

  // ── Language Pills ──
  langPills: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 3,
    gap: 2,
  },
  langPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  langPillActive: {
    backgroundColor: '#fff',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
  },
  langPillText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  langPillTextActive: {
    color: '#4F46E5',
    fontFamily: 'Inter-Bold',
  },
});
