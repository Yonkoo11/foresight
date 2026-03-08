import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, elevation, textLevels, borders } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, TOUCH_MIN } from '../constants/spacing';
import { useAuth } from '../providers/AuthProvider';
import { useCTFeed, useHighlights } from '../hooks/useFeed';
import { useTrackActivity } from '../hooks/useForesightScore';
import { formatNumber, getAvatarColor, timeAgo } from '../utils/formatting';
import { haptics } from '../utils/haptics';
import type { Tweet } from '../types';

// ─── Filter types ─────────────────────────────────────────────────────
type FilterKey = 'all' | 'highlights' | 'rising';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'highlights', label: 'Highlights' },
  { key: 'rising', label: 'Rising' },
];

// ─── FeedScreen ───────────────────────────────────────────────────────
export default function FeedScreen() {
  const { isAuthenticated } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [refreshing, setRefreshing] = useState(false);

  const { data: feedData, isLoading: feedLoading, isError: feedError, refetch: refetchFeed } = useCTFeed(activeFilter);
  const { data: highlights, refetch: refetchHighlights } = useHighlights('24h');
  const trackActivity = useTrackActivity();
  const hasTracked = useRef(false);

  // Track browse activity on mount (only for authenticated users)
  useEffect(() => {
    if (!hasTracked.current && isAuthenticated) {
      hasTracked.current = true;
      trackActivity.mutate('browse_ct_feed');
    }
  }, [isAuthenticated]);

  const [loadingMore, setLoadingMore] = useState(false);
  const tweets = useMemo(() => feedData?.tweets ?? [], [feedData]);
  const highlightTweets = useMemo(() => {
    if (activeFilter === 'all') return highlights ?? feedData?.highlights ?? [];
    return [];
  }, [activeFilter, highlights, feedData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    haptics.impact();
    await Promise.all([refetchFeed(), refetchHighlights()]);
    setRefreshing(false);
  }, [refetchFeed, refetchHighlights]);

  const onFilterPress = useCallback((key: FilterKey) => {
    haptics.selection();
    setActiveFilter(key);
  }, []);

  // ── Header component for FlatList ──────────────────────────────
  const ListHeader = useMemo(
    () => (
      <>
        {/* Highlights carousel (only in "All" filter) */}
        {activeFilter === 'all' && highlightTweets.length > 0 && (
          <View style={styles.highlightsSection}>
            <Text style={styles.sectionLabel}>Top Highlights</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.highlightsScroll}
            >
              {highlightTweets.map((tweet, index) => (
                <HighlightCard key={tweet.id} tweet={tweet} isTop={index === 0} />
              ))}
            </ScrollView>
          </View>
        )}
      </>
    ),
    [activeFilter, highlightTweets],
  );

  // ── Loading skeleton ───────────────────────────────────────────
  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View key={i} style={styles.skeletonCard}>
          <View style={styles.skeletonAvatar} />
          <View style={styles.skeletonBody}>
            <View style={[styles.skeletonLine, { width: '40%' }]} />
            <View style={[styles.skeletonLine, { width: '90%' }]} />
            <View style={[styles.skeletonLine, { width: '65%' }]} />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header + Filter Tabs ─────────────── */}
      <View style={styles.header}>
        <Text style={styles.title}>CT Feed</Text>
      </View>
      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterTab, activeFilter === f.key && styles.filterTabActive]}
              activeOpacity={0.7}
              onPress={() => onFilterPress(f.key)}
              hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
            >
              <Text
                style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Error Banner ──────────────────────── */}
      {feedError && (
        <TouchableOpacity
          style={styles.errorBanner}
          activeOpacity={0.8}
          onPress={onRefresh}
        >
          <MaterialCommunityIcons name="wifi-off" size={16} color={colors.brand} />
          <Text style={styles.errorBannerText}>
            Couldn't load feed. Tap to retry.
          </Text>
        </TouchableOpacity>
      )}

      {/* ── Feed ─────────────────────────────── */}
      {feedLoading && !refreshing ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={tweets}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(Math.min(index * 50, 250)).duration(300)}>
              <TweetCard tweet={item} />
            </Animated.View>
          )}
          ListHeaderComponent={ListHeader}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.feedContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.brand}
              colors={[colors.brand]}
            />
          }
          onEndReached={() => {
            // Show loading indicator briefly for perceived infinite scroll
            if (tweets.length > 0 && !loadingMore) {
              setLoadingMore(true);
              setTimeout(() => setLoadingMore(false), 800);
            }
          }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={loadingMore ? (
            <ActivityIndicator color={colors.brand} style={{ paddingVertical: 20 }} />
          ) : null}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="newspaper-variant-outline" size={40} color={textLevels.muted} />
              <Text style={styles.emptyText}>No tweets yet</Text>
              <Text style={styles.emptySubtext}>Pull to refresh or try a different filter</Text>
            </View>
          }
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Highlight Card ───────────────────────────────────────────────────
function HighlightCard({ tweet, isTop }: { tweet: Tweet; isTop: boolean }) {
  return (
    <View style={[styles.highlightCard, isTop && styles.highlightCardTop]}>
      {/* Author row */}
      <View style={styles.highlightAuthor}>
        <View style={[styles.highlightAvatar, { backgroundColor: getAvatarColor(tweet.authorHandle ?? 'unknown') }]}>
          <Text style={styles.highlightAvatarLetter}>
            {tweet.authorHandle?.charAt(0).toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={styles.highlightHandle} numberOfLines={1}>
          @{tweet.authorHandle}
        </Text>
        <Text style={styles.timestamp}>{timeAgo(tweet.createdAt)}</Text>
      </View>
      {/* Text */}
      <Text style={styles.highlightText} numberOfLines={2}>
        {tweet.text}
      </Text>
      {/* Engagement */}
      <View style={styles.engagementRow}>
        <EngagementStat icon="heart" count={tweet.likes} />
        <EngagementStat icon="repeat-variant" count={tweet.retweets} />
        <EngagementStat icon="comment-outline" count={tweet.replies} />
      </View>
    </View>
  );
}

// ─── Tweet Card ───────────────────────────────────────────────────────
const TweetCard = React.memo(function TweetCard({ tweet }: { tweet: Tweet }) {
  return (
    <View style={styles.tweetCard}>
      {/* Avatar */}
      <View style={[styles.tweetAvatar, { backgroundColor: getAvatarColor(tweet.authorHandle ?? 'unknown') }]}>
        <Text style={styles.tweetAvatarLetter}>
          {tweet.authorHandle?.charAt(0).toUpperCase() ?? '?'}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.tweetContent}>
        <View style={styles.tweetHeaderRow}>
          <Text style={styles.tweetHandle} numberOfLines={1}>
            @{tweet.authorHandle}
          </Text>
          <Text style={styles.timestamp}>{timeAgo(tweet.createdAt)}</Text>
        </View>
        <Text style={styles.tweetText} numberOfLines={3}>
          {tweet.text}
        </Text>
        {/* Engagement row */}
        <View style={styles.tweetEngagement}>
          <EngagementStat icon="heart" count={tweet.likes} />
          <EngagementStat icon="repeat-variant" count={tweet.retweets} />
          <EngagementStat icon="comment-outline" count={tweet.replies} />
          <EngagementStat icon="eye-outline" count={tweet.views} />
        </View>
      </View>
    </View>
  );
});

