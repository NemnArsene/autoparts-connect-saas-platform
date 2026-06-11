import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboardingStore } from '@autoparts/hooks';
import Svg, { Path, Circle, Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const { width: W, height: H } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    title: 'Bienvenue sur\nAutoParts Connect',
    subtitle: 'La première plateforme qui vous permet de trouver et réserver une pièce automobile en moins de 30 secondes.',
    bg1: '#6C3CE1',
    bg2: '#4A1FA8',
    accent: '#A78BFA',
    illustration: 'welcome',
    badge: '5000+ pièces disponibles',
  },
  {
    id: 2,
    title: 'Trouvez la pièce\nqu\'il vous faut',
    subtitle: 'Recherchez par marque, modèle ou référence. Notre catalogue de 5000+ pièces est à votre portée.',
    bg1: '#F59E0B',
    bg2: '#D97706',
    accent: '#FCD34D',
    illustration: 'search',
    badge: '20 fournisseurs certifiés',
  },
  {
    id: 3,
    title: 'Réservez en un\nclic, retirez vite',
    subtitle: 'Réservez votre pièce en ligne et retirez-la auprès de votre fournisseur en toute confiance.',
    bg1: '#10B981',
    bg2: '#059669',
    accent: '#6EE7B7',
    illustration: 'reserve',
    badge: '2000+ réservations/mois',
  },
  {
    id: 4,
    title: 'Disponible\nhors connexion',
    subtitle: 'Consultez le catalogue, vos réservations et votre profil même sans internet grâce à notre mode offline.',
    bg1: '#3B82F6',
    bg2: '#2563EB',
    accent: '#93C5FD',
    illustration: 'offline',
    badge: 'Mode PWA & Offline First',
  },
];

// ── Illustrations SVG ─────────────────────────────────────────────────────────
function WelcomeIllustration({ accent }: { accent: string }) {
  return (
    <Svg width={220} height={220} viewBox="0 0 220 220" fill="none">
      <Circle cx="110" cy="110" r="100" fill="rgba(255,255,255,0.08)" />
      <Circle cx="110" cy="110" r="70" fill="rgba(255,255,255,0.12)" />
      <Circle cx="110" cy="110" r="44" fill="rgba(255,255,255,0.18)" />
      <Path
        d="M110 72L120 95L145 95L126 111L133 135L110 120L87 135L94 111L75 95L100 95Z"
        fill="white"
        opacity={0.95}
      />
      <Circle cx="55" cy="65" r="5" fill={accent} opacity={0.8} />
      <Circle cx="165" cy="155" r="7" fill={accent} opacity={0.6} />
      <Circle cx="160" cy="60" r="4" fill="white" opacity={0.5} />
      <Circle cx="50" cy="155" r="6" fill="white" opacity={0.4} />
      <Path d="M148 45L151 55L161 58L151 61L148 71L145 61L135 58L145 55Z" fill={accent} opacity={0.9} />
      <Path d="M62 148L64 155L71 157L64 159L62 166L60 159L53 157L60 155Z" fill="white" opacity={0.6} />
    </Svg>
  );
}

function SearchIllustration({ accent }: { accent: string }) {
  return (
    <Svg width={220} height={220} viewBox="0 0 220 220" fill="none">
      <Circle cx="110" cy="110" r="100" fill="rgba(255,255,255,0.08)" />
      <Circle cx="98" cy="98" r="44" stroke="white" strokeWidth={8} fill="rgba(255,255,255,0.1)" />
      <Path d="M132 132L158 158" stroke="white" strokeWidth={10} strokeLinecap="round" />
      <Rect x="75" y="90" width="46" height="7" rx="3.5" fill="white" opacity={0.7} />
      <Rect x="75" y="105" width="32" height="7" rx="3.5" fill={accent} opacity={0.9} />
      <Path d="M165 60L168 70L178 73L168 76L165 86L162 76L152 73L162 70Z" fill={accent} opacity={0.9} />
      <Circle cx="55" cy="75" r="6" fill="white" opacity={0.4} />
      <Circle cx="170" cy="140" r="5" fill="white" opacity={0.5} />
    </Svg>
  );
}

function ReserveIllustration({ accent }: { accent: string }) {
  return (
    <Svg width={220} height={220} viewBox="0 0 220 220" fill="none">
      <Circle cx="110" cy="110" r="100" fill="rgba(255,255,255,0.08)" />
      <Rect x="55" y="70" width="110" height="90" rx="12" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth={3} />
      <Rect x="55" y="70" width="110" height="28" rx="12" fill="white" opacity={0.25} />
      <Circle cx="80" cy="120" r="7" fill="white" opacity={0.5} />
      <Circle cx="110" cy="120" r="7" fill={accent} />
      <Circle cx="140" cy="120" r="7" fill="white" opacity={0.5} />
      <Circle cx="80" cy="145" r="7" fill="white" opacity={0.5} />
      <Circle cx="110" cy="145" r="7" fill="white" opacity={0.5} />
      <Circle cx="155" cy="75" r="22" fill={accent} />
      <Path d="M145 75L152 82L167 67" stroke="white" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="55" cy="155" r="5" fill="white" opacity={0.4} />
      <Circle cx="170" cy="155" r="4" fill="white" opacity={0.3} />
    </Svg>
  );
}

