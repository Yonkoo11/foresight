import React, { useCallback } from 'react';
import {
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, TOUCH_MIN } from '../../constants/spacing';
import { haptics } from '../../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  fullWidth?: boolean;
  onPress: () => void;
  children: React.ReactNode;
}

const SPRING_CONFIG = { damping: 15, stiffness: 300 };

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  onPress,
  children,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.97, SPRING_CONFIG);
    }
  }, [disabled, loading, scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const handlePress = useCallback(() => {
    if (!disabled && !loading) {
      haptics.impact();
      onPress();
    }
  }, [disabled, loading, onPress]);

  const variantStyles = VARIANT_STYLES[variant];
  const sizeStyles = SIZE_STYLES[size];
  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      style={[
        styles.base,
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        animatedStyle,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator
          color={variantStyles.textColor}
          size="small"
        />
      ) : (
        <>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={sizeStyles.iconSize}
              color={variantStyles.textColor}
              style={{ marginRight: spacing.sm }}
            />
          )}
          <Text
            style={[
              sizeStyles.text,
              { color: variantStyles.textColor },
            ]}
          >
            {children}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}

// Variant definitions
const VARIANT_STYLES: Record<Variant, { container: ViewStyle; textColor: string }> = {
  primary: {
    container: { backgroundColor: colors.brand },
    textColor: colors.background,
  },
  secondary: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    textColor: '#F0F0F3',
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    textColor: '#A1A1AA',
  },
  danger: {
    container: { backgroundColor: colors.error },
    textColor: '#FFFFFF',
  },
};

// Size definitions
const SIZE_STYLES: Record<Size, { container: ViewStyle; text: TextStyle; iconSize: number }> = {
  sm: {
    container: { height: TOUCH_MIN, paddingHorizontal: spacing.lg },
    text: { ...typography.bodySm, fontWeight: '600' },
    iconSize: 16,
  },
  md: {
    container: { height: 48, paddingHorizontal: spacing.xl },
    text: { ...typography.body, fontWeight: '600' },
    iconSize: 18,
  },
  lg: {
    container: { height: 56, paddingHorizontal: spacing['2xl'] },
    text: { ...typography.body, fontWeight: '700' },
    iconSize: 20,
  },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    minHeight: TOUCH_MIN,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
