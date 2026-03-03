/**
 * Formation Preview Component
 * Shows a simplified 5-person football pitch formation
 * Used on landing page to instantly communicate the product
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Crown, Users, PencilSimple } from '@phosphor-icons/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Influencer {
  id: number;
  name: string;
  twitter_handle?: string;
  handle?: string;
  tier: string;
  profile_image_url?: string;
  price?: number;
  total_points?: number;
}

interface FormationPreviewProps {
  variant?: 'hero' | 'compact' | 'team';
  showStats?: boolean;
  className?: string;
  /** If provided, shows this team instead of fetching sample data */
  team?: Influencer[];
  /** Callback when clicking the edit button */
  onEdit?: () => void;
  /** Show edit button */
  showEdit?: boolean;
}

// Animated score counter — ticks up from 0 to final value
function AnimatedScore({ value, animate, delay = 0 }: { value: number; animate: boolean; delay?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!animate) return;
    const timeout = setTimeout(() => {
      let start: number | null = null;
      const duration = 600;
      function tick(ts: number) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        setDisplay(Math.round(value * progress));
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [animate, value, delay]);
  return <>{display} pts</>;
}

// Example team for when API fails or is loading
const EXAMPLE_TEAM: Influencer[] = [
  { id: 1, name: 'CT Legend', twitter_handle: 'ctlegend', tier: 'S', price: 45 },
  { id: 2, name: 'Alpha Caller', twitter_handle: 'alphacaller', tier: 'A', price: 35 },
  { id: 3, name: 'Gem Hunter', twitter_handle: 'gemhunter', tier: 'A', price: 30 },
  { id: 4, name: 'Chart Master', twitter_handle: 'chartmaster', tier: 'B', price: 25 },
  { id: 5, name: 'Degen Pro', twitter_handle: 'degenpro', tier: 'C', price: 15 },
];

export default function FormationPreview({
  variant = 'hero',
  showStats = true,
  className = '',
  team,
  onEdit,
  showEdit = false,
}: FormationPreviewProps) {
  const [influencers, setInfluencers] = useState<Influencer[]>(team || EXAMPLE_TEAM);
  const [loading, setLoading] = useState(!team);

  useEffect(() => {
    // If team is provided, use it directly
    if (team && team.length >= 5) {
      setInfluencers(team);
      setLoading(false);
      return;
    }

    // Only fetch sample data for hero variant when no team provided
    if (team) return;

    const fetchTopInfluencers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/league/influencers`);
        if (res.data.influencers && res.data.influencers.length >= 5) {
          // Get a mix of tiers for the preview
          const all = res.data.influencers;
          const sTier = all.filter((i: Influencer) => i.tier === 'S')[0];
          const aTier = all.filter((i: Influencer) => i.tier === 'A').slice(0, 2);
          const bTier = all.filter((i: Influencer) => i.tier === 'B')[0];
          const cTier = all.filter((i: Influencer) => i.tier === 'C')[0];

          const teamData = [sTier, ...aTier, bTier, cTier].filter(Boolean);
          if (teamData.length >= 5) {
            setInfluencers(teamData.slice(0, 5));
          }
        }
      } catch (error) {
        // Use example team on error
      } finally {
        setLoading(false);
      }
    };

    fetchTopInfluencers();
  }, [team]);

  const getTierColors = (tier: string) => {
    switch (tier) {
      case 'S':
        return {
          border: 'border-gold-500',
          badge: 'bg-gold-500 text-gray-950',
        };
      case 'A':
        return {
          border: 'border-cyan-500',
          badge: 'bg-cyan-500 text-white',
        };
      case 'B':
        return {
          border: 'border-emerald-500',
          badge: 'bg-emerald-500 text-white',
        };
      default:
        return {
          border: 'border-gray-600',
          badge: 'bg-gray-500 text-white',
        };
    }
  };

  // Staggered entrance animation
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Entrance delays per card position
  const entranceDelays = [0, 150, 150, 300, 300];

  const renderPlayerCard = (influencer: Influencer, index: number, isCaptain: boolean = false) => {
    const colors = getTierColors(influencer.tier);
    const isLarge = variant === 'hero' || variant === 'team';

    return (
      <div
        key={influencer.id}
        className={`relative group ${loading ? 'animate-pulse' : ''}`}
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: `opacity 500ms ease-out ${entranceDelays[index]}ms, transform 500ms ease-out ${entranceDelays[index]}ms`,
        }}
      >
        {/* Captain Crown */}
        {isCaptain && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-gold-500 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-gold">
              <Crown size={12} weight="fill" className="text-gray-950" />
              <span className="text-[10px] font-bold text-gray-950">CPT</span>
            </div>
          </div>
        )}

        {/* Player Card — lift + glow on hover */}
        <div className={`relative border-2 ${colors.border} rounded-xl transition-all duration-200 group-hover:-translate-y-1.5 group-hover:shadow-[0_8px_24px_rgba(245,158,11,0.15)]`}>
          <div className={`bg-gray-900 rounded-xl ${isLarge ? 'p-3 w-28 md:w-32' : 'p-2 w-20'}`}>
            {/* Avatar */}
            <div className={`relative mx-auto mb-2 ${isLarge ? 'w-14 h-14 md:w-16 md:h-16' : 'w-10 h-10'}`}>
              <div className={`w-full h-full rounded-full border-2 ${colors.border} overflow-hidden bg-gray-800 transition-shadow duration-200 group-hover:shadow-[0_0_12px_rgba(245,158,11,0.25)]`}>
                {influencer.profile_image_url ? (
                  <img
                    src={influencer.profile_image_url}
                    alt={influencer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users size={isLarge ? 24 : 16} className="text-gray-500" />
                  </div>
                )}
              </div>
              {/* Tier Badge */}
              <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 ${colors.badge} px-1.5 py-0.5 rounded-full text-[10px] font-bold transition-transform duration-200 group-hover:scale-110`}>
                {influencer.tier}
              </div>
            </div>

            {/* Name */}
            <h4 className={`text-center font-bold text-white truncate ${isLarge ? 'text-xs' : 'text-[10px]'}`}>
              {influencer.name.split(' ')[0]}
            </h4>
            <p className={`text-center text-gray-400 truncate ${isLarge ? 'text-[10px]' : 'text-[8px]'}`}>
              @{influencer.handle || influencer.twitter_handle}
            </p>

            {/* Stats (optional) — gold border brightens on hover */}
            {showStats && isLarge && (
              <div className="mt-2 pt-2 border-t border-gray-800 flex justify-center transition-colors duration-200 group-hover:border-gold-500/30">
                <span className="text-[10px] text-gold-400 font-semibold">
                  {variant === 'team' && influencer.total_points !== undefined
                    ? `${influencer.total_points} pts`
                    : <AnimatedScore value={Math.round(influencer.price || 25)} animate={mounted} delay={entranceDelays[index] + 400} />}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const isHero = variant === 'hero';
  const isTeamView = variant === 'team';
  const containerHeight = isHero || isTeamView ? 'min-h-[380px] md:min-h-[440px]' : 'min-h-[260px]';
  const gap = isHero || isTeamView ? 'gap-14 md:gap-20' : 'gap-8';

  return (
    <div className={`relative ${className}`}>
      {/* Edit Button */}
      {showEdit && onEdit && (
        <button
          onClick={onEdit}
          className="absolute top-4 right-4 z-20 px-4 py-2 border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <PencilSimple size={16} />
          Edit Team
        </button>
      )}

      {/* Pitch Background */}
      <div className={`relative rounded-2xl overflow-hidden ${containerHeight}`}>
        {/* Grass texture base */}
        <div className="absolute inset-0 bg-[#0C1414]"></div>
        {/* Vertical grass blades */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(34,197,94,0.05) 0px, rgba(34,197,94,0.02) 1px, transparent 2px, transparent 4px)',
            backgroundSize: '4px 100%',
          }}
        ></div>
        {/* Horizontal mowing stripes */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(34,197,94,0.03) 0px, transparent 1px, transparent 24px, rgba(34,197,94,0.03) 24px, transparent 25px, transparent 48px)',
            backgroundSize: '100% 48px',
          }}
        ></div>
        {/* Gold light wash */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(135deg, transparent 0px, rgba(245,158,11,0.03) 40px, transparent 80px)',
          }}
        ></div>
        {/* Stadium vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.35)_100%)]"></div>

        {/* Gold pitch lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 md:w-52 h-36 md:h-52 border border-yellow-400/25 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400/40 rounded-full"></div>
          <div className="absolute top-1/2 left-8 right-8 h-px bg-gradient-to-r from-transparent via-yellow-400/25 to-transparent"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 md:w-56 h-16 border-b border-l border-r border-yellow-400/12 rounded-b-full"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 md:w-56 h-16 border-t border-l border-r border-yellow-400/12 rounded-t-full"></div>
        </div>

        {/* Formation: Diamond — 1 top, 2 wide mid, 2 narrow bottom */}
        <div className="relative z-10 h-full flex items-center justify-center py-8">
          <div className={isHero || isTeamView ? 'space-y-6 md:space-y-8' : 'space-y-5'}>
            {/* Top — Captain (solo) */}
            <div className="flex justify-center">
              {renderPlayerCard(influencers[0], 0, true)}
            </div>

            {/* Mid — 2 players, wide spread */}
            <div className={`flex justify-center ${isHero || isTeamView ? 'gap-24 md:gap-36' : 'gap-16'}`}>
              {renderPlayerCard(influencers[1], 1)}
              {renderPlayerCard(influencers[2], 2)}
            </div>

            {/* Bottom — 2 players, tighter (inverted triangle) */}
            <div className={`flex justify-center ${isHero || isTeamView ? 'gap-8 md:gap-12' : 'gap-6'}`}>
              {renderPlayerCard(influencers[3], 3)}
              {renderPlayerCard(influencers[4], 4)}
            </div>
          </div>
        </div>

        {/* Corner brackets — gold tint */}
        <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-gold-500/20 rounded-tl"></div>
        <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-gold-500/20 rounded-tr"></div>
        <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-gold-500/20 rounded-bl"></div>
        <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-gold-500/20 rounded-br"></div>
      </div>
    </div>
  );
}
