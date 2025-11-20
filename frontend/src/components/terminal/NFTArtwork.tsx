/**
 * NFT Artwork SVG Component
 * Generates dynamic SVG based on user stats and level
 */

import type { ForesightLevel } from '../../utils/terminal/foresightCalculator';

interface NFTArtworkProps {
  level: ForesightLevel;
  levelColor: string;
  accuracy: number;
  streak: number;
  animated?: boolean;
}

export function NFTArtwork({
  level,
  levelColor,
  accuracy,
  streak,
  animated = true,
}: NFTArtworkProps) {
  // Calculate ring offset based on accuracy (circle circumference = 754.4)
  const circumference = 754.4;
  const ringOffset = circumference - (accuracy / 100) * circumference;

  // Generate streak particles based on streak count (max 10)
  const particleCount = Math.min(streak, 10);
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    cx: 160 + Math.cos((i * 360) / particleCount * (Math.PI / 180)) * 100,
    cy: 160 + Math.sin((i * 360) / particleCount * (Math.PI / 180)) * 100,
    delay: i * 0.2,
  }));

  return (
    <svg
      viewBox="0 0 320 320"
      className="w-full h-full"
      style={{ maxWidth: '320px', maxHeight: '320px' }}
    >
      {/* Background Gradient */}
      <defs>
        <radialGradient id={`${level}-glow`}>
          <stop offset="0%" stopColor={levelColor} stopOpacity="0.3" />
          <stop offset="50%" stopColor={levelColor} stopOpacity="0.1" />
          <stop offset="100%" stopColor="#0a0e14" stopOpacity="1" />
        </radialGradient>

        {/* Accuracy Ring Gradient */}
        <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={levelColor} />
          <stop offset="100%" stopColor={levelColor} stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect fill={`url(#${level}-glow)`} width="320" height="320" />

      {/* Subtle Grid Pattern */}
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path
          d="M 20 0 L 0 0 0 20"
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="0.5"
        />
      </pattern>
      <rect fill="url(#grid)" width="320" height="320" opacity="0.3" />

      {/* Accuracy Ring */}
      <circle
        cx="160"
        cy="160"
        r="120"
        stroke="url(#ring-gradient)"
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={ringOffset}
        fill="none"
        opacity="0.7"
        strokeLinecap="round"
        transform="rotate(-90 160 160)"
        style={{
          transition: animated ? 'stroke-dashoffset 0.8s ease-out' : 'none',
        }}
      />

      {/* Level Icon */}
      <g transform="translate(160, 160)">
        {level === 'ORACLE' && <OracleIcon color={levelColor} />}
        {level === 'PROPHET' && <ProphetIcon color={levelColor} />}
        {level === 'SEER' && <SeerIcon color={levelColor} />}
        {level === 'APPRENTICE' && <ApprenticeIcon color={levelColor} />}
        {level === 'NOVICE' && <NoviceIcon color={levelColor} />}
      </g>

      {/* Streak Particles */}
      {particles.map((particle, i) => (
        <circle
          key={i}
          cx={particle.cx}
          cy={particle.cy}
          r="3"
          fill="#00ff88"
          opacity="0.8"
        >
          {animated && (
            <animate
              attributeName="opacity"
              values="0.8;0.3;0.8"
              dur="2s"
              repeatCount="indefinite"
              begin={`${particle.delay}s`}
            />
          )}
        </circle>
      ))}

      {/* Accuracy Text */}
      <text
        x="160"
        y="280"
        textAnchor="middle"
        fontFamily="Lexend"
        fontSize="16"
        fontWeight="600"
        fill="var(--text-primary)"
        opacity="0.9"
      >
        {accuracy}% Accuracy
      </text>
    </svg>
  );
}

// ========================================
// Level Icons
// ========================================

function OracleIcon({ color }: { color: string }) {
  return (
    <g>
      {/* Star */}
      <path
        d="M0,-50 L12,-15 L50,-15 L20,10 L32,45 L0,20 L-32,45 L-20,10 L-50,-15 L-12,-15 Z"
        fill={color}
        opacity="0.9"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0"
          to="360"
          dur="20s"
          repeatCount="indefinite"
        />
      </path>
    </g>
  );
}

function ProphetIcon({ color }: { color: string }) {
  return (
    <g>
      {/* Crystal Ball */}
      <circle cx="0" cy="0" r="40" fill="none" stroke={color} strokeWidth="3" opacity="0.7" />
      <circle cx="0" cy="0" r="25" fill={color} opacity="0.3">
        <animate attributeName="r" values="25;28;25" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="-10" cy="-10" r="8" fill={color} opacity="0.6" />
    </g>
  );
}

function SeerIcon({ color }: { color: string }) {
  return (
    <g>
      {/* Eye */}
      <ellipse cx="0" cy="0" rx="50" ry="30" fill="none" stroke={color} strokeWidth="3" opacity="0.7" />
      <circle cx="0" cy="0" r="15" fill={color} opacity="0.8" />
      <circle cx="0" cy="0" r="8" fill="#0a0e14" />
      <circle cx="-3" cy="-3" r="3" fill={color} opacity="0.9" />
    </g>
  );
}

function ApprenticeIcon({ color }: { color: string }) {
  return (
    <g>
      {/* Sprout */}
      <path
        d="M0,20 Q-15,0 -20,-20 Q-10,-15 0,-20 Q10,-15 20,-20 Q15,0 0,20"
        fill={color}
        opacity="0.7"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 0 0;-5 0 0;0 0 0;5 0 0;0 0 0"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
      <ellipse cx="0" cy="25" rx="15" ry="5" fill={color} opacity="0.4" />
    </g>
  );
}

function NoviceIcon({ color }: { color: string }) {
  return (
    <g>
      {/* Target */}
      <circle cx="0" cy="0" r="40" fill="none" stroke={color} strokeWidth="2" opacity="0.5" />
      <circle cx="0" cy="0" r="25" fill="none" stroke={color} strokeWidth="2" opacity="0.6" />
      <circle cx="0" cy="0" r="10" fill={color} opacity="0.7" />
    </g>
  );
}
