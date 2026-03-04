/**
 * Atmosphere Components - Ready-to-use React components for background effects
 * Import and use in your layouts for instant premium dark theme atmosphere
 *
 * Usage:
 * import { AtmosphereContainer, ExpandablePill, SmartTooltip } from '@/components/AtmosphereComponents'
 */

import React, { ReactNode } from 'react';
import '../styles/atmosphere.css';

/**
 * Root container that provides animated gradient background + noise texture + particles
 * Wrap your entire app or major sections with this
 */
export const AtmosphereContainer: React.FC<{
  children: ReactNode;
  variant?: 'gradient' | 'radial' | 'combined';
  includeParticles?: boolean;
  particleCount?: number;
}> = ({
  children,
  variant = 'gradient',
  includeParticles = true,
  particleCount = 10,
}) => {
  return (
    <div className="atmosphere-container">
      <div className="atmosphere-base">
        {(variant === 'gradient' || variant === 'combined') && (
          <div className="atmosphere-gradient" />
        )}
        {(variant === 'radial' || variant === 'combined') && (
          <div className="bg-premium-radial" />
        )}
        <div className="atmosphere-noise" />
        {includeParticles && (
          <ParticleField count={particleCount} />
        )}
      </div>
      <div className="atmosphere-content">
        {children}
      </div>
    </div>
  );
};

/**
 * Particle field generator - creates floating particles
 */
