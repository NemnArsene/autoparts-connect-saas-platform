import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme, Button, IconButton, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCartStore } from '@autoparts/hooks';
import { formatPrice } from '@autoparts/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CartScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, clearCart, cartTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <IconButton icon="close" size={24} onPress={() => router.back()} />
          <Text style={styles.headerTitle}>Mon Panier</Text>
          <View style={{ width: 48 }} />
        </View>
        <View style={styles.emptyContent}>
          <Icon name="cart-outline" size={64} color={theme.colors.onSurfaceVariant} />
          <Text style={styles.emptyTitle}>Votre panier est vide</Text>
          <Text style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 }}>
            Recherchez des pièces et ajoutez-les à votre panier pour procéder à la commande.
          </Text>
          <Button mode="contained" onPress={() => router.push('/search')} style={{ marginTop: 24 }}>
            Découvrir le catalogue
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Mon Panier</Text>
        <IconButton icon="trash-can-outline" iconColor={theme.colors.error} size={24} onPress={clearCart} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {items.map((item) => (
          <View key={item.part.id} style={[styles.cartItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
            <View style={[styles.itemImage, { backgroundColor: theme.colors.elevation.level2 }]}>
              <Icon name="car-part" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.itemInfo}>
              <Text style={{ fontWeight: 'bold' }} numberOfLines={2}>{item.part.name}</Text>
              <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>{item.part.brand}</Text>
              <Text style={{ fontWeight: '900', color: theme.colors.primary, marginTop: 4 }}>
                {formatPrice(item.part.price)}
              </Text>
            </View>
            <View style={styles.qtyControls}>
              <IconButton
                icon="minus"
                size={16}
                mode="contained-tonal"
                onPress={() => updateQuantity(item.part.id, item.quantity - 1)}
              />
              <Text style={{ fontWeight: 'bold' }}>{item.quantity}</Text>
              <IconButton
                icon="plus"
                size={16}
                mode="contained-tonal"
                onPress={() => updateQuantity(item.part.id, item.quantity + 1)}
              />
            </View>
            <IconButton
              icon="close"
              size={16}
              style={styles.removeBtn}
              onPress={() => removeFromCart(item.part.id)}
            />
          </View>
        ))}

        <View style={[styles.summary, { backgroundColor: theme.colors.surface }]}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 16 }}>Résumé</Text>
          <View style={styles.summaryRow}>
            <Text>Sous-total</Text>
            <Text>{formatPrice(cartTotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Livraison</Text>
            <Text>Gratuite</Text>
          </View>
          <Divider style={{ marginVertical: 12 }} />
          <View style={styles.summaryRow}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Total</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: theme.colors.primary }}>
              {formatPrice(cartTotal)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outline }]}>
        <Button mode="contained" onPress={() => router.push('/checkout')} style={styles.checkoutBtn}>
          Passer la commande
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 8,
    elevation: 4,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  emptyContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 16 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: { flex: 1 },
  qtyControls: {
    alignItems: 'center',
  },
  removeBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  summary: {
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
  checkoutBtn: { paddingVertical: 4 },
});
