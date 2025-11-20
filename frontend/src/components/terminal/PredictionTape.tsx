/**
 * Prediction Tape Component
 * Horizontal scrolling feed of predictions (terminal-style ticker)
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PredictionCard, PredictionCardSkeleton, type Prediction } from './PredictionCard';

interface PredictionTapeProps {
  predictions: Prediction[];
  isLoading?: boolean;
  onPredictionClick?: (prediction: Prediction) => void;
  autoScrollToReady?: boolean;
}

export function PredictionTape({
  predictions,
  isLoading = false,
  onPredictionClick,
  autoScrollToReady = true,
}: PredictionTapeProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to first "ready to mark" prediction
  useEffect(() => {
    if (!autoScrollToReady || !scrollContainerRef.current || predictions.length === 0) {
      return;
    }

    const now = Date.now();
    const readyIndex = predictions.findIndex((pred) => {
      const expiresAt = Number(pred.createdAt) * 1000 + Number(pred.lockPeriod) * 1000;
      return now >= expiresAt && !pred.resolved;
    });

    if (readyIndex !== -1) {
      // Scroll to the ready prediction
      const container = scrollContainerRef.current;
      const cardWidth = 288; // 72 * 4 (w-72 = 18rem = 288px)
      const gap = 12; // gap-3 = 12px
      const scrollPosition = readyIndex * (cardWidth + gap);

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  }, [predictions, autoScrollToReady]);

  // Empty state
  if (!isLoading && predictions.length === 0) {
    return <EmptyTape />;
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
            Prediction Feed
          </h3>
        </div>
        <div className="text-xs text-gray-500">
          {predictions.length} {predictions.length === 1 ? 'Prediction' : 'Predictions'}
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto snap-scroll-x hide-scrollbar pb-2"
        style={{
          scrollPadding: '0 16px',
        }}
      >
        {isLoading ? (
          // Loading skeletons
          <>
            <PredictionCardSkeleton />
            <PredictionCardSkeleton />
            <PredictionCardSkeleton />
          </>
        ) : (
          // Actual predictions
          predictions.map((prediction, index) => (
            <PredictionCard
              key={prediction.id.toString()}
              prediction={prediction}
              index={index}
              onClick={() => onPredictionClick?.(prediction)}
            />
          ))
        )}
      </div>

      {/* Scroll Indicators */}
      <ScrollIndicators containerRef={scrollContainerRef} />
    </div>
  );
}

// ========================================
// Empty State
// ========================================

function EmptyTape() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-8 text-center"
    >
      <div className="text-4xl mb-3">📊</div>
      <h3 className="text-lg font-semibold text-gray-300 mb-2">
        No Predictions Yet
      </h3>
      <p className="text-sm text-gray-500">
        Create your first prediction to see it appear in the feed
      </p>
    </motion.div>
  );
}

// ========================================
// Scroll Indicators (Left/Right Arrows)
// ========================================

function ScrollIndicators({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScroll = () => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    checkScroll();
    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [containerRef]);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;

    const scrollAmount = 300; // Roughly one card width
    const currentScroll = containerRef.current.scrollLeft;
    const newScroll = direction === 'left'
      ? currentScroll - scrollAmount
      : currentScroll + scrollAmount;

    containerRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* Left Arrow */}
      {canScrollLeft && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800/90 hover:bg-gray-700 border border-gray-600 rounded-full p-2 shadow-lg backdrop-blur-sm transition-colors"
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      )}

      {/* Right Arrow */}
      {canScrollRight && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800/90 hover:bg-gray-700 border border-gray-600 rounded-full p-2 shadow-lg backdrop-blur-sm transition-colors"
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      )}
    </>
  );
}

// Fix React import for ScrollIndicators
import React from 'react';
