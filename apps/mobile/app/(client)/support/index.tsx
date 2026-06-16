import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '../../../src/components/ScreenHeader';

// ── FAQ Item ──────────────────────────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <Icon
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#6B7280"
        />
      </View>
      {expanded && <Text style={styles.faqAnswer}>{answer}</Text>}
    </TouchableOpacity>
  );
}

// ── Contact Row ───────────────────────────────────────────────────────────────
function ContactRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: string;
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.contactRow} onPress={onPress} activeOpacity={0.6}>
      <View style={styles.contactIcon}>
        <Icon name={icon} size={22} color="#4F46E5" />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={styles.contactValue}>{value}</Text>
      </View>
      <Icon name="chevron-right" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function SupportScreen() {
  const { t } = useTranslation();

  const faqItems = [
    { q: t('support.faq1Q'), a: t('support.faq1A') },
    { q: t('support.faq2Q'), a: t('support.faq2A') },
    { q: t('support.faq3Q'), a: t('support.faq3A') },
    { q: t('support.faq4Q'), a: t('support.faq4A') },
    { q: t('support.faq5Q'), a: t('support.faq5A') },
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('support.title')} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Card ── */}
        <View style={styles.heroCard}>
          <View style={styles.heroIconBox}>
            <Icon name="headphones" size={32} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>{t('support.heroTitle')}</Text>
          <Text style={styles.heroSub}>{t('support.heroSub')}</Text>
        </View>

        {/* ── Contact Card ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('support.contactUs')}</Text>
          <ContactRow
            icon="phone-outline"
            label={t('support.callUs')}
            value="+237 237 6 96 56 71 84"
            onPress={() => Linking.openURL('tel:+237696567184')}
          />
          <ContactRow
            icon="email-outline"
            label={t('support.emailUs')}
            value="support@autoparts-connect.ci"
            onPress={() => Linking.openURL('mailto:support@autoparts-connect.ci')}
          />
          <ContactRow
            icon="map-marker-outline"
            label={t('support.visitUs')}
            value={t('support.address')}
            onPress={() => { }}
          />
        </View>

        {/* ── FAQ Card ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('support.faq')}</Text>
          {faqItems.map((item, i) => (
            <FaqItem key={i} question={item.q} answer={item.a} />
          ))}
        </View>

        {/* ── Legal Links Card ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('support.legal')}</Text>
          <TouchableOpacity style={styles.legalRow} activeOpacity={0.6}>
            <Icon name="file-document-outline" size={20} color="#6B7280" />
            <Text style={styles.legalText}>{t('support.privacyPolicy')}</Text>
            <Icon name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.legalDivider} />
          <TouchableOpacity style={styles.legalRow} activeOpacity={0.6}>
            <Icon name="file-certificate-outline" size={20} color="#6B7280" />
            <Text style={styles.legalText}>{t('support.termsOfUse')}</Text>
            <Icon name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.legalDivider} />
          <TouchableOpacity style={styles.legalRow} activeOpacity={0.6}>
            <Icon name="information-outline" size={20} color="#6B7280" />
            <Text style={styles.legalText}>{t('support.aboutApp')}</Text>
            <Icon name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // ── Body ──
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 20 },

  // ── Hero ──
  heroCard: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  heroIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },

  // ── Cards ──
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    paddingVertical: 16,
  },

  // ── Contact ──
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  contactValue: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },

  // ── FAQ ──
  faqItem: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingVertical: 14,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 10,
    lineHeight: 20,
  },

  // ── Legal ──
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  legalText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginLeft: 14,
  },
  legalDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
});