function OfflineIllustration({ accent }: { accent: string }) {
  return (
    <Svg width={220} height={220} viewBox="0 0 220 220" fill="none">
      <Circle cx="110" cy="110" r="100" fill="rgba(255,255,255,0.08)" />
      <Rect x="75" y="55" width="70" height="120" rx="14" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth={3} />
      <Rect x="85" y="68" width="50" height="80" rx="6" fill="rgba(255,255,255,0.12)" />
      <Circle cx="110" cy="163" r="5" fill="white" opacity={0.6} />
      <Path d="M92 105C98 99 122 99 128 105" stroke={accent} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      <Path d="M98 112C102 108 118 108 122 112" stroke={accent} strokeWidth={4} strokeLinecap="round" />
      <Circle cx="110" cy="119" r="4" fill={accent} />
      <Path d="M130 78C130 73 126 69 121 69C120 64 115 60 109 60C102 60 97 65 97 71C93 71 90 74 90 78C90 82 93 85 97 85H130C134 85 130 82 130 78Z" fill="white" opacity={0.8} />
      <Path d="M113 73L113 84M110 81L113 84L116 81" stroke="#3B82F6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const ILLUSTRATIONS: Record<string, React.FC<{ accent: string }>> = {
  welcome: WelcomeIllustration,
  search: SearchIllustration,
  reserve: ReserveIllustration,
  offline: OfflineIllustration,
};

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useOnboardingStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  
  // Make sure width is reliable on web
  const [winWidth, setWinWidth] = useState(W);
  useEffect(() => {
    const handleResize = () => setWinWidth(Dimensions.get('window').width);
    const sub = Dimensions.addEventListener('change', handleResize);
    return () => sub?.remove();
  }, []);

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const next = currentIndex + 1;
      scrollRef.current?.scrollTo({ x: next * winWidth, animated: true });
      setCurrentIndex(next);
    } else {
      handleFinish();
    }
  };

  const skip = () => handleFinish();

  const handleFinish = () => {
    completeOnboarding();
    router.replace('/(client)');
  };

  const slide = SLIDES[currentIndex];
  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <View style={[styles.root, { backgroundColor: slide.bg2 }]}>
      <StatusBar barStyle="light-content" backgroundColor={slide.bg2} />

      {/* Dynamic Background */}
      <View style={StyleSheet.absoluteFill}>
         <Svg width="100%" height="100%" preserveAspectRatio="none">
            <Defs>
              <SvgLinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={slide.bg1} />
                <Stop offset="1" stopColor={slide.bg2} />
              </SvgLinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#bgGrad)" />
         </Svg>
      </View>

      {/* Skip button */}
      {!isLast && (
        <TouchableOpacity style={styles.skipBtn} onPress={skip} activeOpacity={0.7}>
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>
      )}

      {/* Scrollable slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false} // Disable manual swipe to avoid dot desync
        showsHorizontalScrollIndicator={false}
        style={styles.slider}
      >
        {SLIDES.map((s) => {
          const Comp = ILLUSTRATIONS[s.illustration];
          return (
            <View key={s.id} style={[styles.slide, { width: winWidth }]}>
              {/* Illustration */}
              <View style={styles.illustrationBox}>
                <Comp accent={s.accent} />
              </View>

              {/* Badge */}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{s.badge}</Text>
              </View>

              {/* Texts */}
              <Text style={styles.title}>{s.title}</Text>
              <Text style={styles.subtitle}>{s.subtitle}</Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom controls */}
      <View style={styles.bottomBar}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: i === currentIndex ? 24 : 8,
                  opacity: i === currentIndex ? 1 : 0.4,
                }
              ]}
            />
          ))}
        </View>

        {/* Next / Commencer */}
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={goNext}
          activeOpacity={0.85}
        >
          <Text style={[styles.nextBtnText, { color: slide.bg2 }]}>
            {isLast ? 'Commencer' : 'Suivant'}
          </Text>
          <Text style={[styles.nextArrow, { color: slide.bg2 }]}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  skipBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 44,
    right: 24,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  skipText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '600',
  },
  slider: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 100,
  },
  illustrationBox: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: 'Inter-Bold', // Using Inter
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontFamily: 'Inter-Regular', // Using Inter
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  bottomBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 44 : 28,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 40,
    gap: 4,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    elevation: 8,
  },
  nextBtnText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  nextArrow: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    fontWeight: '800',
    marginTop: -2,
  },
});
