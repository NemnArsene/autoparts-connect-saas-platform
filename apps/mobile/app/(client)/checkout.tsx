import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCartStore, useAuthStore, useCheckout } from '@autoparts/hooks';
import { formatPrice } from '@autoparts/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { TopHeader } from '../../src/components/TopHeader';

const PAYMENT_METHODS = [
  { key: 'mobile_money', label: 'Mobile Money', sub: 'Orange, MTN, Moov, Wave', icon: 'cellphone' },
  { key: 'card', label: 'Carte bancaire', sub: 'Visa, Mastercard', icon: 'credit-card-outline' },
  { key: 'cash', label: 'Paiement à la livraison', sub: 'Espèces à la réception', icon: 'cash' },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { items } = useCartStore();
  const { user } = useAuthStore();
  const { processCheckout, loading } = useCheckout();

  const [paymentMethod, setPaymentMethod] = useState('mobile_money');

  // Calcul réactif du total
  const total = items.reduce((acc, item) => acc + item.part.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!user) return;
    const success = await processCheckout(user, new Date(Date.now() + 86400000 * 2).toISOString());
    if (success) {
      router.replace('/reservations');
    }
  };

  return (
    <View style={styles.container}>
      <TopHeader title="Finaliser" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Récapitulatif ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Récapitulatif</Text>

          {items.map((item) => (
            <View key={item.part.id} style={styles.summaryRow}>
              <Text style={styles.summaryItemName} numberOfLines={1}>
                {item.part.name} × {item.quantity}
              </Text>
              <Text style={styles.summaryItemPrice}>
                {formatPrice(item.part.price * item.quantity)}
              </Text>
            </View>
          ))}

          <Divider style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </View>

        {/* ── Mode de paiement ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mode de paiement</Text>

          {PAYMENT_METHODS.map((method, idx) => {
            const isSelected = paymentMethod === method.key;
            return (
              <TouchableOpacity
                key={method.key}
                style={[
                  styles.paymentOption,
                  isSelected && styles.paymentOptionActive,
                  idx < PAYMENT_METHODS.length - 1 && { marginBottom: 10 },
                ]}
                activeOpacity={0.7}
                onPress={() => setPaymentMethod(method.key)}
              >
                {/* Icon Box */}
                <View style={[styles.payIconBox, isSelected && styles.payIconBoxActive]}>
                  <Icon name={method.icon} size={20} color={isSelected ? '#fff' : '#64748b'} />
                </View>

                {/* Labels */}
                <View style={styles.payLabels}>
                  <Text style={[styles.payLabel, isSelected && styles.payLabelActive]}>
                    {method.label}
                  </Text>
                  <Text style={styles.paySub}>{method.sub}</Text>
                </View>

                {/* Radio */}
                <View style={[styles.radio, isSelected && styles.radioActive]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Informations de contact ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informations de contact</Text>

          <View style={styles.contactRow}>
            <Icon name="account-outline" size={20} color="#94a3b8" style={styles.contactIcon} />
            <Text style={styles.contactText}>{user?.name || 'Nom non renseigné'}</Text>
          </View>

          <View style={styles.contactRow}>
            <Icon name="phone-outline" size={20} color="#94a3b8" style={styles.contactIcon} />
            <Text style={styles.contactText}>{user?.phone || '+237 60 00 00 00 00'}</Text>
          </View>

          <View style={styles.contactRow}>
            <Icon name="email-outline" size={20} color="#94a3b8" style={styles.contactIcon} />
            <Text style={styles.contactText}>{user?.email || 'email@autoparts.cm'}</Text>
          </View>

          <View style={styles.contactRow}>
            <Icon name="map-marker-outline" size={20} color="#94a3b8" style={styles.contactIcon} />
            <Text style={styles.contactText}>{user?.city || 'Douala, Cameroun'}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Footer : bouton de confirmation ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmBtn, loading && styles.confirmBtnDisabled]}
          activeOpacity={0.85}
          onPress={handleCheckout}
          disabled={loading}
        >
          <Text style={styles.confirmBtnText}>
            {loading
              ? 'Traitement en cours...'
              : `Confirmer la réservation · ${formatPrice(total)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 40 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: '#0f172a',
    marginBottom: 16,
  },

  /* Récapitulatif */
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryItemName: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#475569',
    flex: 1,
    marginRight: 12,
  },
  summaryItemPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    color: '#0f172a',
  },
  divider: { backgroundColor: '#f1f5f9', marginVertical: 12 },
  totalLabel: {
    fontFamily: 'Inter-Black',
    fontSize: 16,
    color: '#0f172a',
  },
  totalValue: {
    fontFamily: 'Inter-Black',
    fontSize: 18,
    color: '#4f46e5',
  },

  /* Paiement */
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  paymentOptionActive: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  payIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  payIconBoxActive: {
    backgroundColor: '#6366f1',
  },
  payLabels: { flex: 1 },
  payLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#0f172a',
  },
  payLabelActive: { color: '#4f46e5' },
  paySub: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: '#6366f1' },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366f1',
  },

  /* Contact */
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  contactIcon: { marginRight: 14 },
  contactText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#334155',
  },

  /* Footer */
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#f8fafc',
  },
  confirmBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
  },
  confirmBtnDisabled: {
    backgroundColor: '#a5b4fc',
  },
  confirmBtnText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#fff',
  },
});
