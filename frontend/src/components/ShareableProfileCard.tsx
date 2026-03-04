/**
 * Shareable Profile Card — Premium Trading Card edition
 *
 * Design: Gold beveled frame, tier-colored avatar glow, decorative corners,
 *         full tier badge, matching generateTeamCard.ts premium aesthetic.
 *
 * Canvas: 520×680px @2x retina
 */

import { useState, useEffect } from 'react';
import apiClient from '../lib/apiClient';
import { useAuth } from '../hooks/useAuth';
import { Star, Crown, Diamond, Medal, Trophy, Share, XLogo, Copy, Check, X } from '@phosphor-icons/react';
import { useToast } from '../contexts/ToastContext';
import {
  roundRect, drawAvatarRing,
  loadImage, BG_MAIN, GOLD, TEXT_WHITE, TEXT_MUTED, TEXT_DIM,
} from '../utils/cardDrawing';

interface ProfileCardData {
  username: string;
  avatarUrl?: string;
  totalScore: number;
  tier: string;
  allTimeRank: number | null;
  seasonRank: number | null;
  weekScore: number;
  isFoundingMember: boolean;
  foundingMemberNumber: number | null;
  earlyAdopterTier: string | null;
  effectiveMultiplier: number;
  contestsEntered: number;
  contestsWon: number;
}

interface Props {
  onClose?: () => void;
  showModal?: boolean;
}

const TIER = {
  bronze:   { color: '#F97316', label: 'BRONZE',   Icon: Medal,   gradient: ['#F97316', '#EA580C'] },
  silver:   { color: '#D1D5DB', label: 'SILVER',   Icon: Star,    gradient: ['#D1D5DB', '#9CA3AF'] },
  gold:     { color: '#FBBF24', label: 'GOLD',     Icon: Trophy,  gradient: ['#FBBF24', '#F59E0B'] },
  platinum: { color: '#22D3EE', label: 'PLATINUM', Icon: Crown,   gradient: ['#22D3EE', '#06B6D4'] },
  diamond:  { color: '#F59E0B', label: 'DIAMOND',  Icon: Diamond, gradient: ['#F59E0B', '#D97706'] },
} as const;

const TIER_RANK_LABEL: Record<string, string> = {
  bronze: 'BRONZE TIER',
  silver: 'SILVER TIER',
  gold: 'GOLD TIER',
  platinum: 'PLATINUM TIER',
  diamond: 'DIAMOND TIER',
};

// ─── Canvas generator (Premium Trading Card) ────────────────────────────────

