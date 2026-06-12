import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCartStore } from '@autoparts/hooks';

interface TopHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  leftIcon?: React.ReactNode;
}

export function TopHeader({ title, subtitle, showBack = true, leftIcon }: TopHeaderProps) {
  const router = useRouter();
  const { items: cartItems } = useCartStore();
  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <View style={styles.topHeader}>
      {showBack ? (
        <IconButton icon="chevron-left" size={28} onPress={() => router.back()} style={styles.backButton} />
      ) : leftIcon ? (
        leftIcon
      ) : null}

      <View style={styles.topHeaderTitle}>
        <Text style={styles.topHeaderMainText}>{title}</Text>
        {subtitle ? <Text style={styles.topHeaderSubText}>{subtitle}</Text> : null}
      </View>

      <IconButton icon="weather-night" size={24} onPress={() => { }} />
      <View style={{ position: 'relative' }}>
        <IconButton icon="cart-outline" size={24} onPress={() => router.push('/cart')} />
        {cartCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartCount}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 5 : 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    zIndex: 50,
  },
  backButton: {
    marginLeft: -8,
  },
  topHeaderTitle: {
    flex: 1,
    marginLeft: 8,
  },
  topHeaderMainText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
  },
  topHeaderSubText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    zIndex: 10,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
});
