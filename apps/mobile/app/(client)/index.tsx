import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme, Button, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore, useCartStore, useFavoritesStore } from '@autoparts/hooks';
import { CATEGORIES, VEHICLES, PARTS } from '@autoparts/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PartCard } from '../../src/components/PartCard';

const FEATURED_PARTS = PARTS.filter((p) => p.isNew).slice(0, 8);
const POPULAR_PARTS = PARTS.filter((p) => p.rating >= 4.5).slice(0, 8);

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();
  const { favoriteIds, toggleFavorite } = useFavoritesStore();

  const myVehicle = VEHICLES[0];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.headerTop}>
          <View style={styles.locationRow}>
            <Icon name="map-marker" size={16} color="#fff" />
            <Text style={styles.locationText}>Abidjan, Côte d'Ivoire</Text>
          </View>
          <IconButton 
            icon="bell-outline" 
            iconColor="#fff" 
            size={24} 
            style={{ margin: 0 }} 
            onPress={() => router.push('/notifications')} 
          />
        </View>
        <Text style={styles.greeting}>Bonjour {user?.name?.split(' ')[0] || 'Visiteur'} 👋</Text>
        <Text style={styles.subtitle}>Trouvez votre pièce en moins de 30 secondes</Text>

        <Button
          mode="contained"
          buttonColor="rgba(255,255,255,0.2)"
          textColor="#fff"
          icon="magnify"
          style={styles.searchButton}
          contentStyle={{ justifyContent: 'flex-start' }}
          onPress={() => router.push('/search')}
        >
          Rechercher une pièce, marque...
        </Button>
      </View>

      {/* Vehicle Card */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Mon véhicule</Text>
            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>Pièces compatibles à portée de main</Text>
          </View>
          <Button compact labelStyle={{ fontSize: 12 }}>Gérer</Button>
        </View>

        <View style={[styles.vehicleCard, { backgroundColor: theme.colors.elevation.level2 }]}>
          <View style={[styles.vehicleIcon, { backgroundColor: theme.colors.primary }]}>
            <Icon name="car-wrench" size={24} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{myVehicle.brand} {myVehicle.model}</Text>
            <Text style={{ fontSize: 12, color: theme.colors.onSurfaceVariant }}>
              {myVehicle.year} • {myVehicle.plate} • {myVehicle.color}
            </Text>
          </View>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Catégories</Text>
          <Button compact labelStyle={{ fontSize: 12 }} onPress={() => router.push('/search')}>Tout voir</Button>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {CATEGORIES.slice(0, 8).map((c) => (
            <View key={c.id} style={styles.categoryItem}>
              <View style={[styles.categoryIconBox, { backgroundColor: theme.colors.elevation.level2 }]}>
                {/* Fallback to simple icon since we don't have lucide-react here */}
                <Icon name="car-cog" size={24} color={theme.colors.primary} />
              </View>
              <Text style={styles.categoryName} numberOfLines={1}>{c.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Featured Parts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nouveautés</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {FEATURED_PARTS.map((p) => (
            <PartCard
              key={p.id}
              part={p}
              onPress={() => {}}
              isFav={favoriteIds.includes(p.id)}
              onFav={() => toggleFavorite(p.id)}
              onAdd={() => addToCart(p, 1)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Popular Parts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tendances</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {POPULAR_PARTS.map((p) => (
            <PartCard
              key={p.id}
              part={p}
              onPress={() => {}}
              isFav={favoriteIds.includes(p.id)}
              onFav={() => toggleFavorite(p.id)}
              onAdd={() => addToCart(p, 1)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  greeting: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  searchButton: {
    marginTop: 20,
    borderRadius: 12,
  },
  section: {
    padding: 20,
    paddingBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  vehicleCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  horizontalScroll: {
    overflow: 'visible',
  },
  categoryItem: {
    width: 70,
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 11,
    textAlign: 'center',
  },
});
