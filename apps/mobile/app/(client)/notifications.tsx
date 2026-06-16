import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useNotificationsStore } from '@autoparts/hooks';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '../../src/components/ScreenHeader';

// ── Notification Card ─────────────────────────────────────────────────────────
function NotificationCard({
  title,
  message,
  date,
  type,
  isRead,
  onMarkRead,
}: {
  title: string;
  message: string;
  date: string;
  type: string;
  isRead: boolean;
  onMarkRead: () => void;
}) {
  const getIcon = () => {
    switch (type) {
      case 'order': return { name: 'package-variant', color: '#4F46E5', bg: '#EEF2FF' };
      case 'promo': return { name: 'tag', color: '#F59E0B', bg: '#FFFBEB' };
      case 'reservation': return { name: 'calendar-check', color: '#10B981', bg: '#ECFDF5' };
      default: return { name: 'bell-outline', color: '#6B7280', bg: '#F3F4F6' };
    }
  };

  const icon = getIcon();

  return (
    <TouchableOpacity
      style={[styles.notifCard, !isRead && styles.notifCardUnread]}
      onPress={onMarkRead}
      activeOpacity={0.7}
    >
      <View style={[styles.notifIcon, { backgroundColor: icon.bg }]}>
        <Icon name={icon.name} size={22} color={icon.color} />
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={[styles.notifTitle, !isRead && styles.notifTitleUnread]} numberOfLines={1}>
            {title}
          </Text>
          {!isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notifMessage} numberOfLines={2}>{message}</Text>
        <Text style={styles.notifDate}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function NotificationsScreen() {
  const { t } = useTranslation();
  const { notifications, readIds, unreadCount, markAsRead, markRead } = useNotificationsStore();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={t('notifications.title')}
        rightAction={
          unreadCount > 0 ? (
            <TouchableOpacity
              onPress={() => markAsRead()}
              activeOpacity={0.7}
              style={styles.markAllBtn}
            >
              <Icon name="check-all" size={20} color="#4F46E5" />
              <Text style={styles.markAllText}>{t('notifications.markAll')}</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          /* ── Empty State ── */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Icon name="bell-off-outline" size={56} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>{t('notifications.emptyTitle')}</Text>
            <Text style={styles.emptyMessage}>{t('notifications.emptyMessage')}</Text>
          </View>
        ) : (
          <>
            {unreadCount > 0 && (
              <Text style={styles.sectionLabel}>
                {t('notifications.unread')} ({unreadCount})
              </Text>
            )}
            {notifications.map((n) => {
              const isRead = readIds.includes(n.id);
              return (
                <NotificationCard
                  key={n.id}
                  title={n.title}
                  message={n.message}
                  date={n.date}
                  type={n.type}
                  isRead={isRead}
                  onMarkRead={() => markRead(n.id)}
                />
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // ── Mark All ──
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  markAllText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#4F46E5',
  },

  // ── Body ──
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 8 },

  // ── Section ──
  sectionLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 12,
    marginLeft: 4,
  },

  // ── Notification Card ──
  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 10,
  },
  notifCardUnread: {
    borderColor: '#C7D2FE',
    backgroundColor: '#FAFAFE',
  },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  notifContent: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  notifTitleUnread: {
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
    marginLeft: 8,
  },
  notifMessage: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 6,
  },
  notifDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },

  // ── Empty State ──
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 32,
  },
  emptyIconBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});
