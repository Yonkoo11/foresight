/**
 * Ambient Earnings Counter
 * Floating component showing real-time earnings
 * Pull down to expand for detailed view
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';

interface EarningsData {
  last24h: number;
  today: number;
  week: number;
  allTime: number;
  breakdown: {
    source: string;
    amount: number;
    color: string;
  }[];
}

export function AmbientEarnings() {
  const { address, isConnected } = useAccount();
  const [isExpanded, setIsExpanded] = useState(false);
  const [earnings, setEarnings] = useState<EarningsData>({
    last24h: 0,
    today: 0,
    week: 0,
    allTime: 0,
    breakdown: [],
  });

  // Fetch earnings data (mock for now)
  useEffect(() => {
    if (!address) return;

    // TODO: Replace with real API call
    const mockEarnings: EarningsData = {
      last24h: 1.247,
      today: 1.532,
      week: 8.964,
      allTime: 42.187,
      breakdown: [
        { source: 'Gauntlet', amount: 0.876, color: '#00FF88' },
        { source: 'Whisperer', amount: 0.531, color: '#B084FF' },
        { source: 'Arena', amount: 0.125, color: '#FFAA00' },
        { source: 'Staked', amount: -0.05, color: '#FF4466' },
      ],
    };

    setEarnings(mockEarnings);
  }, [address]);

  if (!isConnected || earnings.last24h === 0) return null;

  return (
    <motion.div
      className="fixed top-20 right-4 z-40"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Collapsed State - Floating Cube */}
      <motion.div
        className="relative cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-lg blur-lg" />

        {/* Main Card */}
        <div className="relative bg-gray-900/90 backdrop-blur-md border border-cyan-500/30 rounded-lg px-4 py-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-400 whitespace-nowrap">Last 24h</div>
            <div className="flex items-center gap-1">
              <AnimatedNumber value={earnings.last24h} />
              <span className="text-xs text-gray-500">ETH</span>
            </div>
          </div>

          {/* Expand Indicator */}
          <motion.div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-cyan-400 text-xs"
            animate={{ y: [0, 2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ▼
          </motion.div>
        </div>
      </motion.div>

      {/* Expanded State - Detailed View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute top-full right-0 mt-2 w-72"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-xl blur-xl" />

            {/* Card */}
            <div className="relative bg-gray-900/95 backdrop-blur-md border border-cyan-500/30 rounded-xl p-4 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">💰 Earnings</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Time Period Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <StatCard label="Today" value={earnings.today} color="cyan" />
                <StatCard label="Week" value={earnings.week} color="blue" />
                <StatCard label="All Time" value={earnings.allTime} color="purple" />
              </div>

              {/* Breakdown */}
              <div className="space-y-2">
                <div className="text-xs text-gray-400 mb-2">Breakdown (24h)</div>
                {earnings.breakdown.map((item) => (
                  <div
                    key={item.source}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-gray-300">{item.source}</span>
                    </div>
                    <span
                      className="font-mono font-semibold"
                      style={{ color: item.amount >= 0 ? '#00FF88' : '#FF4466' }}
                    >
                      {item.amount >= 0 ? '+' : ''}
                      {item.amount.toFixed(3)} ETH
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Animated Number Component
function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const current = start + (end - start) * easeOutCubic(progress);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [value]);

  return (
    <motion.span
      className="font-mono font-bold text-lg"
      style={{
        background: 'linear-gradient(90deg, #00D9FF 0%, #00FF88 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {displayValue >= 0 ? '+' : ''}
      {displayValue.toFixed(3)}
    </motion.span>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'cyan' | 'blue' | 'purple';
}) {
  const colorMap = {
    cyan: 'from-cyan-500/20 to-cyan-500/10 border-cyan-500/30 text-cyan-400',
    blue: 'from-blue-500/20 to-blue-500/10 border-blue-500/30 text-blue-400',
    purple:
      'from-purple-500/20 to-purple-500/10 border-purple-500/30 text-purple-400',
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorMap[color]} border rounded-lg p-2 text-center`}
    >
      <div className={`text-xs font-semibold mb-1`}>{value.toFixed(2)}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
