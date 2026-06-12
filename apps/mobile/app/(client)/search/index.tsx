import { useState, useMemo, useEffect } from 'react';
import { View, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, TextInput, useTheme, Button, IconButton, Modal, Portal, Menu } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore, useCartStore, useFavoritesStore, usePartSearch } from '@autoparts/hooks';
import { PARTS, CATEGORIES, BRANDS, formatPrice } from '@autoparts/models';
import type { PartFilters, Brand } from '@autoparts/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PartCard } from '../../../src/components/PartCard';
import { TopHeader } from '../../../src/components/TopHeader';

export default function SearchScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { addToCart, items: cartItems } = useCartStore();
  const { favoriteIds, toggleFavorite } = useFavoritesStore();

  const [query, setQuery] = useState('');
  const [activeCats, setActiveCats] = useState<string[]>([]);
  const [activeBrands, setActiveBrands] = useState<Brand[]>([]);
  const [priceMax, setPriceMax] = useState(90000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [sortOption, setSortOption] = useState<'pop' | 'price-asc' | 'price-desc' | 'rating'>('pop');
  const [limit, setLimit] = useState(24);

  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const sortLabels = {
    'pop': 'Pertinence',
    'price-asc': 'Prix ↑',
    'price-desc': 'Prix ↓',
    'rating': 'Mieux notés'
  };

  const filters: PartFilters = useMemo(() => ({
    query,
    categories: activeCats,
    brands: activeBrands,
    priceMax,
    inStockOnly,
    sort: sortOption,
  }), [query, activeCats, activeBrands, priceMax, inStockOnly, sortOption]);

  const filteredParts = usePartSearch(PARTS, filters);

  const visibleParts = useMemo(() => {
    return filteredParts.slice(0, limit);
  }, [filteredParts, limit]);

  useEffect(() => {
    setLimit(24);
  }, [query, activeCats, activeBrands, priceMax, inStockOnly, sortOption]);

  const toggleCat = (id: string) => {
    setActiveCats((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  };

  const toggleBrand = (b: Brand) => {
    setActiveBrands((prev) => prev.includes(b) ? prev.filter((br) => br !== b) : [...prev, b]);
  };

  const clearFilters = () => {
    setActiveCats([]);
    setActiveBrands([]);
    setPriceMax(90000);
    setInStockOnly(false);
  };

  // Custom Chip Component to match the design
  const CustomChip = ({ label, icon, selected, onPress }: { label: string, icon?: string, selected: boolean, onPress: () => void }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.customChip,
        selected ? styles.customChipSelected : {}
      ]}
    >
      {icon && <Text style={styles.chipIcon}>{icon}</Text>}
      <Text style={[styles.chipText, selected ? styles.chipTextSelected : {}]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopHeader title="Catalogue" subtitle="5 000+ pièces disponibles" />

      {/* Search Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={24} color={theme.colors.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput
            placeholder="Plaquette de frein Toyota, filtre à huile..."
            value={query}
            onChangeText={setQuery}
            style={[styles.searchInputRaw, { fontFamily: 'Inter-Regular' }]}
            placeholderTextColor={theme.colors.onSurfaceVariant}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            theme={{ colors: { primary: 'transparent' } }}
          />
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setShowFilters(true)}
          >
            <Icon name="tune-variant" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 13, fontFamily: 'Inter-Regular', flex: 1 }}>
          <Text style={{ fontWeight: 'bold', color: theme.colors.onSurface, fontFamily: 'Inter-Bold' }}>
            {filteredParts.length}
          </Text> résultats <Text style={{ color: '#d97706', fontFamily: 'Inter-Regular' }}>(affichage des {Math.min(limit, filteredParts.length)} premiers)</Text>
        </Text>

        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={
            <TouchableOpacity
              style={styles.sortButton}
              onPress={() => setSortMenuVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.sortButtonText}>{sortLabels[sortOption]}</Text>
              <Icon name="chevron-down" size={16} color={theme.colors.onSurface} />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => { setSortOption('pop'); setSortMenuVisible(false); }} title="Pertinence" titleStyle={{ fontFamily: 'Inter-Regular' }} />
          <Menu.Item onPress={() => { setSortOption('price-asc'); setSortMenuVisible(false); }} title="Prix ↑" titleStyle={{ fontFamily: 'Inter-Regular' }} />
          <Menu.Item onPress={() => { setSortOption('price-desc'); setSortMenuVisible(false); }} title="Prix ↓" titleStyle={{ fontFamily: 'Inter-Regular' }} />
          <Menu.Item onPress={() => { setSortOption('rating'); setSortMenuVisible(false); }} title="Mieux notés" titleStyle={{ fontFamily: 'Inter-Regular' }} />
        </Menu>
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
              fullWidth
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

      {/* Bottom Sheet Filter Modal */}
      <Portal>
        <Modal
          visible={showFilters}
          onDismiss={() => setShowFilters(false)}
          contentContainerStyle={styles.modalContent}
          style={styles.modal}
        >
          {/* Dragger Handle */}
          <View style={styles.draggerHandle} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Categories */}
            <Text style={styles.sectionTitle}>Catégorie</Text>
            <View style={styles.chipWrap}>
              {CATEGORIES.map((c) => (
                <CustomChip
                  key={c.id}
                  label={c.name}
                  icon={c.icon}
                  selected={activeCats.includes(c.id)}
                  onPress={() => toggleCat(c.id)}
                />
              ))}
            </View>

            {/* Brands */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Marque véhicule</Text>
            <View style={styles.chipWrap}>
              {BRANDS.map((b) => (
                <CustomChip
                  key={b}
                  label={b}
                  selected={activeBrands.includes(b)}
                  onPress={() => toggleBrand(b)}
                />
              ))}
            </View>

            {/* Price Max */}
            <View style={styles.priceHeader}>
              <Text style={styles.sectionTitle}>Prix max : </Text>
              <Text style={styles.priceValue}>{formatPrice(priceMax)}</Text>
            </View>

            <View style={styles.sliderContainer}>
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: '80%' }]} />
              </View>
              <View style={[styles.sliderThumb, { left: '80%' }]} />
            </View>

            {/* In Stock Checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              activeOpacity={0.7}
              onPress={() => setInStockOnly(!inStockOnly)}
            >
              <View style={[styles.checkbox, inStockOnly && styles.checkboxChecked]}>
                {inStockOnly && <Icon name="check" size={16} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>En stock uniquement</Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              style={styles.applyButton}
              contentStyle={styles.applyButtonContent}
              labelStyle={styles.applyButtonText}
              onPress={() => setShowFilters(false)}
            >
              Appliquer
            </Button>

            {(activeCats.length > 0 || activeBrands.length > 0 || inStockOnly || priceMax !== 90000) && (
              <Button
                mode="text"
                onPress={clearFilters}
                textColor={theme.colors.error}
                style={{ marginTop: 8, marginBottom: 24 }}
              >
                Réinitialiser les filtres
              </Button>
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 16,
    paddingTop: 16,
    paddingBottom: 12,
    elevation: 4,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInputRaw: {
    flex: 1,
    height: 40,
    backgroundColor: 'transparent',
    fontSize: 14,
  },
  filterBtn: {
    backgroundColor: '#6366f1',
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#fff',
  },
  sortButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    marginRight: 4,
    color: '#000',
  },
  resultsContainer: { padding: 8, paddingBottom: 100 },
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
  /* MODAL STYLES */
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  draggerHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  customChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 4,
  },
  customChipSelected: {
    backgroundColor: '#e0e7ff',
    borderColor: '#6366f1',
    borderWidth: 1,
    paddingHorizontal: 13, // adjust for border
    paddingVertical: 7,
  },
  chipIcon: {
    marginRight: 6,
    fontSize: 14,
  },
  chipText: {
    fontSize: 13,
    color: '#334155',
    fontFamily: 'Inter-Medium',
  },
  chipTextSelected: {
    color: '#4f46e5',
    fontFamily: 'Inter-SemiBold',
  },
  priceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  priceValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#4f46e5',
    marginBottom: 12,
  },
  sliderContainer: {
    height: 30,
    justifyContent: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#6366f1',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    top: 5,
    transform: [{ translateX: -10 }],
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  checkboxLabel: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  applyButton: {
    borderRadius: 16,
    backgroundColor: '#6366f1',
    marginTop: 8,
  },
  applyButtonContent: {
    height: 54,
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});

