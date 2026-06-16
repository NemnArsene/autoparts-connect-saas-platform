import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { BRANDS } from '@autoparts/models';

// ── Types ─────────────────────────────────────────────────────────────────────
type StepId = 1 | 2 | 3 | 4 | 5;

interface StepConfig {
  id: StepId;
  titleKey: string;
  subKey: string;
  icon: string;
}

const STEPS: StepConfig[] = [
  { id: 1, titleKey: 'technician.stepTitle1', subKey: 'technician.stepSub1', icon: 'account-wrench' },
  { id: 2, titleKey: 'technician.stepTitle2', subKey: 'technician.stepSub2', icon: 'car' },
  { id: 3, titleKey: 'technician.stepTitle3', subKey: 'technician.stepSub3', icon: 'alert-circle-outline' },
  { id: 4, titleKey: 'technician.stepTitle4', subKey: 'technician.stepSub4', icon: 'map-marker-outline' },
  { id: 5, titleKey: 'technician.stepTitle5', subKey: 'technician.stepSub5', icon: 'crosshairs-gps' },
];

interface FormData {
  technician: string;
  customTechnician: string;
  brand: string;
  customBrand: string;
  problem: string;
  customProblem: string;
  location: string;
  customLocation: string;
  useCurrentLocation: boolean;
  notes: string;
}

const INITIAL_FORM: FormData = {
  technician: '',
  customTechnician: '',
  brand: '',
  customBrand: '',
  problem: '',
  customProblem: '',
  location: '',
  customLocation: '',
  useCurrentLocation: false,
  notes: '',
};

