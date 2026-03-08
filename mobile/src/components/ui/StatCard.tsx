import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  mono?: boolean;
}

export function StatCard({
  label,
  value,
  icon,
  iconColor,
  trend,
  mono = true,
}: StatCardProps) {
  return (
    <View style={styles.container}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={16}
          color={iconColor || colors.textMuted}
          style={styles.icon}
        />
      )}
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, mono && styles.mono]}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Text>
        {trend && trend !== 'neutral' && (
          <MaterialCommunityIcons
            name={trend === 'up' ? 'arrow-up' : 'arrow-down'}
            size={14}
            color={trend === 'up' ? colors.success : colors.error}
            style={{ marginLeft: spacing.xs }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 8,
    padding: spacing.lg,
    flexGrow: 1,
    minWidth: '45%',
  },
  icon: {
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.label,
    color: '#71717A',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  value: {
    ...typography.h2,
    color: '#F0F0F3',
  },
  mono: {
    fontVariant: ['tabular-nums'],
  },
});
