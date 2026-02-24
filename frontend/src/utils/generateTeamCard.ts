/**
 * Canvas-based team card image generator.
 * Draws a football-pitch formation card directly on a <canvas>,
 * bypassing all CORS/DOM-to-image issues.
 *
 * Returns a PNG Blob ready for sharing or download.
 */

interface CardPick {
  name: string;
  handle: string;
  tier: string;
  isCaptain: boolean;
  imageUrl?: string;
}

interface CardOptions {
  picks: CardPick[];
  contestName?: string;
  totalScore?: number;
  rank?: number;
}

const W = 600;
const H = 750;
const SCALE = 2; // Retina

const TIER_COLORS: Record<string, string> = {
  S: '#F59E0B',
  A: '#06B6D4',
  B: '#10B981',
  C: '#71717A',
};

const TIER_GRADIENTS: Record<string, [string, string]> = {
  S: ['#F59E0B', '#D97706'],
  A: ['#06B6D4', '#2563EB'],
  B: ['#10B981', '#0D9488'],
  C: ['#6B7280', '#4B5563'],
};

/**
 * Try to load an image, returns null on failure (CORS, 404, etc).
 */
function loadImage(url: string, timeout = 3000): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const timer = setTimeout(() => {
      img.src = '';
      resolve(null);
    }, timeout);
    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    img.src = url;
  });
}

/**
 * Draw a rounded rectangle path.
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
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

/**
 * Draw a player node on the canvas.
 */
function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  pick: CardPick,
  img: HTMLImageElement | null
) {
  const avatarR = 28;
  const tierColor = TIER_COLORS[pick.tier] || TIER_COLORS.C;
  const [gradA, gradB] = TIER_GRADIENTS[pick.tier] || TIER_GRADIENTS.C;

  // Gradient ring
  const ringGrad = ctx.createLinearGradient(x - avatarR - 3, y - avatarR - 3, x + avatarR + 3, y + avatarR + 3);
  ringGrad.addColorStop(0, gradA);
  ringGrad.addColorStop(1, gradB);
  ctx.beginPath();
  ctx.arc(x, y, avatarR + 3, 0, Math.PI * 2);
  ctx.fillStyle = ringGrad;
  ctx.fill();

  // Dark inner circle
  ctx.beginPath();
  ctx.arc(x, y, avatarR, 0, Math.PI * 2);
  ctx.fillStyle = '#0A0A0F';
  ctx.fill();

  // Avatar image or initial
  if (img) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, avatarR - 1, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, x - avatarR + 1, y - avatarR + 1, (avatarR - 1) * 2, (avatarR - 1) * 2);
    ctx.restore();
  } else {
    // Draw initial
    ctx.fillStyle = tierColor;
    ctx.font = 'bold 20px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pick.name.charAt(0).toUpperCase(), x, y + 1);
  }

  // Tier badge (bottom-right)
  const badgeX = x + avatarR - 4;
  const badgeY = y + avatarR - 8;
  roundRect(ctx, badgeX - 8, badgeY - 7, 16, 14, 3);
  ctx.fillStyle = tierColor;
  ctx.fill();
  ctx.fillStyle = pick.tier === 'S' ? '#0A0A0F' : '#FFFFFF';
  ctx.font = 'bold 9px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(pick.tier, badgeX, badgeY);

  // Captain badge (top-center)
  if (pick.isCaptain) {
    const cpX = x;
    const cpY = y - avatarR - 10;
    roundRect(ctx, cpX - 18, cpY - 7, 36, 14, 7);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
    ctx.fillStyle = '#0A0A0F';
    ctx.font = 'bold 8px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\u{1F451} CPT', cpX, cpY);
  }

  // Name
  ctx.fillStyle = '#FAFAFA';
  ctx.font = '600 11px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const displayName = pick.name.length > 12 ? pick.name.slice(0, 12) : pick.name;
  ctx.fillText(displayName, x, y + avatarR + 8);

  // Handle
  ctx.fillStyle = '#71717A';
  ctx.font = '400 9px Inter, system-ui, sans-serif';
  const displayHandle = pick.handle.length > 14 ? `@${pick.handle.slice(0, 12)}..` : `@${pick.handle}`;
  ctx.fillText(displayHandle, x, y + avatarR + 22);
}

/**
 * Generate the full team card as a PNG blob.
 */
