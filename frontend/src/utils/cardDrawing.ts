/**
 * Shared Canvas Drawing Utilities for Premium Trading Cards
 *
 * Used by: generateTeamCard.ts, ShareableProfileCard.tsx
 * Design: Gold beveled frame, tier-colored glows, decorative corners
 */

import { getRarityInfo, getArchetypeColor } from './rarities';

// ─── Colors ───────────────────────────────────────────────
const GOLD        = '#F59E0B';
const GOLD_LIGHT  = '#FBBF24';
const GOLD_DARK   = '#D97706';
const BG_MAIN     = '#0A0A0F';
const BG_SURFACE  = '#12121A';
const BG_ELEVATED = '#1A1A24';
const BORDER_DIM  = '#27272A';
const TEXT_WHITE   = '#FAFAFA';
const TEXT_MUTED   = '#A1A1AA';
const TEXT_DIM     = '#71717A';

export { GOLD, GOLD_LIGHT, GOLD_DARK, BG_MAIN, BG_SURFACE, BG_ELEVATED, BORDER_DIM, TEXT_WHITE, TEXT_MUTED, TEXT_DIM };

// ─── Rounded Rectangle ───────────────────────────────────
export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ─── Premium Card Frame ──────────────────────────────────
/**
 * Draws the premium card frame: surface, outer gold border, inner bevel, corner ornaments.
 * tierHex = optional tier color for the outer glow (defaults to gold).
 */
