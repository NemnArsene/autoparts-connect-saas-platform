import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useFavoritesStore, useCartStore } from '@autoparts/hooks';
import { PARTS, formatPrice } from '@autoparts/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '../../../src/components/ScreenHeader';

// ── Favorite Part Card ────────────────────────────────────────────────────────
function FavoritePartCard({
  part,
  onRemove,
  onAddToCart,
}: {
  part: any;
  onRemove: () => void;
  onAddToCart: () => void;
}) {
  return (
    <View style={styles.partCard}>
      <View style={styles.partImage}>
        <Icon name="car" size={32} color="#4F46E5" />
      </View>
      <View style={styles.partInfo}>
        <Text style={styles.partName} numberOfLines={1}>{part.name}</Text>
        <Text style={styles.partBrand}>{part.brand}</Text>
        <Text style={styles.partPrice}>{formatPrice(part.price)}</Text>
      </View>
      <View style={styles.partActions}>
        <TouchableOpacity style={styles.removeBtn} onPress={onRemove} activeOpacity={0.7}>
          <Icon name="heart" size={20} color="#EF4444" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartBtn} onPress={onAddToCart} activeOpacity={0.7}>
          <Icon name="cart-plus" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function FavoritesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { favoriteIds, toggleFavorite } = useFavoritesStore();
  const { addToCart } = useCartStore();

  const favoriteParts = PARTS.filter((p) => favoriteIds.includes(p.id));

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('favorites.title')} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {favoriteParts.length === 0 ? (
          /* ── Empty State ── */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Icon name="heart-outline" size={56} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>{t('favorites.emptyTitle')}</Text>
            <Text style={styles.emptyMessage}>{t('favorites.emptyMessage')}</Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push('/search')}
              activeOpacity={0.8}
            >
              <Icon name="magnify" size={18} color="#fff" />
              <Text style={styles.browseButtonText}>{t('favorites.browseParts')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ── Parts List ── */
          <>
            <Text style={styles.countText}>
              {favoriteParts.length} {favoriteParts.length > 1 ? t('favorites.partsCount') : t('favorites.partCount')}
            </Text>
            {favoriteParts.map((part) => (
              <FavoritePartCard
                key={part.id}
                part={part}
                onRemove={() => toggleFavorite(part.id)}
                onAddToCart={() => addToCart(part)}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // ── Body ──
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 20 },

  // ── Empty State ──
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
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
    marginBottom: 32,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  browseButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },

  // ── Count ──
  countText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 16,
  },

  // ── Part Card ──
  partCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
  },
  partImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  partInfo: {
    flex: 1,
  },
  partName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  partBrand: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 6,
  },
  partPrice: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#4F46E5',
  },
  partActions: {
    alignItems: 'center',
    gap: 8,
  },
  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
