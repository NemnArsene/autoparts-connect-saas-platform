import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme, Button, IconButton, Chip } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCartStore, useFavoritesStore } from '@autoparts/hooks';
import { PARTS, CATEGORIES, formatPrice } from '@autoparts/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PartDetailScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const theme = useTheme();
  const router = useRouter();
  
  const { addToCart } = useCartStore();
  const { favoriteIds, toggleFavorite } = useFavoritesStore();

  const part = PARTS.find((p) => p.id === id);

  if (!part) {
    return (
      <View style={styles.errorContainer}>
        <Text>Pièce introuvable</Text>
        <Button onPress={() => router.back()}>Retour</Button>
      </View>
    );
  }

  const isFav = favoriteIds.includes(part.id);
  const cat = CATEGORIES.find((c) => c.id === part.category);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header Image Area */}
        <View style={[styles.imageArea, { backgroundColor: theme.colors.elevation.level2 }]}>
          <IconButton
            icon="arrow-left"
            size={24}
            style={styles.backButton}
            onPress={() => router.back()}
          />
          <IconButton
            icon={isFav ? "heart" : "heart-outline"}
            iconColor={isFav ? theme.colors.error : theme.colors.onSurface}
            size={24}
            style={styles.favButton}
            onPress={() => toggleFavorite(part.id)}
          />
          
          <Icon name="car" size={100} color={theme.colors.primary} />
          
          {part.isPromo && part.oldPrice && (
            <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
              <Text style={styles.badgeText}>-{Math.round((1 - part.price / part.oldPrice) * 100)}%</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.brand, { color: theme.colors.onSurfaceVariant }]}>
            {part.brand} • Réf {part.ref}
          </Text>
          <Text style={styles.title}>{part.name}</Text>
          
          <View style={styles.ratingRow}>
            <Icon name="star" size={16} color="#f59e0b" />
            <Text style={{ fontWeight: 'bold', marginLeft: 4 }}>{part.rating}</Text>
            <Text style={{ color: theme.colors.onSurfaceVariant, marginHorizontal: 8 }}>•</Text>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>{part.reviews} avis</Text>
            <Text style={{ color: theme.colors.onSurfaceVariant, marginHorizontal: 8 }}>•</Text>
            <Chip compact style={{ backgroundColor: part.inStock ? '#d1fae5' : '#fee2e2' }}>
              <Text style={{ fontSize: 10, color: part.inStock ? '#065f46' : '#991b1b' }}>
                {part.inStock ? 'En stock' : 'Rupture'}
              </Text>
            </Chip>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(part.price)}</Text>
            {part.oldPrice && (
              <Text style={[styles.oldPrice, { color: theme.colors.onSurfaceVariant }]}>
                {formatPrice(part.oldPrice)}
              </Text>
            )}
          </View>

          {/* Trust Features */}
          <View style={styles.trustGrid}>
            {[
              { icon: 'shield-check', label: `Garantie ${part.warranty}`, color: theme.colors.primary },
              { icon: 'lightning-bolt', label: 'Livraison 24h', color: '#f59e0b' },
              { icon: 'map-marker', label: part.supplierName, color: theme.colors.secondary },
            ].map((t) => (
              <View key={t.label} style={[styles.trustItem, { backgroundColor: theme.colors.elevation.level1 }]}>
                <Icon name={t.icon} size={20} color={t.color} />
                <Text style={styles.trustText}>{t.label}</Text>
              </View>
            ))}
          </View>

          {/* Compatibility */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compatibilité véhicules</Text>
            <View style={styles.compatGrid}>
              {part.compatibleModels.map((m) => (
                <Chip key={m} style={styles.compatChip} textStyle={{ fontSize: 12 }}>
                  {m}
                </Chip>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={{ color: theme.colors.onSurfaceVariant, lineHeight: 20 }}>
              Pièce {part.name.toLowerCase()} de qualité premium compatible avec les véhicules {part.brand} sélectionnés. Testée et certifiée par nos experts. Installation recommandée par un professionnel agréé.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outline }]}>
        <Button
          mode="outlined"
          icon="cart-plus"
          onPress={() => addToCart(part, 1)}
          style={styles.cartBtn}
        >
          Panier
        </Button>
        <Button
          mode="contained"
          onPress={() => {
            addToCart(part, 1);
            router.push('/cart');
          }}
          style={styles.buyBtn}
        >
          Commander
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1 },
  imageArea: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  favButton: {
    position: 'absolute',
    top: 40,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  badge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  brand: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: '900',
  },
  oldPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    marginLeft: 8,
    marginBottom: 4,
  },
  trustGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  trustItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  trustText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  compatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  compatChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
  cartBtn: {
    flex: 1,
    marginRight: 8,
  },
  buyBtn: {
    flex: 1,
    marginLeft: 8,
  },
});
