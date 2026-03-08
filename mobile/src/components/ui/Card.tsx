import React, { useCallback } from 'react';
import { StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { haptics } from '../../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Variant = 'default' | 'elevated' | 'interactive' | 'highlight';
type Padding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  variant?: Variant;
  padding?: Padding;
  onPress?: () => void;
  accentColor?: string;
  style?: ViewStyle;
  children: React.ReactNode;
}

const PADDING_MAP: Record<Padding, number> = {
  none: 0,
  sm: spacing.md,
  md: spacing.lg,
  lg: spacing.xl,
};

const SPRING_CONFIG = { damping: 15, stiffness: 300 };

export function Card({
  variant = 'default',
  padding = 'md',
  onPress,
  accentColor,
  style,
  children,
}: CardProps) {
  const scale = useSharedValue(1);
  const isInteractive = variant === 'interactive' || !!onPress;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (isInteractive) {
      scale.value = withSpring(0.98, SPRING_CONFIG);
    }
  }, [isInteractive, scale]);

  const handlePressOut = useCallback(() => {
    if (isInteractive) {
      scale.value = withSpring(1, SPRING_CONFIG);
    }
  }, [isInteractive, scale]);

  const handlePress = useCallback(() => {
    if (onPress) {
      haptics.selection();
      onPress();
    }
  }, [onPress]);

  const variantStyle = VARIANT_STYLES[variant];
  const paddingValue = PADDING_MAP[padding];

  const containerStyle: ViewStyle[] = [
    styles.base,
    variantStyle,
    { padding: paddingValue },
  ];

  // Highlight variant: left accent border
  if (variant === 'highlight') {
    containerStyle.push({
      borderLeftWidth: 4,
      borderLeftColor: accentColor || colors.brand,
    });
  }

  if (style) containerStyle.push(style);

  if (isInteractive) {
    return (
      <AnimatedPressable
        style={[...containerStyle, animatedStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <Animated.View style={containerStyle}>
      {children}
    </Animated.View>
  );
}

const VARIANT_STYLES: Record<Variant, ViewStyle> = {
  default: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  elevated: {
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  interactive: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  highlight: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});
