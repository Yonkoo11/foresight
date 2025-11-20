/**
 * Streak Waveform Component
 * Animated gradient bar that grows/shrinks with streak
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface StreakWaveformProps {
  streak: number;
  maxStreak?: number;
  animated?: boolean;
  showFlash?: 'success' | 'error' | null;
}

export function StreakWaveform({
  streak,
  maxStreak = 10,
  animated = true,
  showFlash = null,
}: StreakWaveformProps) {
  const [prevStreak, setPrevStreak] = useState(streak);
  const widthPercentage = Math.min((streak / maxStreak) * 100, 100);

  useEffect(() => {
    setPrevStreak(streak);
  }, [streak]);

  return (
    <div className="relative w-full h-1 bg-gray-800/50 rounded-full overflow-hidden">
      {/* Base waveform */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background: 'linear-gradient(90deg, #00ff88 0%, #00d9ff 100%)',
          backgroundSize: '200% 100%',
        }}
        initial={{ width: `${(prevStreak / maxStreak) * 100}%` }}
        animate={{
          width: `${widthPercentage}%`,
          backgroundPosition: animated ? ['0% 50%', '100% 50%'] : '0% 50%',
        }}
        transition={{
          width: { duration: 0.8, ease: 'easeOut' },
          backgroundPosition: {
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      />

      {/* Flash overlay */}
      {showFlash && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              showFlash === 'success'
                ? 'rgba(0, 255, 136, 0.8)'
                : 'rgba(255, 68, 102, 0.8)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8 }}
        />
      )}
    </div>
  );
}
