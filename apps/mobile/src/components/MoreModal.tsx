import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@autoparts/hooks';
import {
  UserIcon,
  CarIcon,
  HistoryIcon,
  HeartIcon,
  SettingsIcon,
  SupportIcon,
  LogoutIcon,
  ChevronRightIcon,
  CloseIcon,
} from './Icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MoreMenuItem {
  id: string;
  label: string;
  subtitle?: string;
  icon: React.ComponentType<{ color?: string; size?: number }>;
  route?: string;
  action?: () => void;
  danger?: boolean;
  requireAuth?: boolean;
}

interface MoreModalProps {
  visible: boolean;
  onClose: () => void;
  primaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  subtitleColor: string;
}

export const MoreModal: React.FC<MoreModalProps> = ({
  visible,
  onClose,
  primaryColor,
  backgroundColor,
  surfaceColor,
  textColor,
  subtitleColor,
}) => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 65,
          friction: 12,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    }
  }, [visible]);

  const handleNavigate = (route?: string, action?: () => void, requireAuth?: boolean) => {
    // If action requires auth and user is not connected, redirect to login
    if (requireAuth && !user) {
      onClose();
      setTimeout(() => {
        router.push('/login');
      }, 200);
      return;
    }

    onClose();
    setTimeout(() => {
      if (action) {
        action();
      } else if (route) {
        router.push(route as any);
      }
    }, 200);
  };

  const menuItems: MoreMenuItem[] = [
    {
      id: 'profile',
      label: 'Mon profil',
      subtitle: 'Informations personnelles',
      icon: UserIcon,
      route: '/profile',
      requireAuth: true,
    },
    {
      id: 'vehicles',
      label: 'Mes véhicules',
      subtitle: 'Gérer mes véhicules',
      icon: CarIcon,
      route: '/profile',
      requireAuth: true,
    },
    {
      id: 'history',
      label: 'Historique',
      subtitle: 'Mes commandes passées',
      icon: HistoryIcon,
      route: '/reservations',
      requireAuth: true,
    },
    {
      id: 'favorites',
      label: 'Favoris',
      subtitle: 'Pièces sauvegardées',
      icon: HeartIcon,
      route: '/search',
    },
    {
      id: 'settings',
      label: 'Paramètres',
      subtitle: 'Langue, notifications...',
      icon: SettingsIcon,
      route: '/profile',
    },
    {
      id: 'support',
      label: 'Support',
      subtitle: 'Aide et contact',
      icon: SupportIcon,
      route: '/profile',
    },
    ...(user ? [{
      id: 'logout',
      label: 'Déconnexion',
      icon: LogoutIcon,
      danger: true,
      action: () => logout(),
    }] : []),
  ];

  const initials = user?.avatar || (user?.name ? user.name.substring(0, 2).toUpperCase() : 'AP');

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: backgroundColor,
            transform: [{ translateY }],
          },
        ]}
      >
        {/* Handle */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {/* User card OR Guest CTA */}
        {user ? (
          <View style={styles.userCard}>
            <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={[styles.userName, { color: textColor }]}>{user.name}</Text>
              <Text style={[styles.userEmail, { color: subtitleColor }]}>{user.email}</Text>
            </View>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeBtn}>
              <CloseIcon color={textColor} size={20} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.guestCard, { backgroundColor: primaryColor + '08', borderColor: primaryColor + '25' }]}>
            <View style={[styles.guestAvatarBox, { backgroundColor: primaryColor + '15' }]}>
              <UserIcon color={primaryColor} size={26} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.guestTitle, { color: textColor }]}>Visiteur</Text>
              <Text style={[styles.guestSub, { color: subtitleColor }]}>Connectez-vous pour accéder à votre compte</Text>
            </View>
            <TouchableOpacity
              style={[styles.guestLoginBtn, { backgroundColor: primaryColor }]}
              onPress={() => { onClose(); setTimeout(() => router.push('/login'), 200); }}
              activeOpacity={0.85}
            >
              <Text style={styles.guestLoginText}>Connexion</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Menu items */}
        <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
          {menuItems.map((item, index) => {
            const IconComp = item.icon;
            const isLast = index === menuItems.length - 1;
            const color = item.danger ? '#EF4444' : '#1F2937';
            const iconColor = item.danger ? '#EF4444' : '#4B5563';
            const isLocked = item.requireAuth && !user;

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, isLast && { marginBottom: 8 }]}
                onPress={() => handleNavigate(item.route, item.action, item.requireAuth)}
                activeOpacity={0.6}
              >
                <View style={styles.menuItemIcon}>
                  <IconComp color={iconColor} size={22} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.menuItemLabel, { color }]}>{item.label}</Text>
                </View>
                {isLocked ? (
                  <View style={[styles.lockBadge, { backgroundColor: subtitleColor + '20' }]}>
                    <Text style={[styles.lockText, { color: subtitleColor }]}>🔒</Text>
                  </View>
                ) : !item.danger ? (
                  <ChevronRightIcon color={subtitleColor} size={18} />
                ) : null}
              </TouchableOpacity>
            );
          })}

          {/* Register CTA for guests */}
          {!user && (
            <TouchableOpacity
              style={[styles.registerCTA, { backgroundColor: primaryColor }]}
              onPress={() => { onClose(); setTimeout(() => router.push('/register'), 200); }}
              activeOpacity={0.85}
            >
              <Text style={styles.registerCTAText}>Créer un compte gratuit</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: SCREEN_HEIGHT * 0.85,
    boxShadow: '0px -8px 24px rgba(0, 0, 0, 0.12)',
    elevation: 24,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  handle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
  },
  closeBtn: {
    padding: 8,
    marginRight: -8,
  },
  // Authenticated user card
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  userEmail: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  // Guest card
  guestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginVertical: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  guestAvatarBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  guestSub: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
    lineHeight: 15,
  },
  guestLoginBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  guestLoginText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  // Menu items
  menuList: {
    paddingTop: 8,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  menuItemIcon: {
    width: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  menuItemLabel: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  lockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  lockText: {
    fontSize: 12,
  },
  registerCTA: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  registerCTAText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Inter-Bold',
  },
});
