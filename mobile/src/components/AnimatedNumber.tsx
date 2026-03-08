import React, { useEffect } from 'react';
import { TextInput, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { typography } from '../constants/typography';

// AnimatedNumber: counts up from 0 to target value on mount/update
// Uses reanimated for smooth 60fps counting on UI thread
// Renders with tabular-nums to prevent layout shift

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface AnimatedNumberProps {
  value: number;
  /** Duration in ms (default 800) */
  duration?: number;
  /** Format function (default: toLocaleString) */
  format?: (n: number) => string;
  /** Text style */
  style?: TextStyle | TextStyle[];
  /** Prefix string (e.g., "#", "$") */
  prefix?: string;
  /** Suffix string (e.g., " FS", "x") */
  suffix?: string;
}

export function AnimatedNumber({
  value,
  duration = 800,
  format,
  style,
  prefix = '',
  suffix = '',
}: AnimatedNumberProps) {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, duration, animatedValue]);

  const formatFn = format || ((n: number) => Math.round(n).toLocaleString());

  const animatedProps = useAnimatedProps(() => {
    const text = `${prefix}${formatFn(animatedValue.value)}${suffix}`;
    return {
      text,
      defaultValue: text,
    } as any;
  });

  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      style={[
        typography.monoLg,
        { padding: 0, fontVariant: ['tabular-nums'] },
        style,
      ]}
      animatedProps={animatedProps}
    />
  );
}
