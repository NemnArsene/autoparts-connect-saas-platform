import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme, IconButton, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useNotificationsStore } from '@autoparts/hooks';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function NotificationsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { unreadCount, markAsRead } = useNotificationsStore();

  // Mock notifications
  const notifications = [
    {
      id: '1',
      title: 'Commande prête au retrait',
      message: 'Votre réservation #RES-8924 pour Plaquette de frein Bosch est prête au retrait.',
      date: 'Aujourd\'hui à 10:30',
      type: 'order',
      read: unreadCount === 0,
    },
    {
      id: '2',
      title: 'Nouveau fournisseur',
      message: 'PartsAuto CI a ajouté 50 nouvelles pièces compatibles avec votre Toyota Corolla.',
      date: 'Hier à 14:15',
      type: 'system',
      read: true,
    },
    {
      id: '3',
      title: 'Promo Flash',
      message: 'Profitez de -20% sur tous les filtres à huile avec le code OIL20.',
      date: 'Il y a 3 jours',
      type: 'promo',
      read: true,
    }
  ];

  const getIconInfo = (type: string) => {
    switch(type) {
      case 'order': return { name: 'package-variant', color: theme.colors.primary, bg: theme.colors.primaryContainer };
      case 'promo': return { name: 'tag', color: '#f59e0b', bg: '#fef3c7' };
      default: return { name: 'bell-outline', color: theme.colors.onSurfaceVariant, bg: theme.colors.elevation.level2 };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Notifications</Text>
        <IconButton 
          icon="check-all" 
          size={24} 
          onPress={() => markAsRead()} 
          iconColor={unreadCount > 0 ? theme.colors.primary : theme.colors.onSurfaceVariant}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {notifications.map((n, i) => {
          const iconInfo = getIconInfo(n.type);
          
          return (
            <View key={n.id}>
              <View style={[styles.notificationItem, !n.read && { backgroundColor: theme.colors.elevation.level1 }]}>
                <View style={[styles.iconBox, { backgroundColor: iconInfo.bg }]}>
                  <Icon name={iconInfo.name} size={24} color={iconInfo.color} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={[styles.title, !n.read && { fontWeight: 'bold' }]}>{n.title}</Text>
                  <Text style={styles.message}>{n.message}</Text>
                  <Text style={styles.date}>{n.date}</Text>
                </View>
                {!n.read && <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />}
              </View>
              {i < notifications.length - 1 && <Divider />}
            </View>
          );
        })}
      </ScrollView>
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
  content: { paddingBottom: 40 },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: { flex: 1 },
  title: { fontSize: 14, color: '#1f2937' },
  message: { fontSize: 13, color: '#4b5563', marginTop: 4, lineHeight: 18 },
  date: { fontSize: 11, color: '#9ca3af', marginTop: 8 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
});
