/**
 * Duel Face-Off Component
 * Dramatic combat-style visualization for Arena duels
 * Shows two cards facing off with fight night aesthetics
 */

import { motion, AnimatePresence } from 'framer-motion';
import { type Duel } from './DuelCard';
import { useState } from 'react';

interface DuelFaceOffProps {
  duel: Duel;
  onVote?: (position: 'creator' | 'opponent') => void;
  showResult?: boolean;
  winner?: 'creator' | 'opponent' | null;
}

export function DuelFaceOff({ duel, onVote, showResult = false, winner = null }: DuelFaceOffProps) {
  const [hoveredSide, setHoveredSide] = useState<'creator' | 'opponent' | null>(null);
  const [floatingEmojis, setFloatingEmojis] = useState<Array<{ id: number; emoji: string; x: number }>>([]);

  const creatorVotePercent = duel.totalVotes
    ? Math.round((Number(duel.creatorVotes || 0) / Number(duel.totalVotes)) * 100)
    : 50;
  const opponentVotePercent = 100 - creatorVotePercent;

  const handleVote = (position: 'creator' | 'opponent') => {
    // Add floating emoji on vote
    const emoji = ['🔥', '💀', '🤯', '⚡'][Math.floor(Math.random() * 4)];
    const newEmoji = {
      id: Date.now() + Math.random(),
      emoji,
      x: position === 'creator' ? 25 : 75,
    };
    setFloatingEmojis((prev) => [...prev, newEmoji]);

    // Remove emoji after animation
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id));
    }, 2000);

    onVote?.(position);
  };

  return (
    <div className="relative min-h-[400px] bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800">
      {/* Stadium Lighting Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Crowd Reaction Emojis */}
      <AnimatePresence>
        {floatingEmojis.map((item) => (
          <motion.div
            key={item.id}
            className="absolute bottom-0 text-3xl pointer-events-none"
            style={{ left: `${item.x}%` }}
            initial={{ y: 0, opacity: 1, scale: 1 }}
            animate={{ y: -200, opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="relative p-6">
        {/* Duel Info Header */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-full mb-3">
            <span className="text-orange-400 font-bold text-sm uppercase tracking-wider">
              ⚔️ {duel.duelType} Duel
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{duel.question}</h3>
          <div className="text-sm text-gray-400">
            Stake: {(Number(duel.stake) / 1e18).toFixed(3)} ETH
          </div>
        </div>

        {/* Face-Off Cards */}
        <div className="relative grid grid-cols-2 gap-8 mb-6">
          {/* Creator Card */}
          <motion.div
            className="relative"
            onHoverStart={() => setHoveredSide('creator')}
            onHoverEnd={() => setHoveredSide(null)}
            whileHover={{ scale: 1.05, z: 50 }}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Winner Explosion Effect */}
            {showResult && winner === 'creator' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-2xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 2, opacity: 0.5 }}
                transition={{ duration: 0.5 }}
              />
            )}

            <DuelFighterCard
              position="creator"
              name="Creator"
              stance={duel.creatorPosition}
              votePercent={creatorVotePercent}
              isHovered={hoveredSide === 'creator'}
              isWinner={winner === 'creator'}
              onVote={() => handleVote('creator')}
              disabled={showResult}
            />
          </motion.div>

          {/* VS Divider */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div
              className="relative"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center border-4 border-black shadow-2xl">
                <span className="text-white font-black text-2xl">VS</span>
              </div>
              {/* Lightning Bolts */}
              <motion.div
                className="absolute -top-2 -left-2 text-yellow-400"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ⚡
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -right-2 text-yellow-400"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              >
                ⚡
              </motion.div>
            </motion.div>
          </div>

          {/* Opponent Card */}
          <motion.div
            className="relative"
            onHoverStart={() => setHoveredSide('opponent')}
            onHoverEnd={() => setHoveredSide(null)}
            whileHover={{ scale: 1.05, z: 50 }}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Winner Explosion Effect */}
            {showResult && winner === 'opponent' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur-2xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 2, opacity: 0.5 }}
                transition={{ duration: 0.5 }}
              />
            )}

            <DuelFighterCard
              position="opponent"
              name="Opponent"
              stance={duel.creatorPosition === 'YES' ? 'NO' : 'Disagrees'}
              votePercent={opponentVotePercent}
              isHovered={hoveredSide === 'opponent'}
              isWinner={winner === 'opponent'}
              onVote={() => handleVote('opponent')}
              disabled={showResult}
            />
          </motion.div>
        </div>

        {/* Betting Odds Display */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="flex-1 bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Odds</div>
            <div className="text-lg font-bold text-orange-400">
              {creatorVotePercent}%
            </div>
          </div>
          <div className="text-gray-600">•</div>
          <div className="flex-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Odds</div>
            <div className="text-lg font-bold text-cyan-400">
              {opponentVotePercent}%
            </div>
          </div>
        </div>

        {/* Result Banner */}
        {showResult && winner && (
          <motion.div
            className="mt-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-2xl font-bold text-yellow-400">
              🏆 {winner === 'creator' ? 'Creator' : 'Opponent'} Wins!
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Individual Fighter Card
interface DuelFighterCardProps {
  position: 'creator' | 'opponent';
  name: string;
  stance: string;
  votePercent: number;
  isHovered: boolean;
  isWinner: boolean;
  onVote: () => void;
  disabled: boolean;
}

function DuelFighterCard({
  position,
  name,
  stance,
  votePercent,
  isHovered,
  isWinner,
  onVote,
  disabled,
}: DuelFighterCardProps) {
  const cardColor = position === 'creator' ? 'orange' : 'cyan';
  const gradientFrom = position === 'creator' ? 'from-orange-500/20' : 'from-cyan-500/20';
  const gradientTo = position === 'creator' ? 'to-red-500/20' : 'to-blue-500/20';
  const borderColor = position === 'creator' ? 'border-orange-500/50' : 'border-cyan-500/50';
  const textColor = position === 'creator' ? 'text-orange-400' : 'text-cyan-400';

  return (
    <motion.div
      className={`relative bg-gradient-to-br ${gradientFrom} ${gradientTo} border-2 ${borderColor} rounded-xl p-4 cursor-pointer`}
      style={{
        boxShadow: isHovered
          ? `0 0 30px ${position === 'creator' ? '#ff6600' : '#00d9ff'}50`
          : 'none',
      }}
      onClick={!disabled ? onVote : undefined}
      animate={{
        borderColor: isWinner
          ? ['#ffaa00', '#ffff00', '#ffaa00']
          : isHovered
          ? [
              position === 'creator' ? '#ff6600' : '#00d9ff',
              position === 'creator' ? '#ff3300' : '#00aaff',
              position === 'creator' ? '#ff6600' : '#00d9ff',
            ]
          : position === 'creator'
          ? '#ff660080'
          : '#00d9ff80',
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {/* Glow effect on hover */}
      {isHovered && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl blur-xl`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
        />
      )}

      <div className="relative space-y-3">
        {/* Fighter Name */}
        <div className={`text-xs font-bold ${textColor} uppercase tracking-wider`}>
          {name}
        </div>

        {/* Stance */}
        <div className="text-white font-semibold text-sm min-h-[40px]">
          {stance}
        </div>

        {/* Vote Percentage */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Community</span>
            <span className={`font-bold ${textColor}`}>{votePercent}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${
                position === 'creator'
                  ? 'from-orange-500 to-red-500'
                  : 'from-cyan-500 to-blue-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${votePercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Vote Button */}
        {!disabled && (
          <button
            className={`w-full py-2 bg-gradient-to-r ${
              position === 'creator'
                ? 'from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400'
                : 'from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400'
            } text-white rounded-lg font-semibold text-sm transition-all`}
          >
            Vote
          </button>
        )}

        {/* Winner Badge */}
        {isWinner && (
          <motion.div
            className="absolute -top-2 -right-2 bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            👑
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
