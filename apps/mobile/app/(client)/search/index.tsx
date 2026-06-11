import { useState, useMemo, useEffect } from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Text, TextInput, useTheme, Button, IconButton, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore, useCartStore, useFavoritesStore, usePartSearch } from '@autoparts/hooks';
import { PARTS, CATEGORIES, BRANDS, formatPrice } from '@autoparts/models';
import type { PartFilters, Brand } from '@autoparts/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PartCard } from '../../../src/components/PartCard';

export default function SearchScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { favoriteIds, toggleFavorite } = useFavoritesStore();

  const [query, setQuery] = useState('');
  const [activeCats, setActiveCats] = useState<string[]>([]);
  const [activeBrands, setActiveBrands] = useState<Brand[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [limit, setLimit] = useState(24);

  const filters: PartFilters = useMemo(() => ({
    query,
    categories: activeCats,
    brands: activeBrands,
  }), [query, activeCats, activeBrands]);

  const filteredParts = usePartSearch(PARTS, filters);

  const visibleParts = useMemo(() => {
    return filteredParts.slice(0, limit);
  }, [filteredParts, limit]);

  useEffect(() => {
    setLimit(24);
  }, [query, activeCats, activeBrands]);

  const toggleCat = (id: string) => {
    setActiveCats((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  };

  const toggleBrand = (b: Brand) => {
    setActiveBrands((prev) => prev.includes(b) ? prev.filter((br) => br !== b) : [...prev, b]);
  };

  const clearFilters = () => {
    setActiveCats([]);
    setActiveBrands([]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TextInput
          mode="outlined"
          placeholder="Rechercher une pièce..."
          value={query}
          onChangeText={setQuery}
          left={<TextInput.Icon icon="magnify" />}
          right={
            query ? (
              <TextInput.Icon icon="close" onPress={() => setQuery('')} />
            ) : null
          }
          style={styles.searchInput}
        />
        <IconButton
          icon="tune-vertical"
          mode={showFilters ? "contained" : "outlined"}
          onPress={() => setShowFilters(!showFilters)}
          style={styles.filterButton}
        />
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={[styles.filtersPanel, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.filterHeader}>
            <Text style={{ fontWeight: 'bold' }}>Filtres</Text>
            {(activeCats.length > 0 || activeBrands.length > 0) && (
              <Button compact onPress={clearFilters} textColor={theme.colors.error}>
                Réinitialiser
              </Button>
            )}
          </View>
          
          <Text style={styles.filterTitle}>Catégories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {CATEGORIES.map((c) => (
              <Chip
                key={c.id}
                selected={activeCats.includes(c.id)}
                onPress={() => toggleCat(c.id)}
                style={styles.chip}
                showSelectedOverlay
              >
                {c.name}
              </Chip>
            ))}
          </ScrollView>

          <Text style={styles.filterTitle}>Marques</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {BRANDS.map((b) => (
              <Chip
                key={b}
                selected={activeBrands.includes(b)}
                onPress={() => toggleBrand(b)}
                style={styles.chip}
                showSelectedOverlay
              >
                {b}
              </Chip>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>
          <Text style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
            {filteredParts.length}
          </Text> résultats
        </Text>
      </View>

      {/* Results List */}
      <FlatList
        data={visibleParts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <PartCard
              part={item}
              onPress={() => router.push(`/part/${item.id}`)}
              isFav={favoriteIds.includes(item.id)}
              onFav={() => toggleFavorite(item.id)}
              onAdd={() => addToCart(item, 1)}
            />
          </View>
        )}
        onEndReached={() => {
          if (limit < filteredParts.length) {
            setLimit((prev) => prev + 24);
          }
        }}
        onEndReachedThreshold={0.4}
        contentContainerStyle={styles.resultsContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="magnify-close" size={48} color={theme.colors.onSurfaceVariant} />
            <Text style={styles.emptyText}>Aucun résultat trouvé</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 60,
    alignItems: 'center',
    elevation: 4,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  searchInput: { flex: 1, height: 44, backgroundColor: 'transparent' },
  filterButton: { marginLeft: 8, marginTop: 6 },
  filtersPanel: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  chipScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  chip: { marginRight: 8 },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsContainer: { padding: 8, paddingBottom: 40 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 4,
  },
  gridItem: {
    width: '50%',
    padding: 4,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
