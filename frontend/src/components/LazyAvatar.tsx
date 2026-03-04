/**
 * LazyAvatar — Lazy-loaded avatar with instant placeholder fallback.
 *
 * Shows a colored initial or icon immediately, then fades in the real
 * image once loaded. Uses native `loading="lazy"` for below-fold images.
 */

import { useState, useRef, useEffect } from 'react';
import { Users } from '@phosphor-icons/react';

interface LazyAvatarProps {
  src?: string | null;
  alt?: string;
  /** Displayed as initial when no image */
  name?: string;
  /** Tailwind size classes, e.g. "w-8 h-8" */
  size?: string;
  /** Icon size in px (fallback icon) */
  iconSize?: number;
  /** Extra classes on outer wrapper */
  className?: string;
  /** Color for the initial letter (hex) */
  initialColor?: string;
  /** Background for placeholder */
  placeholderBg?: string;
}

export default function LazyAvatar({
  src,
  alt = '',
  name,
  size = 'w-8 h-8',
  iconSize = 16,
  className = '',
  initialColor,
  placeholderBg = 'bg-gray-700',
}: LazyAvatarProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset state when src changes
  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  // If the image was already cached (e.g. from browser cache),
  // the onLoad event might have fired before our ref attached.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  const showImg = !!src && !error;
  const initial = name?.charAt(0)?.toUpperCase();

  return (
    <div className={`relative ${size} rounded-full overflow-hidden ${className}`}>
      {/* Placeholder — always rendered, visible until image loads */}
      <div className={`absolute inset-0 ${placeholderBg} flex items-center justify-center`}>
        {initial ? (
          <span
            className="font-bold text-[0.4em]"
            style={{
              color: initialColor || '#A1A1AA',
              fontSize: `clamp(10px, 40%, 20px)`,
            }}
          >
            {initial}
          </span>
        ) : (
          <Users size={iconSize} className="text-gray-500" />
        )}
      </div>

      {/* Real image — fades in over placeholder */}
      {showImg && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}
