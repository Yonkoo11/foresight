import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, elevation, textLevels, borders, brandAlpha } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, TOUCH_MIN } from '../constants/spacing';
import { useAuth } from '../providers/AuthProvider';
import { useForesightScore } from '../hooks/useForesightScore';
import { useQuestSummary } from '../hooks/useQuests';
import { useSKRBalance } from '../hooks/useSKR';
import { useSolBalance } from '../hooks/useSolBalance';
import { haptics } from '../utils/haptics';
import { truncateAddress, formatNumber, formatSOL } from '../utils/formatting';
import { TIER_CONFIG } from '../types';
import { AnimatedNumber } from '../components/AnimatedNumber';
import type { RootStackParamList } from '../navigation/RootNavigator';

function getTierColor(tier: string): string {
  const key = tier?.charAt(0).toUpperCase() as keyof typeof TIER_CONFIG;
  return TIER_CONFIG[key]?.color ?? textLevels.muted;
}

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, isAuthenticated, logout, refreshUser } = useAuth();
  const { data: fs, isLoading: fsLoading, refetch: refetchFS } = useForesightScore(isAuthenticated);
  const { data: quests } = useQuestSummary(isAuthenticated);
  const { data: skr, isLoading: skrLoading } = useSKRBalance(user?.walletAddress);
  const { data: solBalance } = useSolBalance(user?.walletAddress);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshUser(), refetchFS()]);
    setRefreshing(false);
  }, [refreshUser, refetchFS]);

  const copyAddress = useCallback(async () => {
    if (!user?.walletAddress) return;
    await Clipboard.setStringAsync(user.walletAddress);
    haptics.success();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [user?.walletAddress]);

  const copyReferral = useCallback(async () => {
    if (!user?.referralCode) return;
    await Clipboard.setStringAsync(user.referralCode);
    haptics.success();
  }, [user?.referralCode]);

  // Guest mode — show login prompt (hooks must be above this)
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.guestContainer}>
          <MaterialCommunityIcons name="account-circle-outline" size={64} color={textLevels.muted} />
          <Text style={styles.guestTitle}>Your Profile</Text>
          <Text style={styles.guestSubtitle}>
            Sign in to track your Foresight Score,{'\n'}manage teams, and claim prizes.
          </Text>
          <TouchableOpacity
            style={styles.guestCta}
            onPress={() => navigation.navigate('Auth')}
            activeOpacity={0.8}
          >
            <Text style={styles.guestCtaText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const shareScore = async () => {
    haptics.light();
    const score = fs?.totalScore ?? 0;
    const tier = fs?.tier ?? 'C';
    const tierLabel = TIER_CONFIG[tier as keyof typeof TIER_CONFIG]?.label ?? tier;
    try {
      await Share.share({
        message: `I'm ${tierLabel} tier with a ${formatNumber(score)} Foresight Score on CT Foresight! Draft your CT dream team and compete.\n\nhttps://ct-foresight.xyz/profile`,
      });
    } catch {
      // user cancelled
    }
  };

  const tierProgress = fs?.tierProgress;
  const tierColor = fs ? getTierColor(fs.tier) : textLevels.muted;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.brand}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          {user?.avatarUrl && !avatarError ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={styles.avatar}
              onError={() => setAvatarError(true)}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarLetter}>
                {user?.username?.charAt(0).toUpperCase() ?? '?'}
              </Text>
            </View>
          )}
          <Text style={styles.username}>{user?.username ?? 'Anonymous'}</Text>
          <TouchableOpacity style={styles.addressRow} onPress={copyAddress} activeOpacity={0.7}>
            <Text style={styles.address}>
              {copied ? 'Copied!' : truncateAddress(user?.walletAddress ?? '', 6)}
            </Text>
            <MaterialCommunityIcons
              name={copied ? 'check' : 'content-copy'}
              size={14}
              color={copied ? colors.success : textLevels.muted}
            />
          </TouchableOpacity>
          {solBalance != null && solBalance > 0 && (
            <View style={styles.solBadge}>
              <MaterialCommunityIcons name="circle" size={8} color={colors.success} />
              <Text style={styles.solBadgeText}>◎ {formatSOL(solBalance)} SOL</Text>
            </View>
          )}
          {user?.isFoundingMember && user.foundingMemberNumber && (
            <View style={styles.founderBadge}>
              <MaterialCommunityIcons name="star-four-points" size={14} color={colors.brand} />
              <Text style={styles.founderText}>
                Founding Member #{user.foundingMemberNumber}
              </Text>
            </View>
          )}
        </View>

        {/* Foresight Score Card */}
        {fsLoading && !fs ? (
          <View style={styles.scoreCard}>
            <View style={styles.skeletonLine40} />
            <View style={styles.skeletonLineLarge} />
            <View style={styles.skeletonLine60} />
            <View style={[styles.skeletonProgressBar, { marginTop: 14 }]} />
            <View style={[styles.skeletonLine40, { marginTop: spacing.sm }]} />
          </View>
        ) : fs ? (
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Foresight Score</Text>
            <AnimatedNumber value={fs.totalScore} style={styles.scoreValue} />
            <View style={styles.tierRow}>
              <View style={[styles.tierDot, { backgroundColor: tierColor }]} />
              <Text style={[styles.tierName, { color: tierColor }]}>
                {TIER_CONFIG[fs.tier as keyof typeof TIER_CONFIG]?.label ?? fs.tier}
              </Text>
              {fs.multiplierActive && fs.effectiveMultiplier > 1 && (
                <View style={styles.multiBadge}>
                  <Text style={styles.multiBadgeText}>x{fs.effectiveMultiplier}</Text>
                </View>
              )}
            </View>
            {tierProgress && (
              <>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(tierProgress.progress * 100, 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {tierProgress.currentTier} {'\u2192'} {tierProgress.nextTier}
                  {'  \u00B7  '}
                  {formatNumber(tierProgress.fsToNextTier)} FS to go
                </Text>
              </>
            )}
            <Text style={styles.rankRow}>
              {fs.allTimeRank > 0 ? `#${formatNumber(fs.allTimeRank)}` : 'Unranked'} All-Time  {'\u00B7'}  {fs.seasonRank > 0 ? `#${formatNumber(fs.seasonRank)}` : 'Unranked'} Season
            </Text>
            <TouchableOpacity style={styles.shareScoreBtn} onPress={shareScore} activeOpacity={0.7}>
              <MaterialCommunityIcons name="share-variant" size={16} color={textLevels.secondary} />
              <Text style={styles.shareScoreBtnText}>Share Score</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Season Score</Text>
            <Text style={styles.statValue}>{formatNumber(fs?.seasonScore ?? 0)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Week Score</Text>
            <Text style={styles.statValue}>{formatNumber(fs?.weekScore ?? 0)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>All-Time Rank</Text>
            <Text style={styles.statValue}>{(fs?.allTimeRank ?? 0) > 0 ? `#${formatNumber(fs!.allTimeRank)}` : '-'}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Multiplier</Text>
            <Text style={styles.statValue}>
              {(fs?.effectiveMultiplier ?? 1) > 1 ? `${fs!.effectiveMultiplier}x` : 'None'}
            </Text>
          </View>
        </View>

        {/* Quests Summary */}
        {quests && (
          <View style={styles.questSection}>
            {quests.unclaimed > 0 && (
              <View style={styles.questBanner}>
                <Text style={styles.questBannerText}>
                  {'\uD83C\uDFAF'} {quests.unclaimed} quest reward{quests.unclaimed > 1 ? 's' : ''} to claim
                </Text>
              </View>
            )}
            <Text style={styles.questProgress}>
              {quests.daily.completed}/{quests.daily.total} Daily  {'\u00B7'}  {quests.weekly.completed}/{quests.weekly.total} Weekly
            </Text>
          </View>
        )}

        {/* SKR Status */}
        {skrLoading && !skr ? (
          <View style={styles.skrCard}>
            <View style={styles.skrLeft}>
              <View style={{ width: spacing.xl, height: spacing.xl, borderRadius: spacing.md, backgroundColor: elevation.elevated }} />
              <View>
                <View style={styles.skeletonLine60} />
                <View style={[styles.skeletonLine40, { marginTop: spacing.xs }]} />
              </View>
            </View>
            <View style={styles.skrRight}>
              <View style={styles.skeletonLine40} />
            </View>
          </View>
        ) : skr ? (
          <TouchableOpacity
            style={[styles.skrCard, { borderColor: skr.tierColor + '44' }]}
            onPress={() => navigation.navigate('SKR')}
            activeOpacity={0.7}
          >
            <View style={styles.skrLeft}>
              <MaterialCommunityIcons name="shield-star" size={24} color={skr.tierColor} />
              <View>
                <Text style={styles.skrTitle}>SKR Token</Text>
                <Text style={[styles.skrTier, { color: skr.tierColor }]}>{skr.tierLabel}</Text>
              </View>
            </View>
            <View style={styles.skrRight}>
              <Text style={styles.skrBalance}>{formatNumber(skr.balance)}</Text>
              {skr.fsMultiplier > 1 && (
                <Text style={styles.skrMulti}>{skr.fsMultiplier}x FS</Text>
              )}
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={textLevels.muted} />
          </TouchableOpacity>
        ) : null}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionRow} onPress={copyReferral} activeOpacity={0.7}>
            <MaterialCommunityIcons name="gift-outline" size={20} color={textLevels.secondary} />
            <Text style={styles.actionText}>Referral Code: {user?.referralCode ?? '---'}</Text>
            <MaterialCommunityIcons name="content-copy" size={16} color={textLevels.muted} />
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => { haptics.impact(); logout(); }}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="logout" size={20} color={colors.error} />
            <Text style={[styles.actionText, { color: colors.error }]}>Sign Out</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={textLevels.muted} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const BRAND_BG = brandAlpha['12'];
const cardBase = {
  backgroundColor: elevation.surface,
  borderWidth: 1,
  borderColor: borders.subtle,
} as const;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: elevation.base },
  scroll: { paddingBottom: spacing['3xl'] },
  header: { alignItems: 'center', paddingTop: spacing.xl, paddingBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  avatarFallback: { backgroundColor: colors.brand, justifyContent: 'center', alignItems: 'center' },
  avatarLetter: { ...typography.h1, fontSize: 32, color: colors.black },
  username: { ...typography.h1, fontSize: 22, color: textLevels.primary, marginTop: spacing.md },
  addressRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: spacing.xs, minHeight: TOUCH_MIN,
  },
  address: { ...typography.caption, fontSize: 13, color: textLevels.muted },
  solBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: elevation.surface, borderWidth: 1, borderColor: borders.subtle,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2, borderRadius: 8,
    marginTop: spacing.sm,
  },
  solBadgeText: { ...typography.mono, fontSize: 13, fontWeight: '600', color: textLevels.primary },
  founderBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm,
    backgroundColor: BRAND_BG, paddingHorizontal: 10, paddingVertical: spacing.xs, borderRadius: spacing.md,
  },
  founderText: { ...typography.caption, fontWeight: '600', color: colors.brand },
  scoreCard: {
    ...cardBase, marginHorizontal: spacing.lg, marginTop: spacing.xs,
    borderRadius: spacing.md, padding: 20, alignItems: 'center',
  },
  scoreLabel: { ...typography.label, color: textLevels.muted },
  scoreValue: {
    ...typography.monoLg, fontSize: 40, fontWeight: '700',
    color: textLevels.primary, marginTop: 2,
  },
  tierRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  tierDot: { width: spacing.sm, height: spacing.sm, borderRadius: spacing.xs },
  tierName: { ...typography.bodySm, fontWeight: '600' },
  multiBadge: {
    backgroundColor: brandAlpha['15'], paddingHorizontal: 6,
    paddingVertical: 2, borderRadius: 6, marginLeft: spacing.xs,
  },
  multiBadgeText: { ...typography.caption, fontSize: 11, fontWeight: '700', color: colors.brand },
  progressBar: {
    width: '100%', height: 6, backgroundColor: elevation.elevated,
    borderRadius: 3, marginTop: 14, overflow: 'hidden',
  },
  progressFill: { height: 6, backgroundColor: colors.brand, borderRadius: 3 },
  progressText: { ...typography.caption, color: textLevels.muted, marginTop: 6 },
  rankRow: { ...typography.bodySm, fontSize: 13, color: textLevels.secondary, marginTop: spacing.md },
  shareScoreBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    marginTop: spacing.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    backgroundColor: elevation.elevated, borderRadius: spacing.sm, minHeight: 36,
  },
  shareScoreBtnText: { ...typography.caption, fontWeight: '600', color: textLevels.secondary },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: spacing.lg, marginTop: spacing.lg, gap: 10,
  },
  statCard: { ...cardBase, width: '48%', flexGrow: 1, borderRadius: spacing.sm, padding: 14 },
  statLabel: { ...typography.label, color: textLevels.muted },
  statValue: {
    ...typography.mono, fontSize: 20, fontWeight: '700',
    color: textLevels.primary, marginTop: 2,
  },
  questSection: { marginHorizontal: spacing.lg, marginTop: spacing.lg },
  questBanner: {
    backgroundColor: BRAND_BG, borderRadius: spacing.sm,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  questBannerText: { ...typography.bodySm, fontWeight: '600', color: colors.brand, textAlign: 'center' },
  questProgress: { ...typography.bodySm, fontSize: 13, color: textLevels.secondary, textAlign: 'center' },
  skrCard: {
    ...cardBase, flexDirection: 'row', alignItems: 'center',
    marginHorizontal: spacing.lg, marginTop: spacing.lg,
    borderRadius: spacing.md, padding: spacing.lg, gap: spacing.md,
    minHeight: TOUCH_MIN,
  },
  skrLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  skrTitle: { ...typography.bodySm, fontWeight: '600', color: textLevels.primary },
  skrTier: { ...typography.caption, fontWeight: '700' },
  skrRight: { alignItems: 'flex-end', marginRight: spacing.xs },
  skrBalance: { ...typography.mono, fontSize: 16, fontWeight: '700', color: textLevels.primary },
  skrMulti: { ...typography.caption, fontSize: 11, fontWeight: '600', color: colors.brand },
  actions: {
    ...cardBase, marginHorizontal: spacing.lg, marginTop: spacing.xl,
    borderRadius: spacing.md, overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: 14,
    gap: 10, minHeight: TOUCH_MIN,
  },
  actionText: { ...typography.bodySm, flex: 1, color: textLevels.primary },
  separator: { height: 1, backgroundColor: borders.subtle, marginHorizontal: spacing.lg },
  // Guest mode
  guestContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: spacing['2xl'], gap: spacing.md,
  },
  guestTitle: { ...typography.h1, fontSize: 22, color: textLevels.primary },
  guestSubtitle: { ...typography.body, fontSize: 15, color: textLevels.secondary, textAlign: 'center', lineHeight: 22 },
  guestCta: {
    backgroundColor: colors.brand, paddingVertical: 14, paddingHorizontal: 40,
    borderRadius: spacing.md, marginTop: spacing.lg, minHeight: TOUCH_MIN,
  },
  guestCtaText: { ...typography.body, fontWeight: '700', color: elevation.base },

  // Skeleton styles
  skeletonLine40: { height: spacing.md, width: '40%', borderRadius: 6, backgroundColor: elevation.elevated },
  skeletonLine60: { height: spacing.md, width: '60%', borderRadius: 6, backgroundColor: elevation.elevated },
  skeletonLineLarge: {
    height: spacing['2xl'], width: '50%', borderRadius: spacing.sm,
    backgroundColor: elevation.elevated, marginTop: spacing.sm, alignSelf: 'center' as const,
  },
  skeletonProgressBar: { height: 6, width: '100%', borderRadius: 3, backgroundColor: elevation.elevated },
});
