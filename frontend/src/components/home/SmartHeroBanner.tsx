/**
 * Smart Hero Banner
 * Adapts based on user state (new vs connected with stats)
 */

import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { useNFTData } from '../../hooks/terminal/useNFTData';
import { getForesightData } from '../../utils/terminal/foresightCalculator';
import { StreakFlame } from '../StreakFlame';

export function SmartHeroBanner() {
  const { isConnected } = useAccount();
  const { stats } = useNFTData();

  // Determine if user has activity
  const hasActivity = stats && Number(stats.totalPredictions) > 0;

  if (!isConnected) {
    return <NewUserHero />;
  }

  if (hasActivity) {
    return <ActiveUserHero stats={stats} />;
  }

  return <ConnectedNoActivityHero />;
}

// ========================================
// New User Hero (Not Connected)
// ========================================

function NewUserHero() {
  return (
    <motion.div
      className="text-center mb-12 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-6">
        <motion.div
          className="text-7xl mb-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          🔮
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          Build Your Onchain
          <br />
          Foresight Reputation
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Make predictions. Build your streak. Earn a dynamic NFT that evolves with your accuracy.
        </p>
      </div>

      {/* Value Props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
        <div className="bg-gray-800/50 border border-cyan-500/30 rounded-lg p-4">
          <div className="text-3xl mb-2">⏱️</div>
          <div className="font-semibold text-cyan-400 mb-1">Time-Locked</div>
          <div className="text-sm text-gray-400">
            Predictions locked onchain
          </div>
        </div>
        <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4">
          <div className="text-3xl mb-2">🎯</div>
          <div className="font-semibold text-purple-400 mb-1">Verifiable</div>
          <div className="text-sm text-gray-400">
            Transparent accuracy tracking
          </div>
        </div>
        <div className="bg-gray-800/50 border border-blue-500/30 rounded-lg p-4">
          <div className="text-3xl mb-2">🏆</div>
          <div className="font-semibold text-blue-400 mb-1">Dynamic NFT</div>
          <div className="text-sm text-gray-400">
            Evolves as you improve
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md mx-auto">
        <p className="text-sm text-gray-400 mb-2">
          👆 Connect your wallet above to start
        </p>
        <p className="text-xs text-gray-600">
          Your foresight journey begins here
        </p>
      </div>
    </motion.div>
  );
}

// ========================================
// Active User Hero (Has Stats)
// ========================================

function ActiveUserHero({ stats }: { stats: any }) {
  const foresightData = getForesightData(stats);

  return (
    <motion.div
      className="mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Enhanced NFT Preview */}
      <div className="relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 max-w-md mx-auto mb-6 overflow-hidden">
        {/* Animated Background Glow */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${foresightData.levelColor}40, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="relative text-center">
          {/* Level Badge with Animation */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 10,
            }}
          >
            <motion.span
              className="text-4xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {foresightData.levelEmoji}
            </motion.span>
            <span
              className="text-3xl font-bold"
              style={{ color: foresightData.levelColor }}
            >
              {foresightData.level}
            </span>
          </motion.div>

          {/* Quick Stats with Animations */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <StatBox
              value={Number(stats.totalPredictions)}
              label="Predictions"
              color="#00D9FF"
            />
            <StatBox
              value={`${foresightData.accuracy}%`}
              label="Accuracy"
              color={foresightData.accuracy >= 60 ? '#00FF88' : '#8B949E'}
              pulseOnMilestone={foresightData.accuracy >= 67}
            />
            <div className="flex flex-col items-center justify-center">
              <StreakFlame streak={foresightData.streakCount} size="sm" showCount={false} />
              <div className="text-lg font-bold text-orange-400 mt-1">
                {foresightData.streakCount}
              </div>
              <div className="text-xs text-gray-500">Streak</div>
            </div>
          </div>

          {/* Foresight Score */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-1">Foresight Score</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {foresightData.scoreValue}
            </div>
          </div>

          {/* CTA to Terminal */}
          <Link
            to="/terminal"
            className="block w-full py-3 px-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 font-medium transition-all duration-200"
          >
            Open Foresight Terminal →
          </Link>
        </div>
      </div>

      {/* Contextual message */}
      <p className="text-center text-sm text-gray-500">
        Your prediction identity is live. Choose a game mode below.
      </p>
    </motion.div>
  );
}

// ========================================
// Animated Stat Box Component
// ========================================

interface StatBoxProps {
  value: string | number;
  label: string;
  color: string;
  pulseOnMilestone?: boolean;
}

function StatBox({ value, label, color, pulseOnMilestone = false }: StatBoxProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="text-2xl font-bold"
        style={{ color }}
        animate={
          pulseOnMilestone
            ? {
                scale: [1, 1.1, 1],
                textShadow: [
                  `0 0 0px ${color}`,
                  `0 0 10px ${color}`,
                  `0 0 0px ${color}`,
                ],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: pulseOnMilestone ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        {value}
      </motion.div>
      <div className="text-xs text-gray-500">{label}</div>
    </motion.div>
  );
}

// ========================================
// Connected No Activity Hero
// ========================================

function ConnectedNoActivityHero() {
  return (
    <motion.div
      className="text-center mb-12 py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-5xl mb-4">🎯</div>
      <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Ready to Build Your Reputation?
      </h2>
      <p className="text-gray-400 mb-6 max-w-xl mx-auto">
        Make your first prediction to unlock your dynamic NFT and start earning your foresight score.
      </p>

      <Link
        to="/terminal"
        className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg shadow-cyan-500/30"
      >
        Create First Prediction
      </Link>
    </motion.div>
  );
}
