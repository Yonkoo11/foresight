import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TIER_CONFIG } from '../../types';
import { typography } from '../../constants/typography';

type TierKey = keyof typeof TIER_CONFIG;
type BadgeVariant = 'filled' | 'dot';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  tier: TierKey;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export function Badge({ tier, variant = 'filled', size = 'sm' }: BadgeProps) {
  const config = TIER_CONFIG[tier];
  if (!config) return null;

  if (variant === 'dot') {
    return (
      <View style={styles.dotContainer}>
        <View style={[styles.dot, { backgroundColor: config.color }]} />
        <Text style={[
          size === 'sm' ? styles.dotTextSm : styles.dotTextMd,
          { color: config.color },
        ]}>
          {tier}
        </Text>
      </View>
    );
  }

  // Filled variant
  const isSmall = size === 'sm';
  return (
    <View style={[
      styles.filled,
      isSmall ? styles.filledSm : styles.filledMd,
      { backgroundColor: config.bg },
    ]}>
      <Text style={[
        isSmall ? styles.filledTextSm : styles.filledTextMd,
        { color: config.color },
      ]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Dot variant
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotTextSm: {
    ...typography.caption,
    fontWeight: '700',
  },
  dotTextMd: {
    ...typography.bodySm,
    fontWeight: '700',
  },

  // Filled variant
  filled: {
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  filledSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  filledMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  filledTextSm: {
    fontSize: 10,
    fontWeight: '700',
  },
  filledTextMd: {
    ...typography.caption,
    fontWeight: '700',
  },
});
