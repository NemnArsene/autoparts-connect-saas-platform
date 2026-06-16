import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '../../src/components/ScreenHeader';

// ── Mock data (will be replaced by real store) ────────────────────────────────
interface TechRequest {
  id: string;
  technician: string;
  brand: string;
  problemKey: string;
  problem: string;
  location: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: string;
  notes?: string;
}

const MOCK_REQUESTS: TechRequest[] = [
  {
    id: '1',
    technician: 'Jean Méké',
    brand: 'Toyota',
    problemKey: 'brake',
    problem: 'Problème de frein',
    location: 'Domicile',
    status: 'confirmed',
    date: '15 Jun 2026',
    notes: 'Frein avant qui grince',
  },
  {
    id: '2',
    technician: 'Paul Atangana',
    brand: 'BMW',
    problemKey: 'engine',
    problem: 'Problème moteur',
    location: 'Bureau',
    status: 'pending',
    date: '14 Jun 2026',
  },
  {
    id: '3',
    technician: 'Marie Ngono',
    brand: 'Peugeot',
    problemKey: 'electrical',
    problem: 'Problème électrique',
    location: 'Garage',
    status: 'completed',
    date: '10 Jun 2026',
    notes: 'Phale arrière gauche ne fonctionne plus',
  },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; labelKey: string }> = {
  pending: { color: '#F59E0B', bg: '#FEF3C7', label: 'En attente', labelKey: 'technician.requests.statusPending' },
  confirmed: { color: '#3B82F6', bg: '#DBEAFE', label: 'Confirmé', labelKey: 'technician.requests.statusConfirmed' },
  completed: { color: '#10B981', bg: '#D1FAE5', label: 'Terminé', labelKey: 'technician.requests.statusCompleted' },
  cancelled: { color: '#EF4444', bg: '#FEE2E2', label: 'Annulé', labelKey: 'technician.requests.statusCancelled' },
};

const PROBLEM_ICONS: Record<string, string> = {
  brake: 'octagon-outline',
  engine: 'cog-outline',
  electrical: 'lightning-bolt',
  suspension: 'car-door',
  transmission: 'sync',
  oil: 'oil',
  tire: 'circle-outline',
  ac: 'snowflake',
  bodywork: 'car-side',
  other: 'dots-horizontal',
};

// ── Request Card ──────────────────────────────────────────────────────────────
function RequestCard({
  request,
  primaryColor,
  t,
}: {
  request: TechRequest;
  primaryColor: string;
  t: (key: string) => string;
}) {
  const status = STATUS_CONFIG[request.status];
  const problemIcon = PROBLEM_ICONS[request.problemKey || 'other'] || 'alert-circle-outline';

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      {/* Top row: status + date */}
      <View style={styles.cardTop}>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={[styles.statusText, { color: status.color }]}>{t(status.labelKey)}</Text>
        </View>
        <Text style={styles.dateText}>{request.date}</Text>
      </View>

      {/* Main content */}
      <View style={styles.cardBody}>
        <View style={styles.cardIconBox}>
          <Icon name={problemIcon} size={24} color={primaryColor} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTechnician}>{request.technician}</Text>
          <Text style={styles.cardProblem}>{request.problem}</Text>
          <View style={styles.cardMeta}>
            <Icon name="car" size={12} color="#9CA3AF" />
            <Text style={styles.cardMetaText}>{request.brand}</Text>
            <View style={styles.metaDot} />
            <Icon name="map-marker-outline" size={12} color="#9CA3AF" />
            <Text style={styles.cardMetaText}>{request.location}</Text>
          </View>
        </View>
      </View>

      {/* Notes preview */}
      {request.notes && (
        <View style={styles.notesPreview}>
          <Icon name="note-text-outline" size={14} color="#9CA3AF" />
          <Text style={styles.notesText} numberOfLines={1}>{request.notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function TechnicianRequestsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const primaryColor = theme.colors.primary;

  const requests = MOCK_REQUESTS;
  const activeRequests = requests.filter((r) => r.status === 'pending' || r.status === 'confirmed');
  const pastRequests = requests.filter((r) => r.status === 'completed' || r.status === 'cancelled');

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScreenHeader title={t('technician.requests.title')} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* New Request Button */}
        <TouchableOpacity
          style={[styles.newRequestBtn, { backgroundColor: primaryColor }]}
          onPress={() => router.push('/technician-contact')}
          activeOpacity={0.85}
        >
          <View style={styles.newRequestIconBox}>
            <Icon name="plus" size={22} color={primaryColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.newRequestTitle}>{t('technician.requests.newRequest')}</Text>
            <Text style={styles.newRequestSub}>{t('technician.requests.newRequestSub')}</Text>
          </View>
          <Icon name="chevron-right" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Active Requests */}
        {activeRequests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionDot} />
                <Text style={styles.sectionTitle}>{t('technician.requests.active')}</Text>
              </View>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{activeRequests.length}</Text>
              </View>
            </View>
            {activeRequests.map((req) => (
              <RequestCard key={req.id} request={req} primaryColor={primaryColor} t={t} />
            ))}
          </View>
        )}

        {/* Past Requests */}
        {pastRequests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View style={[styles.sectionDot, { backgroundColor: '#D1D5DB' }]} />
                <Text style={[styles.sectionTitle, { color: '#6B7280' }]}>{t('technician.requests.past')}</Text>
              </View>
              <View style={[styles.countBadge, { backgroundColor: '#F3F4F6' }]}>
                <Text style={[styles.countText, { color: '#6B7280' }]}>{pastRequests.length}</Text>
              </View>
            </View>
            {pastRequests.map((req) => (
              <RequestCard key={req.id} request={req} primaryColor={primaryColor} t={t} />
            ))}
          </View>
        )}

        {/* Empty state */}
        {requests.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconBox, { backgroundColor: primaryColor + '10' }]}>
              <Icon name="wrench-outline" size={48} color={primaryColor} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
              {t('technician.requests.emptyTitle')}
            </Text>
            <Text style={[styles.emptyMessage, { color: theme.colors.onSurfaceVariant }]}>
              {t('technician.requests.emptyMessage')}
            </Text>
            <TouchableOpacity
              style={[styles.emptyBtn, { backgroundColor: primaryColor }]}
              onPress={() => router.push('/technician-contact')}
              activeOpacity={0.85}
            >
              <Text style={styles.emptyBtnText}>{t('technician.requests.makeFirst')}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: 16,
  },
  // New Request Button
  newRequestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  newRequestIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newRequestTitle: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter-Bold',
  },
  newRequestSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    marginTop: 1,
  },
  // Section
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  countBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
  },
  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },
  dateText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  cardBody: {
    flexDirection: 'row',
    gap: 12,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardTechnician: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  cardProblem: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 2,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  cardMetaText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 2,
  },
  notesPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  notesText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    flex: 1,
  },
  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  emptyBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
});
