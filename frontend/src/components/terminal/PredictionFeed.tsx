/**
 * TikTok-Style Prediction Feed
 * Vertical scrolling feed with snap points and swipe gestures
 * Optimized for mobile-first experience
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowUp, ArrowDown, Share, Bookmark, Heart } from '@phosphor-icons/react';

interface Prediction {
  id: bigint;
  question: string;
  description?: string;
  category: 'crypto' | 'politics' | 'sports' | 'tech' | 'other';
  deadline: bigint;
  resolved: boolean;
  userVote?: 'YES' | 'NO';
  yesVotes: bigint;
  noVotes: bigint;
  createdBy: string;
  createdAt: bigint;
}

interface PredictionFeedProps {
  predictions: Prediction[];
  onVote?: (predictionId: bigint, vote: 'YES' | 'NO') => void;
  onShare?: (predictionId: bigint) => void;
  onBookmark?: (predictionId: bigint) => void;
}

export function PredictionFeed({ predictions, onVote, onShare, onBookmark }: PredictionFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [snapEnabled, setSnapEnabled] = useState(true);

  // Handle scroll snapping
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !snapEnabled) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const cardHeight = window.innerHeight;
      const index = Math.round(scrollTop / cardHeight);

      if (index !== currentIndex) {
        setCurrentIndex(index);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentIndex, snapEnabled]);

  const handleVote = (predictionId: bigint, vote: 'YES' | 'NO') => {
    onVote?.(predictionId, vote);
  };

  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      style={{ scrollBehavior: snapEnabled ? 'smooth' : 'auto' }}
    >
      {predictions.map((prediction, index) => (
        <PredictionCard
          key={Number(prediction.id)}
          prediction={prediction}
          isActive={index === currentIndex}
          onVote={handleVote}
          onShare={onShare}
          onBookmark={onBookmark}
        />
      ))}

      {/* Scroll Indicator */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        {predictions.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-8 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-cyan-400'
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Individual Prediction Card
interface PredictionCardProps {
  prediction: Prediction;
  isActive: boolean;
  onVote?: (predictionId: bigint, vote: 'YES' | 'NO') => void;
  onShare?: (predictionId: bigint) => void;
  onBookmark?: (predictionId: bigint) => void;
}

function PredictionCard({ prediction, isActive, onVote, onShare, onBookmark }: PredictionCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [liked, setLiked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  const totalVotes = Number(prediction.yesVotes) + Number(prediction.noVotes);
  const yesPercent = totalVotes > 0 ? (Number(prediction.yesVotes) / totalVotes) * 100 : 50;
  const noPercent = 100 - yesPercent;

  const categoryColors = {
    crypto: 'from-orange-500 to-yellow-500',
    politics: 'from-blue-500 to-purple-500',
    sports: 'from-green-500 to-emerald-500',
    tech: 'from-cyan-500 to-blue-500',
    other: 'from-gray-500 to-gray-600',
  };

  const categoryEmojis = {
    crypto: '💰',
    politics: '🏛️',
    sports: '⚽',
    tech: '💻',
    other: '🔮',
  };

  return (
    <motion.div
      ref={cardRef}
      className="h-screen snap-start relative flex items-center justify-center p-6"
      style={{ opacity, scale }}
      onClick={() => setShowActions(!showActions)}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[prediction.category]} opacity-10`} />

      {/* Card Content */}
      <div className="relative w-full max-w-md">
        {/* Category Badge */}
        <motion.div
          className="absolute -top-12 left-0 flex items-center gap-2 px-4 py-2 bg-gray-800/90 backdrop-blur-sm rounded-full border border-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-2xl">{categoryEmojis[prediction.category]}</span>
          <span className="text-sm font-medium text-gray-300 capitalize">
            {prediction.category}
          </span>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="relative bg-gray-900/95 backdrop-blur-lg rounded-3xl p-8 border-2 border-gray-700 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
          animate={isActive ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0.7, scale: 0.95, rotateY: -10 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated Border Glow */}
          {isActive && (
            <motion.div
              className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${categoryColors[prediction.category]} opacity-20 blur-xl`}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}

          {/* Question */}
          <div className="relative mb-6">
            <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
              {prediction.question}
            </h2>
            {prediction.description && (
              <p className="text-gray-400 text-sm leading-relaxed">
                {prediction.description}
              </p>
            )}
          </div>

          {/* Vote Stats */}
          <div className="relative mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{totalVotes} predictions</span>
              <span className="text-sm text-gray-500">
                {new Date(Number(prediction.deadline) * 1000).toLocaleDateString()}
              </span>
            </div>

            {/* Vote Percentage Bar */}
            <div className="relative h-12 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
              <motion.div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-start pl-4"
                initial={{ width: 0 }}
                animate={{ width: `${yesPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <span className="text-white font-bold text-sm">
                  {yesPercent.toFixed(0)}% YES
                </span>
              </motion.div>

              <motion.div
                className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-red-500 to-orange-500 flex items-center justify-end pr-4"
                initial={{ width: 0 }}
                animate={{ width: `${noPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              >
                <span className="text-white font-bold text-sm">
                  {noPercent.toFixed(0)}% NO
                </span>
              </motion.div>
            </div>
          </div>

          {/* Vote Buttons */}
          {!prediction.userVote && !prediction.resolved && (
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onVote?.(prediction.id, 'YES');
                }}
                className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-500/30 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-2">
                  <ArrowUp size={24} weight="bold" />
                  <span>YES</span>
                </div>
              </motion.button>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onVote?.(prediction.id, 'NO');
                }}
                className="flex-1 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white rounded-2xl font-bold text-lg shadow-lg shadow-red-500/30 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-2">
                  <ArrowDown size={24} weight="bold" />
                  <span>NO</span>
                </div>
              </motion.button>
            </motion.div>
          )}

          {/* Already Voted */}
          {prediction.userVote && !prediction.resolved && (
            <div className={`p-4 rounded-2xl border-2 text-center ${
              prediction.userVote === 'YES'
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <div className="font-bold text-lg">
                You voted {prediction.userVote}
              </div>
              <div className="text-sm opacity-70 mt-1">
                Waiting for resolution...
              </div>
            </div>
          )}

          {/* Resolved */}
          {prediction.resolved && (
            <div className="p-4 bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl text-center">
              <div className="text-blue-400 font-bold text-lg">
                ✓ Resolved
              </div>
              {prediction.userVote && (
                <div className="text-sm text-gray-400 mt-1">
                  You predicted {prediction.userVote}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Side Actions */}
        <AnimatePresence>
          {showActions && isActive && (
            <motion.div
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 flex flex-col gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Like */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(!liked);
                }}
                className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
                  liked
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-800/90 text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart size={24} weight={liked ? 'fill' : 'regular'} />
              </motion.button>

              {/* Bookmark */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark?.(prediction.id);
                }}
                className="w-14 h-14 rounded-full bg-gray-800/90 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-yellow-400 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bookmark size={24} />
              </motion.button>

              {/* Share */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare?.(prediction.id);
                }}
                className="w-14 h-14 rounded-full bg-gray-800/90 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-cyan-400 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share size={24} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Creator Info */}
        <motion.div
          className="absolute -bottom-12 left-0 right-0 flex items-center gap-3 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
            {prediction.createdBy.slice(2, 4).toUpperCase()}
          </div>
          <div>
            <div className="text-sm text-gray-400">Created by</div>
            <div className="text-xs text-gray-500 font-mono">
              {prediction.createdBy.slice(0, 6)}...{prediction.createdBy.slice(-4)}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
