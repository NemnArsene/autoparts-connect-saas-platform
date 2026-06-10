import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme, Chip, IconButton } from 'react-native-paper';
import { useReservationsStore } from '@autoparts/hooks';
import { formatPrice } from '@autoparts/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

export default function ReservationsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { myReservations } = useReservationsStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', text: '#d97706' };
      case 'confirmed': return { bg: '#d1fae5', text: '#059669' };
      case 'ready': return { bg: '#dbeafe', text: '#2563eb' };
      case 'completed': return { bg: '#e0e7ff', text: '#4f46e5' };
      case 'cancelled': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#f3f4f6', text: '#4b5563' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'ready': return 'Prêt au retrait';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  if (myReservations.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <Icon name="clipboard-text-outline" size={64} color={theme.colors.onSurfaceVariant} />
        <Text style={styles.emptyTitle}>Aucune réservation</Text>
        <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
          Vous n'avez pas encore réservé de pièces.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={styles.headerTitle}>Mes Réservations</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {myReservations.map((res) => {
          const statusColors = getStatusColor(res.status);
          
          return (
            <View key={res.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.reference}>{res.reference}</Text>
                <Chip
                  compact
                  style={{ backgroundColor: statusColors.bg }}
                  textStyle={{ color: statusColors.text, fontSize: 10, fontWeight: 'bold' }}
                >
                  {getStatusLabel(res.status)}
                </Chip>
              </View>

              <View style={styles.cardBody}>
                <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.elevation.level2 }]}>
                  <Icon name="car-part" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.partInfo}>
                  <Text style={styles.partName} numberOfLines={2}>{res.partName}</Text>
                  <Text style={{ fontSize: 12, color: theme.colors.onSurfaceVariant }}>
                    Qté: {res.quantity} • {res.supplierName}
                  </Text>
                </View>
                <Text style={styles.price}>{formatPrice(res.totalPrice)}</Text>
              </View>

              <View style={[styles.cardFooter, { borderTopColor: theme.colors.outline }]}>
                <View style={styles.dateRow}>
                  <Icon name="calendar-clock" size={16} color={theme.colors.onSurfaceVariant} />
                  <Text style={{ fontSize: 12, color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                    Retrait prévu : {new Date(res.pickupDate).toLocaleDateString('fr-FR')}
                  </Text>
                </View>
                <IconButton
                  icon="chevron-right"
                  size={20}
                  onPress={() => {}}
                  style={{ margin: 0 }}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 16 },
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  content: { padding: 16, paddingBottom: 40 },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  reference: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  cardBody: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  partInfo: { flex: 1 },
  partName: { fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  price: { fontWeight: '900', fontSize: 16 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
});
