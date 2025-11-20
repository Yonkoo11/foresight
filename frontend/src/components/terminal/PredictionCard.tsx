/**
 * Prediction Card Component
 * Individual card for prediction tape scroll
 */

import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { formatEther } from 'viem';

export interface Prediction {
  id: bigint;
  text: string;
  creator: `0x${string}`;
  lockPeriod: bigint;
  createdAt: bigint;
  stake: bigint;
  resolved: boolean;
  success?: boolean;
}

interface PredictionCardProps {
  prediction: Prediction;
  onClick?: () => void;
  index?: number;
}

export function PredictionCard({ prediction, onClick, index = 0 }: PredictionCardProps) {
  const createdAtMs = Number(prediction.createdAt) * 1000;
  const lockPeriodSeconds = Number(prediction.lockPeriod);
  const expiresAtMs = createdAtMs + lockPeriodSeconds * 1000;
  const now = Date.now();

  const isExpired = now >= expiresAtMs;
  const isReadyToMark = isExpired && !prediction.resolved;

  // Calculate progress percentage
  const totalDuration = lockPeriodSeconds * 1000;
  const elapsed = now - createdAtMs;
  const progress = Math.min((elapsed / totalDuration) * 100, 100);

  // Determine card state
  const getCardState = () => {
    if (prediction.resolved) {
      return prediction.success ? 'resolved-correct' : 'resolved-wrong';
    }
    if (isReadyToMark) {
      return 'ready';
    }
    return 'active';
  };

  const cardState = getCardState();

  const stateStyles = {
    active: {
      border: 'border-cyan-500/30',
      bg: 'bg-gray-800/50',
      glow: '',
    },
    ready: {
      border: 'border-green-500/50',
      bg: 'bg-green-500/5',
      glow: 'shadow-lg shadow-green-500/20',
    },
    'resolved-correct': {
      border: 'border-green-500/30',
      bg: 'bg-green-500/10',
      glow: '',
    },
    'resolved-wrong': {
      border: 'border-red-500/30',
      bg: 'bg-red-500/10',
      glow: '',
    },
  };

  const styles = stateStyles[cardState];

  return (
    <motion.div
      className={`flex-shrink-0 w-72 ${styles.bg} ${styles.border} ${styles.glow} border rounded-xl p-4 cursor-pointer hover:bg-gray-700/50 transition-all duration-200`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          {/* Creator Address */}
          <p className="text-xs text-gray-500 mb-1 truncate">
            {prediction.creator.slice(0, 6)}...{prediction.creator.slice(-4)}
          </p>

          {/* Prediction Text */}
          <p className="text-sm text-gray-200 font-medium line-clamp-2">
            {prediction.text}
          </p>
        </div>

        {/* Status Badge */}
        <StatusBadge state={cardState} />
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-1 bg-gray-700/50 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              cardState === 'resolved-correct'
                ? 'bg-green-500'
                : cardState === 'resolved-wrong'
                ? 'bg-red-500'
                : cardState === 'ready'
                ? 'bg-green-500'
                : 'bg-cyan-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        {/* Time Info */}
        <div className="flex items-center gap-1 text-gray-400">
          {prediction.resolved ? (
            <>
              <span>✓</span>
              <span>Resolved</span>
            </>
          ) : isReadyToMark ? (
            <>
              <span className="animate-pulse text-green-400">●</span>
              <span className="text-green-400 font-medium">Ready to mark</span>
            </>
          ) : (
            <>
              <span>⏳</span>
              <span>
                {formatDistanceToNow(expiresAtMs, { addSuffix: false })} left
              </span>
            </>
          )}
        </div>

        {/* Stake Amount */}
        {prediction.stake > 0n && (
          <div className="flex items-center gap-1 text-purple-400 font-medium">
            <span>💰</span>
            <span>{formatEther(prediction.stake)} ETH</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ========================================
// Status Badge Component
// ========================================

function StatusBadge({ state }: { state: string }) {
  const badgeConfig = {
    active: {
      icon: '⏳',
      label: 'Active',
      color: 'text-cyan-400 bg-cyan-500/10',
    },
    ready: {
      icon: '✓',
      label: 'Ready',
      color: 'text-green-400 bg-green-500/10',
    },
    'resolved-correct': {
      icon: '✅',
      label: 'Correct',
      color: 'text-green-400 bg-green-500/10',
    },
    'resolved-wrong': {
      icon: '❌',
      label: 'Wrong',
      color: 'text-red-400 bg-red-500/10',
    },
  };

  const config = badgeConfig[state as keyof typeof badgeConfig];

  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
}

// ========================================
// Empty Card (Loading Skeleton)
// ========================================

export function PredictionCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-72 bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 animate-pulse">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1">
          <div className="w-20 h-3 bg-gray-700/30 rounded mb-2" />
          <div className="w-full h-4 bg-gray-700/30 rounded mb-1" />
          <div className="w-3/4 h-4 bg-gray-700/30 rounded" />
        </div>
        <div className="w-16 h-6 bg-gray-700/30 rounded-full" />
      </div>
      <div className="h-1 bg-gray-700/30 rounded-full mb-3" />
      <div className="flex items-center justify-between">
        <div className="w-24 h-3 bg-gray-700/30 rounded" />
        <div className="w-16 h-3 bg-gray-700/30 rounded" />
      </div>
    </div>
  );
}
