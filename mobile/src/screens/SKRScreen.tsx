import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, elevation, textLevels, borders, brandAlpha } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, TOUCH_MIN } from '../constants/spacing';
import { useAuth } from '../providers/AuthProvider';
import { useSKRBalance, TIERS } from '../hooks/useSKR';
import { formatNumber } from '../utils/formatting';

const TIER_ORDER = ['bronze', 'silver', 'gold'] as const;

export default function SKRScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { data: skr, isLoading, refetch } = useSKRBalance(user?.walletAddress);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />}
      >
        {/* Header */}
        <Text style={s.title}>SKR Token</Text>
        <Text style={s.subtitle}>Stake SKR to unlock premium features and boost your Foresight Score</Text>

        {/* Balance Card */}
        <View style={s.balanceCard}>
          <Text style={s.balanceLabel}>YOUR SKR BALANCE</Text>
          <Text style={s.balanceValue}>
            {isLoading ? '...' : formatNumber(skr?.balance ?? 0)}
          </Text>
          <View style={s.tierRow}>
            <View style={[s.tierDot, { backgroundColor: skr?.tierColor ?? textLevels.muted }]} />
            <Text style={[s.tierName, { color: skr?.tierColor ?? textLevels.muted }]}>
              {skr?.tierLabel ?? (user?.walletAddress ? 'Loading...' : 'No Wallet')}
            </Text>
            {skr && skr.fsMultiplier > 1 && (
              <View style={s.multiplierBadge}>
                <Text style={s.multiplierText}>{skr.fsMultiplier}x FS</Text>
              </View>
            )}
          </View>
          {skr?.nextTier && (
            <Text style={s.nextTierText}>
              {formatNumber(skr.toNextTier)} SKR to {skr.nextTier}
            </Text>
          )}
        </View>

        {/* Tier Benefits */}
        <Text style={s.sectionTitle}>Staking Tiers</Text>
        {TIER_ORDER.map((tierKey) => {
          const t = TIERS[tierKey];
          const isActive = skr && skr.balance >= t.min;
          const isCurrent = skr?.tier === tierKey;

          return (
            <View key={tierKey} style={[s.tierCard, isCurrent && { borderColor: t.color, borderWidth: 1.5 }]}>
              <View style={s.tierCardHeader}>
                <View style={[s.tierIcon, { backgroundColor: t.color + '22' }]}>
                  <MaterialCommunityIcons
                    name={tierKey === 'gold' ? 'crown' : tierKey === 'silver' ? 'shield-star' : 'shield'}
                    size={20}
                    color={t.color}
                  />
                </View>
                <View style={s.tierCardInfo}>
                  <Text style={[s.tierCardName, { color: t.color }]}>{t.label}</Text>
                  <Text style={s.tierCardMin}>{formatNumber(t.min)}+ SKR</Text>
                </View>
                {isActive && (
                  <View style={[s.unlockedBadge, { backgroundColor: t.color + '22' }]}>
                    <Text style={[s.unlockedText, { color: t.color }]}>
                      {isCurrent ? 'CURRENT' : 'UNLOCKED'}
                    </Text>
                  </View>
                )}
              </View>

              {/* Progress bar for current/next tier */}
              {isCurrent && skr?.nextTier && (() => {
                const nextKey = TIER_ORDER[TIER_ORDER.indexOf(tierKey) + 1];
                const range = nextKey ? TIERS[nextKey].min - t.min : 1;
                const pct = Math.min(100, ((skr.balance - t.min) / (range || 1)) * 100);
                return (
                  <View style={s.progressWrap}>
                    <View style={s.progressTrack}>
                      <View style={[s.progressFill, { backgroundColor: t.color, width: `${pct}%` }]} />
                    </View>
                  </View>
                );
              })()}

              <View style={s.benefitsList}>
                <BenefitRow
                  icon="flash"
                  text={`${t.multiplier}x Foresight Score multiplier`}
                  color={t.color}
                  active={!!isActive}
                />
                {tierKey === 'silver' && (
                  <BenefitRow
                    icon="trophy"
                    text="Access to Pro Contests (higher prizes, smaller fields)"
                    color={t.color}
                    active={!!isActive}
                  />
                )}
                {tierKey === 'gold' && (
                  <>
                    <BenefitRow
                      icon="trophy"
                      text="Access to all Pro Contests"
                      color={t.color}
                      active={!!isActive}
                    />
                    <BenefitRow
                      icon="eye"
                      text="Priority drafting (see stats 1hr early)"
                      color={t.color}
                      active={!!isActive}
                    />
                  </>
                )}
              </View>
            </View>
          );
        })}

        {/* How SKR Works */}
        <View style={s.infoCard}>
          <MaterialCommunityIcons name="information-outline" size={18} color={colors.cyan} />
          <View style={s.infoContent}>
            <Text style={s.infoTitle}>How SKR works</Text>
            <Text style={s.infoText}>
              SKR is the native token of the Solana Mobile ecosystem. Hold SKR in your wallet to automatically unlock tier benefits. Top contest finishers earn bonus SKR rewards.
            </Text>
          </View>
        </View>

        {/* Earn CTA */}
        <TouchableOpacity
          style={s.earnCta}
          onPress={() => (navigation as any).navigate('Main', { screen: 'Compete' })}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="trophy-outline" size={20} color={elevation.base} />
          <Text style={s.earnCtaText}>Earn SKR by placing in contests</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function BenefitRow({ icon, text, color, active }: { icon: string; text: string; color: string; active: boolean }) {
  return (
    <View style={s.benefitRow}>
      <MaterialCommunityIcons
        name={icon as any}
        size={14}
        color={active ? color : textLevels.muted}
      />
      <Text style={[s.benefitText, !active && { color: textLevels.muted }]}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: elevation.base },
  scroll: { padding: spacing.xl, paddingBottom: spacing['3xl'] },

  title: { ...typography.h1, fontSize: 28, fontWeight: '800', color: textLevels.primary, marginBottom: spacing.xs },
  subtitle: { ...typography.bodySm, color: textLevels.secondary, marginBottom: spacing.xl },

  // Balance Card
  balanceCard: {
    backgroundColor: elevation.surface, borderWidth: 1, borderColor: borders.subtle,
    borderRadius: spacing.lg, padding: spacing.xl, marginBottom: spacing['2xl'], alignItems: 'center',
  },
  balanceLabel: {
    ...typography.label, fontSize: 11, color: textLevels.muted,
    letterSpacing: 1, marginBottom: spacing.sm,
  },
  balanceValue: {
    ...typography.monoLg, fontSize: 44, fontWeight: '800', color: textLevels.primary,
    marginBottom: spacing.sm,
  },
  tierRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  tierDot: { width: 10, height: 10, borderRadius: 5 },
  tierName: { ...typography.body, fontWeight: '700' },
  multiplierBadge: {
    backgroundColor: brandAlpha['12'], paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: 6,
  },
  multiplierText: { ...typography.caption, color: colors.brand, fontWeight: '700' },
  nextTierText: { ...typography.caption, fontSize: 13, color: textLevels.muted, marginTop: spacing.xs },

  // Section
  sectionTitle: { ...typography.h2, color: textLevels.primary, marginBottom: spacing.md },

  // Tier Card
  tierCard: {
    backgroundColor: elevation.surface, borderWidth: 1, borderColor: borders.subtle,
    borderRadius: spacing.md, padding: spacing.lg, marginBottom: spacing.md,
  },
  tierCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  tierIcon: {
    width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center',
    marginRight: spacing.md,
  },
  tierCardInfo: { flex: 1 },
  tierCardName: { ...typography.body, fontWeight: '700' },
  tierCardMin: { ...typography.mono, fontSize: 12, color: textLevels.muted },
  unlockedBadge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: 6 },
  unlockedText: { ...typography.label, fontSize: 10 },

  progressWrap: { marginBottom: spacing.md },
  progressTrack: { height: spacing.xs, backgroundColor: elevation.elevated, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: spacing.xs, borderRadius: 2 },

  benefitsList: { gap: 6 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: TOUCH_MIN },
  benefitText: { ...typography.bodySm, fontSize: 13, color: textLevels.secondary, flex: 1 },

  // Info Card
  infoCard: {
    flexDirection: 'row', backgroundColor: elevation.surface, borderWidth: 1, borderColor: borders.subtle,
    borderRadius: spacing.md, padding: spacing.lg, marginTop: spacing.lg, gap: spacing.md,
  },
  infoContent: { flex: 1 },
  infoTitle: { ...typography.bodySm, fontWeight: '700', color: textLevels.primary, marginBottom: spacing.xs },
  infoText: { ...typography.bodySm, fontSize: 13, color: textLevels.secondary, lineHeight: 18 },
  earnCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, backgroundColor: colors.brand, borderRadius: spacing.md, paddingVertical: 14,
    marginTop: spacing.xl, minHeight: TOUCH_MIN,
  },
  earnCtaText: { ...typography.bodySm, fontSize: 15, fontWeight: '700', color: elevation.base },
});
