import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore, useReservationsStore, useFavoritesStore } from '@autoparts/hooks';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '../../../src/components/ScreenHeader';

// ── Menu Row ──────────────────────────────────────────────────────────────────
function MenuRow({
  icon,
  label,
  count,
  onPress,
  isLast = false,
}: {
  icon: string;
  label: string;
  count?: number;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.menuRow, !isLast && styles.menuRowBorder]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={styles.menuIcon}>
        <Icon name={icon} size={22} color="#6B7280" />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <View style={styles.menuRight}>
        {count !== undefined && count > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        )}
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}

// ── Main Profile Screen ───────────────────────────────────────────────────────
export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuthStore();
  const { myReservations } = useReservationsStore();
  const { favoriteIds } = useFavoritesStore();

  const initials = user?.avatar || (user?.name ? user.name.substring(0, 2).toUpperCase() : 'AP');

  const menuItems = [
    {
      icon: 'car',
      label: t('profile.myVehicles'),
      count: 3,
      route: '/vehicles' as const,
    },
    {
      icon: 'package-variant',
      label: t('profile.myReservations'),
      count: myReservations?.length ?? 0,
      route: '/reservations' as const,
    },
    {
      icon: 'heart-outline',
      label: t('profile.myFavorites'),
      count: favoriteIds?.length ?? 0,
      route: '/favorites' as const,
    },
    {
      icon: 'clock-outline',
      label: t('profile.orderHistory'),
      route: '/reservations' as const,
    },
    {
      icon: 'cog-outline',
      label: t('profile.settings'),
      route: '/settings' as const,
    },
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('profile.title')} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile Card ── */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user?.avatarUri ? (
              <Image source={{ uri: user.avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
          </View>

          <Text style={styles.userName}>{user?.name || t('profile.guest')}</Text>
          <Text style={styles.userEmail}>{user?.email || t('profile.notConnected')}</Text>

          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.7}
            onPress={() => router.push('/edit-profile')}
          >
            <Icon name="pencil-outline" size={18} color="#4F46E5" />
            <Text style={styles.editButtonText}>{t('profile.editProfile')}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Menu Items Card ── */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <MenuRow
              key={item.icon}
              icon={item.icon}
              label={item.label}
              count={item.count}
              onPress={() => router.push(item.route)}
              isLast={index === menuItems.length - 1}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // ── Body ──
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 20 },

  // ── Profile Card ──
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 16,
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
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4F46E5',
  },

  // ── Menu Card ──
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  countText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
});