export async function generateTeamCardImage(options: CardOptions): Promise<Blob> {
  const { picks, contestName, totalScore, rank } = options;
  const canvas = document.createElement('canvas');
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(SCALE, SCALE);

  // ─── Background ─────────────────────────────────────────────────────
  // Dark base
  roundRect(ctx, 0, 0, W, H, 20);
  ctx.fillStyle = '#0A0A0F';
  ctx.fill();

  // Pitch gradient overlay
  const pitchGrad = ctx.createLinearGradient(0, 0, 0, H);
  pitchGrad.addColorStop(0, 'rgba(6, 78, 59, 0.35)');
  pitchGrad.addColorStop(0.5, 'rgba(17, 24, 39, 0.6)');
  pitchGrad.addColorStop(1, 'rgba(10, 10, 15, 1)');
  roundRect(ctx, 0, 0, W, H, 20);
  ctx.fillStyle = pitchGrad;
  ctx.fill();

  // Radial emerald glow
  const radGlow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 280);
  radGlow.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
  radGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = radGlow;
  ctx.fillRect(0, 0, W, H);

  // ─── Pitch lines ────────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;

  // Center circle
  ctx.beginPath();
  ctx.arc(W / 2, H / 2, 80, 0, Math.PI * 2);
  ctx.stroke();

  // Center dot
  ctx.beginPath();
  ctx.arc(W / 2, H / 2, 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fill();

  // Horizontal half line
  ctx.beginPath();
  ctx.moveTo(30, H / 2);
  ctx.lineTo(W - 30, H / 2);
  ctx.stroke();

  // Top arc
  ctx.beginPath();
  ctx.arc(W / 2, 0, 90, 0, Math.PI);
  ctx.stroke();

  // Bottom arc
  ctx.beginPath();
  ctx.arc(W / 2, H, 90, Math.PI, Math.PI * 2);
  ctx.stroke();

  // ─── Corner brackets ───────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 2;
  const cm = 12; // corner margin
  const cl = 20; // corner length
  // Top-left
  ctx.beginPath(); ctx.moveTo(cm, cm + cl); ctx.lineTo(cm, cm); ctx.lineTo(cm + cl, cm); ctx.stroke();
  // Top-right
  ctx.beginPath(); ctx.moveTo(W - cm, cm + cl); ctx.lineTo(W - cm, cm); ctx.lineTo(W - cm - cl, cm); ctx.stroke();
  // Bottom-left
  ctx.beginPath(); ctx.moveTo(cm, H - cm - cl); ctx.lineTo(cm, H - cm); ctx.lineTo(cm + cl, H - cm); ctx.stroke();
  // Bottom-right
  ctx.beginPath(); ctx.moveTo(W - cm, H - cm - cl); ctx.lineTo(W - cm, H - cm); ctx.lineTo(W - cm - cl, H - cm); ctx.stroke();

  // ─── Gold top accent line ──────────────────────────────────────────
  const goldGrad = ctx.createLinearGradient(0, 0, W, 0);
  goldGrad.addColorStop(0, '#F59E0B');
  goldGrad.addColorStop(0.5, '#FBBF24');
  goldGrad.addColorStop(1, '#F59E0B');
  roundRect(ctx, 0, 0, W, 3, 0);
  ctx.fillStyle = goldGrad;
  ctx.fill();

  // ─── Header ────────────────────────────────────────────────────────
  // FORESIGHT title
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 22px Inter, system-ui, sans-serif';
  ctx.fillText('FORESIGHT', W / 2, 30);

  // Contest name
  if (contestName) {
    ctx.fillStyle = '#71717A';
    ctx.font = '500 10px Inter, system-ui, sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(contestName.toUpperCase(), W / 2, 56);
  }

  // Skip avatar loading entirely — proxy fetches are unreliable and slow.
  // The styled initials look clean and generate instantly.
  const images = picks.map(() => null);

  // ─── Sort: captain first, then by tier ─────────────────────────────
  const indexed = picks.map((p, i) => ({ pick: p, img: images[i] }));
  indexed.sort((a, b) => {
    if (a.pick.isCaptain && !b.pick.isCaptain) return -1;
    if (!a.pick.isCaptain && b.pick.isCaptain) return 1;
    const order = ['S', 'A', 'B', 'C'];
    return order.indexOf(a.pick.tier) - order.indexOf(b.pick.tier);
  });

  // ─── Formation: 2-1-2 ─────────────────────────────────────────────
  const topY = 150;
  const midY = 335;
  const botY = 520;
  const gap = 130;

  // Top row (2 players)
  if (indexed[0]) drawPlayer(ctx, W / 2 - gap / 2, topY, indexed[0].pick, indexed[0].img);
  if (indexed[1]) drawPlayer(ctx, W / 2 + gap / 2, topY, indexed[1].pick, indexed[1].img);

  // Middle row (1 player)
  if (indexed[2]) drawPlayer(ctx, W / 2, midY, indexed[2].pick, indexed[2].img);

  // Bottom row (2 players)
  if (indexed[3]) drawPlayer(ctx, W / 2 - gap / 2, botY, indexed[3].pick, indexed[3].img);
  if (indexed[4]) drawPlayer(ctx, W / 2 + gap / 2, botY, indexed[4].pick, indexed[4].img);

  // ─── Score/Rank (if available) ─────────────────────────────────────
  if (totalScore !== undefined || rank) {
    let scoreX = W / 2;
    if (totalScore !== undefined && rank) {
      scoreX = W / 2 - 40;
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 16px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`${totalScore} pts`, scoreX, H - 75);

      ctx.fillStyle = '#FAFAFA';
      ctx.fillText(`#${rank}`, W / 2 + 40, H - 75);
    } else if (totalScore !== undefined) {
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 16px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${totalScore} pts`, scoreX, H - 75);
    }
  }

  // ─── Footer ────────────────────────────────────────────────────────
  ctx.textBaseline = 'bottom';
  ctx.font = '500 10px Inter, system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#52525B';
  ctx.fillText('foresight.gg', 24, H - 20);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#06B6D4';
  ctx.fillText('\u25C6', W - 74, H - 20);
  ctx.fillStyle = '#52525B';
  ctx.fillText('Tapestry', W - 24, H - 20);

  // ─── Convert to blob ──────────────────────────────────────────────
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
      'image/png'
    );
  });
}
