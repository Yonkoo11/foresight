import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, elevation, borders, textLevels } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, TOUCH_MIN } from '../constants/spacing';

interface Props {
  icon: string;
  title: string;
  message: string;
  onDismiss: () => void;
}

export function OnboardingTip({ icon, title, message, onDismiss }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MaterialCommunityIcons name={icon as any} size={20} color={colors.brand} />
        <View style={styles.textWrap}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.dismiss}
        onPress={onDismiss}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <MaterialCommunityIcons name="close" size={16} color={textLevels.muted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: elevation.surface,
    borderWidth: 1,
    borderColor: borders.default,
    borderLeftWidth: 3,
    borderLeftColor: colors.brand,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    ...typography.bodySm,
    fontWeight: '700',
    color: textLevels.primary,
    marginBottom: 2,
  },
  message: {
    ...typography.caption,
    color: textLevels.secondary,
    lineHeight: 18,
  },
  dismiss: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
});
