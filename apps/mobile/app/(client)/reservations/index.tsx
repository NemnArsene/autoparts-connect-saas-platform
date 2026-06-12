import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useReservationsStore, useAuthStore } from '@autoparts/hooks';
import { formatPrice } from '@autoparts/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { G, Circle, Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { TopHeader } from '../../../src/components/TopHeader';

export default function ReservationsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { myReservations } = useReservationsStore();
  const [activeTab, setActiveTab] = useState('all');

  if (!user) {
    return (
      <View style={styles.authContainer}>
        <View style={styles.authCard}>
          <Icon name="lock-outline" size={56} color="#6366f1" />
          <Text style={styles.authTitle}>Connexion requise</Text>
          <Text style={styles.authSub}>
            Connectez-vous pour consulter vos réservations et suivre vos commandes.
          </Text>
          <TouchableOpacity style={styles.authBtn} onPress={() => router.push('/login')} activeOpacity={0.85}>
            <Text style={styles.authBtnText}>Se connecter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.authRegister} onPress={() => router.push('/register')} activeOpacity={0.7}>
            <Text style={styles.authRegisterText}>Créer un compte gratuit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':   return { bg: '#fef3c7', text: '#d97706', label: 'En\nattente' };
      case 'confirmed': return { bg: '#d1fae5', text: '#059669', label: 'Confirmée' };
      case 'ready':     return { bg: '#dbeafe', text: '#2563eb', label: 'Prêt' };
      case 'completed': return { bg: '#e0e7ff', text: '#4f46e5', label: 'Terminée' };
      case 'cancelled': return { bg: '#fee2e2', text: '#dc2626', label: 'Annulée' };
      default:          return { bg: '#f3f4f6', text: '#4b5563', label: status };
    }
  };

  const tabs = [
    { key: 'all',       label: 'Toutes' },
    { key: 'pending',   label: 'En attente' },
    { key: 'confirmed', label: 'Confirmées' },
    { key: 'completed', label: 'Terminées' },
  ];

  const filtered = activeTab === 'all'
    ? myReservations
    : myReservations.filter((r) => r.status === activeTab);

  const getRelativeDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Réservé Aujourd'hui";
    if (diffDays === 1) return 'Réservé Hier';
    if (diffDays < 7)  return `Il y a ${diffDays} jours`;
    return `Le ${date.toLocaleDateString('fr-FR')}`;
  };

  return (
    <View style={styles.container}>
      <TopHeader title="Mes réservations" />

      {/* Status Filter Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="clipboard-text-outline" size={64} color="#94a3b8" />
          <Text style={styles.emptyTitle}>Aucune réservation</Text>
          <Text style={styles.emptySub}>
            {activeTab === 'all'
              ? "Vous n'avez pas encore réservé de pièces."
              : 'Aucune réservation avec ce statut.'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {filtered.map((res) => {
            const statusInfo = getStatusInfo(res.status);
            const dateRef = (res as any).createdAt || res.pickupDate;
            return (
              <TouchableOpacity key={res.id} style={styles.card} activeOpacity={0.85}>
                <View style={styles.cardMain}>
                  {/* SVG Target Image */}
                  <View style={styles.imgBox}>
                    <Svg viewBox="0 0 100 100" width={46} height={46}>
                      <G stroke="white" strokeWidth="2" fill="none" strokeLinecap="round">
                        <Circle cx="50" cy="50" r="26" />
                        <Circle cx="50" cy="50" r="16" />
                        <Circle cx="50" cy="50" r="6" fill="white" />
                        <Path d="M50 24 L50 18 M50 82 L50 76 M24 50 L18 50 M82 50 L76 50" strokeWidth="3" />
                      </G>
                    </Svg>
                  </View>

                  <View style={styles.cardInfo}>
                    {/* Title + Status */}
                    <View style={styles.titleRow}>
                      <Text style={styles.partName} numberOfLines={1}>{res.partName}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                        <Text style={[styles.statusText, { color: statusInfo.text }]}>{statusInfo.label}</Text>
                      </View>
                    </View>

                    <Text style={styles.supplierText}>{res.supplierName}</Text>

                    {/* Reference + Total */}
                    <View style={styles.metaRow}>
                      <View>
                        <Text style={styles.metaKey}>RÉF</Text>
                        <Text style={styles.metaRef}>{res.reference}</Text>
                        <Text style={styles.metaDate}>{getRelativeDate(dateRef)}</Text>
                      </View>
                      <View style={styles.totalCol}>
                        <Text style={styles.totalKey}>TOTAL</Text>
                        <Text style={styles.totalVal}>{formatPrice(res.totalPrice)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 60 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  // Tabs
  tabsWrapper: {
    backgroundColor: '#fff',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tabsScroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  tabActive: { backgroundColor: '#6366f1' },
  tabText: { fontFamily: 'Inter-Medium', fontSize: 13, color: '#64748b' },
  tabTextActive: { fontFamily: 'Inter-SemiBold', color: '#fff' },

  // Empty
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: '#0f172a', marginTop: 16 },
  emptySub: { fontSize: 14, fontFamily: 'Inter-Regular', color: '#64748b', textAlign: 'center', marginTop: 8 },

  // List
  content: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  cardMain: { flexDirection: 'row', padding: 14 },
  imgBox: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#ea580c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardInfo: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  partName: { fontFamily: 'Inter-Bold', fontSize: 14, color: '#0f172a', flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontFamily: 'Inter-SemiBold', fontSize: 11, textAlign: 'center' },
  supplierText: { fontFamily: 'Inter-Regular', fontSize: 12, color: '#64748b', marginBottom: 10 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  metaKey: { fontFamily: 'Inter-Bold', fontSize: 9, color: '#94a3b8', letterSpacing: 0.5, marginBottom: 2 },
  metaRef: { fontFamily: 'Inter-Medium', fontSize: 12, color: '#334155' },
  metaDate: { fontFamily: 'Inter-Regular', fontSize: 11, color: '#94a3b8', marginTop: 4 },
  totalCol: { alignItems: 'flex-end' },
  totalKey: { fontFamily: 'Inter-Bold', fontSize: 9, color: '#94a3b8', letterSpacing: 0.5, marginBottom: 2 },
  totalVal: { fontFamily: 'Inter-Black', fontSize: 14, color: '#4f46e5' },

  // Auth guard
  authContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f8fafc' },
  authCard: {
    width: '100%', backgroundColor: '#fff', borderRadius: 24, padding: 32,
    alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
  },
  authTitle: { fontSize: 22, fontFamily: 'Inter-ExtraBold', color: '#0f172a', marginTop: 16, marginBottom: 10 },
  authSub: { fontSize: 14, fontFamily: 'Inter-Regular', color: '#64748b', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  authBtn: { width: '100%', paddingVertical: 15, borderRadius: 16, alignItems: 'center', marginBottom: 12, backgroundColor: '#6366f1' },
  authBtnText: { color: '#fff', fontSize: 16, fontFamily: 'Inter-Bold' },
  authRegister: { paddingVertical: 6 },
  authRegisterText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: '#6366f1' },
});
