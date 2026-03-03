/**
 * OnboardingFlow — Immersive full-screen onboarding experience
 *
 * 5-step cinematic walkthrough:
 *   1. "The Signal"  – Hook with gold pulse
 *   2. "The Roster"  – Floating influencer avatars with tier rings
 *   3. "The Draft"   – Animated formation building itself
 *   4. "The Score"   – Scoring bars animating in
 *   5. "The Call"    – CTA for the live contest
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Crown,
  Target,
  ChartLineUp,
  Trophy,
  Lightning,
  X,
  CaretRight,
} from '@phosphor-icons/react';
import { useOnboarding } from '../../contexts/OnboardingContext';

interface OnboardingFlowProps {
  onComplete: () => void;
  contestId?: number;
}

// Real influencers from the roster
const SHOWCASE_INFLUENCERS = [
  { handle: 'cobie', name: 'Cobie', tier: 'S' as const, price: 28 },
  { handle: 'blknoiz06', name: 'Ansem', tier: 'S' as const, price: 28 },
  { handle: 'DefiIgnas', name: 'DeFi Ignas', tier: 'A' as const, price: 22 },
  { handle: 'CryptoKaleo', name: 'Kaleo', tier: 'A' as const, price: 22 },
  { handle: 'rektcapital', name: 'Rekt Capital', tier: 'A' as const, price: 22 },
  { handle: 'CryptoHayes', name: 'Arthur Hayes', tier: 'B' as const, price: 18 },
  { handle: 'Route2FI', name: 'Route2FI', tier: 'B' as const, price: 18 },
  { handle: 'haabordeaux', name: 'Hasu', tier: 'C' as const, price: 12 },
];

const TIER_COLORS = {
  S: { ring: 'ring-gold-400', text: 'text-gold-400', bg: 'bg-gold-500/20', border: 'border-gold-500/40', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]' },
  A: { ring: 'ring-cyan-400', text: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]' },
  B: { ring: 'ring-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]' },
  C: { ring: 'ring-gray-400', text: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/40', glow: 'shadow-[0_0_20px_rgba(161,161,170,0.15)]' },
};

const TOTAL_STEPS = 5;

// ─── Step 1: The Signal ──────────────────────────────────────────────────────

function StepSignal({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      {/* Gold pulse ring */}
      <div className={`relative mb-10 transition-all duration-700 ${active ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
        <div className="w-24 h-24 rounded-full border-2 border-gold-500/30 flex items-center justify-center animate-pulse-gold">
          <div className="w-16 h-16 rounded-full border border-gold-500/50 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gold-500 shadow-[0_0_30px_rgba(245,158,11,0.6)]" />
          </div>
        </div>
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-[spin_8s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-1.5 h-1.5 rounded-full bg-gold-400/60" />
        </div>
        <div className="absolute inset-0 animate-[spin_12s_linear_infinite_reverse]">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-1 h-1 rounded-full bg-gold-400/40" />
        </div>
      </div>

      <p className={`text-xs font-mono text-gold-400/60 uppercase tracking-[0.3em] mb-4 transition-all duration-500 delay-200 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        Foresight
      </p>

      <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4 transition-all duration-500 delay-300 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        The alpha is in<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-500">the timeline.</span>
      </h1>

      <p className={`text-sm sm:text-base text-gray-400 max-w-sm leading-relaxed transition-all duration-500 delay-500 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        Draft CT influencers. Score their real Twitter performance. Compete for prizes.
      </p>
    </div>
  );
}

// ─── Step 2: The Roster ──────────────────────────────────────────────────────

function StepRoster({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <p className={`text-xs font-mono text-gray-500 uppercase tracking-[0.2em] mb-3 transition-all duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}>
        Step 1
      </p>
      <h2 className={`text-2xl sm:text-3xl font-bold text-white mb-2 transition-all duration-500 delay-100 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        Meet the Roster
      </h2>
      <p className={`text-sm text-gray-400 mb-8 transition-all duration-500 delay-200 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        62 real CT influencers across 4 tiers
      </p>

      {/* Floating avatar grid */}
      <div className={`grid grid-cols-4 gap-3 sm:gap-4 max-w-sm mx-auto mb-8 transition-all duration-500 delay-300 ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        {SHOWCASE_INFLUENCERS.map((inf, i) => {
          const tc = TIER_COLORS[inf.tier];
          return (
            <div
              key={inf.handle}
              className="flex flex-col items-center gap-1.5"
              style={{
                transitionDelay: active ? `${400 + i * 80}ms` : '0ms',
                opacity: active ? 1 : 0,
                transform: active ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
              }}
            >
              <div className={`relative rounded-full ring-2 ${tc.ring} ${tc.glow} transition-shadow duration-300`}>
                <img
                  src={`https://unavatar.io/twitter/${inf.handle}`}
                  alt={inf.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-800 object-cover"
                  loading="eager"
                />
                <span className={`absolute -bottom-1 -right-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${tc.bg} ${tc.text} ${tc.border} border`}>
                  {inf.tier}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 truncate w-full text-center">{inf.name}</span>
            </div>
          );
        })}
      </div>

      {/* Tier legend */}
      <div className={`flex items-center justify-center gap-4 sm:gap-6 transition-all duration-500 delay-700 ${active ? 'opacity-100' : 'opacity-0'}`}>
        {(['S', 'A', 'B', 'C'] as const).map(tier => (
          <div key={tier} className="flex items-center gap-1.5">
            <span className={`text-[10px] font-bold ${TIER_COLORS[tier].text}`}>{tier}</span>
            <span className="text-[10px] text-gray-600">
              {tier === 'S' ? '28pts' : tier === 'A' ? '22pts' : tier === 'B' ? '18pts' : '12pts'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 3: The Draft ───────────────────────────────────────────────────────

function StepDraft({ active }: { active: boolean }) {
  const [showSlots, setShowSlots] = useState([false, false, false, false, false]);
  const [showBudget, setShowBudget] = useState(false);

  useEffect(() => {
    if (!active) {
      setShowSlots([false, false, false, false, false]);
      setShowBudget(false);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    // Stagger each slot appearing
    [600, 900, 1200, 1500, 1800].forEach((delay, i) => {
      timers.push(setTimeout(() => {
        setShowSlots(prev => { const n = [...prev]; n[i] = true; return n; });
      }, delay));
    });
    timers.push(setTimeout(() => setShowBudget(true), 2200));
    return () => timers.forEach(clearTimeout);
  }, [active]);

  const team = [
    { handle: 'cobie', name: 'Cobie', tier: 'S' as const, price: 28, captain: true },
    { handle: 'DefiIgnas', name: 'DeFi Ignas', tier: 'A' as const, price: 22, captain: false },
    { handle: 'CryptoKaleo', name: 'Kaleo', tier: 'A' as const, price: 22, captain: false },
    { handle: 'CryptoHayes', name: 'Arthur Hayes', tier: 'B' as const, price: 18, captain: false },
    { handle: 'haabordeaux', name: 'Hasu', tier: 'C' as const, price: 12, captain: false },
  ];
  const totalCost = team.reduce((s, p) => s + p.price, 0); // 102

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <p className={`text-xs font-mono text-gray-500 uppercase tracking-[0.2em] mb-3 transition-all duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}>
        Step 2
      </p>
      <h2 className={`text-2xl sm:text-3xl font-bold text-white mb-2 transition-all duration-500 delay-100 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        Draft Your 5
      </h2>
      <p className={`text-sm text-gray-400 mb-6 transition-all duration-500 delay-200 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        Pick 5 influencers within a 150-point budget
      </p>

      {/* Formation: 1-2-2 pyramid */}
      <div className="relative w-full max-w-xs mx-auto mb-6">
        {/* Row 1: Captain */}
        <div className="flex justify-center mb-3">
          <DraftSlot player={team[0]} visible={showSlots[0]} />
        </div>
        {/* Row 2: Two players */}
        <div className="flex justify-center gap-6 sm:gap-10 mb-3">
          <DraftSlot player={team[1]} visible={showSlots[1]} />
          <DraftSlot player={team[2]} visible={showSlots[2]} />
        </div>
        {/* Row 3: Two players */}
        <div className="flex justify-center gap-6 sm:gap-10">
          <DraftSlot player={team[3]} visible={showSlots[3]} />
          <DraftSlot player={team[4]} visible={showSlots[4]} />
        </div>
      </div>

      {/* Budget bar */}
      <div className={`w-full max-w-xs mx-auto transition-all duration-500 ${showBudget ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Budget Used</span>
          <span className="text-xs font-mono text-white tabular-nums">
            {totalCost} <span className="text-gray-500">/ 150</span>
          </span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-500 to-amber-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: showBudget ? `${(totalCost / 150) * 100}%` : '0%' }}
          />
        </div>
        <p className="text-[10px] text-gray-600 mt-2 font-mono">
          48 points remaining — room for upgrades
        </p>
      </div>
    </div>
  );
}

function DraftSlot({ player, visible }: {
  player: { handle: string; name: string; tier: 'S' | 'A' | 'B' | 'C'; price: number; captain: boolean };
  visible: boolean;
}) {
  const tc = TIER_COLORS[player.tier];
  return (
    <div
      className={`flex flex-col items-center transition-all duration-400 ease-out ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
    >
      <div className={`relative rounded-full ring-2 ${tc.ring} ${visible ? tc.glow : ''} transition-shadow duration-500`}>
        <img
          src={`https://unavatar.io/twitter/${player.handle}`}
          alt={player.name}
          className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gray-800 object-cover"
          loading="eager"
        />
        {player.captain && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <Crown size={14} weight="fill" className="text-gold-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.8)]" />
          </div>
        )}
        <span className={`absolute -bottom-1 -right-1 text-[7px] font-bold px-1 py-0.5 rounded-full ${tc.bg} ${tc.text} ${tc.border} border`}>
          {player.tier}
        </span>
      </div>
      <span className="text-[9px] text-gray-400 mt-1 truncate max-w-[60px]">{player.name}</span>
      <div className="flex items-center gap-1 mt-0.5">
        <span className="text-[8px] font-mono text-gray-600">{player.price}pts</span>
        {player.captain && (
          <span className="text-[7px] font-bold text-gold-400">2x</span>
        )}
      </div>
    </div>
  );
}

// ─── Step 4: The Score ───────────────────────────────────────────────────────

function StepScore({ active }: { active: boolean }) {
  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => setAnimateBars(true), 500);
      return () => clearTimeout(timer);
    }
    setAnimateBars(false);
  }, [active]);

  const categories = [
    { label: 'Activity', desc: 'Tweets per week', max: 35, val: 28, icon: Lightning },
    { label: 'Engagement', desc: 'Likes, RTs, replies', max: 60, val: 52, icon: Target },
    { label: 'Growth', desc: 'Follower gains', max: 40, val: 31, icon: ChartLineUp },
    { label: 'Viral', desc: 'Breakout tweets', max: 25, val: 18, icon: Trophy },
  ];

  const rawTotal = categories.reduce((s, c) => s + c.val, 0);

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <p className={`text-xs font-mono text-gray-500 uppercase tracking-[0.2em] mb-3 transition-all duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}>
        Step 3
      </p>
      <h2 className={`text-2xl sm:text-3xl font-bold text-white mb-2 transition-all duration-500 delay-100 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        Real Performance
      </h2>
      <p className={`text-sm text-gray-400 mb-8 transition-all duration-500 delay-200 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        Scores come from actual Twitter data — no RNG
      </p>

      {/* Scoring bars */}
      <div className="w-full max-w-sm mx-auto space-y-4 mb-8">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          const pct = (cat.val / cat.max) * 100;
          return (
            <div
              key={cat.label}
              style={{
                transitionDelay: active ? `${300 + i * 100}ms` : '0ms',
                opacity: active ? 1 : 0,
                transform: active ? 'translateX(0)' : 'translateX(-16px)',
                transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon size={12} weight="bold" className="text-gray-500" />
                  <span className="text-xs font-medium text-white">{cat.label}</span>
                  <span className="text-[10px] text-gray-600 hidden sm:inline">{cat.desc}</span>
                </div>
                <span className="text-[10px] font-mono text-gray-300 tabular-nums">
                  {cat.val}<span className="text-gray-600">/{cat.max}</span>
                </span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-500/70 rounded-full transition-all ease-out"
                  style={{
                    width: animateBars ? `${pct}%` : '0%',
                    transitionDuration: '800ms',
                    transitionDelay: `${400 + i * 120}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Captain multiplier callout */}
      <div className={`flex items-center justify-center gap-4 px-5 py-3 rounded-xl bg-gray-900 border border-gray-800 max-w-sm mx-auto transition-all duration-500 ${animateBars ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ transitionDelay: '1200ms' }}
      >
        <div className="flex items-center gap-2">
          <Crown size={16} weight="fill" className="text-gold-400" />
          <span className="text-xs text-gray-400">Captain bonus</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-gray-500 tabular-nums line-through">{rawTotal}</span>
          <CaretRight size={10} className="text-gray-600" />
          <span className="text-sm font-mono font-bold text-gold-400 tabular-nums">{rawTotal * 2}</span>
          <span className="text-[10px] text-gold-500/60">pts</span>
        </div>
      </div>
    </div>
  );
}

// ─── Step 5: The Call ────────────────────────────────────────────────────────

function StepCall({ active, onEnter }: { active: boolean; onEnter: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      {/* Trophy icon with glow */}
      <div className={`relative mb-6 transition-all duration-700 delay-200 ${active ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.4)]">
          <Trophy weight="fill" className="w-10 h-10 text-white" />
        </div>
      </div>

      <p className={`text-xs font-mono text-gold-400/60 uppercase tracking-[0.3em] mb-3 transition-all duration-500 delay-300 ${active ? 'opacity-100' : 'opacity-0'}`}>
        Live Now
      </p>

      <h2 className={`text-3xl sm:text-4xl font-bold text-white mb-3 transition-all duration-500 delay-400 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        The Call
      </h2>

      <p className={`text-sm text-gray-400 max-w-sm mb-8 leading-relaxed transition-all duration-500 delay-500 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        Draft 5 CT influencers. Pick a Captain for 2x points. Top 3 win real prizes.
      </p>

      {/* Prize breakdown */}
      <div className={`grid grid-cols-3 gap-3 max-w-xs mx-auto mb-8 transition-all duration-500 delay-600 ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="px-3 py-3 rounded-xl bg-gray-900 border border-gold-500/30">
          <Trophy size={16} weight="fill" className="text-gold-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-white font-mono">$50</p>
          <p className="text-[10px] text-gray-500">1st Place</p>
        </div>
        <div className="px-3 py-3 rounded-xl bg-gray-900 border border-gray-700">
          <Trophy size={16} weight="fill" className="text-gray-300 mx-auto mb-1" />
          <p className="text-lg font-bold text-white font-mono">$30</p>
          <p className="text-[10px] text-gray-500">2nd Place</p>
        </div>
        <div className="px-3 py-3 rounded-xl bg-gray-900 border border-gray-700">
          <Trophy size={16} weight="fill" className="text-amber-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-white font-mono">$20</p>
          <p className="text-[10px] text-gray-500">3rd Place</p>
        </div>
      </div>

      {/* Feature pills */}
      <div className={`flex flex-wrap items-center justify-center gap-2 mb-8 transition-all duration-500 delay-700 ${active ? 'opacity-100' : 'opacity-0'}`}>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
          Free Entry
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-300 font-medium">
          500 Spots
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-300 font-medium">
          72h Contest
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={onEnter}
        className={`group flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gold-500 hover:bg-gold-400 active:bg-gold-600 text-gray-950 font-bold text-base transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] delay-800 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        Draft Your Team
        <ArrowRight size={18} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
      </button>

      <p className={`text-[10px] text-gray-600 mt-3 font-mono transition-all duration-500 delay-1000 ${active ? 'opacity-100' : 'opacity-0'}`}>
        This is your call.
      </p>
    </div>
  );
}

// ─── Main Flow ───────────────────────────────────────────────────────────────

export default function OnboardingFlow({ onComplete, contestId }: OnboardingFlowProps) {
  const navigate = useNavigate();
  const { markWelcomeSeen, markVisited } = useOnboarding();
  const [step, setStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const touchStartRef = useRef<number | null>(null);

  const finish = useCallback(() => {
    setIsExiting(true);
    markWelcomeSeen();
    markVisited();
    setTimeout(() => {
      onComplete();
    }, 300);
  }, [markWelcomeSeen, markVisited, onComplete]);

  const handleEnterContest = useCallback(() => {
    markWelcomeSeen();
    markVisited();
    setIsExiting(true);
    setTimeout(() => {
      if (contestId) {
        navigate(`/draft/${contestId}`);
      } else {
        navigate('/compete?tab=contests');
      }
    }, 300);
  }, [contestId, navigate, markWelcomeSeen, markVisited]);

  const next = useCallback(() => {
    if (step < TOTAL_STEPS - 1) setStep(s => s + 1);
  }, [step]);

  const prev = useCallback(() => {
    if (step > 0) setStep(s => s - 1);
  }, [step]);

  // Lock body scroll while onboarding is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (step === TOTAL_STEPS - 1) {
          handleEnterContest();
        } else {
          next();
        }
      }
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') finish();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [step, next, prev, finish, handleEnterContest]);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
    touchStartRef.current = null;
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#0A0A0F] transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Skip button */}
      <button
        onClick={finish}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 transition-colors"
      >
        Skip <X size={14} />
      </button>

      {/* Step content */}
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center min-h-0 pb-20">
          {step === 0 && <StepSignal active={step === 0} />}
          {step === 1 && <StepRoster active={step === 1} />}
          {step === 2 && <StepDraft active={step === 2} />}
          {step === 3 && <StepScore active={step === 3} />}
          {step === 4 && <StepCall active={step === 4} onEnter={handleEnterContest} />}
        </div>

        {/* Bottom navigation */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 sm:pb-8">
          {/* Progress bar */}
          <div className="max-w-xs mx-auto mb-4">
            <div className="h-0.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-500/60 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>

          {/* Nav buttons */}
          {step < TOTAL_STEPS - 1 && (
            <div className="flex items-center justify-between max-w-xs mx-auto">
              <button
                onClick={prev}
                disabled={step === 0}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 disabled:opacity-0 disabled:pointer-events-none transition-all"
              >
                <ArrowLeft size={14} /> Back
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i === step ? 'bg-gold-500 w-4' : i < step ? 'bg-gold-500/40' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white hover:text-gold-400 transition-colors"
              >
                Next <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
