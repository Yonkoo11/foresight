/**
 * Streak Flame Component
 * Grows in size and intensity based on streak count
 * Visual feedback for prediction streaks
 */

import { motion } from 'framer-motion';

interface StreakFlameProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function StreakFlame({ streak, size = 'md', showCount = true }: StreakFlameProps) {
  // Calculate flame intensity based on streak
  const getFlameData = (streak: number) => {
    if (streak === 0) {
      return {
        emoji: '🔥',
        color: '#8B949E',
        scale: 0.8,
        glow: 'rgba(139, 148, 158, 0.2)',
        intensity: 'cold',
      };
    }

    if (streak < 3) {
      return {
        emoji: '🔥',
        color: '#FFAA00',
        scale: 1,
        glow: 'rgba(255, 170, 0, 0.3)',
        intensity: 'warm',
      };
    }

    if (streak < 7) {
      return {
        emoji: '🔥',
        color: '#FF6600',
        scale: 1.2,
        glow: 'rgba(255, 102, 0, 0.4)',
        intensity: 'hot',
      };
    }

    if (streak < 15) {
      return {
        emoji: '🔥',
        color: '#FF3300',
        scale: 1.4,
        glow: 'rgba(255, 51, 0, 0.5)',
        intensity: 'blazing',
      };
    }

    // 15+ streak = legendary
    return {
      emoji: '🔥',
      color: '#FF0088',
      scale: 1.6,
      glow: 'rgba(255, 0, 136, 0.6)',
      intensity: 'legendary',
    };
  };

  const flame = getFlameData(streak);

  // Size variants
  const sizeMap = {
    sm: { emoji: 'text-2xl', count: 'text-xs', container: 'gap-1' },
    md: { emoji: 'text-4xl', count: 'text-sm', container: 'gap-2' },
    lg: { emoji: 'text-6xl', count: 'text-base', container: 'gap-3' },
  };

  const sizeClasses = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${sizeClasses.container}`}>
      {/* Animated Flame */}
      <motion.div
        className="relative"
        animate={{
          scale: [flame.scale, flame.scale * 1.1, flame.scale],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{ backgroundColor: flame.glow }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Flame Emoji */}
        <span className={`relative ${sizeClasses.emoji}`}>{flame.emoji}</span>
      </motion.div>

      {/* Streak Count */}
      {showCount && (
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span
            className={`${sizeClasses.count} font-bold font-mono`}
            style={{ color: flame.color }}
          >
            {streak}
          </span>
          <span className="text-xs text-gray-500">streak</span>
        </motion.div>
      )}
    </div>
  );
}

// Streak Achievement Badge (shows when milestone reached)
interface StreakMilestoneProps {
  streak: number;
  onClose?: () => void;
}

export function StreakMilestone({ streak, onClose }: StreakMilestoneProps) {
  const getMilestoneMessage = (streak: number) => {
    if (streak === 3) return { title: '🔥 On Fire!', subtitle: '3 streak combo' };
    if (streak === 7)
      return { title: '🔥🔥 Unstoppable!', subtitle: 'Week-long streak' };
    if (streak === 15)
      return { title: '🔥🔥🔥 Legendary!', subtitle: '15 streak master' };
    if (streak === 30)
      return { title: '👑 Oracle Status', subtitle: 'Month streak legend' };
    return null;
  };

  const milestone = getMilestoneMessage(streak);
  if (!milestone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20 border-2 border-orange-500/50 rounded-2xl p-8 max-w-sm mx-4"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 10 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
        }}
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-2xl blur-2xl" />

        {/* Content */}
        <div className="relative text-center">
          <StreakFlame streak={streak} size="lg" showCount={false} />
          <h3 className="text-2xl font-bold text-white mt-4 mb-2">
            {milestone.title}
          </h3>
          <p className="text-gray-300 mb-6">{milestone.subtitle}</p>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white rounded-lg font-semibold transition-all"
          >
            Keep Going
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
