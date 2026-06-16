import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

interface TechnicianBannerProps {
  onPress: () => void;
  label: string;
  subtitle: string;
  btnText: string;
}

export function TechnicianBanner({ onPress, label, subtitle, btnText }: TechnicianBannerProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const iconBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();

    // Continuous pulse on icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    ).start();

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Icon subtle bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconBounce, {
          toValue: -4,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(iconBounce, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.touchable}>
        {/* Glow effect behind the card */}
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowAnim,
            },
          ]}
        />

        {/* Main card */}
        <View style={styles.card}>
          <Svg width="100%" height="100%" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="techBannerGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#6C3CE1" />
                <Stop offset="0.5" stopColor="#7C3AED" />
                <Stop offset="1" stopColor="#9333EA" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" rx={18} fill="url(#techBannerGrad)" />
          </Svg>

          {/* Decorative circles */}
          <View style={styles.decoCircle1} />
          <View style={styles.decoCircle2} />

          <View style={styles.content}>
            {/* Animated icon */}
            <Animated.View
              style={[
                styles.iconBox,
                {
                  transform: [{ scale: pulseAnim }, { translateY: iconBounce }],
                },
              ]}
            >
              <Icon name="account-wrench" size={30} color="#fff" />
            </Animated.View>

            <View style={styles.textContainer}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>

            <View style={styles.btnContainer}>
              <Text style={styles.btnText}>{btnText}</Text>
              <Icon name="arrow-right" size={16} color="#6C3CE1" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  touchable: {
    position: 'relative',
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    backgroundColor: '#6C3CE1',
    marginHorizontal: -4,
    marginVertical: -4,
  },
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  decoCircle1: {
    position: 'absolute',
    top: -20,
    right: -10,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  decoCircle2: {
    position: 'absolute',
    bottom: -30,
    right: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10,
    fontFamily: 'Inter-ExtraBold',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  subtitle: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    marginTop: 3,
    lineHeight: 17,
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  btnText: {
    color: '#6C3CE1',
    fontFamily: 'Inter-Bold',
    fontSize: 12,
  },
});
