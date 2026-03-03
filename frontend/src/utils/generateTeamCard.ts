/**
 * Canvas-based team card image generator — Premium Trading Card edition.
 *
 * Gold beveled frame, tier-colored avatar rings with glow,
 * full tier badges, archetype labels, decorative corners.
 *
 * Returns a PNG Blob ready for sharing or download.
 */

import {
  roundRect, drawAvatarRing, drawTierBadge,
  drawArchetypeLabel, loadImage,
  BG_MAIN, GOLD, TEXT_WHITE, TEXT_DIM,
} from './cardDrawing';


interface CardPick {
  name: string;
  handle: string;
  tier: string;
  isCaptain: boolean;
  imageUrl?: string;
  archetype?: string;
}

interface CardOptions {
  picks: CardPick[];
  contestName?: string;
  totalScore?: number;
  rank?: number;
  username?: string;
  userAvatar?: string;
}

const W = 530;
const H = 776;      // Matches frame image aspect ratio (0.683)
const S = 2; // Retina scale

/**
 * Draw a single player node on the canvas.
 */
function drawPlayer(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  pick: CardPick,
  img: HTMLImageElement | null,
) {
  const avatarR = 32 * S;

  // Avatar with tier ring + glow
  drawAvatarRing(ctx, cx, cy, avatarR, pick.tier, S, img, pick.name);

  // Captain badge (above avatar)
  if (pick.isCaptain) {
    const cpY = cy - avatarR - 14 * S;
    roundRect(ctx, cx - 24 * S, cpY - 8 * S, 48 * S, 16 * S, 8 * S);
    ctx.fillStyle = GOLD;
    ctx.fill();
    ctx.fillStyle = '#0A0A0F';
    ctx.font = `bold ${9 * S}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\u{1F451} CPT', cx, cpY);
  }

  // Name
  ctx.fillStyle = TEXT_WHITE;
  ctx.font = `600 ${12 * S}px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const displayName = pick.name.length > 12 ? pick.name.slice(0, 11) + '\u2026' : pick.name;
  ctx.fillText(displayName, cx, cy + avatarR + 10 * S);

  // Handle
  ctx.fillStyle = TEXT_DIM;
  ctx.font = `400 ${9 * S}px Inter, system-ui, sans-serif`;
  const displayHandle = pick.handle.length > 14 ? `@${pick.handle.slice(0, 12)}\u2026` : `@${pick.handle}`;
  ctx.fillText(displayHandle, cx, cy + avatarR + 26 * S);

  // Tier badge (below handle)
  drawTierBadge(ctx, cx, cy + avatarR + 40 * S, pick.tier, S, 'sm');

  // Archetype label (below tier badge)
  if (pick.archetype && pick.archetype !== 'All-Rounder') {
    drawArchetypeLabel(ctx, cx, cy + avatarR + 58 * S, pick.archetype, S, 8);
  }
}

/**
 * Generate the full team card as a PNG blob.
 */
export async function generateTeamCardImage(options: CardOptions): Promise<Blob> {
  const { picks, contestName, totalScore, rank, username, userAvatar } = options;
  const canvas = document.createElement('canvas');
  canvas.width = W * S;
  canvas.height = H * S;
  const ctx = canvas.getContext('2d')!;

  // ─── Load frame + logo ─────────────────────────────────────
  const [frameImg, logoImg] = await Promise.all([
    loadImage('/card-frame-gold.png', 5000),
    loadImage('/logo.svg', 3000),
  ]);

  // ─── Frame image as background (slight overscale to crop dark edges) ─
  if (frameImg) {
    const os = 1.02;
    const fw = W * S * os;
    const fh = H * S * os;
    ctx.drawImage(frameImg, (W * S - fw) / 2, (H * S - fh) / 2, fw, fh);
  } else {
    ctx.fillStyle = BG_MAIN;
    ctx.fillRect(0, 0, W * S, H * S);
  }

  // ─── Subtle pitch lines (behind formation) ────────────────
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1 * S;
  ctx.beginPath();
  ctx.arc(W * S / 2, H * S / 2, 80 * S, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(W * S / 2, H * S / 2, 3 * S, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(100 * S, H * S / 2);
  ctx.lineTo((W - 100) * S, H * S / 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
  ctx.stroke();

  // ─── Header: Logo + FORESIGHT ─────────────────────────────
  const cx = W * S / 2;
  if (logoImg) {
    const logoH = 32 * S;
    const logoW = logoH * (logoImg.naturalWidth / logoImg.naturalHeight || 1.714);
    ctx.drawImage(logoImg, cx - logoW / 2, 95 * S, logoW, logoH);
  }

  ctx.font = `bold ${16 * S}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = GOLD;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.letterSpacing = `${2 * S}px`;
  ctx.fillText('FORESIGHT', cx, 120 * S);
  ctx.letterSpacing = '0px';

  // Decorative underline
  const titleW = ctx.measureText('FORESIGHT').width;
  const lineY = 140 * S;
  const grad = ctx.createLinearGradient(cx - titleW / 2, lineY, cx + titleW / 2, lineY);
  grad.addColorStop(0, 'rgba(245,158,11,0)');
  grad.addColorStop(0.3, 'rgba(245,158,11,0.6)');
  grad.addColorStop(0.5, GOLD);
  grad.addColorStop(0.7, 'rgba(245,158,11,0.6)');
  grad.addColorStop(1, 'rgba(245,158,11,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(cx - titleW * 0.7, lineY, titleW * 1.4, 1.5 * S);

  // Contest subtitle
  if (contestName) {
    ctx.font = `500 ${9 * S}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = TEXT_DIM;
    ctx.letterSpacing = `${2 * S}px`;
    ctx.fillText(contestName.toUpperCase(), cx, lineY + 8 * S);
    ctx.letterSpacing = '0px';
  }

  // ─── Sort: captain first, then by tier ────────────────────
  const indexed = picks.map((p) => ({ pick: p }));
  indexed.sort((a, b) => {
    if (a.pick.isCaptain && !b.pick.isCaptain) return -1;
    if (!a.pick.isCaptain && b.pick.isCaptain) return 1;
    const order = ['S', 'A', 'B', 'C'];
    return order.indexOf(a.pick.tier) - order.indexOf(b.pick.tier);
  });

  // ─── Formation: 2-1-2 (scaled to canvas) ──────────────────
  const topY = 215 * S;
  const midY = 375 * S;
  const botY = 535 * S;
  const gap = 140 * S;

  // Top row (2 players)
  if (indexed[0]) drawPlayer(ctx, W * S / 2 - gap / 2, topY, indexed[0].pick, null);
  if (indexed[1]) drawPlayer(ctx, W * S / 2 + gap / 2, topY, indexed[1].pick, null);

  // Middle row (1 player)
  if (indexed[2]) drawPlayer(ctx, W * S / 2, midY, indexed[2].pick, null);

  // Bottom row (2 players)
  if (indexed[3]) drawPlayer(ctx, W * S / 2 - gap / 2, botY, indexed[3].pick, null);
  if (indexed[4]) drawPlayer(ctx, W * S / 2 + gap / 2, botY, indexed[4].pick, null);

  // ─── Score/Rank (if available) ────────────────────────────
  if (totalScore !== undefined || rank) {
    const scoreY = H * S - 135 * S;
    if (totalScore !== undefined && rank) {
      // Score (gold, left)
      ctx.fillStyle = GOLD;
      ctx.font = `bold ${16 * S}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`${totalScore} pts`, W * S / 2 - 50 * S, scoreY);

      // Rank (white, right)
      ctx.fillStyle = TEXT_WHITE;
      ctx.fillText(`#${rank}`, W * S / 2 + 50 * S, scoreY);
    } else if (totalScore !== undefined) {
      ctx.fillStyle = GOLD;
      ctx.font = `bold ${16 * S}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`${totalScore} pts`, W * S / 2, scoreY);
    }
  }

  // ─── Footer ───────────────────────────────────────────────
  const footerY = H * S - 115 * S;
  const inset = 80 * S;

  // Divider line
  const footGrad = ctx.createLinearGradient(inset, footerY, W * S - inset, footerY);
  footGrad.addColorStop(0, 'rgba(245,158,11,0)');
  footGrad.addColorStop(0.5, 'rgba(245,158,11,0.25)');
  footGrad.addColorStop(1, 'rgba(245,158,11,0)');
  ctx.fillStyle = footGrad;
  ctx.fillRect(inset, footerY, W * S - inset * 2, 1 * S);

  const footTextY = footerY + 14 * S;

  if (username) {
    // Try to load user avatar
    let userImg: HTMLImageElement | null = null;
    if (userAvatar) {
      userImg = await loadImage(userAvatar, 2000);
    }

    const avatarR = 10 * S;
    const avatarX = inset + avatarR;
    const avatarY = footTextY;

    if (userImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(userImg, avatarX - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2);
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
      ctx.fillStyle = GOLD + '33';
      ctx.fill();
      ctx.fillStyle = GOLD;
      ctx.font = `bold ${9 * S}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(username.charAt(0).toUpperCase(), avatarX, avatarY);
    }

    // Ring
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
    ctx.strokeStyle = GOLD + '55';
    ctx.lineWidth = 1 * S;
    ctx.stroke();

    ctx.font = `500 ${9 * S}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = TEXT_DIM;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`@${username}`, avatarX + avatarR + 8 * S, avatarY);
  } else {
    ctx.font = `500 ${9 * S}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = TEXT_DIM;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('ct-foresight.xyz', inset, footTextY);
  }

  // "Tapestry" right-aligned
  ctx.textAlign = 'right';
  ctx.fillStyle = TEXT_DIM;
  ctx.fillText('Tapestry Protocol', W * S - inset, footTextY);

  // ─── Convert to blob ──────────────────────────────────────
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
      'image/png',
    );
  });
}
