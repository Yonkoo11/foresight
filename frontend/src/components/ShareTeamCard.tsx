/**
 * ShareTeamCard — Shareable formation card with Twitter/native sharing
 *
 * Display: React formation visual (on-screen)
 * Share: Canvas-drawn PNG (bypasses CORS entirely)
 *
 * Flow:
 * - Mobile: Web Share API → native share sheet (attach image directly)
 * - Desktop: Download PNG → open Twitter composer → user attaches image
 */

import { useState, useEffect } from 'react';
import { XLogo, Export, DownloadSimple, Crown } from '@phosphor-icons/react';
import { useToast } from '../contexts/ToastContext';
import { generateTeamCardImage } from '../utils/generateTeamCard';

interface TeamPick {
  id: number;
  name: string;
  handle?: string;
  twitter_handle?: string;
  tier: string;
  profile_image_url?: string;
  total_points?: number;
  isCaptain?: boolean;
}

interface ShareTeamCardProps {
  picks: TeamPick[];
  captainId?: number | null;
  contestName?: string;
  totalScore?: number;
  rank?: number;
  username?: string;
  userAvatar?: string;
  variant?: 'celebration' | 'compact' | 'share-only';
  className?: string;
}

const TIER_STYLES: Record<string, { gradient: string; border: string; badge: string; hex: string }> = {
  S: { gradient: 'from-gold-400 to-amber-600', border: 'border-gold-400', badge: 'bg-gold-500 text-gray-950', hex: '#F59E0B' },
  A: { gradient: 'from-cyan-500 to-blue-600', border: 'border-cyan-400', badge: 'bg-cyan-500 text-white', hex: '#06B6D4' },
  B: { gradient: 'from-emerald-500 to-teal-600', border: 'border-emerald-400', badge: 'bg-emerald-500 text-white', hex: '#10B981' },
  C: { gradient: 'from-gray-500 to-gray-700', border: 'border-gray-400', badge: 'bg-gray-500 text-white', hex: '#71717A' },
};

