import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { useTheme } from 'react-native-paper';
import {
  HomeIcon,
  HomeFillIcon,
  SearchIcon,
  SearchFillIcon,
  BoxIcon,
  BoxFillIcon,
  BellIcon,
  BellFillIcon,
  GridIcon,
} from '../../src/components/Icons';
import { MoreModal } from '../../src/components/MoreModal';
import { useNotificationsStore } from '@autoparts/hooks';
import { useTranslation } from 'react-i18next';

// ── Custom Tab Bar ────────────────────────────────────────────────────────────
interface TabItem {
  name: string;
  label: string;
  Icon: React.ComponentType<{ color?: string; size?: number }>;
  FillIcon: React.ComponentType<{ color?: string; size?: number }>;
  route: '/' | '/search' | '/reservations' | '/notifications';
  badgeKey?: 'notifications';
}

// TABS is now built dynamically inside CustomTabBar to react to language changes

function CustomTabBar() {
  const { t } = useTranslation();
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [moreVisible, setMoreVisible] = useState(false);
  const { unreadCount } = useNotificationsStore();

  const TABS: TabItem[] = [
    { name: 'index',              label: t('tabs.home'),          Icon: HomeIcon,   FillIcon: HomeFillIcon,   route: '/' },
    { name: 'search/index',       label: t('tabs.search'),        Icon: SearchIcon, FillIcon: SearchFillIcon, route: '/search' },
    { name: 'reservations/index', label: t('tabs.reservations'),  Icon: BoxIcon,    FillIcon: BoxFillIcon,    route: '/reservations' },
    { name: 'notifications',      label: t('tabs.notifications'), Icon: BellIcon,   FillIcon: BellFillIcon,   route: '/notifications', badgeKey: 'notifications' },
  ];

  const primaryColor = theme.colors.primary;
  const backgroundColor = theme.colors.surface;
  const inactiveColor = theme.colors.onSurfaceVariant || '#9CA3AF';

  // Determine active tab
  const activeTab = (() => {
    if (pathname === '/' || pathname === '') return 'index';
    if (pathname.startsWith('/search')) return 'search/index';
    if (pathname.startsWith('/reservations')) return 'reservations/index';
    if (pathname.startsWith('/notifications')) return 'notifications';
    return 'index';
  })();

  const getBadge = (badgeKey?: string) => {
    if (badgeKey === 'notifications') return unreadCount;
    return 0;
  };

  return (
    <>
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor,
            borderTopColor: theme.colors.outline + '30',
          },
        ]}
      >
        {/* 4 main tabs */}
        {TABS.map((tab) => {
          const isActive = activeTab === tab.name;
          const color = isActive ? primaryColor : inactiveColor;
          const IconComp = isActive ? tab.FillIcon : tab.Icon;
          const badge = getBadge(tab.badgeKey);

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => router.push(tab.route)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
            >
              <View style={styles.iconWrapper}>
                <IconComp color={color} size={24} />
                {badge > 0 && (
                  <View style={[styles.badge, { backgroundColor: '#EF4444' }]}>
                    <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.tabLabel, { color, fontFamily: isActive ? 'Inter-SemiBold' : 'Inter-Medium' }]}>
                {tab.label}
              </Text>
              {isActive && (
                <View style={[styles.activeIndicator, { backgroundColor: primaryColor }]} />
              )}
            </TouchableOpacity>
          );
        })}

        {/* "Autres" tab — always 5th */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setMoreVisible(true)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Autres"
        >
          <View style={styles.iconWrapper}>
            <GridIcon color={inactiveColor} size={24} />
          </View>
          <Text style={[styles.tabLabel, { color: inactiveColor, fontFamily: 'Inter-Medium' }]}>{t('tabs.more')}</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom sheet */}
      <MoreModal
        visible={moreVisible}
        onClose={() => setMoreVisible(false)}
        primaryColor={primaryColor}
        backgroundColor={theme.colors.background}
        surfaceColor={theme.colors.surface}
        textColor={theme.colors.onSurface}
        subtitleColor={inactiveColor}
      />
    </>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function ClientTabsLayout() {
  return (
    <Tabs
      tabBar={() => <CustomTabBar />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search/index" />
      <Tabs.Screen name="reservations/index" />
      <Tabs.Screen name="notifications" />
      {/* These screens exist but are NOT tabs — hidden from bar */}
      <Tabs.Screen name="cart" options={{ href: null }} />
      <Tabs.Screen name="checkout" options={{ href: null }} />
      <Tabs.Screen name="profile/index" options={{ href: null }} />
      <Tabs.Screen name="edit-profile/index" options={{ href: null }} />
      <Tabs.Screen name="settings/index" options={{ href: null }} />
      <Tabs.Screen name="support/index" options={{ href: null }} />
      <Tabs.Screen name="favorites/index" options={{ href: null }} />
      <Tabs.Screen name="vehicles/index" options={{ href: null }} />
      <Tabs.Screen name="part/[id]" options={{ href: null }} />
    </Tabs>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
    paddingHorizontal: 4,
    boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.06)',
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    gap: 2,
  },
  iconWrapper: {
    position: 'relative',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 11,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.1,
    marginTop: 1,
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 3,
    borderRadius: 2,
  },
});
