/**
 * Interactive Card Component
 * Provides tilt and flip interactions for cards
 * Optimized for mobile performance
 */

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { type ReactNode, useRef } from 'react';

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
  enableTilt?: boolean;
  enableFlip?: boolean;
  flipped?: boolean;
  backContent?: ReactNode;
}

export function InteractiveCard({
  children,
  className = '',
  enableTilt = true,
  enableFlip = false,
  flipped = false,
  backContent,
}: InteractiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Transform mouse position to rotation
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt) return;

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    if (!enableTilt) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  if (enableFlip) {
    return (
      <motion.div
        ref={cardRef}
        className={`relative ${className}`}
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Front */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {children}
        </div>

        {/* Back */}
        {backContent && (
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {backContent}
          </div>
        )}
      </motion.div>
    );
  }

  if (enableTilt) {
    return (
      <motion.div
        ref={cardRef}
        className={className}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.02 }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={className}>{children}</div>;
}

// Preset card styles for common use cases
export function GameModeCard({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <InteractiveCard
      className={`cursor-pointer ${className}`}
      enableTilt={true}
      enableFlip={false}
    >
      <div onClick={onClick}>{children}</div>
    </InteractiveCard>
  );
}

export function InfluencerCard({
  children,
  className = '',
  onClick,
  selected = false,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}) {
  return (
    <motion.div
      className={`cursor-pointer ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        borderColor: selected ? '#00D9FF' : 'rgba(107, 114, 128, 0.5)',
        boxShadow: selected
          ? '0 0 20px rgba(0, 217, 255, 0.3)'
          : '0 0 0px rgba(0, 0, 0, 0)',
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export function PredictionCard({
  children,
  className = '',
  onClick,
  shakeOnResolve = false,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  shakeOnResolve?: boolean;
}) {
  return (
    <motion.div
      className={`cursor-pointer ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      animate={
        shakeOnResolve
          ? {
              x: [0, -2, 2, -2, 2, 0],
              y: [0, 2, -2, 2, -2, 0],
            }
          : {}
      }
      transition={{
        duration: shakeOnResolve ? 0.5 : 0.2,
      }}
    >
      {children}
    </motion.div>
  );
}
