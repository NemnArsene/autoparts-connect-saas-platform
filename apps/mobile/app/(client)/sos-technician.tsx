import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Modal,
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SupportIcon, CloseIcon, ChevronRightIcon } from '../../src/components/Icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Technician {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  avatarInitials: string;
  specialtyKey: string;
  rating: string;
  experience: string;
  color: string;
}

export default function SosTechnicianScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();

  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Pulse animation for SOS badge
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    ).start();
  }, []);

  const technicians: Technician[] = [
    {
      id: 'chouibou',
      name: 'Chouibou',
      phone: '699591116',
      whatsapp: '237699591116',
      avatarInitials: 'CB',
      specialtyKey: 'technician.sos.chouibouSpec',
      rating: '4.9',
      experience: '8 ans',
      color: '#EA580C', // Orange
    },
    {
      id: 'mohamed',
      name: 'Mohamed',
      phone: '694241391',
      whatsapp: '237694241391',
      avatarInitials: 'MH',
      specialtyKey: 'technician.sos.mohamedSpec',
      rating: '4.8',
      experience: '10 ans',
      color: '#2563EB', // Blue
    },
    {
      id: 'axel',
      name: 'Axel',
      phone: '696567184',
      whatsapp: '237696567184',
      avatarInitials: 'AX',
      specialtyKey: 'technician.sos.axelSpec',
      rating: '4.9',
      experience: '6 ans',
      color: '#16A34A', // Green
    },
  ];

  const handleOpenContact = (tech: Technician) => {
    setSelectedTech(tech);
    setModalVisible(true);
  };

  const handleCall = (phone: string) => {
    setModalVisible(false);
    Linking.openURL(`tel:+237${phone}`);
  };

  const handleWhatsApp = (whatsapp: string, techName: string) => {
    setModalVisible(false);
    const msg = `Bonjour ${techName}, j'ai besoin d'une assistance d'urgence avec AutoParts Connect.`;
    Linking.openURL(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('technician.sos.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Urgent Pulsing SOS Banner */}
        <View style={styles.sosCard}>
          <LinearGradient
            colors={['#DC2626', '#991B1B']}
            style={styles.sosGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.sosHeaderRow}>
              <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}>
                <View style={styles.innerPulseCircle} />
              </Animated.View>
              <Text style={styles.sosBannerTitle}>ASSISTANCE D'URGENCE 24/7</Text>
            </View>
            <Text style={styles.sosBannerSub}>{t('technician.sos.subtitle')}</Text>
          </LinearGradient>
        </View>

        {/* Technician Cards */}
        <View style={styles.listContainer}>
          {technicians.map((tech) => (
            <TouchableOpacity
              key={tech.id}
              style={styles.techCard}
              activeOpacity={0.9}
              onPress={() => handleOpenContact(tech)}
            >
              {/* Inner container to hold card elements */}
              <View style={styles.techCardInner}>
                <View style={[styles.avatarBox, { backgroundColor: tech.color }]}>
                  <Text style={styles.avatarText}>{tech.avatarInitials}</Text>
                  <View style={styles.onlineDot} />
                </View>

                <View style={styles.techInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.techName}>{tech.name}</Text>
                    <View style={styles.ratingBadge}>
                      <Text style={styles.ratingText}>★ {tech.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.techSpecialty}>{t(tech.specialtyKey)}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>📅 Exp: {tech.experience}</Text>
                    <Text style={styles.statusText}>⚡ Dispo immédiate</Text>
                  </View>
                </View>

                <View style={styles.chevronBox}>
                  <ChevronRightIcon color="#DC2626" size={24} />
                </View>
              </View>

              {/* Neomorphic / Premium shadow-simulated bottom highlight button */}
              <View style={styles.contactBar}>
                <Text style={styles.contactBarText}>Demander assistance d'urgence</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Security Warning info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>💡 Conseil de sécurité</Text>
          <Text style={styles.infoBoxText}>
            En cas de panne sur la voie publique, allumez vos feux de détresse, enfilez votre gilet jaune et placez le triangle de présignalisation à au moins 30 mètres en amont.
          </Text>
        </View>
      </ScrollView>

      {/* Modal for Contact Option */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t('technician.sos.contactModalTitle', { name: selectedTech?.name })}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon color="#4B5563" size={24} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>{t('technician.sos.contactModalSub')}</Text>

            <View style={styles.btnGroup}>
              {/* Option normal call */}
              <TouchableOpacity
                style={[styles.modalActionBtn, styles.callBtn]}
                onPress={() => selectedTech && handleCall(selectedTech.phone)}
                activeOpacity={0.8}
              >
                <Text style={styles.callBtnText}>📞 {t('technician.sos.call')}</Text>
              </TouchableOpacity>

              {/* Option whatsapp */}
              <TouchableOpacity
                style={[styles.modalActionBtn, styles.whatsappBtn]}
                onPress={() =>
                  selectedTech && handleWhatsApp(selectedTech.whatsapp, selectedTech.name)
                }
                activeOpacity={0.8}
              >
                <Text style={styles.whatsappBtnText}>💬 {t('technician.sos.whatsapp')}</Text>
              </TouchableOpacity>

              {/* Cancel button */}
              <TouchableOpacity
                style={[styles.modalActionBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>{t('technician.sos.cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFF',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.03)',
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  backButtonText: {
    fontSize: 20,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  sosCard: {
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0px 8px 16px rgba(220, 38, 38, 0.25)',
    elevation: 8,
  },
  sosGradient: {
    padding: 20,
    gap: 10,
  },
  sosHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pulseCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerPulseCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  sosBannerTitle: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    letterSpacing: 1.5,
  },
  sosBannerSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    lineHeight: 20,
  },
  listContainer: {
    gap: 16,
  },
  techCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.04)',
    elevation: 4,
  },
  techCardInner: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatarBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  techInfo: {
    flex: 1,
    marginLeft: 14,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  techName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  ratingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#D97706',
  },
  techSpecialty: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 2,
  },
  metaText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  chevronBox: {
    paddingLeft: 8,
  },
  contactBar: {
    backgroundColor: '#FEF2F2',
    borderTopWidth: 1,
    borderTopColor: '#FEE2E2',
    paddingVertical: 10,
    alignItems: 'center',
  },
  contactBarText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#DC2626',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: 6,
  },
  infoBoxTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#1E40AF',
  },
  infoBoxText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#1E3A8A',
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 16,
    boxShadow: '0px -10px 25px rgba(0, 0, 0, 0.15)',
    elevation: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
  btnGroup: {
    gap: 12,
    marginTop: 8,
  },
  modalActionBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  },
  callBtn: {
    backgroundColor: '#1E293B',
  },
  callBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Inter-Bold',
  },
  whatsappBtn: {
    backgroundColor: '#25D366',
  },
  whatsappBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Inter-Bold',
  },
  cancelBtn: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelBtnText: {
    color: '#4B5563',
    fontSize: 15,
    fontFamily: 'Inter-Bold',
  },
});