// ─── Small Engagement Stat ────────────────────────────────────────────
function EngagementStat({ icon, count }: { icon: string; count: number }) {
  return (
    <View style={styles.engagementStat}>
      <MaterialCommunityIcons
        name={icon as any}
        size={14}
        color={textLevels.muted}
      />
      <Text style={styles.engagementCount}>{formatNumber(count)}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: elevation.base,
  },

  // Header
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    fontSize: 28,
    fontWeight: '800',
    color: textLevels.primary,
  },

  // Filter tabs
  filterRow: {
    borderBottomWidth: 1,
    borderBottomColor: borders.subtle,
  },
  filterScroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  filterTab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: elevation.surface,
    borderWidth: 1,
    borderColor: borders.default,
    minHeight: TOUCH_MIN,
    justifyContent: 'center',
  },
  filterTabActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  filterText: {
    ...typography.bodySm,
    fontWeight: '600',
    color: textLevels.secondary,
  },
  filterTextActive: {
    color: colors.black,
  },

  // Highlights section
  highlightsSection: {
    paddingTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    ...typography.label,
    color: textLevels.secondary,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  highlightsScroll: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  highlightCard: {
    width: 280,
    backgroundColor: elevation.surface,
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: borders.default,
    padding: spacing.md + 2, // ~14px, closest to original
  },
  highlightCardTop: {
    borderColor: colors.brand,
    borderWidth: 1.5,
  },
  highlightAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  highlightAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: elevation.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightAvatarLetter: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.brand,
  },
  highlightHandle: {
    ...typography.h2,
    flex: 1,
  },
  highlightText: {
    ...typography.bodySm,
    color: textLevels.secondary,
    marginBottom: 10,
  },

  // Feed
  feedContent: {
    paddingBottom: spacing['2xl'],
  },
  separator: {
    height: 1,
    backgroundColor: borders.subtle,
    marginHorizontal: spacing.xl,
  },

  // Tweet card
  tweetCard: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md + 2, // ~14px
    gap: spacing.md,
  },
  tweetAvatar: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    borderRadius: TOUCH_MIN / 2,
    backgroundColor: elevation.surface,
    borderWidth: 1,
    borderColor: borders.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tweetAvatarLetter: {
    ...typography.bodySm,
    fontWeight: '700',
    color: colors.cyan,
  },
  tweetContent: {
    flex: 1,
  },
  tweetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  tweetHandle: {
    ...typography.bodySm,
    fontWeight: '700',
    color: textLevels.primary,
    flexShrink: 1,
  },
  timestamp: {
    ...typography.caption,
    color: textLevels.muted,
    marginLeft: spacing.sm,
  },
  tweetText: {
    ...typography.body,
    color: textLevels.secondary,
    marginBottom: 10,
  },
  tweetEngagement: {
    flexDirection: 'row',
    gap: spacing.lg,
  },

  // Engagement stat
  engagementRow: {
    flexDirection: 'row',
    gap: spacing.md + 2, // ~14px, closest to original
  },
  engagementStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  engagementCount: {
    ...typography.caption,
    color: textLevels.muted,
    fontVariant: ['tabular-nums'],
  },

  // Skeleton loading
  skeletonContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  skeletonCard: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  skeletonAvatar: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    borderRadius: TOUCH_MIN / 2,
    backgroundColor: elevation.surface,
  },
  skeletonBody: {
    flex: 1,
    gap: spacing.sm,
  },
  skeletonLine: {
    height: spacing.md,
    borderRadius: 6,
    backgroundColor: elevation.surface,
  },

  // Error banner
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: spacing.md + 2,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    gap: spacing.sm,
    minHeight: TOUCH_MIN,
  },
  errorBannerText: {
    ...typography.bodySm,
    fontWeight: '600',
    color: colors.brand,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    fontWeight: '600',
    color: textLevels.secondary,
  },
  emptySubtext: {
    ...typography.caption,
    fontSize: 13,
    color: textLevels.muted,
  },
});