export const ParticleField: React.FC<{ count?: number; glow?: boolean }> = ({
  count = 10,
  glow = false,
}) => {
  const particles = Array.from({ length: count }, (_, i) => {
    // Pseudo-random distribution
    const duration = 8 + (i % 5) * 1.2;
    const drift = (i % 2 === 0 ? 1 : -1) * (50 + (i % 3) * 30);
    const delay = -(i * 2);
    const left = (i / count) * 100;

    return {
      id: i,
      duration,
      drift,
      delay,
      left,
    };
  });

  return (
    <div className="particle-field">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`particle ${glow ? 'glow' : ''}`}
          style={{
            '--duration': `${p.duration}s`,
            '--drift': `${p.drift}px`,
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

/**
 * Expandable pill - compact by default, expands on hover to show label + icon
 * Perfect for status indicators, online/offline states, etc.
 */
export const ExpandablePill: React.FC<{
  icon?: ReactNode | string;
  label: string;
  onClick?: () => void;
  className?: string;
  title?: string;
}> = ({ icon, label, onClick, className = '', title }) => {
  const [isActive, setIsActive] = React.useState(false);

  const handleTouchClick = () => {
    setIsActive(!isActive);
    onClick?.();
  };

  return (
    <div
      className={`pill-expandable ${isActive ? 'active' : ''} ${className}`}
      onClick={handleTouchClick}
      title={title || label}
    >
      {icon && <div className="pill-icon">{icon}</div>}
      <span className="pill-text">{label}</span>
    </div>
  );
};

/**
 * Smart tooltip - shows label on hover, reveals additional content on hover
 * Use for stats, explanations, or contextual information
 */
export const SmartTooltip: React.FC<{
  trigger: ReactNode;
  title: string;
  content: ReactNode;
  secondary?: string;
  className?: string;
}> = ({ trigger, title, content, secondary, className = '' }) => {
  return (
    <div className={`smart-tooltip ${className}`}>
      <div className="tooltip-trigger">
        {trigger}
      </div>
      <div className="tooltip-content">
        <p>{content}</p>
        {secondary && <p className="secondary">{secondary}</p>}
      </div>
    </div>
  );
};

/**
 * Noise-textured surface card - applies premium grain texture overlay
 * Use for elevated surfaces, cards, modals
 */
export const TexturedCard: React.FC<{
  children: ReactNode;
  className?: string;
  noiseIntensity?: 'subtle' | 'normal' | 'strong';
}> = ({ children, className = '', noiseIntensity = 'normal' }) => {
  const noiseClass = {
    subtle: 'noise-fine',
    normal: '',
    strong: 'noise-strong',
  }[noiseIntensity];

  return (
    <div className={`surface-with-noise ${noiseClass} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Animated gradient background (for isolated sections)
 * Use on homepage, hero sections, or standalone containers
 */
export const AnimatedGradientBg: React.FC<{
  children: ReactNode;
  variant?: 'standard' | 'radial';
  className?: string;
}> = ({ children, variant = 'standard', className = '' }) => {
  const bgClass = variant === 'radial' ? 'bg-premium-radial' : 'bg-gradient-animated';
  return (
    <div className={`${bgClass} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Gold glow effect - applies box-shadow glow with brand color
 * Wrap elements to add premium gold highlight effect
 */
export const GoldGlow: React.FC<{
  children: ReactNode;
  intensity?: 'subtle' | 'normal' | 'strong';
  className?: string;
}> = ({ children, intensity = 'normal', className = '' }) => {
  const shadowMap = {
    subtle: '0 0 10px rgba(245, 158, 11, 0.2)',
    normal: '0 0 20px rgba(245, 158, 11, 0.4)',
    strong: '0 0 30px rgba(245, 158, 11, 0.6)',
  };

  return (
    <div
      className={className}
      style={{ boxShadow: shadowMap[intensity] }}
    >
      {children}
    </div>
  );
};

/**
 * Full feature bar with status indicators (online, performance, etc)
 * Demonstrates multiple atmosphere components together
 */
export const FeatureBar: React.FC<{
  items: Array<{
    icon: ReactNode | string;
    label: string;
    status?: string;
    info?: string;
  }>;
  className?: string;
}> = ({ items, className = '' }) => {
  return (
    <div className={`flex gap-2 flex-wrap ${className}`}>
      {items.map((item, idx) => (
        <SmartTooltip
          key={idx}
          trigger={<span>{item.icon}</span>}
          title={item.label}
          content={item.status || item.label}
          secondary={item.info}
          className="flex-1"
        />
      ))}
    </div>
  );
};

/**
 * Atmospheric page wrapper - combines all effects with sensible defaults
 * Use for top-level page layouts
 */
export const AtmosphericPage: React.FC<{
  children: ReactNode;
  gradientVariant?: 'gradient' | 'radial' | 'combined';
  particleCount?: number;
  showNoise?: boolean;
  className?: string;
}> = ({
  children,
  gradientVariant = 'gradient',
  particleCount = 10,
  showNoise = true,
  className = '',
}) => {
  return (
    <AtmosphereContainer
      variant={gradientVariant}
      includeParticles={true}
      particleCount={particleCount}
    >
      <div className={`relative w-full min-h-screen ${className}`}>
        {showNoise && <div className="atmosphere-noise-overlay" />}
        {children}
      </div>
    </AtmosphereContainer>
  );
};

/**
 * Hook to pause animations when page is hidden (performance optimization)
 * Call in your main App component
 */
export const useReducedMotionAnimation = (selector: string = '.particle') => {
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        const style = el as HTMLElement;
        style.style.animationPlayState = document.hidden ? 'paused' : 'running';
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selector]);
};

/**
 * Example usage component - shows how to combine effects
 */
export const AtmosphereDemo: React.FC = () => {
  return (
    <AtmosphericPage gradientVariant="combined" particleCount={12}>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-8 px-4">
        {/* Hero section with glow */}
        <GoldGlow intensity="strong">
          <h1 className="text-4xl font-bold text-white text-center">
            Premium Dark Theme
          </h1>
        </GoldGlow>

        {/* Status indicators */}
        <div className="flex gap-4">
          <ExpandablePill
            icon="🟢"
            label="Online"
            title="All systems operational"
          />
          <SmartTooltip
            trigger="⚡"
            title="Performance"
            content="99.8% uptime"
            secondary="Last 30 days"
          />
        </div>

        {/* Textured card example */}
        <TexturedCard className="p-6 max-w-md">
          <h2 className="text-white text-xl font-semibold mb-2">
            Premium Card
          </h2>
          <p className="text-gray-400">
            This card has subtle noise texture for depth and premium feel.
          </p>
        </TexturedCard>
      </div>
    </AtmosphericPage>
  );
};

export default AtmosphereDemo;
