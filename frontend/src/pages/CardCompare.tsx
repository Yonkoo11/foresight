/**
 * Pitch Background Compare — pick your formation background style
 * Route: /card-compare
 */

import { useState } from 'react';
import { Crown, Users } from '@phosphor-icons/react';

interface Influencer {
  id: number;
  name: string;
  handle: string;
  tier: string;
  total_points: number;
}

const SAMPLE_TEAM: Influencer[] = [
  { id: 1, name: 'Michael', handle: 'saylor', tier: 'S', total_points: 48 },
  { id: 2, name: 'Ansem', handle: 'blknoiz06', tier: 'A', total_points: 35 },
  { id: 3, name: 'ZachXBT', handle: 'zachxbt', tier: 'A', total_points: 34 },
  { id: 4, name: 'Brian', handle: 'brian_armstrong', tier: 'B', total_points: 25 },
  { id: 5, name: 'Kaleo', handle: 'CryptoKaleo', tier: 'C', total_points: 17 },
];

const getTierColors = (tier: string) => {
  switch (tier) {
    case 'S': return { border: 'border-gold-500', badge: 'bg-gold-500 text-gray-950' };
    case 'A': return { border: 'border-cyan-500', badge: 'bg-cyan-500 text-white' };
    case 'B': return { border: 'border-emerald-500', badge: 'bg-emerald-500 text-white' };
    default: return { border: 'border-gray-600', badge: 'bg-gray-500 text-white' };
  }
};

