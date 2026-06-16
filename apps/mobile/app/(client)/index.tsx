import React from 'react';
import { View, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore, useCartStore, useFavoritesStore } from '@autoparts/hooks';
import { CATEGORIES, VEHICLES, PARTS } from '@autoparts/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { PartCard } from '../../src/components/PartCard';
import { TopHeader } from '../../src/components/TopHeader';
import { useTranslation } from 'react-i18next';

const FEATURED_PARTS = PARTS.filter((p) => p.isNew).slice(0, 8);
const POPULAR_PARTS = PARTS.filter((p) => p.rating >= 4.5).slice(0, 8);

function HeaderGradient() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="headerGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#6C3CE1" />
            <Stop offset="1" stopColor="#D946EF" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#headerGrad)" />
      </Svg>
    </View>
  );
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuthStore();
  const { addToCart, items: cartItems } = useCartStore();
  const { favoriteIds, toggleFavorite } = useFavoritesStore();

  const myVehicle = VEHICLES[0];
  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const categoryIcons: Record<string, { color: string, icon: string }> = {
    freinage: { color: '#EF4444', icon: 'octagon-outline' },
    moteur: { color: '#F97316', icon: 'cog-outline' },
    suspension: { color: '#8B5CF6', icon: 'wrench-outline' },
    filtration: { color: '#0EA5E9', icon: 'weather-windy' },
    electricite: { color: '#F59E0B', icon: 'lightning-bolt' },
    transmission: { color: '#10B981', icon: 'sync' },
    carrosserie: { color: '#E11D48', icon: 'car-side' },
    pneumatiques: { color: '#4B5563', icon: 'tire' },
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopHeader
        title={t('common.appTitle')}
        subtitle={t('common.appSubtitle')}
        showBack={false}
        leftIcon={
          <View style={styles.logoCircle}>
            <Icon name="snowflake" size={18} color="#fff" />
          </View>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>

      {/* Main Gradient Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <HeaderGradient />
          <View style={styles.headerInner}>
            <View style={styles.headerTop}>
              <View style={styles.locationRow}>
                <Icon name="map-marker-outline" size={16} color="#fff" />
                <Text style={styles.locationText}>{t('home.location')}</Text>
              </View>
            </View>

            <Text style={styles.greeting}>
              {t('home.greeting')} {user?.name?.split(' ')[0] || t('home.greetingDefault')} 👋
            </Text>
            <Text style={styles.subtitle}>{t('home.subtitle')}</Text>

            {/* Search Bar */}
            <TouchableOpacity
              style={styles.searchBox}
              activeOpacity={0.9}
              onPress={() => router.push('/search')}
            >
              <Icon name="magnify" size={20} color="#fff" style={styles.searchIcon} />
              <Text style={styles.searchText}>{t('home.searchPlaceholder')}</Text>
            </TouchableOpacity>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>5000+</Text>
                <Text style={styles.statLabel}>{t('home.statParts')}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>20</Text>
                <Text style={styles.statLabel}>{t('home.statSuppliers')}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>{t('home.statCities')}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Vehicle Card */}
      <View style={styles.section}>
        <View style={styles.vehicleOuterCard}>
          <View style={styles.vehicleHeaderRow}>
            <View>
              <Text style={styles.vehicleTitle}>{t('home.myVehicle')}</Text>
              <Text style={styles.vehicleSubtitle}>{t('home.vehicleSubtitle')}</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.vehicleManageText}>{t('common.manage')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.vehicleInnerCard}>
            <View style={styles.vehicleIcon}>
              <Icon name="wrench-outline" size={24} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.vehicleTitleRow}>
                <Text style={styles.vehicleName}>{myVehicle.brand} {myVehicle.model}</Text>
                <View style={styles.activeBadge}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeText}>{t('home.vehicleActive')}</Text>
                </View>
              </View>
              <Text style={styles.vehicleDetails}>
                {myVehicle.year} • {myVehicle.plate} • {myVehicle.color}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Categories Grid */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.categories')}</Text>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Text style={{ color: theme.colors.primary, fontWeight: '600', fontSize: 14 }}>
              {t('common.seeAll')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesGrid}>
          {CATEGORIES.slice(0, 8).map((c) => {
            const config = categoryIcons[c.id] || { color: theme.colors.primary, icon: 'car-cog' };
            return (
              <TouchableOpacity key={c.id} style={styles.categoryItem} onPress={() => router.push('/search')}>
                <View style={[styles.categoryIconBox, { backgroundColor: config.color }]}>
                  <Icon name={config.icon} size={28} color="#fff" />
                </View>
                <Text style={styles.categoryName} numberOfLines={1}>{c.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Promo Banner */}
      <View style={[styles.promoBanner, { marginHorizontal: 20, marginBottom: 24 }]}>
        <Svg width="100%" height="100%" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="promoGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#F97316" />
              <Stop offset="1" stopColor="#EA580C" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" rx={16} fill="url(#promoGrad)" />
        </Svg>
        <View style={styles.promoContent}>
          <View style={styles.promoIconBox}>
            <Icon name="tag-outline" size={24} color="#fff" />
          </View>
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoLabel}>{t('home.promoLabel')}</Text>
            <Text style={styles.promoTitle}>{t('home.promoTitle')}</Text>
            <Text style={styles.promoSub}>{t('home.promoSub')}</Text>
          </View>
          <TouchableOpacity style={styles.promoBtn}>
            <Text style={styles.promoBtnText}>{t('home.promoBtn')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Featured Parts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="auto-fix" size={20} color="#F59E0B" />
            <Text style={styles.sectionTitle}>{t('home.newParts')}</Text>
          </View>
        </View>
        <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 13, marginBottom: 16, marginTop: -8 }}>
          {t('home.newPartsSubtitle')}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={{ paddingRight: 20 }}>
          {FEATURED_PARTS.map((p) => (
            <PartCard
              key={p.id}
              part={p}
              onPress={() => { }}
              isFav={favoriteIds.includes(p.id)}
              onFav={() => toggleFavorite(p.id)}
              onAdd={() => addToCart(p, 1)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Popular Parts (Tendances) */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="fire" size={20} color="#EF4444" />
            <Text style={styles.sectionTitle}>{t('home.trending')}</Text>
          </View>
        </View>
        <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 13, marginBottom: 16, marginTop: -8 }}>
          {t('home.trendingSubtitle')}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={{ paddingRight: 20 }}>
          {POPULAR_PARTS.map((p) => (
            <PartCard
              key={p.id}
              part={p}
              onPress={() => { }}
              isFav={favoriteIds.includes(p.id)}
              onFav={() => toggleFavorite(p.id)}
              onAdd={() => addToCart(p, 1)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Trust Badges */}
      <View style={styles.trustBadgesContainer}>
        <View style={styles.trustBadge}>
          <Icon name="shield-check-outline" size={28} color="#059669" />
          <Text style={styles.trustBadgeText}>{t('home.certifiedParts')}</Text>
        </View>
        <View style={styles.trustBadge}>
          <Icon name="truck-fast-outline" size={28} color="#0284C7" />
          <Text style={styles.trustBadgeText}>{t('home.fastDelivery')}</Text>
        </View>
        <View style={styles.trustBadge}>
          <Icon name="clock-outline" size={28} color="#7C3AED" />
          <Text style={styles.trustBadgeText}>{t('home.support247')}</Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerWrapper: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 24,
    backgroundColor: '#fff',
    boxShadow: '0px 12px 32px rgba(108, 60, 225, 0.3)',
  },
  header: {
    borderRadius: 24,
    overflow: 'hidden',
    paddingBottom: 24,
  },
  headerInner: {
    padding: 20,
    paddingTop: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },
  greeting: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter-ExtraBold',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  searchIcon: { marginRight: 10 },
  searchText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 11,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-ExtraBold',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9,
    fontFamily: 'Inter-Bold',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  section: {
    padding: 18,
    paddingBottom: 0,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-ExtraBold',
    color: '#111827',
  },
  vehicleOuterCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  vehicleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  vehicleTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  vehicleSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  vehicleManageText: {
    color: '#6C3CE1',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  vehicleInnerCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vehicleTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleName: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#111827',
  },
  vehicleDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  activeText: {
    color: '#059669',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
  },
  categoryItem: {
    width: '23%',
    alignItems: 'center',
  },
  categoryIconBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 11,
    textAlign: 'center',
    color: '#374151',
    fontFamily: 'Inter-Medium',
  },
  promoBanner: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0px 8px 16px rgba(234, 88, 12, 0.25)',
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
  },
  promoIconBox: { padding: 8 },
  promoTextContainer: { flex: 1 },
  promoLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 10,
    fontFamily: 'Inter-ExtraBold',
    letterSpacing: 0.5,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-ExtraBold',
    marginVertical: 2,
  },
  promoSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  promoBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  promoBtnText: {
    color: '#EA580C',
    fontFamily: 'Inter-Bold',
    fontSize: 13,
  },
  horizontalScroll: { overflow: 'visible' },
  trustBadgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 8,
    gap: 8,
  },
  trustBadge: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  trustBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
});
