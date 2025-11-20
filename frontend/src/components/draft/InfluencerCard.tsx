/**
 * InfluencerCard Component
 * Shows an influencer available for drafting with rarity system
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendUp, Lightning, Crown, Star } from '@phosphor-icons/react';

export interface Influencer {
  id: bigint;
  name: string;
  handle: string;
  avatar?: string; // Profile picture URL
  bio?: string; // Twitter bio
  tier: 'S' | 'A' | 'B' | 'C';
  weeklyScore: bigint;
  totalDrafts: bigint;
  price: bigint; // Cost to draft
}

interface InfluencerCardProps {
  influencer: Influencer;
  onDraft?: (influencerId: bigint) => void;
  onClick?: (influencer: Influencer) => void;
  disabled?: boolean;
  inTeam?: boolean;
}

export function InfluencerCard({ influencer, onDraft, onClick, disabled, inTeam }: InfluencerCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const tierColors = {
    S: 'from-yellow-500 to-orange-500',
    A: 'from-purple-500 to-pink-500',
    B: 'from-blue-500 to-cyan-500',
    C: 'from-gray-500 to-gray-600',
  };

  const tierBadgeColors = {
    S: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    A: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    B: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    C: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  // Rarity system
  const rarityInfo = {
    S: { name: 'Legendary', icon: Crown, glow: 'shadow-yellow-500/50', particles: true },
    A: { name: 'Epic', icon: Lightning, glow: 'shadow-purple-500/50', particles: true },
    B: { name: 'Rare', icon: Star, glow: 'shadow-blue-500/30', particles: false },
    C: { name: 'Common', icon: TrendUp, glow: 'shadow-gray-500/20', particles: false },
  };

  const rarity = rarityInfo[influencer.tier];
  const RarityIcon = rarity.icon;

  return (
    <motion.div
      className={`relative bg-gray-800/50 border rounded-xl p-4 transition-all cursor-pointer overflow-hidden ${
        inTeam
          ? 'border-cyan-500 bg-cyan-500/10'
          : `border-gray-700 hover:border-gray-600 hover:bg-gray-800/70 ${rarity.glow} hover:shadow-xl`
      }`}
      onClick={() => onClick?.(influencer)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Holographic Background Effect for High Tiers */}
      {(influencer.tier === 'S' || influencer.tier === 'A') && (
        <motion.div
          className={`absolute inset-0 opacity-20 bg-gradient-to-br ${tierColors[influencer.tier]}`}
          animate={isHovered ? {
            background: [
              `linear-gradient(135deg, var(--tw-gradient-stops))`,
              `linear-gradient(225deg, var(--tw-gradient-stops))`,
              `linear-gradient(315deg, var(--tw-gradient-stops))`,
              `linear-gradient(135deg, var(--tw-gradient-stops))`,
            ],
          } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Animated Border Glow for Legendary */}
      {influencer.tier === 'S' && (
        <motion.div
          className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tierColors[influencer.tier]} opacity-30 blur-lg`}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Floating Particles for Rare Cards */}
      {rarity.particles && isHovered && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${tierColors[influencer.tier]}`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [-10, -30, -10],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </>
      )}

      <div className="relative z-10">
        {/* Rarity Badge */}
        <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 bg-gray-900/95 backdrop-blur-sm rounded-full border border-gray-700">
          <RarityIcon size={12} className={`${tierBadgeColors[influencer.tier].split(' ')[1]}`} weight="fill" />
          <span className={`text-xs font-bold ${tierBadgeColors[influencer.tier].split(' ')[1]}`}>
            {rarity.name}
          </span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-3 mb-3 mt-2">
          {/* Avatar with Glow */}
          <motion.div
            className={`relative w-12 h-12 rounded-full border-2 ${tierBadgeColors[influencer.tier].replace('bg-', 'border-').replace('/20', '')}`}
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {influencer.avatar && !imageError ? (
              <img
                src={influencer.avatar}
                alt={influencer.name}
                className="w-full h-full rounded-full object-cover bg-gray-700"
                onError={(_e) => {
                  console.log('Failed to load avatar for', influencer.handle, 'URL:', influencer.avatar);
                  setImageError(true);
                }}
              />
            ) : (
              <div className={`w-full h-full rounded-full bg-gradient-to-r ${tierColors[influencer.tier]} flex items-center justify-center text-white font-bold`}>
                {influencer.name.charAt(0)}
              </div>
            )}

            {/* Avatar Glow Ring for High Tiers */}
            {(influencer.tier === 'S' || influencer.tier === 'A') && (
              <motion.div
                className={`absolute inset-0 rounded-full border-2 bg-gradient-to-r ${tierColors[influencer.tier]} opacity-50 blur-sm`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-200">{influencer.name}</h3>
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${tierBadgeColors[influencer.tier]}`}>
                {influencer.tier}-Tier
              </span>
            </div>
            <p className="text-sm text-gray-500">@{influencer.handle}</p>
          </div>
        </div>

        {/* Stats with Enhanced Styling */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <motion.div
            className="bg-gray-900/50 rounded p-2 border border-gray-800"
            whileHover={{ borderColor: 'rgba(156, 163, 175, 0.5)' }}
          >
            <div className="text-xs text-gray-500">Weekly Score</div>
            <div className={`text-sm font-bold bg-gradient-to-r ${tierColors[influencer.tier]} bg-clip-text text-transparent`}>
              {Number(influencer.weeklyScore)}
            </div>
          </motion.div>
          <motion.div
            className="bg-gray-900/50 rounded p-2 border border-gray-800"
            whileHover={{ borderColor: 'rgba(156, 163, 175, 0.5)' }}
          >
            <div className="text-xs text-gray-500">Cost</div>
            <div className="text-sm font-bold text-orange-400 flex items-center gap-1">
              {Number(influencer.price)} <span className="text-xs">📊</span>
            </div>
          </motion.div>
          <motion.div
            className="bg-gray-900/50 rounded p-2 border border-gray-800"
            whileHover={{ borderColor: 'rgba(156, 163, 175, 0.5)' }}
          >
            <div className="text-xs text-gray-500">Popularity</div>
            <div className="text-sm font-bold text-cyan-400">
              {Number(influencer.totalDrafts)}
            </div>
          </motion.div>
        </div>

        {/* Action */}
        {inTeam ? (
          <div className="text-center py-2 bg-cyan-500/20 rounded text-cyan-400 text-sm font-medium border border-cyan-500/30">
            ✓ In Your Team
          </div>
        ) : (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onDraft?.(influencer.id);
            }}
            disabled={disabled}
            className={`w-full px-4 py-2 bg-gradient-to-r ${tierColors[influencer.tier]} text-white rounded font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-2">
              <RarityIcon size={16} weight="bold" />
              <span>Draft ({Number(influencer.price)} pts)</span>
            </div>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
