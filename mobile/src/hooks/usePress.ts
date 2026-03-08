import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

// Press animation hook following DESIGN_MASTERY §6
// Kowalski: scale(0.97) at 160ms ease-out
// Rauno: ~0.96
// We use spring physics for interruptible, natural-feeling press

const SPRING_CONFIG = { damping: 15, stiffness: 300 };

interface UsePressOptions {
  /** Scale value on press (default 0.97) */
  scale?: number;
}

export function usePress(options?: UsePressOptions) {
  const pressScale = options?.scale ?? 0.97;
  const scaleValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const onPressIn = useCallback(() => {
    scaleValue.value = withSpring(pressScale, SPRING_CONFIG);
  }, [pressScale, scaleValue]);

  const onPressOut = useCallback(() => {
    scaleValue.value = withSpring(1, SPRING_CONFIG);
  }, [scaleValue]);

  return {
    animatedStyle,
    onPressIn,
    onPressOut,
  };
}