function PlayerCard({ influencer, isCaptain }: { influencer: Influencer; isCaptain?: boolean }) {
  const colors = getTierColors(influencer.tier);
  return (
    <div className="relative">
      {isCaptain && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-gold-500 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-gold">
            <Crown size={12} weight="fill" className="text-gray-950" />
            <span className="text-[10px] font-bold text-gray-950">CPT</span>
          </div>
        </div>
      )}
      <div className={`relative border-2 ${colors.border} rounded-xl`}>
        <div className="bg-gray-900 rounded-xl p-3 w-28">
          <div className="relative mx-auto mb-2 w-14 h-14">
            <div className={`w-full h-full rounded-full border-2 ${colors.border} overflow-hidden bg-gray-800`}>
              <div className="w-full h-full flex items-center justify-center">
                <Users size={24} className="text-gray-500" />
              </div>
            </div>
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 ${colors.badge} px-1.5 py-0.5 rounded-full text-[10px] font-bold`}>
              {influencer.tier}
            </div>
          </div>
          <h4 className="text-center font-bold text-white truncate text-xs">{influencer.name}</h4>
          <p className="text-center text-gray-400 truncate text-[10px]">@{influencer.handle}</p>
          <div className="mt-2 pt-2 border-t border-gray-800 flex justify-center">
            <span className="text-[10px] text-gold-400 font-semibold">{influencer.total_points} pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Formation() {
  return (
    <div className="relative z-10 h-full flex items-center justify-center py-8">
      <div className="space-y-8">
        <div className="flex justify-center">
          <PlayerCard influencer={SAMPLE_TEAM[0]} isCaptain />
        </div>
        <div className="flex justify-center gap-14">
          <PlayerCard influencer={SAMPLE_TEAM[1]} />
          <PlayerCard influencer={SAMPLE_TEAM[2]} />
        </div>
        <div className="flex justify-center gap-14">
          <PlayerCard influencer={SAMPLE_TEAM[3]} />
          <PlayerCard influencer={SAMPLE_TEAM[4]} />
        </div>
      </div>
    </div>
  );
}

function CornerBrackets({ color = 'white' }: { color?: 'white' | 'gold' }) {
  const c = color === 'gold' ? 'border-gold-500/20' : 'border-white/[0.08]';
  return (
    <>
      <div className={`absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 ${c} rounded-tl`} />
      <div className={`absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 ${c} rounded-tr`} />
      <div className={`absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 ${c} rounded-bl`} />
      <div className={`absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 ${c} rounded-br`} />
    </>
  );
}

/* ── Option 1: Stadium Spotlight ──────────────────────────────────── */

function Option1() {
  return (
    <div className="relative rounded-2xl overflow-hidden min-h-[440px]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D14] via-[#0A0A0F] to-[#0D0D14]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(245,158,11,0.10)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.35)_0%,transparent_20%,transparent_80%,rgba(0,0,0,0.35)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,transparent_15%,transparent_85%,rgba(0,0,0,0.25)_100%)]" />
      {/* Gold pitch lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 md:w-52 h-36 md:h-52 border border-yellow-500/30 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50" />
        <div className="absolute top-1/2 left-8 right-8 h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-16 border-b border-l border-r border-yellow-500/15 rounded-b-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-16 border-t border-l border-r border-yellow-500/15 rounded-t-full" />
      </div>
      <CornerBrackets color="gold" />
      <Formation />
    </div>
  );
}

/* ── Option 2: Tactical Chalkboard ────────────────────────────────── */

function Option2() {
  return (
    <div className="relative rounded-2xl overflow-hidden min-h-[440px]">
      <div className="absolute inset-0 bg-gray-900" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(245,158,11,0.03) 35px, rgba(245,158,11,0.03) 70px)`,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.2)_100%)]" />
      {/* White pitch lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 md:w-52 h-36 md:h-52 border border-white/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/20 rounded-full" />
        <div className="absolute top-1/2 left-8 right-8 h-px bg-white/[0.06]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-16 border-b border-l border-r border-white/[0.06] rounded-b-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-16 border-t border-l border-r border-white/[0.06] rounded-t-full" />
      </div>
      <CornerBrackets />
      <Formation />
    </div>
  );
}

/* ── Option 3: Grass Texture ──────────────────────────────────────── */

function Option3() {
  return (
    <div className="relative rounded-2xl overflow-hidden min-h-[440px]">
      <div className="absolute inset-0 bg-[#0C1414]" />
      {/* Vertical grass blades */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, rgba(34,197,94,0.05) 0px, rgba(34,197,94,0.02) 1px, transparent 2px, transparent 4px)`,
          backgroundSize: '4px 100%',
        }}
      />
      {/* Horizontal mowing stripes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgba(34,197,94,0.03) 0px, transparent 1px, transparent 24px, rgba(34,197,94,0.03) 24px, transparent 25px, transparent 48px)`,
          backgroundSize: '100% 48px',
        }}
      />
      {/* Gold light wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(135deg, transparent 0px, rgba(245,158,11,0.03) 40px, transparent 80px)`,
        }}
      />
      {/* Stadium vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.35)_100%)]" />
      {/* Gold pitch lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 md:w-52 h-36 md:h-52 border border-yellow-400/30 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400/50 rounded-full" />
        <div className="absolute top-1/2 left-8 right-8 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-16 border-b border-l border-r border-yellow-400/15 rounded-b-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-16 border-t border-l border-r border-yellow-400/15 rounded-t-full" />
      </div>
      <CornerBrackets color="gold" />
      <Formation />
    </div>
  );
}

/* ── Option 4: Digital Holo Grid ──────────────────────────────────── */

function Option4() {
  return (
    <div className="relative rounded-2xl overflow-hidden min-h-[440px]">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-[#0A0A0F] to-[#0E0E16]" />
      {/* Cyan fine grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(34,211,238,0.07) 0.5px, transparent 0.5px),
            linear-gradient(rgba(34,211,238,0.07) 0.5px, transparent 0.5px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      {/* Gold larger grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(245,158,11,0.06) 1px, transparent 1px),
            linear-gradient(rgba(245,158,11,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '200px 200px',
        }}
      />
      {/* Diagonal shatter */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(135deg, transparent calc(50% - 1px), rgba(34,211,238,0.04) calc(50% - 0.5px), rgba(34,211,238,0.04) calc(50% + 0.5px), transparent calc(50% + 1px))`,
          backgroundSize: '120px 120px',
        }}
      />
      {/* Cyan center glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.08)_0%,transparent_55%)]" />
      {/* Cyan + gold pitch lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 md:w-52 h-36 md:h-52 border border-cyan-400/30 rounded-full"
          style={{ boxShadow: '0 0 20px rgba(34,211,238,0.10)' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 md:w-40 h-28 md:h-40 border border-yellow-400/15 rounded-full" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full"
          style={{ boxShadow: '0 0 12px rgba(250,204,21,0.8)' }}
        />
        <div className="absolute top-1/2 left-8 right-8 h-px bg-gradient-to-r from-cyan-400/0 via-cyan-400/30 to-cyan-400/0" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-16 border-b border-l border-r border-cyan-400/12 rounded-b-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-16 border-t border-l border-r border-cyan-400/12 rounded-t-full" />
      </div>
      <CornerBrackets />
      <Formation />
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function CardCompare() {
  const [selected, setSelected] = useState<number | null>(null);

  const options = [
    { id: 1, name: 'Stadium Spotlight', desc: 'Gold spotlight from above, dark stadium shadows on edges. Cinematic.', Component: Option1 },
    { id: 2, name: 'Tactical Chalkboard', desc: 'Subtle grid pattern with gold diagonal accents. Clean, strategic.', Component: Option2 },
    { id: 3, name: 'Grass Texture', desc: 'Dark green grass blades with mowing stripes, gold pitch lines. Stadium at night.', Component: Option3 },
    { id: 4, name: 'Digital Holo Grid', desc: 'Cyan + gold grid lines, glowing center. Futuristic, crypto-native.', Component: Option4 },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Pitch Background Compare</h1>
          <p className="text-gray-500 text-sm">Click to select. All pure CSS — no images.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {options.map(({ id, name, desc, Component }) => (
            <div key={id}>
              <button
                onClick={() => setSelected(id)}
                className={`w-full text-left rounded-2xl transition-all ${
                  selected === id
                    ? 'ring-2 ring-gold-500 ring-offset-2 ring-offset-gray-950'
                    : 'hover:ring-1 hover:ring-gray-700'
                }`}
              >
                <Component />
              </button>
              <div className="mt-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${selected === id ? 'text-gold-400' : 'text-white'}`}>
                    #{id} — {name}
                  </span>
                  {selected === id && (
                    <span className="text-[10px] font-bold text-gold-400 bg-gold-500/15 px-2 py-0.5 rounded-full">
                      SELECTED
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
