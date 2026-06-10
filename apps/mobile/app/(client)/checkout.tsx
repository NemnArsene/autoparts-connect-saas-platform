import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Button, IconButton, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCartStore, useAuthStore, useCheckout } from '@autoparts/hooks';
import { formatPrice } from '@autoparts/models';

export default function CheckoutScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { cartTotal } = useCartStore();
  const { user } = useAuthStore();
  const { processCheckout, loading } = useCheckout();

  const handleCheckout = async () => {
    if (!user) return;
    const success = await processCheckout(user, new Date(Date.now() + 86400000 * 2).toISOString());
    if (success) {
      router.replace('/reservations');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Paiement</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={styles.sectionTitle}>Informations de contact</Text>
          <TextInput
            mode="outlined"
            label="Nom complet"
            value={user?.name || ''}
            disabled
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Numéro de téléphone"
            value={user?.phone || ''}
            disabled
            style={styles.input}
          />
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={styles.sectionTitle}>Méthode de retrait</Text>
          <View style={[styles.methodSelected, { borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={{ fontWeight: 'bold', color: theme.colors.onPrimaryContainer }}>Retrait en magasin</Text>
            <Text style={{ fontSize: 12, color: theme.colors.onPrimaryContainer }}>Gratuit • Dans 48h</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={styles.sectionTitle}>Paiement</Text>
          <View style={[styles.methodSelected, { borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={{ fontWeight: 'bold', color: theme.colors.onPrimaryContainer }}>Paiement à la livraison</Text>
            <Text style={{ fontSize: 12, color: theme.colors.onPrimaryContainer }}>Payer en espèces ou mobile money au retrait</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outline }]}>
        <View style={styles.totalRow}>
          <Text style={{ fontWeight: 'bold' }}>Total à payer</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: theme.colors.primary }}>
            {formatPrice(cartTotal)}
          </Text>
        </View>
        <Button
          mode="contained"
          loading={loading}
          disabled={loading}
          onPress={handleCheckout}
          style={styles.confirmBtn}
        >
          Confirmer la commande
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  content: { padding: 16, paddingBottom: 120 },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  methodSelected: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
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
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmBtn: { paddingVertical: 4 },
});