export default function ShareTeamCard({
  picks,
  captainId,
  contestName,
  totalScore,
  rank,
  username,
  userAvatar,
  variant = 'celebration',
  className = '',
}: ShareTeamCardProps) {
  const { showToast } = useToast();
  const [generating, setGenerating] = useState(true);
  const [cachedBlob, setCachedBlob] = useState<Blob | null>(null);

  // Pre-generate the image as soon as the component mounts — no wait on click
  useEffect(() => {
    generateTeamCardImage({
      picks: picks.map((p) => ({
        name: p.name,
        handle: p.handle || p.twitter_handle || '',
        tier: p.tier,
        isCaptain: !!(p.isCaptain || p.id === captainId),
        imageUrl: p.profile_image_url,
      })),
      contestName,
      totalScore,
      rank,
      username,
      userAvatar,
    })
      .then((blob) => { setCachedBlob(blob); setGenerating(false); })
      .catch(() => setGenerating(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const buildPostText = () => {
    const captain = picks.find((p) => p.isCaptain || p.id === captainId);
    const others = picks.filter((p) => !(p.isCaptain || p.id === captainId));

    let tweet = `\u{1F3C6} Just locked in my squad on @ForesightCT!\n\n`;
    if (captain) {
      const h = captain.handle || captain.twitter_handle || captain.name;
      tweet += `\u{1F451} Captain: @${h}\n`;
    }
    others.forEach((p) => {
      const h = p.handle || p.twitter_handle || p.name;
      tweet += `\u{26A1} @${h}\n`;
    });
    tweet += `\nDraft your team and beat me \u{1F440}\u{1F447}\n`;
    tweet += `#Foresight #CTDraft #Solana`;
    return tweet;
  };

  const handleShare = async () => {
    const blob = cachedBlob;
    if (!blob) {
      showToast('Still generating image, try again in a moment', 'info');
      return;
    }

    const tweetText = encodeURIComponent(buildPostText());
    const twitterUrl = `https://x.com/intent/post?text=${tweetText}`;

    // Mobile: use Web Share API to share the image file natively
    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
    if (isMobile && navigator.canShare) {
      const file = new File([blob], 'foresight-team.png', { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text: buildPostText() });
          return;
        } catch { /* cancelled */ }
      }
    }

    // Desktop: copy image to clipboard + open Twitter composer
    const pasteKey = /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘V' : 'Ctrl+V';
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast(`Image copied — paste it in your tweet (${pasteKey})`, 'success');
      // Brief delay so user sees the toast before Twitter opens
      setTimeout(() => window.open(twitterUrl, '_blank'), 600);
    } catch {
      // Clipboard failed — download instead
      downloadBlob(blob);
      showToast('Image saved — attach it to your tweet', 'info');
      setTimeout(() => window.open(twitterUrl, '_blank'), 600);
    }
  };

  const handleDownload = async () => {
    if (cachedBlob) {
      downloadBlob(cachedBlob);
      showToast('Team card saved!', 'success');
      return;
    }
    setGenerating(true);
    try {
      const blob = await generateTeamCardImage({
        picks: picks.map((p) => ({
          name: p.name,
          handle: p.handle || p.twitter_handle || '',
          tier: p.tier,
          isCaptain: !!(p.isCaptain || p.id === captainId),
        })),
        contestName,
        totalScore,
        rank,
        username,
        userAvatar,
      });
      downloadBlob(blob);
      showToast('Team card saved!', 'success');
    } catch {
      showToast('Failed to generate image', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(buildPostText());
    showToast('Copied to clipboard!', 'success');
  };

  // Sort picks: captain first, then by tier
  const sortedPicks = [...picks].sort((a, b) => {
    const aIsCpt = a.isCaptain || a.id === captainId;
    const bIsCpt = b.isCaptain || b.id === captainId;
    if (aIsCpt && !bIsCpt) return -1;
    if (!aIsCpt && bIsCpt) return 1;
    const tierOrder = ['S', 'A', 'B', 'C'];
    return tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
  });

  const topRow = sortedPicks.slice(0, 2);
  const midRow = sortedPicks.slice(2, 3);
  const botRow = sortedPicks.slice(3, 5);

  // ─── The formation card (display only — Canvas handles the image) ──
  // Matches the football-pitch style from generateTeamCard.ts
  const formationCard = (
    <div className="relative w-[380px] rounded-2xl overflow-hidden" style={{
      aspectRatio: '600/750',
      background: '#0A0A0F',
    }}>
      {/* Pitch gradient overlay */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(6,78,59,0.35) 0%, rgba(17,24,39,0.6) 50%, rgba(10,10,15,1) 100%)',
      }} />

      {/* Radial emerald glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at center, rgba(16,185,129,0.08) 0%, transparent 70%)',
      }} />

      {/* Pitch lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 750" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Center circle */}
        <circle cx="300" cy="375" r="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        {/* Center dot */}
        <circle cx="300" cy="375" r="3" fill="rgba(255,255,255,0.08)" />
        {/* Half line */}
        <line x1="30" y1="375" x2="570" y2="375" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        {/* Top arc */}
        <path d="M 210 0 A 90 90 0 0 1 390 0" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
        {/* Bottom arc */}
        <path d="M 210 750 A 90 90 0 0 0 390 750" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
        {/* Corner brackets */}
        <path d="M 12 32 L 12 12 L 32 12" stroke="rgba(255,255,255,0.06)" strokeWidth="2" fill="none" />
        <path d="M 568 32 L 568 12 L 548 12" stroke="rgba(255,255,255,0.06)" strokeWidth="2" fill="none" />
        <path d="M 12 718 L 12 738 L 32 738" stroke="rgba(255,255,255,0.06)" strokeWidth="2" fill="none" />
        <path d="M 568 718 L 568 738 L 548 738" stroke="rgba(255,255,255,0.06)" strokeWidth="2" fill="none" />
      </svg>

      {/* Gold top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{
        background: 'linear-gradient(90deg, #F59E0B, #FBBF24, #F59E0B)',
      }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full px-6 py-6">

        {/* Header */}
        <div className="flex flex-col items-center">
          <div style={{ color: '#F59E0B', fontSize: 18, fontWeight: 700, letterSpacing: '3px' }}>
            FORESIGHT
          </div>
          {contestName && (
            <div className="text-[9px] text-gray-500 tracking-widest uppercase mt-1">
              {contestName}
            </div>
          )}
        </div>

        {/* Formation */}
        <div className="flex flex-col items-center justify-center gap-3 w-full">
          <div className="flex justify-center gap-10">
            {topRow.map((pick) => (
              <PlayerNode key={pick.id} pick={pick} captainId={captainId} />
            ))}
          </div>
          <div className="flex justify-center">
            {midRow.map((pick) => (
              <PlayerNode key={pick.id} pick={pick} captainId={captainId} />
            ))}
          </div>
          <div className="flex justify-center gap-10">
            {botRow.map((pick) => (
              <PlayerNode key={pick.id} pick={pick} captainId={captainId} />
            ))}
          </div>
        </div>

        {/* Score/Rank + Footer */}
        <div style={{ width: '100%' }}>
          {(totalScore !== undefined || rank) && (
            <div className="flex items-center justify-center gap-4 text-[11px] mb-2">
              {totalScore !== undefined && <span style={{ color: '#F59E0B' }} className="font-bold">{totalScore} pts</span>}
              {rank && <span className="text-white font-bold">#{rank}</span>}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {username ? (
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full overflow-hidden shrink-0" style={{ border: '1px solid rgba(245,158,11,0.5)' }}>
                  {userAvatar ? (
                    <img src={userAvatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)' }}>
                      <span className="text-[6px] font-bold" style={{ color: '#F59E0B' }}>
                        {username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-[8px] text-gray-400">@{username}</span>
              </div>
            ) : (
              <span style={{ color: '#52525B', fontSize: 8, fontWeight: 500 }}>ct-foresight.xyz</span>
            )}
            <span style={{ color: '#52525B', fontSize: 8 }}>Tapestry Protocol</span>
          </div>
        </div>
      </div>

    </div>
  );

  // ─── Share-only: formation + share buttons ────────────────────────────
  if (variant === 'share-only') {
    return (
      <div className={className}>
        {formationCard}
        <div className="mt-4 space-y-2">
          <button
            onClick={handleShare}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-white hover:bg-gray-100 text-gray-950 font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
          >
            {generating ? (
              <div className="w-5 h-5 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <XLogo size={22} weight="fill" />
            )}
            {generating ? 'Preparing...' : 'Share on X'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              disabled={generating}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800/60 hover:bg-gray-800 text-gray-400 hover:text-gray-300 text-sm font-medium transition-colors border border-gray-800 disabled:opacity-60"
            >
              <DownloadSimple size={16} />
              Save Image
            </button>
            <button
              onClick={handleCopyText}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800/60 hover:bg-gray-800 text-gray-400 hover:text-gray-300 text-sm font-medium transition-colors border border-gray-800"
            >
              <Export size={16} />
              Copy Text
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Compact: inline share buttons ────────────────────────────────────
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={handleShare}
          disabled={generating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all disabled:opacity-60"
        >
          <XLogo size={14} weight="fill" />
          Share
        </button>
        <button
          onClick={handleCopyText}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 text-sm hover:text-white transition-all"
        >
          <Export size={14} />
          Copy
        </button>
      </div>
    );
  }

  // ─── Celebration: full card + share buttons ───────────────────────────
  return (
    <div className={className}>
      {formationCard}
      <div className="mt-4 space-y-2">
        <button
          onClick={handleShare}
          disabled={generating}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-gray-950 font-medium transition-colors disabled:opacity-60"
        >
          {generating ? (
            <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <XLogo size={18} weight="fill" />
          )}
          Share on X
        </button>
        <button
          onClick={handleCopyText}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-colors border border-gray-700"
        >
          <Export size={18} />
          Copy Team Details
        </button>
      </div>
    </div>
  );
}

// ─── Player Node (display only — React component for on-screen) ──────────
function PlayerNode({ pick, captainId }: { pick: TeamPick; captainId?: number | null }) {
  const [imgError, setImgError] = useState(false);
  const isCaptain = pick.isCaptain || pick.id === captainId;
  const tier = TIER_STYLES[pick.tier] || TIER_STYLES.C;
  const handle = pick.handle || pick.twitter_handle || '';
  // Use unavatar.io for reliable live Twitter profile photos — DB avatar_url can be stale
  const avatarSrc = handle ? `https://unavatar.io/twitter/${handle}` : pick.profile_image_url;
  const showImg = !!avatarSrc && !imgError;

  return (
    <div className="relative flex flex-col items-center w-20">
      {isCaptain && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-gold-500 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-lg">
            <Crown size={10} weight="fill" className="text-gray-950" />
            <span className="text-[8px] font-extrabold text-gray-950">CPT</span>
          </div>
        </div>
      )}

      <div className={`p-[3px] rounded-full bg-gradient-to-br ${tier.gradient}`}
        style={{ boxShadow: `0 0 16px ${tier.hex}50, 0 0 32px ${tier.hex}20` }}>
        <div className="w-12 h-12 rounded-full overflow-hidden" style={{ background: '#1A1A24' }}>
          {showImg ? (
            <img
              src={avatarSrc}
              alt={pick.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ color: tier.hex }}>
              {pick.name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      <div className={`absolute top-7 -right-0.5 ${tier.badge} px-1 py-px rounded text-[8px] font-extrabold z-10`}>
        {pick.tier}
      </div>

      <div className="mt-1.5 text-center">
        <div className="text-[10px] font-semibold text-white truncate max-w-[76px]">
          {pick.name.split(' ')[0]}
        </div>
        <div className="text-[8px] text-gray-400 truncate max-w-[76px]">
          @{handle.length > 10 ? handle.slice(0, 10) : handle}
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function downloadBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'foresight-team.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
