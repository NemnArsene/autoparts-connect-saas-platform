import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

// ── Types ─────────────────────────────────────────────────────────────────────
type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: string;
  color: string;
  plate: string;
  isActive: boolean;
};

// ── Mock Initial Data ─────────────────────────────────────────────────────────
const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: '1',
    brand: 'Honda',
    model: 'HR-V',
    year: '2013',
    color: 'Rouge',
    plate: 'AM-3949-TF',
    isActive: true,
  },
  {
    id: '2',
    brand: 'Peugeot',
    model: 'Partner',
    year: '2011',
    color: 'Beige',
    plate: 'LG-8962-GL',
    isActive: true,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function VehiclesScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form state
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [plate, setPlate] = useState('');

  const openAddModal = () => {
    setEditingVehicle(null);
    setBrand('');
    setModel('');
    setYear('');
    setColor('');
    setPlate('');
    setModalVisible(true);
  };

  const openEditModal = (v: Vehicle) => {
    setEditingVehicle(v);
    setBrand(v.brand);
    setModel(v.model);
    setYear(v.year);
    setColor(v.color);
    setPlate(v.plate);
    setModalVisible(true);
  };

  const saveVehicle = () => {
    if (!brand || !model || !plate) return;

    if (editingVehicle) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === editingVehicle.id
            ? { ...v, brand, model, year, color, plate }
            : v
        )
      );
    } else {
      const newV: Vehicle = {
        id: Date.now().toString(),
        brand,
        model,
        year,
        color,
        plate,
        isActive: true,
      };
      setVehicles([newV, ...vehicles]);
    }
    setModalVisible(false);
  };

  const toggleActiveStatus = () => {
    if (!editingVehicle) return;
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === editingVehicle.id ? { ...v, isActive: !v.isActive } : v
      )
    );
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
            <Icon name="chevron-left" size={26} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('vehicles.title')}</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="weather-night" size={22} color="#475569" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="cart-outline" size={22} color="#475569" />
              <View style={styles.cartBadge} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── Add Button ── */}
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal} activeOpacity={0.8}>
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.addBtnText}>{t('vehicles.addBtn')}</Text>
        </TouchableOpacity>

        {/* ── List ── */}
        {vehicles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="car-off" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>{t('vehicles.empty')}</Text>
          </View>
        ) : (
          vehicles.map((v) => (
            <View key={v.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vehicleTitle}>{v.brand} {v.model}</Text>
                  <Text style={styles.vehicleSub}>{v.year} • {v.color}</Text>
                  <Text style={styles.vehiclePlate}>{v.plate}</Text>
                </View>
                <View style={[styles.statusBadge, !v.isActive && styles.statusBadgeInactive]}>
                  <Text style={[styles.statusText, !v.isActive && styles.statusTextInactive]}>
                    {v.isActive ? t('vehicles.active') : t('vehicles.inactive')}
                  </Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(v)}>
                  <Icon name="pencil-outline" size={16} color="#475569" />
                  <Text style={styles.actionText}>{t('vehicles.edit')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Icon name="eye-outline" size={16} color="#475569" />
                  <Text style={styles.actionText}>{t('vehicles.details')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Add/Edit Modal ── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingVehicle ? t('vehicles.editTitle') : t('vehicles.addTitle')}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Icon name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>{t('vehicles.brandLabel')} *</Text>
              <TextInput style={styles.input} value={brand} onChangeText={setBrand} placeholder="ex: Honda" placeholderTextColor="#9CA3AF" />

              <Text style={styles.label}>{t('vehicles.modelLabel')} *</Text>
              <TextInput style={styles.input} value={model} onChangeText={setModel} placeholder="ex: HR-V" placeholderTextColor="#9CA3AF" />

              <View style={styles.rowInputs}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.label}>{t('vehicles.yearLabel')}</Text>
                  <TextInput style={styles.input} value={year} onChangeText={setYear} placeholder="ex: 2013" keyboardType="numeric" placeholderTextColor="#9CA3AF" />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.label}>{t('vehicles.colorLabel')}</Text>
                  <TextInput style={styles.input} value={color} onChangeText={setColor} placeholder="ex: Rouge" placeholderTextColor="#9CA3AF" />
                </View>
              </View>

              <Text style={styles.label}>{t('vehicles.plateLabel')} *</Text>
              <TextInput style={styles.input} value={plate} onChangeText={setPlate} placeholder="ex: AM-3949-TF" placeholderTextColor="#9CA3AF" autoCapitalize="characters" />

              {/* Status Toggle for existing vehicle */}
              {editingVehicle && (
                <TouchableOpacity
                  style={[styles.deactivateBtn, !editingVehicle.isActive && styles.activateBtn]}
                  onPress={toggleActiveStatus}
                >
                  <Icon name={editingVehicle.isActive ? "car-off" : "car"} size={20} color={editingVehicle.isActive ? "#EF4444" : "#10B981"} />
                  <Text style={[styles.deactivateText, !editingVehicle.isActive && styles.activateText]}>
                    {editingVehicle.isActive ? t('vehicles.deactivate') : t('vehicles.activate')}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.saveBtn} onPress={saveVehicle} activeOpacity={0.8}>
                <Text style={styles.saveBtnText}>{t('vehicles.save')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // ── Header ──
  headerWrapper: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 30 : 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBack: { padding: 4, marginRight: 12 },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
  },
  headerRight: { flexDirection: 'row', gap: 16, marginRight: 4 },
  headerIcon: { position: 'relative', padding: 4 },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },

  // ── Body ──
  scrollContent: { padding: 16 },

  addBtn: {
    backgroundColor: '#6C3CE1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  addBtnText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },

  // ── Cards ──
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 20,
  },
  vehicleTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  vehicleSub: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  vehiclePlate: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusBadgeInactive: {
    backgroundColor: '#F1F5F9',
  },
  statusText: {
    color: '#059669',
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
  statusTextInactive: {
    color: '#64748B',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#475569',
  },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  modalForm: {
    padding: 20,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  saveBtn: {
    backgroundColor: '#6C3CE1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter-Bold',
  },
  deactivateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  activateBtn: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  deactivateText: {
    color: '#EF4444',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  activateText: {
    color: '#10B981',
  },
});
