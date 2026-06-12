import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme, Button, IconButton, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCartStore } from '@autoparts/hooks';
import { formatPrice } from '@autoparts/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { G, Circle, Path } from 'react-native-svg';
import { TopHeader } from '../../src/components/TopHeader';

export default function CartScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, clearCart } = useCartStore();

  // Calcul réactif — NE PAS utiliser cartTotal (getter Zustand non réactif)
  const subtotal = items.reduce((acc, item) => acc + item.part.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: '#f8fafc' }]}>
        <TopHeader title="Mon panier" />
        <View style={styles.emptyContent}>
          <Icon name="cart-outline" size={64} color="#94a3b8" />
          <Text style={styles.emptyTitle}>Votre panier est vide</Text>
          <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 8, fontFamily: 'Inter-Regular' }}>
            Recherchez des pièces et ajoutez-les à votre panier pour procéder à la commande.
          </Text>
          <Button mode="contained" onPress={() => router.push('/search')} style={styles.emptyBtn} labelStyle={{ fontFamily: 'Inter-Bold' }}>
            Découvrir le catalogue
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#f8fafc' }]}>
      <TopHeader title="Mon panier" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.listHeader}>
          <Text style={styles.articlesCount}>{items.length} {items.length > 1 ? 'articles' : 'article'}</Text>
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearText}>Vider</Text>
          </TouchableOpacity>
        </View>

        {items.map((item) => (
          <View key={item.part.id} style={styles.cartItem}>
            <View style={[styles.itemImage, { backgroundColor: '#ea580c' }]}>
              <Svg viewBox="0 0 100 100" width={48} height={48}>
                <G stroke="white" strokeWidth="2" fill="none" strokeLinecap="round">
                  <Circle cx="50" cy="50" r="26" />
                  <Circle cx="50" cy="50" r="16" />
                  <Circle cx="50" cy="50" r="6" fill="white" />
                  <Path d="M50 24 L50 18 M50 82 L50 76 M24 50 L18 50 M82 50 L76 50" strokeWidth="3" />
                </G>
              </Svg>
            </View>
            <View style={styles.itemInfo}>
              <View style={styles.itemTitleRow}>
                <Text style={styles.itemTitle} numberOfLines={2}>{item.part.name}</Text>
                <TouchableOpacity onPress={() => removeFromCart(item.part.id)} style={styles.removeIconBtn}>
                  <Icon name="close" size={16} color="#94a3b8" />
                </TouchableOpacity>
              </View>
              <Text style={styles.itemSubtitle}>{item.part.brand} • Réf AP-{item.part.id.toUpperCase()}</Text>

              <View style={styles.itemBottomRow}>
                <View style={styles.qtyControlBox}>
                  <TouchableOpacity onPress={() => updateQuantity(item.part.id, Math.max(1, item.quantity - 1))} style={styles.qtyBtn}>
                    <Icon name="minus" size={14} color="#64748b" />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item.part.id, item.quantity + 1)} style={styles.qtyBtn}>
                    <Icon name="plus" size={14} color="#64748b" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemPrice}>
                  {formatPrice(item.part.price * item.quantity)}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Récapitulatif</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total</Text>
            <Text style={[styles.summaryValue, { fontFamily: 'Inter-Bold' }]}>{formatPrice(subtotal)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Frais de service</Text>
            <Text style={[styles.summaryValue, { color: '#10b981' }]}>Gratuit</Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>{formatPrice(subtotal)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={() => router.push('/checkout')}
          style={styles.checkoutBtn}
          contentStyle={styles.checkoutBtnContent}
          labelStyle={styles.checkoutBtnLabel}
          buttonColor="#6366f1"
        >
          Passer à la réservation  →
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: { flex: 1 },
  container: { flex: 1 },
  emptyContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyTitle: { fontSize: 20, fontFamily: 'Inter-Bold', marginTop: 16, color: '#0f172a' },
  emptyBtn: { marginTop: 24, backgroundColor: '#6366f1', borderRadius: 12 },

  scrollContent: { padding: 16, paddingBottom: 120 },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  articlesCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  clearText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ef4444',
  },

  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#0f172a',
    flex: 1,
    marginRight: 8,
  },
  removeIconBtn: {
    padding: 4,
    marginTop: -4,
    marginRight: -4,
  },
  itemSubtitle: {
    color: '#64748b',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  qtyControlBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    backgroundColor: '#fff',
  },
  qtyBtn: {
    padding: 6,
  },
  qtyText: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    color: '#0f172a',
    minWidth: 24,
    textAlign: 'center',
  },
  itemPrice: {
    fontFamily: 'Inter-Black',
    fontSize: 14,
    color: '#4f46e5',
  },

  summaryBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
  },
  summaryTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: '#0f172a',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#0f172a',
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#f1f5f9',
  },
  summaryTotalLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#0f172a',
  },
  summaryTotalValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#4f46e5',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#f8fafc',
  },
  checkoutBtn: {
    borderRadius: 12,
  },
  checkoutBtnContent: {
    height: 54,
  },
  checkoutBtnLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
});

