import { useEffect, useState } from 'react';
import { X } from '@phosphor-icons/react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp_reward?: number;
}

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

const rarityColors = {
  common: {
    border: 'border-gray-500/30',
    glow: 'shadow-gray-500/20',
    text: 'text-gray-400',
  },
  rare: {
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/30',
    text: 'text-blue-400',
  },
  epic: {
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/30',
    text: 'text-purple-400',
  },
  legendary: {
    border: 'border-cyan-500/30',
    glow: 'shadow-cyan-500/40',
    text: 'text-cyan-400',
  },
};

const AchievementToast = ({ achievement, onClose }: AchievementToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const colors = rarityColors[achievement.rarity];

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div
        className={`
          min-w-[320px] max-w-[400px]
          bg-[#0a0a0a] border ${colors.border}
          rounded-lg shadow-xl ${colors.glow}
          p-4
          flex items-start gap-3
          relative overflow-hidden
        `}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              background: `radial-gradient(circle at 30% 50%, ${
                achievement.rarity === 'legendary' ? 'rgba(6, 182, 212, 0.3)' :
                achievement.rarity === 'epic' ? 'rgba(168, 85, 247, 0.3)' :
                achievement.rarity === 'rare' ? 'rgba(59, 130, 246, 0.3)' :
                'rgba(156, 163, 175, 0.3)'
              } 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Icon */}
        <div className="relative flex-shrink-0">
          <div className="text-4xl">{achievement.icon}</div>
        </div>

        {/* Content */}
        <div className="flex-1 relative">
          <div className="flex items-start justify-between mb-1">
            <div>
              <div className="text-white font-semibold text-sm">
                {achievement.name}
              </div>
              <div className={`text-xs capitalize ${colors.text}`}>
                {achievement.rarity}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="text-gray-400 text-xs mt-1">
            {achievement.description}
          </div>

          {achievement.xp_reward && achievement.xp_reward > 0 && (
            <div className="mt-2 flex items-center gap-1 text-xs text-cyan-400">
              <span>+{achievement.xp_reward} XP</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementToast;
