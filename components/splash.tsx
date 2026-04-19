import { FontSize, FontWeight, Opacity, SemanticColors } from '@/constants/design-tokens';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';

interface SplashProps {
  onFinish: () => void;
}

export function Splash({ onFinish }: SplashProps) {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(10);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    logoScale.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.5)) });
    subtitleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    subtitleTranslateY.value = withDelay(400, withTiming(0, { duration: 500 }));

    const timer = setTimeout(() => {
      logoOpacity.value = withTiming(0, { duration: 300 });
      subtitleOpacity.value = withTiming(0, { duration: 300 });
      setTimeout(onFinish, 350);
    }, 2000);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.emoji, logoStyle]}>💪</Animated.Text>
      <Animated.Text style={[styles.logo, logoStyle]}>FitLog</Animated.Text>
      <Animated.Text style={[styles.subtitle, subtitleStyle]}>나만의 운동 기록</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SemanticColors.splashBg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 56,
    lineHeight: 70,
    marginBottom: 8,
  },
  logo: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.black,
    color: SemanticColors.white,
    letterSpacing: -1,
    lineHeight: 50,
  },
  subtitle: {
    fontSize: FontSize.lg,
    color: `rgba(255,255,255,${Opacity.muted})`,
    marginTop: 4,
    lineHeight: 22,
  },
});
