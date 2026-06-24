import { View, ScrollView, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { Text, Button, Chip } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCartStore, useFavoritesStore } from '@autoparts/hooks';
import { PARTS, CATEGORIES, formatPrice } from '@autoparts/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { G, Circle, Path } from 'react-native-svg';
import { TopHeader } from '../../../src/components/TopHeader';
import { getPartImage } from '../../../src/components/partImages';
import { useState } from 'react';

export default function PartDetailScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { favoriteIds, toggleFavorite } = useFavoritesStore();
  const [quantity, setQuantity] = useState(1);

  const part = PARTS.find((p) => p.id === id);

  if (!part) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ fontFamily: 'Inter-Regular' }}>Pièce introuvable</Text>
        <Button onPress={() => router.back()}>Retour</Button>
      </View>
    );
  }

  const isFav = favoriteIds.includes(part.id);
  const totalPrice = part.price * quantity;
  const discountPct = part.oldPrice ? Math.round((1 - part.price / part.oldPrice) * 100) : 0;

  return (
    <View style={styles.container}>
      <TopHeader title="Détail pièce" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero image */}
        <View style={styles.heroBox}>
          {getPartImage(part.name) ? (
            <Image
              source={getPartImage(part.name)}
              style={styles.heroRealImage}
              resizeMode="contain"
            />
          ) : (
            <Svg viewBox="0 0 100 100" width={120} height={120}>
              <G stroke="white" strokeWidth="2" fill="none" strokeLinecap="round">
                <Circle cx="50" cy="50" r="26" />
                <Circle cx="50" cy="50" r="16" />
                <Circle cx="50" cy="50" r="6" fill="white" />
                <Path d="M50 24 L50 18 M50 82 L50 76 M24 50 L18 50 M82 50 L76 50" strokeWidth="3" />
              </G>
            </Svg>
          )}

          {part.isPromo && part.oldPrice && (
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>-{discountPct}%</Text>
            </View>
          )}

          <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavorite(part.id)} activeOpacity={0.7}>
            <Icon name={isFav ? 'heart' : 'heart-outline'} size={22} color={isFav ? '#ef4444' : '#94a3b8'} />
          </TouchableOpacity>
        </View>

        {/* Main Card */}
        <View style={styles.mainCard}>
          {/* Reference + Brand */}
          <Text style={styles.refText}>
            {part.brand.toUpperCase()} · RÉF {part.ref || `AP-${part.id.toUpperCase()}`}
          </Text>

          <Text style={styles.partName}>{part.name}</Text>

          {/* Rating + Stock */}
          <View style={styles.ratingRow}>
            <Icon name="star" size={16} color="#f59e0b" />
            <Text style={styles.ratingNum}>{part.rating}</Text>
            <Text style={styles.ratingDot}>·</Text>
            <Text style={styles.ratingAvis}>{part.reviews} avis</Text>
            <Text style={styles.ratingDot}>·</Text>
            <View style={[styles.stockChip, { backgroundColor: part.inStock ? '#d1fae5' : '#fee2e2' }]}>
              <Text style={[styles.stockText, { color: part.inStock ? '#059669' : '#dc2626' }]}>
                {part.inStock ? 'En stock' : 'Rupture'}
              </Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.priceMain}>{formatPrice(part.price)}</Text>
            {part.oldPrice && (
              <Text style={styles.priceOld}>{formatPrice(part.oldPrice)}</Text>
            )}
          </View>

          {/* Trust Features */}
          <View style={styles.trustGrid}>
            {[
              { icon: 'shield-check', label: `Garantie ${part.warranty || '3 mois'}`, color: '#6366f1' },
              { icon: 'lightning-bolt', label: 'Livraison 24h', color: '#f59e0b' },
              { icon: 'map-marker', label: part.supplierName || 'Auto Pièces Auto', color: '#10b981' },
            ].map((t) => (
              <View key={t.label} style={styles.trustItem}>
                <Icon name={t.icon} size={22} color={t.color} />
                <Text style={styles.trustText}>{t.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Compatibilité */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compatibilité véhicules</Text>
          <View style={styles.compatWrap}>
            {(part.compatibleModels || []).map((m) => (
              <View key={m} style={styles.compatChip}>
                <Text style={styles.compatText}>{m}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descText}>
            Pièce {part.name.toLowerCase()} de qualité premium compatible avec les véhicules {part.brand} sélectionnés.
            Testée et certifiée par nos experts. Installation recommandée par un professionnel agréé.
          </Text>
        </View>

        {/* Infos grille */}
        <View style={styles.section}>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Référence</Text>
              <Text style={styles.infoValue}>{part.ref || `AP-${part.id.toUpperCase()}`}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Stock disponible</Text>
              <Text style={styles.infoValue}>{part.inStock ? '30+ unités' : '0 unité'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Catégorie</Text>
              <Text style={styles.infoValue}>{CATEGORIES.find(c => c.id === part.category)?.name || '-'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Marque</Text>
              <Text style={styles.infoValue}>{part.brand}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer CTA with quantity */}
      <View style={styles.footer}>
        <View style={styles.footerTopRow}>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              activeOpacity={0.7}
            >
              <Icon name="minus" size={16} color="#64748b" />
            </TouchableOpacity>
            <Text style={styles.qtyNum}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(quantity + 1)}
              activeOpacity={0.7}
            >
              <Icon name="plus" size={16} color="#64748b" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.85}
            onPress={() => {
              addToCart(part, quantity);
              router.push('/cart');
            }}
          >
            <Text style={styles.addBtnText}>Ajouter au panier</Text>
          </TouchableOpacity>
        </View>

        {/* WhatsApp Order Button */}
        <TouchableOpacity
          style={styles.waBtn}
          activeOpacity={0.85}
          onPress={() => {
            const priceStr = formatPrice(totalPrice);
            const msg = `Bonjour VizuParts, je veux ${part.name} (x${quantity}) \u00e0 ${priceStr}`;
            Linking.openURL(`https://wa.me/237696567184?text=${encodeURIComponent(msg)}`);
          }}
        >
          <Icon name="whatsapp" size={18} color="#fff" />
          <Text style={styles.waBtnText}>Commander sur WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { paddingBottom: 20 },

  heroBox: {
    height: 240,
    backgroundColor: '#ea580c',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  heroRealImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8fafc',
  },
  heroBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#ef4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroBadgeText: { color: '#fff', fontFamily: 'Inter-Bold', fontSize: 13 },
  favBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },

  mainCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  refText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#6366f1',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  partName: {
    fontSize: 22,
    fontFamily: 'Inter-ExtraBold',
    color: '#0f172a',
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingNum: { fontFamily: 'Inter-Bold', fontSize: 14, color: '#0f172a', marginLeft: 4 },
  ratingDot: { color: '#94a3b8', marginHorizontal: 6 },
  ratingAvis: { fontFamily: 'Inter-Regular', fontSize: 13, color: '#64748b' },
  stockChip: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  stockText: { fontFamily: 'Inter-SemiBold', fontSize: 11 },

  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20 },
  priceMain: { fontSize: 30, fontFamily: 'Inter-Black', color: '#0f172a' },
  priceOld: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    marginLeft: 10,
    marginBottom: 4,
  },

  trustGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  trustItem: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  trustText: { fontSize: 10, fontFamily: 'Inter-SemiBold', color: '#334155', marginTop: 6, textAlign: 'center' },

  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  sectionTitle: { fontSize: 15, fontFamily: 'Inter-Bold', color: '#0f172a', marginBottom: 12 },
  compatWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  compatChip: {
    backgroundColor: '#ede9fe',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  compatText: { fontFamily: 'Inter-Medium', fontSize: 13, color: '#4f46e5' },
  descText: { fontFamily: 'Inter-Regular', fontSize: 14, color: '#475569', lineHeight: 22 },

  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 0,
  },
  infoItem: {
    width: '50%',
    paddingVertical: 8,
    paddingRight: 8,
  },
  infoLabel: { fontFamily: 'Inter-Regular', fontSize: 12, color: '#94a3b8', marginBottom: 2 },
  infoValue: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: '#0f172a' },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 12,
    paddingBottom: 7,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
  },
  footerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 4,
    backgroundColor: '#f8fafc',
  },
  qtyBtn: { padding: 8 },
  qtyNum: { fontFamily: 'Inter-Bold', fontSize: 16, color: '#0f172a', minWidth: 28, textAlign: 'center' },
  addBtn: {
    flex: 1,
    backgroundColor: '#6366f1',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { fontFamily: 'Inter-Bold', fontSize: 15, color: '#fff' },
  waBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    borderRadius: 14,
    paddingVertical: 12,
    gap: 8,
  },
  waBtnText: {
    color: '#fff',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
});
