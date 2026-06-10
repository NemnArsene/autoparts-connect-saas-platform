import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme, Avatar, List, Divider, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@autoparts/hooks';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.headerTitle}>Mon Profil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.colors.surface }]}>
          <Avatar.Text
            size={64}
            label={getInitials(user?.name)}
            style={{ backgroundColor: theme.colors.primaryContainer }}
            color={theme.colors.onPrimaryContainer}
          />
          <View style={styles.profileInfo}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{user?.name || 'Visiteur'}</Text>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>{user?.email || 'Non connecté'}</Text>
            {user?.phone && (
              <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12, marginTop: 4 }}>
                <Icon name="phone" size={12} /> {user.phone}
              </Text>
            )}
          </View>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuSection, { backgroundColor: theme.colors.surface }]}>
          <List.Item
            title="Mon véhicule"
            description="Gérer les informations de votre voiture"
            left={(props) => <List.Icon {...props} icon="car-cog" color={theme.colors.primary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Mes favoris"
            description="Pièces sauvegardées"
            left={(props) => <List.Icon {...props} icon="heart" color={theme.colors.error} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Historique des commandes"
            left={(props) => <List.Icon {...props} icon="history" color={theme.colors.onSurfaceVariant} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </View>

        <View style={[styles.menuSection, { backgroundColor: theme.colors.surface }]}>
          <List.Item
            title="Paramètres du compte"
            left={(props) => <List.Icon {...props} icon="cog-outline" color={theme.colors.onSurfaceVariant} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Support client"
            left={(props) => <List.Icon {...props} icon="help-circle-outline" color={theme.colors.onSurfaceVariant} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </View>

        <View style={styles.logoutSection}>
          {user ? (
            <Button
              mode="outlined"
              textColor={theme.colors.error}
              style={{ borderColor: theme.colors.error }}
              onPress={handleLogout}
              icon="logout"
            >
              Se déconnecter
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={() => router.replace('/(auth)')}
              icon="login"
            >
              Se connecter
            </Button>
          )}
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  content: { padding: 16, paddingBottom: 40 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginTop: -40,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileInfo: { marginLeft: 16, flex: 1 },
  menuSection: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  logoutSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  version: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 12,
  },
});
