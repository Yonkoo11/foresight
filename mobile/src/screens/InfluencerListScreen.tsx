import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, elevation, textLevels, borders, brandAlpha } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, TOUCH_MIN } from '../constants/spacing';
import { useInfluencers } from '../hooks/useInfluencers';
import { Avatar } from '../components/Avatar';
import { TIER_CONFIG } from '../types';
import type { Influencer } from '../types';
import { haptics } from '../utils/haptics';
import { formatNumber } from '../utils/formatting';

type TierKey = 'S' | 'A' | 'B' | 'C';
const TIER_ORDER: TierKey[] = ['S', 'A', 'B', 'C'];

export default function InfluencerListScreen() {
  const navigation = useNavigation();
  const { data, isLoading, refetch } = useInfluencers({ sortBy: 'points' });
  const [search, setSearch] = useState('');
  const [activeTier, setActiveTier] = useState<TierKey | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    haptics.impact();
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const sections = useMemo(() => {
    const all = data?.influencers ?? [];
    const q = search.toLowerCase().trim();

    const filtered = all.filter((inf) => {
      if (activeTier && inf.tier !== activeTier) return false;
      if (q && !inf.handle.toLowerCase().includes(q) && !inf.name.toLowerCase().includes(q)) return false;
      return true;
    });

    // Group by tier
    const grouped: Record<TierKey, Influencer[]> = { S: [], A: [], B: [], C: [] };
    filtered.forEach((inf) => {
      const t = inf.tier as TierKey;
      if (grouped[t]) grouped[t].push(inf);
    });

    return TIER_ORDER
      .filter((t) => grouped[t].length > 0)
      .map((t) => ({
        title: TIER_CONFIG[t].label,
        tier: t,
        data: grouped[t],
      }));
  }, [data, search, activeTier]);

  const totalCount = data?.influencers?.length ?? 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={textLevels.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>All Influencers</Text>
          <Text style={styles.subtitle}>{totalCount} CT personalities across {TIER_ORDER.length} tiers</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <MaterialCommunityIcons name="magnify" size={18} color={textLevels.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by handle or name..."
          placeholderTextColor={textLevels.muted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialCommunityIcons name="close-circle" size={16} color={textLevels.muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tier Filter Chips */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, !activeTier && styles.filterChipActive]}
          onPress={() => { haptics.selection(); setActiveTier(null); }}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterChipText, !activeTier && styles.filterChipTextActive]}>All</Text>
        </TouchableOpacity>
        {TIER_ORDER.map((t) => {
          const tc = TIER_CONFIG[t];
          const isActive = activeTier === t;
          return (
            <TouchableOpacity
              key={t}
              style={[
                styles.filterChip,
                isActive && { backgroundColor: tc.bg, borderColor: tc.color },
              ]}
              onPress={() => { haptics.selection(); setActiveTier(isActive ? null : t); }}
              activeOpacity={0.7}
            >
              <View style={[styles.filterDot, { backgroundColor: tc.color }]} />
              <Text style={[styles.filterChipText, isActive && { color: tc.color }]}>
                {tc.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Influencer List */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} colors={[colors.brand]} />
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: TIER_CONFIG[section.tier as TierKey].color }]} />
            <Text style={[styles.sectionTitle, { color: TIER_CONFIG[section.tier as TierKey].color }]}>
              {section.title}
            </Text>
            <Text style={styles.sectionCount}>{section.data.length}</Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(Math.min(index * 30, 150)).duration(250)}>
            <InfluencerRow influencer={item} />
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="account-search" size={48} color={textLevels.muted} />
            <Text style={styles.emptyText}>
              {isLoading ? 'Loading influencers...' : 'No influencers match your search'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ─── Influencer Row Card ─────────────────────────────────────────────
function InfluencerRow({ influencer }: { influencer: Influencer }) {
  const tc = TIER_CONFIG[influencer.tier];

  return (
    <View style={styles.rowCard}>
      <Avatar
        uri={influencer.avatar}
        name={influencer.handle}
        size={48}
        borderColor={tc.color}
        borderWidth={2}
      />
      <View style={styles.rowInfo}>
        <View style={styles.rowTop}>
          <Text style={styles.rowHandle} numberOfLines={1}>@{influencer.handle}</Text>
          <View style={[styles.rowTierBadge, { backgroundColor: tc.bg }]}>
            <Text style={[styles.rowTierText, { color: tc.color }]}>{tc.label}</Text>
          </View>
        </View>
        {influencer.name ? (
          <Text style={styles.rowName} numberOfLines={1}>{influencer.name}</Text>
        ) : null}
        <View style={styles.rowStats}>
          <View style={styles.rowStat}>
            <MaterialCommunityIcons name="account-group" size={12} color={textLevels.muted} />
            <Text style={styles.rowStatText}>{formatNumber(influencer.followers)}</Text>
          </View>
          <View style={styles.rowStat}>
            <MaterialCommunityIcons name="lightning-bolt" size={12} color={textLevels.muted} />
            <Text style={styles.rowStatText}>{influencer.totalPoints} pts</Text>
          </View>
          <View style={styles.rowStat}>
            <MaterialCommunityIcons name="currency-usd" size={12} color={colors.brand} />
            <Text style={[styles.rowStatText, { color: colors.brand, fontWeight: '700' }]}>{influencer.price} cr</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  backBtn: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    color: textLevels.primary,
  },
  subtitle: {
    ...typography.caption,
    color: textLevels.muted,
    marginTop: 2,
  },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: elevation.surface,
    borderWidth: 1,
    borderColor: borders.subtle,
    borderRadius: 12,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    height: TOUCH_MIN,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.bodySm,
    color: textLevels.primary,
    paddingVertical: 0,
  },

  // Filter chips
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: elevation.surface,
    borderWidth: 1,
    borderColor: borders.subtle,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    height: 36,
  },
  filterChipActive: {
    backgroundColor: brandAlpha['12'],
    borderColor: colors.brand,
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  filterChipText: {
    ...typography.caption,
    fontWeight: '600',
    color: textLevels.secondary,
  },
  filterChipTextActive: {
    color: colors.brand,
    fontWeight: '700',
  },

  // List
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  sectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: '700',
  },
  sectionCount: {
    ...typography.caption,
    color: textLevels.muted,
    fontWeight: '600',
  },

  // Row card
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: elevation.surface,
    borderWidth: 1,
    borderColor: borders.subtle,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  rowInfo: {
    flex: 1,
    gap: 3,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowHandle: {
    ...typography.bodySm,
    fontWeight: '700',
    color: textLevels.primary,
    flex: 1,
  },
  rowTierBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rowTierText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  rowName: {
    ...typography.caption,
    color: textLevels.secondary,
  },
  rowStats: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: 2,
  },
  rowStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rowStatText: {
    ...typography.caption,
    fontSize: 11,
    color: textLevels.muted,
    fontWeight: '600',
  },

  // Empty
  emptyContainer: {
    alignItems: 'center',
    paddingTop: spacing['3xl'],
    gap: spacing.md,
  },
  emptyText: {
    ...typography.bodySm,
    color: textLevels.muted,
    textAlign: 'center',
  },
});