export function drawPremiumFrame(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  r: number, scale: number,
  tierHex?: string,
) {
  const s = scale;
  const glowColor = tierHex || GOLD;

  // 1) Outer glow (soft shadow behind card)
  ctx.save();
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 24 * s;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = BG_SURFACE;
  ctx.fill();
  ctx.restore();

  // 2) Card surface fill
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = BG_SURFACE;
  ctx.fill();

  // 3) Outer gold gradient border (3px)
  const borderGrad = ctx.createLinearGradient(x, y, x + w, y + h);
  borderGrad.addColorStop(0, GOLD_LIGHT);
  borderGrad.addColorStop(0.5, GOLD);
  borderGrad.addColorStop(1, GOLD_DARK);
  roundRect(ctx, x, y, w, h, r);
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 3 * s;
  ctx.stroke();

  // 4) Inner bevel line (1px inset, subtle white)
  const inset = 6 * s;
  roundRect(ctx, x + inset, y + inset, w - inset * 2, h - inset * 2, r - 4);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1 * s;
  ctx.stroke();

  // 5) Top accent line (gold gradient)
  const topGrad = ctx.createLinearGradient(x + r, y, x + w - r, y);
  topGrad.addColorStop(0, 'rgba(245,158,11,0.1)');
  topGrad.addColorStop(0.3, GOLD);
  topGrad.addColorStop(0.7, GOLD_LIGHT);
  topGrad.addColorStop(1, 'rgba(245,158,11,0.1)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(x + r, y + 1 * s, w - r * 2, 3 * s);

  // 6) Bottom accent line (subtle gold)
  const botGrad = ctx.createLinearGradient(x + r, y + h, x + w - r, y + h);
  botGrad.addColorStop(0, 'rgba(245,158,11,0)');
  botGrad.addColorStop(0.5, 'rgba(245,158,11,0.3)');
  botGrad.addColorStop(1, 'rgba(245,158,11,0)');
  ctx.fillStyle = botGrad;
  ctx.fillRect(x + r, y + h - 2 * s, w - r * 2, 1 * s);

  // 7) Corner ornaments (decorative double-line L-brackets)
  drawCornerOrnaments(ctx, x, y, w, h, s);
}

// ─── Corner Ornaments ────────────────────────────────────
function drawCornerOrnaments(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  s: number,
) {
  const m = 14 * s;   // margin from edge
  const len = 24 * s; // arm length
  const gap = 4 * s;  // gap between double lines

  ctx.save();

  // Outer lines (gold, brighter)
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1.5 * s;
  ctx.globalAlpha = 0.7;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(x + m, y + m + len); ctx.lineTo(x + m, y + m); ctx.lineTo(x + m + len, y + m);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(x + w - m - len, y + m); ctx.lineTo(x + w - m, y + m); ctx.lineTo(x + w - m, y + m + len);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(x + m, y + h - m - len); ctx.lineTo(x + m, y + h - m); ctx.lineTo(x + m + len, y + h - m);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(x + w - m - len, y + h - m); ctx.lineTo(x + w - m, y + h - m); ctx.lineTo(x + w - m, y + h - m - len);
  ctx.stroke();

  // Inner lines (dimmer, offset inward)
  ctx.strokeStyle = GOLD_DARK;
  ctx.lineWidth = 1 * s;
  ctx.globalAlpha = 0.35;

  // Top-left inner
  ctx.beginPath();
  ctx.moveTo(x + m + gap, y + m + gap + len); ctx.lineTo(x + m + gap, y + m + gap); ctx.lineTo(x + m + gap + len, y + m + gap);
  ctx.stroke();
  // Top-right inner
  ctx.beginPath();
  ctx.moveTo(x + w - m - gap - len, y + m + gap); ctx.lineTo(x + w - m - gap, y + m + gap); ctx.lineTo(x + w - m - gap, y + m + gap + len);
  ctx.stroke();
  // Bottom-left inner
  ctx.beginPath();
  ctx.moveTo(x + m + gap, y + h - m - gap - len); ctx.lineTo(x + m + gap, y + h - m - gap); ctx.lineTo(x + m + gap + len, y + h - m - gap);
  ctx.stroke();
  // Bottom-right inner
  ctx.beginPath();
  ctx.moveTo(x + w - m - gap - len, y + h - m - gap); ctx.lineTo(x + w - m - gap, y + h - m - gap); ctx.lineTo(x + w - m - gap, y + h - m - gap - len);
  ctx.stroke();

  ctx.restore();
}

// ─── Avatar with Tier Ring + Glow ────────────────────────
export function drawAvatarRing(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, radius: number,
  tier: string, scale: number,
  image?: HTMLImageElement | null,
  initial?: string,
  colorOverride?: { hex: string; gradient: [string, string] },
) {
  const s = scale;
  const info = colorOverride
    ? { hexColor: colorOverride.hex, gradientPair: colorOverride.gradient }
    : getRarityInfo(tier);
  const [c1, c2] = info.gradientPair;
  const ringWidth = 4 * s;
  const outerR = radius + ringWidth;

  // 1) Glow behind avatar
  ctx.save();
  ctx.shadowColor = info.hexColor;
  ctx.shadowBlur = 16 * s;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = BG_ELEVATED;
  ctx.fill();
  ctx.restore();

  // 2) Tier gradient ring
  const ringGrad = ctx.createLinearGradient(cx - outerR, cy - outerR, cx + outerR, cy + outerR);
  ringGrad.addColorStop(0, c1);
  ringGrad.addColorStop(1, c2);
  ctx.beginPath();
  ctx.arc(cx, cy, outerR - ringWidth / 2, 0, Math.PI * 2);
  ctx.strokeStyle = ringGrad;
  ctx.lineWidth = ringWidth;
  ctx.stroke();

  // 3) Dark fill inside ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 1 * s, 0, Math.PI * 2);
  ctx.fillStyle = BG_ELEVATED;
  ctx.fill();

  // 4) Avatar image or initial
  if (image) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 2 * s, 0, Math.PI * 2);
    ctx.clip();
    const d = (radius - 2 * s) * 2;
    ctx.drawImage(image, cx - d / 2, cy - d / 2, d, d);
    ctx.restore();
  } else if (initial) {
    ctx.fillStyle = info.hexColor;
    ctx.font = `bold ${radius * 0.8}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initial.charAt(0).toUpperCase(), cx, cy + 2 * s);
  }
}

// ─── Tier Badge (Full Label) ─────────────────────────────
export function drawTierBadge(
  ctx: CanvasRenderingContext2D,
  cx: number, y: number,
  tier: string, scale: number,
  size: 'sm' | 'md' | 'lg' = 'md',
) {
  const s = scale;
  const info = getRarityInfo(tier);
  const label = `${tier} · ${info.fullLabel}`;

  const fontSize = size === 'sm' ? 8 : size === 'md' ? 9 : 11;
  ctx.font = `bold ${fontSize * s}px Inter, sans-serif`;
  const textW = ctx.measureText(label).width;
  const padX = 8 * s;
  const padY = 4 * s;
  const badgeW = textW + padX * 2;
  const badgeH = fontSize * s + padY * 2;
  const bx = cx - badgeW / 2;

  // Badge background
  roundRect(ctx, bx, y, badgeW, badgeH, 4 * s);
  ctx.fillStyle = info.hexColor + '30'; // 30 = ~19% opacity
  ctx.fill();
  roundRect(ctx, bx, y, badgeW, badgeH, 4 * s);
  ctx.strokeStyle = info.hexColor + '60'; // 60 = ~38% opacity
  ctx.lineWidth = 1 * s;
  ctx.stroke();

  // Badge text
  ctx.fillStyle = info.hexColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, cx, y + badgeH / 2);
}

// ─── Archetype Label ─────────────────────────────────────
export function drawArchetypeLabel(
  ctx: CanvasRenderingContext2D,
  cx: number, y: number,
  archetype: string | undefined,
  scale: number,
  fontSize = 9,
) {
  if (!archetype || archetype === 'All-Rounder') return;

  const s = scale;
  const color = getArchetypeColor(archetype);

  ctx.font = `italic 500 ${fontSize * s}px Inter, sans-serif`;
  ctx.fillStyle = color.hex;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(archetype, cx, y);
}

// ─── Foresight Header ────────────────────────────────────
export function drawForesightHeader(
  ctx: CanvasRenderingContext2D,
  cx: number, y: number,
  scale: number,
  subtitle?: string,
) {
  const s = scale;

  // "FORESIGHT" title
  ctx.font = `bold ${22 * s}px Inter, sans-serif`;
  ctx.fillStyle = GOLD;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.letterSpacing = `${1 * s}px`;
  ctx.fillText('FORESIGHT', cx, y);
  ctx.letterSpacing = '0px';

  // Decorative underline
  const titleW = ctx.measureText('FORESIGHT').width;
  const lineY = y + 28 * s;
  const grad = ctx.createLinearGradient(cx - titleW / 2, lineY, cx + titleW / 2, lineY);
  grad.addColorStop(0, 'rgba(245,158,11,0)');
  grad.addColorStop(0.2, 'rgba(245,158,11,0.6)');
  grad.addColorStop(0.5, GOLD);
  grad.addColorStop(0.8, 'rgba(245,158,11,0.6)');
  grad.addColorStop(1, 'rgba(245,158,11,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(cx - titleW * 0.7, lineY, titleW * 1.4, 1.5 * s);

  // Subtitle (contest name etc.)
  if (subtitle) {
    ctx.font = `500 ${10 * s}px Inter, sans-serif`;
    ctx.fillStyle = TEXT_MUTED;
    ctx.letterSpacing = `${2 * s}px`;
    ctx.fillText(subtitle.toUpperCase(), cx, lineY + 8 * s);
    ctx.letterSpacing = '0px';
  }
}

// ─── Footer Branding ─────────────────────────────────────
export function drawFooter(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number,
  scale: number,
  leftText: string,
  rightText = 'Tapestry',
) {
  const s = scale;

  // Divider line
  const grad = ctx.createLinearGradient(x + 20 * s, y, x + w - 20 * s, y);
  grad.addColorStop(0, 'rgba(245,158,11,0)');
  grad.addColorStop(0.5, 'rgba(245,158,11,0.3)');
  grad.addColorStop(1, 'rgba(245,158,11,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(x + 20 * s, y, w - 40 * s, 1 * s);

  // Left text
  ctx.font = `500 ${10 * s}px Inter, sans-serif`;
  ctx.fillStyle = TEXT_DIM;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(leftText, x + 24 * s, y + 10 * s);

  // Right text
  ctx.textAlign = 'right';
  ctx.fillText(rightText, x + w - 24 * s, y + 10 * s);
}

// ─── Image Loader ────────────────────────────────────────
export function loadImage(url: string, timeoutMs = 3000): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    // Only set crossOrigin for external URLs — local assets don't need it
    // and setting it can cause issues with some dev servers
    if (!url.startsWith('/')) {
      img.crossOrigin = 'anonymous';
    }
    const timer = setTimeout(() => resolve(null), timeoutMs);
    img.onload = () => { clearTimeout(timer); resolve(img); };
    img.onerror = () => { clearTimeout(timer); resolve(null); };
    img.src = url;
  });
}
