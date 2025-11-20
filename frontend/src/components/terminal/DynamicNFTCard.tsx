/**
 * Dynamic NFT Card - Hero Component
 * The centerpiece of the Foresight Terminal dashboard
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NFTArtwork } from './NFTArtwork';
import { StreakWaveform } from './StreakWaveform';
import {
  getForesightData,
  type UserStats,
} from '../../utils/terminal/foresightCalculator';

interface DynamicNFTCardProps {
  stats: UserStats | null;
  isLoading?: boolean;
  onViewProfile?: () => void;
}

export function DynamicNFTCard({
  stats,
  isLoading = false,
  onViewProfile,
}: DynamicNFTCardProps) {
  const [showFlash, setShowFlash] = useState<'success' | 'error' | null>(null);
  const [prevScore, setPrevScore] = useState<number | null>(null);

  // Default stats for loading/empty state
  const defaultStats: UserStats = {
    totalPredictions: 0n,
    resolvedPredictions: 0n,
    correctPredictions: 0n,
    currentStreak: 0n,
    foresightScore: 0n,
  };

  const currentStats = stats || defaultStats;
  const foresightData = getForesightData(currentStats);

  // Detect score changes and trigger animations
  useEffect(() => {
    if (prevScore !== null && stats) {
      const newScore = Number(stats.foresightScore);
      if (newScore > prevScore) {
        // Score improved
        setShowFlash('success');
        setTimeout(() => setShowFlash(null), 800);
      } else if (newScore < prevScore) {
        // Score decreased
        setShowFlash('error');
        setTimeout(() => setShowFlash(null), 800);
      }
    }
    if (stats) {
      setPrevScore(Number(stats.foresightScore));
    }
  }, [stats, prevScore]);

  if (isLoading) {
    return <NFTCardSkeleton />;
  }

  return (
    <motion.div
      className="relative w-full max-w-sm mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Main Card */}
      <motion.div
        className="relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50 overflow-hidden"
        style={{
          boxShadow: `0 0 20px rgba(${hexToRgb(foresightData.levelColor)}, 0.2)`,
        }}
        animate={
          showFlash
            ? {
                boxShadow: [
                  `0 0 20px rgba(${hexToRgb(foresightData.levelColor)}, 0.2)`,
                  `0 0 40px rgba(${showFlash === 'success' ? '0, 255, 136' : '255, 68, 102'}, 0.6)`,
                  `0 0 20px rgba(${hexToRgb(foresightData.levelColor)}, 0.2)`,
                ],
              }
            : {}
        }
        transition={{ duration: 0.8 }}
      >
        {/* Background Glow Effect */}
        <div
          className="absolute inset-0 opacity-10 blur-3xl"
          style={{ backgroundColor: foresightData.levelColor }}
        />

        {/* NFT Artwork */}
        <div className="relative mb-4">
          <motion.div
            className="aspect-square w-full max-w-xs mx-auto rounded-xl overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <NFTArtwork
              level={foresightData.level}
              levelColor={foresightData.levelColor}
              accuracy={foresightData.accuracy}
              streak={foresightData.streakCount}
              animated={!isLoading}
            />
          </motion.div>
        </div>

        {/* Level Badge */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-2xl">{foresightData.levelEmoji}</span>
          <span
            className="text-xl font-bold tracking-wide"
            style={{ color: foresightData.levelColor }}
          >
            {foresightData.level}
          </span>
        </div>

        {/* Streak Waveform */}
        <div className="mb-4">
          <StreakWaveform
            streak={foresightData.streakCount}
            maxStreak={10}
            animated={!isLoading}
            showFlash={showFlash}
          />
        </div>

        {/* Foresight Score */}
        <div className="text-center mb-3">
          <div className="text-sm text-gray-400 mb-1">Foresight Score</div>
          <motion.div
            className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
            key={foresightData.scoreValue}
            initial={{ scale: 1 }}
            animate={
              showFlash
                ? {
                    scale: [1, 1.1, 1],
                  }
                : { scale: 1 }
            }
            transition={{ duration: 0.4 }}
          >
            {foresightData.scoreValue}
          </motion.div>
        </div>

        {/* Sub Stats */}
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-300">
              {Number(currentStats.totalPredictions)}
            </span>
            <span>Predictions</span>
          </div>
          <div className="w-px h-4 bg-gray-600" />
          <div className="flex items-center gap-1">
            <span
              className="font-semibold"
              style={{
                color: foresightData.accuracy >= 60 ? '#00ff88' : '#8b949e',
              }}
            >
              {foresightData.accuracy}%
            </span>
            <span>Accuracy</span>
          </div>
        </div>

        {/* CTA Button */}
        {onViewProfile && (
          <motion.button
            onClick={onViewProfile}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 font-medium transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Full Profile →
          </motion.button>
        )}

        {/* Empty State */}
        {Number(currentStats.totalPredictions) === 0 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center p-6">
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-lg font-semibold text-gray-300 mb-2">
                No Predictions Yet
              </div>
              <div className="text-sm text-gray-500">
                Create your first prediction to start building your foresight reputation
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Level Description */}
      <motion.div
        className="text-center mt-3 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {foresightData.levelDescription}
      </motion.div>
    </motion.div>
  );
}

// ========================================
// Loading Skeleton
// ========================================

function NFTCardSkeleton() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 animate-pulse">
        {/* NFT Artwork Skeleton */}
        <div className="aspect-square w-full max-w-xs mx-auto bg-gray-700/30 rounded-xl mb-4" />

        {/* Level Badge Skeleton */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gray-700/30 rounded" />
          <div className="w-24 h-6 bg-gray-700/30 rounded" />
        </div>

        {/* Waveform Skeleton */}
        <div className="h-1 bg-gray-700/30 rounded-full mb-4" />

        {/* Score Skeleton */}
        <div className="text-center mb-3">
          <div className="w-32 h-4 bg-gray-700/30 rounded mx-auto mb-2" />
          <div className="w-20 h-12 bg-gray-700/30 rounded mx-auto" />
        </div>

        {/* Stats Skeleton */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-24 h-4 bg-gray-700/30 rounded" />
          <div className="w-24 h-4 bg-gray-700/30 rounded" />
        </div>

        {/* Button Skeleton */}
        <div className="w-full h-12 bg-gray-700/30 rounded-lg" />
      </div>
    </div>
  );
}

// ========================================
// Utilities
// ========================================

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 217, 255';
}