async function generateProfileCard(data: ProfileCardData): Promise<Blob | null> {
  const W = 530;
  const H = 776;      // Matches frame image aspect ratio (0.683)
  const S = 2;

  const tier = TIER[data.tier as keyof typeof TIER] ?? TIER.bronze;
  const tc = tier.color;

  const canvas = document.createElement('canvas');
  canvas.width = W * S;
  canvas.height = H * S;
  const ctx = canvas.getContext('2d')!;

  // ── Load assets in parallel ────────────────────────────────────────
  const [frameImg, logoImg, avatarImg] = await Promise.all([
    loadImage('/card-frame-gold.png', 8000),
    loadImage('/logo.svg', 3000),
    data.avatarUrl ? loadImage(data.avatarUrl) : Promise.resolve(null),
  ]);

  // ── Frame image as background (slight overscale to crop dark edges) ─
  if (frameImg) {
    const os = 1.02;
    const fw = W * S * os;
    const fh = H * S * os;
    ctx.drawImage(frameImg, (W * S - fw) / 2, (H * S - fh) / 2, fw, fh);
  } else {
    ctx.fillStyle = BG_MAIN;
    ctx.fillRect(0, 0, W * S, H * S);
  }

  // ── Content zone ───────────────────────────────────────────────────
  const cx = W * S / 2;
  const safeTop = Math.round(H * 0.13) * S;
  const safeBot = Math.round(H * 0.87) * S;
  const safeL   = Math.round(W * 0.13) * S;
  const safeR   = Math.round(W * 0.87) * S;
  const contentW = safeR - safeL;

  // ── Atmosphere: Radial tier glow from avatar area ──────────────────
  const glowCY = safeTop + 180 * S;
  const rg = ctx.createRadialGradient(cx, glowCY, 0, cx, glowCY, 280 * S);
  rg.addColorStop(0, `${tc}14`);
  rg.addColorStop(0.4, `${tc}08`);
  rg.addColorStop(1, 'transparent');
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, W * S, H * S);

  // ── Atmosphere: Subtle horizontal scan lines ───────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.012)';
  for (let sy = safeTop; sy < safeBot; sy += 6 * S) {
    ctx.fillRect(safeL, sy, contentW, 1 * S);
  }

  // ── Logo ───────────────────────────────────────────────────────────
  let y = safeTop;
  if (logoImg) {
    const logoH = 36 * S;
    const logoW = logoH * (logoImg.naturalWidth / logoImg.naturalHeight || 1.714);
    ctx.drawImage(logoImg, cx - logoW / 2, y, logoW, logoH);
    y += logoH + 2 * S;
  }

  // ── "FORESIGHT" header ─────────────────────────────────────────────
  ctx.font = `bold ${18 * S}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = GOLD;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.letterSpacing = `${1.5 * S}px`;
  ctx.fillText('FORESIGHT', cx, y);
  ctx.letterSpacing = '0px';

  const titleW = ctx.measureText('FORESIGHT').width;
  y += 24 * S;
  const lineGrad = ctx.createLinearGradient(cx - titleW / 2, y, cx + titleW / 2, y);
  lineGrad.addColorStop(0, 'rgba(245,158,11,0)');
  lineGrad.addColorStop(0.3, 'rgba(245,158,11,0.6)');
  lineGrad.addColorStop(0.5, GOLD);
  lineGrad.addColorStop(0.7, 'rgba(245,158,11,0.6)');
  lineGrad.addColorStop(1, 'rgba(245,158,11,0)');
  ctx.fillStyle = lineGrad;
  ctx.fillRect(cx - titleW * 0.7, y, titleW * 1.4, 2 * S);
  y += 18 * S;

  // ── Avatar with tier ring + glow ──────────────────────────────────
  const AR = 52 * S;
  const AY = y + AR + 4 * S;
  drawAvatarRing(ctx, cx, AY, AR, '', S, avatarImg, data.username,
    { hex: tc, gradient: [tier.gradient[0], tier.gradient[1]] });

  // Tier badge circle (bottom-right of avatar)
  const badgeR = 14 * S;
  const badgeX = cx + AR - 4 * S;
  const badgeY = AY + AR - 8 * S;
  ctx.beginPath(); ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
  ctx.fillStyle = tc; ctx.fill();
  ctx.beginPath(); ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
  ctx.strokeStyle = BG_MAIN; ctx.lineWidth = 3 * S; ctx.stroke();
  ctx.fillStyle = '#0A0A0F';
  ctx.font = `bold ${11 * S}px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(tier.label.charAt(0), badgeX, badgeY);

  // ── Username ──────────────────────────────────────────────────────
  y = AY + AR + 22 * S;
  ctx.fillStyle = TEXT_WHITE;
  ctx.font = `bold ${24 * S}px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(data.username, cx, y);

  // Tier / founding member label
  const memberText = data.isFoundingMember && data.foundingMemberNumber
    ? `Founding Member #${data.foundingMemberNumber}`
    : TIER_RANK_LABEL[data.tier] || 'CT FORESIGHT';

  y += 8 * S;
  ctx.font = `bold ${8 * S}px Inter, system-ui, sans-serif`;
  const labelW = ctx.measureText(memberText).width;
  const lbPadX = 10 * S;
  const lbH = 16 * S;
  const lbW = labelW + lbPadX * 2;
  const lbX = cx - lbW / 2;
  roundRect(ctx, lbX, y, lbW, lbH, 4 * S);
  ctx.fillStyle = `${tc}25`; ctx.fill();
  roundRect(ctx, lbX, y, lbW, lbH, 4 * S);
  ctx.strokeStyle = `${tc}50`; ctx.lineWidth = 1 * S; ctx.stroke();
  ctx.fillStyle = tc;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(memberText, cx, y + lbH / 2);
  y += lbH + 14 * S;

  // ── SEASON RANK — gold, glowing ───────────────────────────────────
  ctx.fillStyle = TEXT_MUTED;
  ctx.font = `600 ${8 * S}px Inter, system-ui, sans-serif`;
  ctx.letterSpacing = `${2 * S}px`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('SEASON RANK', cx, y);
  ctx.letterSpacing = '0px';

  const rankStr = data.seasonRank ? `#${data.seasonRank}` : '\u2014';
  y += 8 * S;

  // Gold glow pass
  ctx.save();
  ctx.shadowColor = GOLD;
  ctx.shadowBlur = 18 * S;
  ctx.fillStyle = GOLD;
  ctx.font = `bold ${44 * S}px Inter, system-ui, sans-serif`;
  ctx.textBaseline = 'top';
  ctx.fillText(rankStr, cx, y);
  ctx.restore();

  // Crisp gold text on top
  ctx.fillStyle = GOLD;
  ctx.font = `bold ${44 * S}px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(rankStr, cx, y);
  y += 54 * S;

  // ── Stat Pyramid ──────────────────────────────────────────────────
  const boxR = 8 * S;

  // FS Score — full width, prominent
  const fsBoxH = 52 * S;
  roundRect(ctx, safeL, y, contentW, fsBoxH, boxR);
  const fsGrad = ctx.createLinearGradient(safeL, y, safeL, y + fsBoxH);
  fsGrad.addColorStop(0, '#1E1E28');
  fsGrad.addColorStop(1, '#151520');
  ctx.fillStyle = fsGrad;
  ctx.fill();

  // Gold top accent line
  const accentInset = 16 * S;
  ctx.fillStyle = GOLD;
  ctx.fillRect(safeL + accentInset, y, contentW - accentInset * 2, 2 * S);

  // Subtle gold border
  roundRect(ctx, safeL, y, contentW, fsBoxH, boxR);
  ctx.strokeStyle = `${GOLD}30`;
  ctx.lineWidth = 1 * S;
  ctx.stroke();

  ctx.fillStyle = GOLD;
  ctx.font = `600 ${7 * S}px Inter, system-ui, sans-serif`;
  ctx.letterSpacing = `${1.5 * S}px`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('FORESIGHT SCORE', cx, y + 17 * S);
  ctx.letterSpacing = '0px';

  ctx.fillStyle = TEXT_WHITE;
  ctx.font = `bold ${24 * S}px Inter, system-ui, sans-serif`;
  ctx.fillText(data.totalScore.toLocaleString(), cx, y + 38 * S);
  y += fsBoxH + 8 * S;

  // Multiplier + All-Time — side by side
  const sideGap = 8 * S;
  const halfW = (contentW - sideGap) / 2;
  const sideBoxH = 44 * S;

  const sideStats = [
    { label: 'MULTIPLIER', value: data.effectiveMultiplier > 1 ? `${data.effectiveMultiplier.toFixed(2)}\u00d7` : '1.00\u00d7' },
    { label: 'ALL-TIME', value: data.allTimeRank ? `#${data.allTimeRank}` : '\u2014' },
  ];

  sideStats.forEach((item, i) => {
    const bx = safeL + i * (halfW + sideGap);

    roundRect(ctx, bx, y, halfW, sideBoxH, boxR);
    const sg = ctx.createLinearGradient(bx, y, bx, y + sideBoxH);
    sg.addColorStop(0, '#1A1A24');
    sg.addColorStop(1, '#141420');
    ctx.fillStyle = sg;
    ctx.fill();

    roundRect(ctx, bx, y, halfW, sideBoxH, boxR);
    ctx.strokeStyle = '#27272A';
    ctx.lineWidth = 1 * S;
    ctx.stroke();

    ctx.fillStyle = GOLD;
    ctx.font = `600 ${7 * S}px Inter, system-ui, sans-serif`;
    ctx.letterSpacing = `${1 * S}px`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(item.label, bx + halfW / 2, y + 15 * S);
    ctx.letterSpacing = '0px';

    ctx.fillStyle = TEXT_WHITE;
    ctx.font = `bold ${18 * S}px Inter, system-ui, sans-serif`;
    ctx.fillText(item.value, bx + halfW / 2, y + 32 * S);
  });

  // ── Footer ────────────────────────────────────────────────────────
  const footerY = safeBot - 18 * S;
  const inset = safeL;
  const footGrad = ctx.createLinearGradient(inset, footerY, W * S - inset, footerY);
  footGrad.addColorStop(0, 'rgba(245,158,11,0)');
  footGrad.addColorStop(0.5, 'rgba(245,158,11,0.25)');
  footGrad.addColorStop(1, 'rgba(245,158,11,0)');
  ctx.fillStyle = footGrad;
  ctx.fillRect(inset, footerY, W * S - inset * 2, 1 * S);

  ctx.font = `500 ${10 * S}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = TEXT_MUTED;
  ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.fillText('Tapestry Protocol', inset, footerY + 8 * S);
  ctx.textAlign = 'right';
  ctx.fillText('ct-foresight.xyz', W * S - inset, footerY + 8 * S);

  return new Promise((res) => canvas.toBlob((b) => res(b), 'image/png'));
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function ShareableProfileCard({ onClose, showModal = true }: Props) {
  const { address, isConnected } = useAuth();
  const { showToast } = useToast();
  const [loading,    setLoading]    = useState(true);
  const [data,       setData]       = useState<ProfileCardData | null>(null);
  const [copied,     setCopied]     = useState(false);
  const [generating, setGenerating] = useState(false);
  const [cachedBlob, setCachedBlob] = useState<Blob | null>(null);

  useEffect(() => { if (isConnected) fetchData(); }, [isConnected]);

  useEffect(() => {
    if (!data) return;
    setGenerating(true);
    generateProfileCard(data)
      .then((b) => { if (b) setCachedBlob(b); })
      .catch(console.error)
      .finally(() => setGenerating(false));
  }, [data]);

  const fetchData = async () => {
    try {
      const [fsRes, statsRes] = await Promise.all([
        apiClient.get(`/api/v2/fs/me`),
        apiClient.get(`/api/users/stats`)
          .catch(() => ({ data: { success: false } })),
      ]);
      if (fsRes.data.success) {
        const fs = fsRes.data.data;
        const st = statsRes.data.success ? statsRes.data.data : {};
        setData({
          username:             fs.username || address?.slice(0, 8) || 'Anonymous',
          avatarUrl:            fs.avatarUrl,
          totalScore:           fs.totalScore || 0,
          tier:                 fs.tier || 'bronze',
          allTimeRank:          fs.allTimeRank,
          seasonRank:           fs.seasonRank,
          weekScore:            fs.weekScore || 0,
          isFoundingMember:     fs.isFoundingMember || false,
          foundingMemberNumber: fs.foundingMemberNumber,
          earlyAdopterTier:     fs.earlyAdopterTier,
          effectiveMultiplier:  fs.effectiveMultiplier || 1,
          contestsEntered:      st.contestsEntered || 0,
          contestsWon:          st.contestsWon || 0,
        });
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const buildTweetText = () => {
    if (!data) return '';
    const rankLabel = TIER_RANK_LABEL[data.tier] || data.tier.toUpperCase();
    let t = `${rankLabel} on @ForesightCT\n\n`;
    t += `${data.totalScore.toLocaleString()} FS`;
    if (data.seasonRank) t += ` · Season #${data.seasonRank}`;
    if (data.effectiveMultiplier > 1) t += `\n${data.effectiveMultiplier.toFixed(2)}× multiplier`;
    t += `\n\nBack CT calls. Get paid.\n#CTForesight #CTDraft`;
    return t;
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!cachedBlob) { showToast('Still preparing card, try again in a moment', 'info'); return; }
    const tweetUrl = `https://x.com/intent/post?text=${encodeURIComponent(buildTweetText())}`;

    // Mobile: native share sheet with image file
    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
    if (isMobile && navigator.canShare) {
      const file = new File([cachedBlob], 'foresight-profile.png', { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], text: buildTweetText() }); return; }
        catch { /* cancelled */ }
      }
    }

    // Desktop: copy image to clipboard + open Twitter composer
    const pasteKey = /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘V' : 'Ctrl+V';
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': cachedBlob })]);
      showToast(`Image copied — paste it in your tweet (${pasteKey})`, 'success');
      setTimeout(() => window.open(tweetUrl, '_blank'), 600);
    } catch {
      // Clipboard failed — download instead
      downloadBlob(cachedBlob, `foresight-${data?.username || 'profile'}.png`);
      showToast('Image saved — attach it to your tweet', 'info');
      setTimeout(() => window.open(tweetUrl, '_blank'), 600);
    }
  };

  const handleSave = async () => {
    if (cachedBlob) {
      downloadBlob(cachedBlob, `foresight-${data?.username || 'profile'}.png`);
      showToast('Card saved!', 'success');
      return;
    }
    if (!data) return;
    setGenerating(true);
    const blob = await generateProfileCard(data).catch(() => null);
    setGenerating(false);
    if (blob) { downloadBlob(blob, `foresight-${data.username}.png`); showToast('Saved!', 'success'); }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://ct-foresight.xyz/profile/${address}`);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  if (!isConnected) return null;

  const tierCfg = data ? (TIER[data.tier as keyof typeof TIER] ?? TIER.bronze) : TIER.bronze;
  const tc = tierCfg.color;

  // ── DOM preview — dark card matching team card aesthetic ──────────────
  const memberText = data?.isFoundingMember && data.foundingMemberNumber
    ? `Founding Member #${data.foundingMemberNumber}`
    : TIER_RANK_LABEL[data?.tier || 'bronze'] || 'CT FORESIGHT';
  const rankStr = data?.seasonRank ? `#${data.seasonRank}` : '—';

  const preview = (
    <div className="relative w-[380px]" style={{
      aspectRatio: '530/776',
      backgroundImage: 'url(/card-frame-gold.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Atmosphere: radial tier glow */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 50% 35%, ${tc}14 0%, ${tc}08 40%, transparent 70%)`,
      }} />

      {/* Atmosphere: scan lines */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(255,255,255,0.012) 5px, rgba(255,255,255,0.012) 6px)',
      }} />

      {/* Content layer */}
      <div className="absolute inset-0 flex flex-col items-center justify-between"
        style={{ top: '13%', bottom: '15%', left: '13%', right: '13%' }}>

        {/* Logo + FORESIGHT header */}
        <div className="flex flex-col items-center">
          <img src="/logo.svg" alt="" style={{ width: 68, height: 40, objectFit: 'contain' }} />
          <div style={{ color: GOLD, fontSize: 16, fontWeight: 700, letterSpacing: '2px', marginTop: 2 }}>
            FORESIGHT
          </div>
          <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}90, ${GOLD}, ${GOLD}90, transparent)`, width: 130, margin: '4px 0 0' }} />
        </div>

        {/* Avatar with tier ring + glow */}
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 70, height: 70, borderRadius: '50%',
            background: `linear-gradient(135deg, ${tierCfg.gradient[0]}, ${tierCfg.gradient[1]})`,
            padding: 3, boxShadow: `0 0 20px ${tc}40, 0 0 40px ${tc}15`,
          }}>
            <div style={{
              width: '100%', height: '100%', borderRadius: '50%',
              background: '#1A1A24', display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {data?.avatarUrl ? (
                <img src={data.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: tc, fontSize: 30, fontWeight: 700 }}>
                  {(data?.username || 'A').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <div style={{
            position: 'absolute', bottom: -2, right: -2,
            width: 22, height: 22, borderRadius: '50%',
            background: tc, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: '#0A0A0F',
            border: '2px solid #0A0A0F', boxShadow: `0 0 8px ${tc}60`,
          }}>
            {tierCfg.label.charAt(0)}
          </div>
        </div>

        {/* Name + badge + rank */}
        <div className="flex flex-col items-center">
          <div style={{ color: '#FAFAFA', fontSize: 20, fontWeight: 700, lineHeight: 1 }}>
            {data?.username || '\u2014'}
          </div>
          <div style={{
            marginTop: 4, padding: '2px 10px', borderRadius: 4,
            background: `${tc}25`, border: `1px solid ${tc}50`,
            color: tc, fontSize: 9, fontWeight: 700, letterSpacing: '1px',
          }}>
            {memberText}
          </div>
          <div style={{ color: '#A1A1AA', fontSize: 8, fontWeight: 600, letterSpacing: '2px', marginTop: 10 }}>SEASON RANK</div>
          <div style={{
            color: GOLD, fontSize: 36, fontWeight: 700, lineHeight: 1, marginTop: 2,
            textShadow: `0 0 20px ${GOLD}60, 0 0 40px ${GOLD}25`,
          }}>{rankStr}</div>
        </div>

        {/* Stat Pyramid */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* FS Score — full width, prominent */}
          <div style={{
            position: 'relative',
            background: 'linear-gradient(180deg, #1E1E28, #151520)',
            border: `1px solid ${GOLD}30`,
            borderRadius: 8, padding: '8px 8px', textAlign: 'center',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 16, right: 16,
              height: 2, background: GOLD,
            }} />
            <div style={{ color: GOLD, fontSize: 7, fontWeight: 600, letterSpacing: '1.5px' }}>FORESIGHT SCORE</div>
            <div style={{ color: '#FAFAFA', fontSize: 22, fontWeight: 700, marginTop: 2 }}>
              {(data?.totalScore || 0).toLocaleString()}
            </div>
          </div>

          {/* Multiplier + All-Time side by side */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { label: 'MULTIPLIER', value: (data?.effectiveMultiplier ?? 1) > 1 ? `${data!.effectiveMultiplier.toFixed(2)}×` : '1.00×' },
              { label: 'ALL-TIME', value: data?.allTimeRank ? `#${data.allTimeRank}` : '—' },
            ].map((item, i) => (
              <div key={i} style={{
                flex: 1,
                background: 'linear-gradient(180deg, #1A1A24, #141420)',
                border: '1px solid #27272A',
                borderRadius: 8, padding: '6px 4px', textAlign: 'center',
              }}>
                <div style={{ color: GOLD, fontSize: 7, fontWeight: 600, letterSpacing: '1px' }}>{item.label}</div>
                <div style={{ color: '#FAFAFA', fontSize: 16, fontWeight: 700, marginTop: 2 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ width: '100%' }}>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, rgba(245,158,11,0.25), transparent)`, marginBottom: 4 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ color: '#71717A', fontSize: 9, fontWeight: 500 }}>Tapestry Protocol</span>
            <span style={{ color: '#71717A', fontSize: 9 }}>ct-foresight.xyz</span>
          </div>
        </div>
      </div>

    </div>
  );

  const content = (
    <div>
      {preview}
      <div className="mt-4 flex gap-2.5">
        <button
          onClick={handleShare}
          disabled={generating}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
          style={{ background: generating ? '#1F1F23' : '#FFFFFF', color: '#09090B' }}
        >
          {generating
            ? <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
            : <XLogo size={16} weight="fill" />}
          {generating ? 'Preparing…' : 'Share on X'}
        </button>
        <button
          onClick={handleSave}
          disabled={generating}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm bg-gray-800 hover:bg-gray-700 text-white transition-colors disabled:opacity-50"
        >
          <Share size={16} />
          Save Image
        </button>
      </div>
      <button
        onClick={handleCopyLink}
        className="w-full mt-2 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 text-gray-500 hover:text-gray-300 border border-gray-800 hover:border-gray-700 transition-colors"
      >
        {copied
          ? <><Check size={14} className="text-green-400" /><span className="text-green-400">Copied!</span></>
          : <><Copy size={14} />Copy profile link</>}
      </button>
      <p className="text-center text-[11px] text-gray-600 mt-2 leading-tight">
        Image is copied to clipboard — paste into your tweet ({/Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘V' : 'Ctrl+V'})
      </p>
    </div>
  );

  if (loading) return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!showModal) return content;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative">
        {onClose && (
          <button onClick={onClose}
            className="absolute -top-4 -right-4 z-10 w-8 h-8 rounded-full bg-gray-800/80 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <X size={16} weight="bold" />
          </button>
        )}
        {content}
      </div>
    </div>
  );
}

// ─── Share button ─────────────────────────────────────────────────────────

export function ShareProfileButton({ variant = 'primary', className = '' }: {
  variant?: 'primary' | 'secondary' | 'icon';
  className?: string;
}) {
  const [show, setShow] = useState(false);
  if (variant === 'icon') return (
    <>
      <button onClick={() => setShow(true)}
        className={`p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all ${className}`}>
        <Share size={20} />
      </button>
      {show && <ShareableProfileCard onClose={() => setShow(false)} />}
    </>
  );
  return (
    <>
      <button onClick={() => setShow(true)}
        className={`${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2 ${className}`}>
        <Share size={18} />Share Card
      </button>
      {show && <ShareableProfileCard onClose={() => setShow(false)} />}
    </>
  );
}
