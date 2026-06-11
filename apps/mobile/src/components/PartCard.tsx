import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatPrice } from '@autoparts/models';
import type { Part } from '@autoparts/models';

interface PartCardProps {
  part: Part;
  onPress: () => void;
  isFav?: boolean;
  onFav?: () => void;
  onAdd?: () => void;
  compact?: boolean;
}

export function PartCard({ part, onPress, isFav, onFav, onAdd, compact }: PartCardProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
        compact && styles.compactCard
      ]}
    >
      <View style={[styles.imageContainer, compact && styles.compactImageContainer]}>
        {/* Placeholder image since we don't have SVG gradients easily in RN without react-native-svg */}
        <View style={[styles.placeholderImage, { backgroundColor: theme.colors.elevation.level2 }]}>
          <Icon name="car" size={compact ? 30 : 40} color={theme.colors.onSurfaceVariant} />
        </View>
        
        {part.isPromo && part.oldPrice && (
          <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
            <Text style={styles.badgeText}>-{Math.round((1 - part.price / part.oldPrice) * 100)}%</Text>
          </View>
        )}
        {part.isNew && !part.isPromo && (
          <View style={[styles.badge, { backgroundColor: '#10b981' }]}>
            <Text style={styles.badgeText}>Nouveau</Text>
          </View>
        )}
        
        {onFav && (
          <IconButton
            icon={isFav ? "heart" : "heart-outline"}
            iconColor={isFav ? theme.colors.error : theme.colors.onSurfaceVariant}
            size={20}
            style={styles.favButton}
            onPress={onFav}
          />
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={[styles.brand, { color: theme.colors.onSurfaceVariant }]}>{part.brand}</Text>
        <Text style={[styles.title, { color: theme.colors.onSurface }]} numberOfLines={2}>
          {part.name}
        </Text>
        
        <View style={styles.ratingRow}>
          <Icon name="star" size={12} color="#f59e0b" />
          <Text style={[styles.ratingText, { color: theme.colors.onSurfaceVariant }]}>
            {part.rating} ({part.reviews})
          </Text>
        </View>
        
        <View style={styles.footerRow}>
          <View>
            <Text style={[styles.price, { color: theme.colors.onSurface }]}>
              {formatPrice(part.price)}
            </Text>
            {part.oldPrice && (
              <Text style={[styles.oldPrice, { color: theme.colors.onSurfaceVariant }]}>
                {formatPrice(part.oldPrice)}
              </Text>
            )}
          </View>
          
          {onAdd && (
            <IconButton
              icon="plus"
              mode="contained"
              containerColor={theme.colors.primary}
              iconColor={theme.colors.onPrimary}
              size={18}
              style={styles.addButton}
              onPress={onAdd}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
  },
  compactCard: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 12,
  },
  imageContainer: {
    height: 120,
    position: 'relative',
  },
  compactImageContainer: {
    width: 100,
    height: 100,
  },
  placeholderImage: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  favButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    margin: 4,
  },
  infoContainer: {
    padding: 10,
    flex: 1,
  },
  brand: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    marginTop: 2,
    minHeight: 36,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 10,
    marginLeft: 4,
    fontFamily: 'Inter-Medium',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  oldPrice: {
    fontSize: 10,
    textDecorationLine: 'line-through',
    fontFamily: 'Inter-Regular',
  },
  addButton: {
    margin: 0,
  },
});