// ── Step Indicator ────────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  const theme = useTheme();
  return (
    <View style={styles.stepIndicator}>
      {Array.from({ length: total }).map((_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === current;
        const isCompleted = stepNum < current;
        return (
          <React.Fragment key={i}>
            <View
              style={[
                styles.stepDot,
                {
                  backgroundColor: isCompleted
                    ? theme.colors.primary
                    : isActive
                    ? theme.colors.primary
                    : theme.colors.outline + '40',
                  width: isActive ? 32 : 10,
                  borderRadius: isActive ? 6 : 5,
                },
              ]}
            />
            {i < total - 1 && (
              <View
                style={[
                  styles.stepLine,
                  {
                    backgroundColor: isCompleted
                      ? theme.colors.primary
                      : theme.colors.outline + '30',
                  },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

// ── Option Card ───────────────────────────────────────────────────────────────
function OptionCard({
  label,
  subtitle,
  icon,
  selected,
  onPress,
  primaryColor,
  isOther,
}: {
  label: string;
  subtitle?: string;
  icon?: string;
  selected: boolean;
  onPress: () => void;
  primaryColor: string;
  isOther?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.optionCard,
        selected && { backgroundColor: primaryColor + '10', borderColor: primaryColor },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.optionRow}>
        {icon && (
          <View style={[styles.optionIconBox, selected && { backgroundColor: primaryColor + '20' }]}>
            <Icon name={icon} size={22} color={selected ? primaryColor : '#6B7280'} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={[styles.optionLabel, selected && { color: primaryColor, fontFamily: 'Inter-Bold' }]}>
            {label}
          </Text>
          {subtitle && (
            <Text style={[styles.optionSub, { color: selected ? primaryColor + '90' : '#9CA3AF' }]}>
              {subtitle}
            </Text>
          )}
        </View>
        <View style={[styles.radioOuter, selected && { borderColor: primaryColor }]}>
          {selected && <View style={[styles.radioInner, { backgroundColor: primaryColor }]} />}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function TechnicianContactScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const primaryColor = theme.colors.primary;

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [showCustomInput, setShowCustomInput] = useState<Record<number, boolean>>({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const updateForm = (key: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCustom = (step: number) => {
    setShowCustomInput((prev) => ({ ...prev, [step]: !prev[step] }));
    // Reset selections when switching
    if (step === 1) updateForm('technician', '');
    if (step === 2) updateForm('brand', '');
    if (step === 3) updateForm('problem', '');
    if (step === 4) updateForm('location', '');
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(form.technician || form.customTechnician);
      case 2:
        return !!(form.brand || form.customBrand);
      case 3:
        return !!(form.problem || form.customProblem);
      case 4:
        return !!(form.location || form.customLocation);
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as StepId);
    } else {
      handleSend();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as StepId);
    }
  };

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
    }, 1500);
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScreenHeader title={t('technician.title')} />
        <View style={styles.successContainer}>
          <View style={[styles.successIconBox, { backgroundColor: '#10B981' + '15' }]}>
            <Icon name="check-circle" size={64} color="#10B981" />
          </View>
          <Text style={[styles.successTitle, { color: theme.colors.onSurface }]}>
            {t('technician.success')}
          </Text>
          <Text style={[styles.successMessage, { color: theme.colors.onSurfaceVariant }]}>
            {t('technician.successMessage')}
          </Text>
          <View style={styles.successBtns}>
            <TouchableOpacity
              style={[styles.successBtnSecondary, { borderColor: primaryColor }]}
              onPress={() => {
                // Reset form and start new request
                setForm(INITIAL_FORM);
                setSuccess(false);
                setCurrentStep(1);
              }}
              activeOpacity={0.85}
            >
              <Icon name="plus" size={18} color={primaryColor} style={{ marginRight: 6 }} />
              <Text style={[styles.successBtnSecondaryText, { color: primaryColor }]}>{t('technician.requests.newRequest')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.successBtn, { backgroundColor: primaryColor }]}
              onPress={() => router.back()}
              activeOpacity={0.85}
            >
              <Text style={styles.successBtnText}>{t('common.back')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ── Render step content ───────────────────────────────────────────────────
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Choose technician
        return (
          <View style={styles.stepContent}>
            {Object.entries(t('technician.technicians', { returnObjects: true })).map(
              ([key, label]) => (
                <OptionCard
                  key={key}
                  label={label as string}
                  icon="account-wrench"
                  selected={form.technician === key && !showCustomInput[1]}
                  onPress={() => {
                    updateForm('technician', key);
                    setShowCustomInput((prev) => ({ ...prev, [1]: false }));
                  }}
                  primaryColor={primaryColor}
                />
              )
            )}
            <OptionCard
              label={t('technician.customTechnician')}
              icon="pencil-outline"
              selected={showCustomInput[1]}
              onPress={() => toggleCustom(1)}
              primaryColor={primaryColor}
              isOther
            />
            {showCustomInput[1] && (
              <View style={styles.customInputWrapper}>
                <TextInput
                  style={[styles.customInput, { borderColor: primaryColor + '40', color: theme.colors.onSurface }]}
                  placeholder={t('technician.technicianPlaceholder')}
                  placeholderTextColor="#9CA3AF"
                  value={form.customTechnician}
                  onChangeText={(v) => updateForm('customTechnician', v)}
                  autoFocus
                />
              </View>
            )}
          </View>
        );

      case 2: // Car brand
        return (
          <View style={styles.stepContent}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
              {BRANDS.map((brand) => (
                <OptionCard
                  key={brand}
                  label={brand}
                  icon="car"
                  selected={form.brand === brand && !showCustomInput[2]}
                  onPress={() => {
                    updateForm('brand', brand);
                    setShowCustomInput((prev) => ({ ...prev, [2]: false }));
                  }}
                  primaryColor={primaryColor}
                />
              ))}
              <OptionCard
                label={t('technician.customBrand')}
                icon="pencil-outline"
                selected={showCustomInput[2]}
                onPress={() => toggleCustom(2)}
                primaryColor={primaryColor}
                isOther
              />
              {showCustomInput[2] && (
                <View style={styles.customInputWrapper}>
                  <TextInput
                    style={[styles.customInput, { borderColor: primaryColor + '40', color: theme.colors.onSurface }]}
                    placeholder={t('technician.brandLabel')}
                    placeholderTextColor="#9CA3AF"
                    value={form.customBrand}
                    onChangeText={(v) => updateForm('customBrand', v)}
                    autoFocus
                  />
                </View>
              )}
            </ScrollView>
          </View>
        );

      case 3: // Problem type
        return (
          <View style={styles.stepContent}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
              {Object.entries(t('technician.problems', { returnObjects: true })).map(
                ([key, label]) => {
                  const problemIcons: Record<string, string> = {
                    brake: 'octagon-outline',
                    engine: 'cog-outline',
                    electrical: 'lightning-bolt',
                    suspension: 'car-door',
                    transmission: 'sync',
                    oil: 'oil',
                    tire: 'circle-outline',
                    ac: 'snowflake',
                    bodywork: 'car-side',
                    other: 'dots-horizontal',
                  };
                  return (
                    <OptionCard
                      key={key}
                      label={label as string}
                      icon={problemIcons[key] || 'alert-circle-outline'}
                      selected={form.problem === key && !showCustomInput[3]}
                      onPress={() => {
                        updateForm('problem', key);
                        setShowCustomInput((prev) => ({ ...prev, [3]: false }));
                      }}
                      primaryColor={primaryColor}
                    />
                  );
                }
              )}
              <OptionCard
                label={t('technician.customProblem')}
                icon="pencil-outline"
                selected={showCustomInput[3]}
                onPress={() => toggleCustom(3)}
                primaryColor={primaryColor}
                isOther
              />
              {showCustomInput[3] && (
                <View style={styles.customInputWrapper}>
                  <TextInput
                    style={[styles.customInput, { borderColor: primaryColor + '40', color: theme.colors.onSurface }]}
                    placeholder={t('technician.problemLabel')}
                    placeholderTextColor="#9CA3AF"
                    value={form.customProblem}
                    onChangeText={(v) => updateForm('customProblem', v)}
                    autoFocus
                  />
                </View>
              )}
            </ScrollView>
          </View>
        );

      case 4: // Meeting location
        return (
          <View style={styles.stepContent}>
            {Object.entries(t('technician.locations', { returnObjects: true })).map(
              ([key, label]) => {
                const locationIcons: Record<string, string> = {
                  home: 'home-outline',
                  work: 'briefcase-outline',
                  garage: 'garage',
                  parking: 'parking',
                  roadside: 'road-variant',
                };
                return (
                  <OptionCard
                    key={key}
                    label={label as string}
                    icon={locationIcons[key] || 'map-marker-outline'}
                    selected={form.location === key && !showCustomInput[4]}
                    onPress={() => {
                      updateForm('location', key);
                      setShowCustomInput((prev) => ({ ...prev, [4]: false }));
                    }}
                    primaryColor={primaryColor}
                  />
                );
              }
            )}
            <OptionCard
              label={t('technician.customLocation')}
              icon="pencil-outline"
              selected={showCustomInput[4]}
              onPress={() => toggleCustom(4)}
              primaryColor={primaryColor}
              isOther
            />
            {showCustomInput[4] && (
              <View style={styles.customInputWrapper}>
                <TextInput
                  style={[styles.customInput, { borderColor: primaryColor + '40', color: theme.colors.onSurface }]}
                  placeholder={t('technician.locationLabel')}
                  placeholderTextColor="#9CA3AF"
                  value={form.customLocation}
                  onChangeText={(v) => updateForm('customLocation', v)}
                  autoFocus
                />
              </View>
            )}
          </View>
        );

      case 5: // Geolocation + Notes
        return (
          <View style={styles.stepContent}>
            {/* Location toggle */}
            <TouchableOpacity
              style={[
                styles.locationToggle,
                {
                  backgroundColor: form.useCurrentLocation ? primaryColor + '10' : '#F9FAFB',
                  borderColor: form.useCurrentLocation ? primaryColor : '#E5E7EB',
                },
              ]}
              onPress={() => updateForm('useCurrentLocation', !form.useCurrentLocation)}
              activeOpacity={0.7}
            >
              <View style={styles.locationToggleRow}>
                <View style={[styles.locationIconBox, { backgroundColor: form.useCurrentLocation ? primaryColor + '20' : '#F3F4F6' }]}>
                  <Icon
                    name={form.useCurrentLocation ? 'crosshairs-gps' : 'crosshairs'}
                    size={24}
                    color={form.useCurrentLocation ? primaryColor : '#9CA3AF'}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.locationToggleTitle, { color: form.useCurrentLocation ? primaryColor : '#1F2937' }]}>
                    {t('technician.useMyLocation')}
                  </Text>
                  <Text style={styles.locationToggleSub}>
                    {form.useCurrentLocation
                      ? t('technician.locationShared')
                      : t('technician.currentLocation')}
                  </Text>
                </View>
                <View style={[styles.toggleTrack, { backgroundColor: form.useCurrentLocation ? primaryColor : '#D1D5DB' }]}>
                  <View
                    style={[
                      styles.toggleThumb,
                      { transform: [{ translateX: form.useCurrentLocation ? 18 : 0 }] },
                    ]}
                  />
                </View>
              </View>
            </TouchableOpacity>

            {/* Notes */}
            <View style={styles.notesSection}>
              <Text style={[styles.notesLabel, { color: theme.colors.onSurface }]}>
                {t('technician.additionalNotes')}
              </Text>
              <TextInput
                style={[
                  styles.notesInput,
                  {
                    borderColor: '#E5E7EB',
                    color: theme.colors.onSurface,
                    backgroundColor: '#F9FAFB',
                  },
                ]}
                placeholder={t('technician.notesPlaceholder')}
                placeholderTextColor="#9CA3AF"
                value={form.notes}
                onChangeText={(v) => updateForm('notes', v)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        );
    }
  };

  const stepConfig = STEPS[currentStep - 1];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScreenHeader title={t('technician.title')} />

      {/* Step indicator */}
      <StepIndicator current={currentStep} total={5} />

      {/* Step header */}
      <View style={styles.stepHeader}>
        <View style={[styles.stepIconCircle, { backgroundColor: primaryColor + '12' }]}>
          <Icon name={stepConfig.icon} size={28} color={primaryColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.stepTitle, { color: theme.colors.onSurface }]}>
            {t(stepConfig.titleKey)}
          </Text>
          <Text style={[styles.stepSub, { color: theme.colors.onSurfaceVariant }]}>
            {t(stepConfig.subKey)}
          </Text>
        </View>
      </View>

      {/* Step content */}
      <View style={styles.contentArea}>{renderStepContent()}</View>

      {/* Bottom buttons */}
      <View style={styles.bottomBar}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={[styles.backBtn, { borderColor: theme.colors.outline + '40' }]}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Icon name="chevron-left" size={20} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.backBtnText, { color: theme.colors.onSurfaceVariant }]}>
              {t('technician.back')}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.nextBtn,
            {
              backgroundColor: canProceed() ? primaryColor : primaryColor + '50',
              flex: currentStep === 1 ? 1 : undefined,
              opacity: canProceed() ? 1 : 0.6,
            },
          ]}
          onPress={handleNext}
          activeOpacity={0.85}
          disabled={!canProceed() || sending}
        >
          {sending ? (
            <Text style={styles.nextBtnText}>{t('technician.sending')}</Text>
          ) : currentStep === 5 ? (
            <>
              <Icon name="send" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.nextBtnText}>{t('technician.sendRequest')}</Text>
            </>
          ) : (
            <>
              <Text style={styles.nextBtnText}>{t('technician.next')}</Text>
              <Icon name="chevron-right" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 0,
  },
  stepDot: {
    height: 10,
    borderRadius: 5,
  },
  stepLine: {
    height: 2,
    width: 24,
    borderRadius: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  stepIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.3,
  },
  stepSub: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContent: {
    gap: 10,
  },
  optionCard: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#fff',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  optionSub: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    marginTop: 1,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  customInputWrapper: {
    marginTop: 4,
    paddingLeft: 52,
  },
  customInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  locationToggle: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  locationToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationToggleTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  locationToggleSub: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 1,
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
  },
  notesSection: {
    marginTop: 4,
  },
  notesLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  notesInput: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    minHeight: 110,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  backBtnText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    marginLeft: 4,
  },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 14,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter-Bold',
  },
  // Success screen
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  successIconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 22,
    fontFamily: 'Inter-ExtraBold',
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  successBtns: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  successBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
  },
  successBtnSecondaryText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  successBtn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  successBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter-Bold',
  },
});
