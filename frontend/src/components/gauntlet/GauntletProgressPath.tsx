/**
 * Gauntlet Progress Path Component
 * Rogue-like progression visualization with checkpoints and tension
 * Shows 5-prediction journey with visual milestones
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface GauntletProgressPathProps {
  totalPredictions: number; // Always 5 for gauntlet
  submittedCount: number; // How many submitted (0-5)
  correctCount?: number; // How many correct (0-5), undefined if not resolved
  isResolved?: boolean;
}

export function GauntletProgressPath({
  totalPredictions = 5,
  submittedCount,
  correctCount,
  isResolved = false,
}: GauntletProgressPathProps) {
  const [hoveredCheckpoint, setHoveredCheckpoint] = useState<number | null>(null);
  const [showMilestonePopup, setShowMilestonePopup] = useState(false);

  // Checkpoints: 0, 1, 2, 3, 4, 5
  const checkpoints = Array.from({ length: totalPredictions + 1 }, (_, i) => i);

  // Determine checkpoint status
  const getCheckpointStatus = (index: number): 'completed' | 'current' | 'upcoming' | 'failed' => {
    if (isResolved && correctCount !== undefined) {
      if (index <= correctCount) return 'completed';
      return 'failed';
    }

    if (index < submittedCount) return 'completed';
    if (index === submittedCount) return 'current';
    return 'upcoming';
  };

  // Checkpoint milestone info
  const getMilestoneInfo = (index: number) => {
    switch (index) {
      case 0:
        return { label: 'Start', reward: 'Entry', color: '#6B7280' };
      case 1:
        return { label: '1/5', reward: 'In Progress', color: '#8B949E' };
      case 2:
        return { label: '2/5', reward: 'Halfway', color: '#9CA3AF' };
      case 3:
        return { label: '3/5', reward: 'Qualify (15%)', color: '#FCD34D', important: true };
      case 4:
        return { label: '4/5', reward: 'Strong (35%)', color: '#22D3EE', important: true };
      case 5:
        return { label: '5/5', reward: 'Perfect (50%)', color: '#10B981', important: true };
      default:
        return { label: `${index}/5`, reward: '', color: '#6B7280' };
    }
  };

  // Show milestone popup when reaching important checkpoints
  useEffect(() => {
    if (submittedCount === 3 || submittedCount === 4 || submittedCount === 5) {
      setShowMilestonePopup(true);
      const timer = setTimeout(() => setShowMilestonePopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [submittedCount]);

  // Calculate tension level (0-100)
  const tensionLevel = isResolved
    ? correctCount !== undefined && correctCount >= 3
      ? 100 // Success
      : 0 // Failed
    : (submittedCount / totalPredictions) * 100;

  return (
    <div className="relative">
      {/* Tension Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-gray-400">
            {isResolved ? 'Final Results' : 'Gauntlet Progress'}
          </div>
          <div className="text-sm text-gray-400">
            {isResolved
              ? `${correctCount || 0}/5 Correct`
              : `${submittedCount}/5 Submitted`}
          </div>
        </div>

        {/* Tension Health Bar */}
        <div className="relative h-4 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-yellow-900/20 to-green-900/20" />

          {/* Progress Fill */}
          <motion.div
            className={`h-full ${
              tensionLevel < 40
                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                : tensionLevel < 80
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                : 'bg-gradient-to-r from-green-500 to-emerald-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${tensionLevel}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Pulsing effect when active */}
          {!isResolved && submittedCount > 0 && submittedCount < 5 && (
            <motion.div
              className="absolute inset-0 bg-white/10"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          {/* Checkpoint markers on bar */}
          {checkpoints.slice(1).map((checkpoint) => (
            <div
              key={checkpoint}
              className="absolute top-0 bottom-0 w-0.5 bg-gray-700"
              style={{ left: `${(checkpoint / totalPredictions) * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* Progress Path Visualization */}
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-gray-800 rounded-full" style={{ marginLeft: '24px', marginRight: '24px' }}>
          {/* Active Progress Line */}
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(submittedCount / totalPredictions) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        {/* Checkpoints */}
        <div className="relative flex justify-between items-start pt-2">
          {checkpoints.map((index) => {
            const status = getCheckpointStatus(index);
            const milestone = getMilestoneInfo(index);
            const isHovered = hoveredCheckpoint === index;

            return (
              <div
                key={index}
                className="flex flex-col items-center flex-1"
                onMouseEnter={() => setHoveredCheckpoint(index)}
                onMouseLeave={() => setHoveredCheckpoint(null)}
              >
                {/* Checkpoint Node */}
                <motion.div
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                    status === 'completed'
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-2 border-green-400 shadow-lg shadow-green-500/50'
                      : status === 'current'
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-500 border-2 border-cyan-400 shadow-lg shadow-cyan-500/50'
                      : status === 'failed'
                      ? 'bg-gradient-to-br from-red-500 to-orange-500 border-2 border-red-400 shadow-lg shadow-red-500/30'
                      : 'bg-gray-800 border-2 border-gray-600'
                  }`}
                  whileHover={{ scale: 1.15, y: -5 }}
                  animate={
                    status === 'current'
                      ? {
                          scale: [1, 1.1, 1],
                          boxShadow: [
                            '0 0 0px rgba(34, 211, 238, 0.5)',
                            '0 0 20px rgba(34, 211, 238, 0.8)',
                            '0 0 0px rgba(34, 211, 238, 0.5)',
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {/* Icon */}
                  <span className="text-white font-bold text-sm">
                    {status === 'completed'
                      ? '✓'
                      : status === 'failed'
                      ? '✕'
                      : status === 'current'
                      ? '⭐'
                      : index}
                  </span>

                  {/* Importance Ring for milestones */}
                  {milestone.important && status !== 'failed' && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2"
                      style={{ borderColor: milestone.color }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.8, 0.3, 0.8],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                {/* Checkpoint Label */}
                <div className="mt-3 text-center">
                  <div
                    className={`text-xs font-bold mb-1 ${
                      status === 'completed'
                        ? 'text-green-400'
                        : status === 'current'
                        ? 'text-cyan-400'
                        : status === 'failed'
                        ? 'text-red-400'
                        : 'text-gray-500'
                    }`}
                  >
                    {milestone.label}
                  </div>
                  <div className="text-xs text-gray-600">{milestone.reward}</div>
                </div>

                {/* Hover Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute top-16 mt-8 bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl z-20 w-32"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="text-xs text-gray-300 mb-1 font-semibold">
                        {milestone.label}
                      </div>
                      <div className="text-xs text-gray-500">{milestone.reward}</div>
                      {milestone.important && (
                        <div
                          className="text-xs font-bold mt-2"
                          style={{ color: milestone.color }}
                        >
                          Milestone!
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone Achievement Popup */}
      <AnimatePresence>
        {showMilestonePopup && submittedCount >= 3 && (
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <div className="bg-gradient-to-br from-yellow-500/30 via-orange-500/30 to-red-500/30 border-2 border-yellow-500/60 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
              <div className="text-center">
                <div className="text-5xl mb-3">
                  {submittedCount === 3 ? '🎯' : submittedCount === 4 ? '💪' : '🏆'}
                </div>
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  {submittedCount === 3
                    ? 'Qualified!'
                    : submittedCount === 4
                    ? 'Strong Run!'
                    : 'Perfect Score!'}
                </div>
                <div className="text-sm text-gray-300">
                  {submittedCount === 3
                    ? '3/5 - You qualify for rewards'
                    : submittedCount === 4
                    ? '4/5 - Solid performance'
                    : '5/5 - Maximum rewards!'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Risk Indicator (when not resolved and progress is low) */}
      {!isResolved && submittedCount > 0 && submittedCount < 3 && (
        <motion.div
          className="mt-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <div className="text-sm font-bold text-red-400 mb-1">Risk Zone</div>
              <div className="text-xs text-gray-400">
                You need at least 3/5 correct to qualify for rewards
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Success Message (when resolved with 3+ correct) */}
      {isResolved && correctCount !== undefined && correctCount >= 3 && (
        <motion.div
          className="mt-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">
              {correctCount === 5 ? '🏆' : correctCount === 4 ? '🎯' : '✅'}
            </div>
            <div>
              <div className="text-sm font-bold text-green-400 mb-1">
                {correctCount === 5
                  ? 'Perfect Score!'
                  : correctCount === 4
                  ? 'Strong Performance!'
                  : 'Qualified!'}
              </div>
              <div className="text-xs text-gray-400">
                {correctCount}/5 correct • You earned rewards
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Failure Message (when resolved with <3 correct) */}
      {isResolved && correctCount !== undefined && correctCount < 3 && (
        <motion.div
          className="mt-6 bg-gray-800/50 border border-gray-700 rounded-lg p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">😔</div>
            <div>
              <div className="text-sm font-bold text-gray-400 mb-1">
                Did Not Qualify
              </div>
              <div className="text-xs text-gray-500">
                {correctCount}/5 correct • Need 3+ to earn rewards
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Compact version for sidebar/header
export function GauntletProgressCompact({
  submittedCount,
  totalPredictions = 5,
}: {
  submittedCount: number;
  totalPredictions?: number;
}) {
  const progress = (submittedCount / totalPredictions) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{submittedCount}/{totalPredictions}</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Mini Checkpoints */}
      <div className="flex gap-1">
        {Array.from({ length: totalPredictions }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < submittedCount
                ? 'bg-green-500'
                : i === submittedCount
                ? 'bg-cyan-500 animate-pulse'
                : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
