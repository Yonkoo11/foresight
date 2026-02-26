# Profile Card Canvas Implementation Snippets

> Ready-to-use code fragments for implementing either the Badge or Certificate design

---

## CONCEPT 1: FEDERAL AGENT BADGE

### 1a. Shield Shape Polygon

```typescript
function drawShield(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const shieldWidth = w;
  const shieldHeight = h;
  const pointDepth = h * 0.15; // Top comes to a point

  ctx.beginPath();
  // Top point (center)
  ctx.moveTo(x + shieldWidth / 2, y);

  // Top-right to right
  ctx.lineTo(x + shieldWidth * 0.85, y + pointDepth);
  ctx.lineTo(x + shieldWidth, y + pointDepth * 1.5);

  // Right edge
  ctx.lineTo(x + shieldWidth, y + shieldHeight * 0.65);

  // Bottom-right curve
  ctx.quadraticCurveTo(
    x + shieldWidth * 0.9,
    y + shieldHeight,
    x + shieldWidth / 2,
    y + shieldHeight
  );

  // Bottom-left curve
  ctx.quadraticCurveTo(
    x + shieldWidth * 0.1,
    y + shieldHeight,
    x,
    y + shieldHeight * 0.65
  );

  // Left edge
  ctx.lineTo(x, y + pointDepth * 1.5);

  // Top-left to point
  ctx.lineTo(x + shieldWidth * 0.15, y + pointDepth);
  ctx.closePath();
}

// Usage in generateProfileCard:
const SHIELD_W = 420;
const SHIELD_H = 580;
const SHIELD_X = (W - SHIELD_W) / 2; // Center horizontally
const SHIELD_Y = 50;

drawShield(ctx, SHIELD_X, SHIELD_Y, SHIELD_W, SHIELD_H);

// Outer border (gold, embossed)
ctx.strokeStyle = '#F59E0B';
ctx.lineWidth = 12;
ctx.stroke();

// Inner border (lighter gold)
ctx.strokeStyle = '#F59E0BCC';
ctx.lineWidth = 2;
ctx.stroke();

// Beveled edge effect (darker gold inside)
ctx.strokeStyle = '#D97706';
ctx.lineWidth = 1;
ctx.globalAlpha = 0.3;
ctx.stroke();
ctx.globalAlpha = 1;
```

### 1b. Hologram Rainbow Effect

```typescript
function drawHologramEffect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, alpha: number = 0.12) {
  const holo = ctx.createLinearGradient(x, y, x, y + h);

  // Rainbow spectrum
  holo.addColorStop(0.0, `rgba(255, 0, 127, ${alpha})`);   // Magenta
  holo.addColorStop(0.2, `rgba(75, 0, 255, ${alpha})`);    // Blue
  holo.addColorStop(0.4, `rgba(0, 127, 255, ${alpha})`);   // Cyan
  holo.addColorStop(0.6, `rgba(0, 200, 100, ${alpha})`);   // Green
  holo.addColorStop(0.8, `rgba(255, 200, 0, ${alpha})`);   // Yellow
  holo.addColorStop(1.0, `rgba(255, 100, 0, ${alpha})`);   // Orange

  ctx.fillStyle = holo;
  ctx.fillRect(x, y, w, h);
}

// Usage: Hologram at bottom of badge
drawHologramEffect(ctx, SHIELD_X, SHIELD_Y + SHIELD_H - 100, SHIELD_W, 100);
```

### 1c. Photo ID Square Avatar with Stamp

```typescript
async function drawPhotoIDAvatar(
  ctx: CanvasRenderingContext2D,
  avatarImg: HTMLImageElement | null,
  x: number,
  y: number,
  size: number,
  tierColor: string,
  licenseNumber: string
) {
  const padding = 6; // White padding around photo
  const totalSize = size + padding * 2;

  // White backing (Polaroid instant film effect)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x - padding, y - padding, totalSize, totalSize);

  // Light drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  // Gold border
  ctx.strokeStyle = tierColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(x - padding, y - padding, totalSize, totalSize);

  ctx.shadowColor = 'transparent';

  // Draw avatar image (clipped square)
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, size, size);
  ctx.clip();

  if (avatarImg) {
    ctx.drawImage(avatarImg, x, y, size, size);
  } else {
    // Fallback: gradient + initial
    const grad = ctx.createRadialGradient(x + size/2, y, 0, x + size/2, y + size/2, size);
    grad.addColorStop(0, tierColor + '44');
    grad.addColorStop(1, tierColor + '11');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, size, size);

    ctx.fillStyle = tierColor;
    ctx.font = 'bold 48px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H', x + size/2, y + size/2);
  }

  ctx.restore();

  // Instant film fade (white to transparent at bottom)
  const fadeGrad = ctx.createLinearGradient(x, y + size * 0.7, x, y + size);
  fadeGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  fadeGrad.addColorStop(1, 'rgba(255, 255, 255, 0.4)');
  ctx.fillStyle = fadeGrad;
  ctx.fillRect(x, y + size * 0.7, size, size * 0.3);

  // License number stamp below photo
  ctx.fillStyle = '#1A1A1A';
  ctx.font = 'bold 9px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '1px';
  ctx.fillText(`LIC #${licenseNumber}`, x + size/2, y + size + 16);
}
```

### 1d. Data Fields (Grid Layout)

```typescript
interface DataField {
  label: string;
  value: string;
  highlighted?: boolean; // Gold text if true
}

function drawDataFields(
  ctx: CanvasRenderingContext2D,
  fields: DataField[],
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number = 20
) {
  ctx.font = '11px JetBrains Mono, monospace';
  ctx.textBaseline = 'alphabetic';
  let currentY = y;

  fields.forEach((field) => {
    // Draw label
    ctx.fillStyle = '#A1A1AA'; // Muted gray
    ctx.textAlign = 'left';
    const labelWidth = ctx.measureText(field.label).width;
    ctx.fillText(field.label, x, currentY);

    // Draw value
    ctx.fillStyle = field.highlighted ? '#F59E0B' : '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.fillText(field.value, x + labelWidth + 12, currentY);

    currentY += lineHeight;
  });
}

// Usage:
const badgeFields: DataField[] = [
  { label: 'NAME:', value: data.username },
  { label: 'TIER:', value: data.tier.toUpperCase() + ' AGENT' },
  { label: 'RANK:', value: `#${data.seasonRank}` },
  { label: 'SCORE:', value: data.totalScore.toLocaleString(), highlighted: true },
  { label: 'MULTIPLIER:', value: `${data.effectiveMultiplier.toFixed(2)}×`, highlighted: true },
  { label: 'STATUS:', value: 'VERIFIED' },
  { label: 'ISSUED:', value: new Date().toLocaleDateString() },
  { label: 'EXPIRES:', value: new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString() },
];

drawDataFields(ctx, badgeFields, SHIELD_X + 40, SHIELD_Y + 280, SHIELD_W - 80);
```

### 1e. Security Watermark (Diagonal Text)

```typescript
function drawSecurityWatermark(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();
  ctx.globalAlpha = 0.06;

  ctx.font = 'bold 32px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FFFFFF';

  // Diagonal text repeated
  ctx.rotate(-Math.PI / 6); // -30 degrees

  let offsetX = x - w;
  while (offsetX < x + w * 2) {
    let offsetY = y - h;
    while (offsetY < y + h * 2) {
      ctx.fillText(text, offsetX, offsetY);
      offsetY += 120;
    }
    offsetX += 140;
  }

  ctx.restore();
}

// Usage:
drawSecurityWatermark(ctx, 'SOLANA', 0, 0, W, H);
```

---

## CONCEPT 2: VINTAGE CERTIFICATE

### 2a. Ornate Gold Border Frame

```typescript
function drawOrnateFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  borderWidth: number = 8,
  cornerSize: number = 24
) {
  // Outer gold border
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = borderWidth;
  ctx.lineJoin = 'round';
  ctx.strokeRect(x + borderWidth/2, y + borderWidth/2, w - borderWidth, h - borderWidth);

  // Inner accent line
  ctx.strokeStyle = '#FBBF2444';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + borderWidth + 4, y + borderWidth + 4, w - borderWidth*2 - 8, h - borderWidth*2 - 8);

  // Corner flourishes (small gold decorations)
  drawCornerFlourish(ctx, x + borderWidth, y + borderWidth, cornerSize, '#F59E0B');
  drawCornerFlourish(ctx, x + w - borderWidth, y + borderWidth, cornerSize, '#F59E0B', 'topright');
  drawCornerFlourish(ctx, x + borderWidth, y + h - borderWidth, cornerSize, '#F59E0B', 'bottomleft');
  drawCornerFlourish(ctx, x + w - borderWidth, y + h - borderWidth, cornerSize, '#F59E0B', 'bottomright');
}

function drawCornerFlourish(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
  position: 'topleft' | 'topright' | 'bottomleft' | 'bottomright' = 'topleft'
) {
  ctx.save();
  ctx.fillStyle = color;

  // Simple flourish: small spiral or leaf shape
  const s = size / 2;

  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2); // Center dot
  ctx.fill();

  // Decorative lines radiating from corner
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;

  const angle = position.includes('top') ? 0 : Math.PI;
  const angleStart = position.includes('left') ? angle : angle + Math.PI/2;

  for (let i = 0; i < 3; i++) {
    const a = angleStart + (i - 1) * Math.PI / 6;
    const x1 = cx + Math.cos(a) * 3;
    const y1 = cy + Math.sin(a) * 3;
    const x2 = cx + Math.cos(a) * (s + 2);
    const y2 = cy + Math.sin(a) * (s + 2);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  ctx.restore();
}
```

### 2b. Paper Texture Overlay

```typescript
function drawPaperTexture(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  intensity: number = 0.02
) {
  // Create subtle diagonal noise pattern
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  // Seeded random for consistency
  let seed = 12345;
  function random() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  for (let i = 0; i < data.length; i += 4) {
    const noise = random() * 255 * intensity;
    const val = Math.floor(noise);
    data[i] = val;     // R
    data[i + 1] = val; // G
    data[i + 2] = val; // B
    data[i + 3] = 15;  // Very subtle alpha
  }

  ctx.putImageData(imageData, x, y);

  // Diagonal lines pattern (very subtle)
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.01)';
  ctx.lineWidth = 1;

  for (let i = -h; i < w; i += 8) {
    ctx.beginPath();
    ctx.moveTo(x + i, y);
    ctx.lineTo(x + i + h, y + h);
    ctx.stroke();
  }
}
```

### 2c. Circular Avatar with Wax Seal

```typescript
async function drawCertificateAvatar(
  ctx: CanvasRenderingContext2D,
  avatarImg: HTMLImageElement | null,
  x: number,
  y: number,
  radius: number,
  tierColor: string
) {
  // Outer gold ring (large, decorative)
  ctx.strokeStyle = tierColor;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(x, y, radius + 12, 0, Math.PI * 2);
  ctx.stroke();

  // Inner accent ring
  ctx.strokeStyle = tierColor + '77';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, radius + 17, 0, Math.PI * 2);
  ctx.stroke();

  // Shadow effect (embossed)
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 3;

  // Avatar circle (clipped)
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.clip();

  if (avatarImg) {
    ctx.drawImage(avatarImg, x - radius, y - radius, radius * 2, radius * 2);
  } else {
    const grad = ctx.createRadialGradient(x, y - radius/2, 0, x, y, radius);
    grad.addColorStop(0, tierColor + '44');
    grad.addColorStop(1, tierColor + '11');
    ctx.fillStyle = grad;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);

    ctx.fillStyle = tierColor;
    ctx.font = 'bold 56px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H', x, y + 4);
  }

  ctx.restore();
  ctx.shadowColor = 'transparent';

  // Inner emboss highlight (subtle)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.arc(x - 8, y - 8, radius - 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

// Wax seal (bottom-right corner)
function drawWaxSeal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  tierColor: string,
  iconChar: string = '⭐'
) {
  // Outer decorative ring (like old wax seal edges)
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, radius + 6, 0, Math.PI * 2);
  ctx.stroke();

  // Dashed edge (like crimped wax)
  ctx.strokeStyle = '#F59E0B88';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ctx.arc(x, y, radius + 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Inner seal (tier color)
  ctx.fillStyle = tierColor;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Emboss effect
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x - 6, y - 6, radius - 2, 0, Math.PI * 2);
  ctx.stroke();

  // Center icon
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(iconChar, x, y);
}
```

### 2d. Certificate Text Layout

```typescript
function drawCertificateContent(
  ctx: CanvasRenderingContext2D,
  data: ProfileCardData,
  startY: number,
  pageWidth: number
) {
  ctx.fillStyle = '#1A1A1A';
  ctx.textAlign = 'center';
  let y = startY;
  const lineSpacing = 24;
  const sectionGap = 28;

  // "THIS IS TO CERTIFY THAT"
  ctx.font = 'italic 12px Georgia, serif';
  ctx.fillText('THIS IS TO CERTIFY THAT', pageWidth / 2, y);
  y += sectionGap;

  // Name (large, bold serif)
  ctx.font = 'bold 38px Georgia, serif';
  ctx.fillText(data.username.toUpperCase(), pageWidth / 2, y);
  y += sectionGap;

  // Decorative line under name
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pageWidth / 4, y - 12);
  ctx.lineTo((pageWidth * 3) / 4, y - 12);
  ctx.stroke();

  y += lineSpacing;

  // "HAS ACHIEVED THE RANK OF"
  ctx.font = 'normal 12px Georgia, serif';
  ctx.fillText('HAS ACHIEVED THE RANK OF', pageWidth / 2, y);
  y += sectionGap;

  // Tier achievement (prominent)
  ctx.font = 'bold 18px Georgia, serif';
  ctx.fillText(`${data.tier.toUpperCase()} TIER ANALYST`, pageWidth / 2, y);
  y += sectionGap;

  // Stats (3 lines)
  ctx.font = 'normal 12px Georgia, serif';
  ctx.fillText(`Foresight Score: ${data.totalScore.toLocaleString()} FS`, pageWidth / 2, y);
  y += lineSpacing;
  ctx.fillText(`Season Ranking: #${data.seasonRank}`, pageWidth / 2, y);
  y += lineSpacing;
  ctx.fillText(`Multiplier Achievement: ${data.effectiveMultiplier.toFixed(2)}×`, pageWidth / 2, y);
  y += sectionGap;

  // "IN THE LEAGUE OF"
  ctx.font = 'italic 12px Georgia, serif';
  ctx.fillText('IN THE LEAGUE OF', pageWidth / 2, y);
  y += sectionGap;

  // League name
  ctx.font = 'bold 14px Georgia, serif';
  ctx.fillText('CRYPTO TWITTER TALENT', pageWidth / 2, y);
  y += sectionGap + 8;

  // Signature lines
  ctx.font = 'normal 10px Georgia, serif';
  const sig1X = pageWidth / 4;
  const sig2X = (pageWidth * 3) / 4;

  ctx.beginPath();
  ctx.moveTo(sig1X - 40, y);
  ctx.lineTo(sig1X + 40, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(sig2X - 40, y);
  ctx.lineTo(sig2X + 40, y);
  ctx.stroke();

  ctx.fillText('VERIFIED', sig1X, y + 14);
  ctx.fillText('DATE', sig2X, y + 14);

  y += 44;

  // License details
  ctx.font = 'normal 9px JetBrains Mono, monospace';
  ctx.fillStyle = '#52525B';
  ctx.fillText(`LICENSE #FST-${String(data.foundingMemberNumber || Math.floor(Math.random() * 999999)).padStart(6, '0')}`, pageWidth / 2, y);
  y += 16;

  ctx.fillText(`ISSUED: ${new Date().toLocaleDateString()}  |  EXPIRES: ${new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString()}`, pageWidth / 2, y);
}
```

---

## Integration Checklist

- [ ] Choose concept (Badge or Certificate)
- [ ] Swap background: `ctx.fillStyle` from `#0A0A0F` (badge) or `#F5F1E8` (cert)
- [ ] Draw container shape (shield or rounded rect with frame)
- [ ] Add avatar (square ID or circular + seal)
- [ ] Render stats (data fields or certificate text)
- [ ] Add security marks (watermark, hologram, or seal)
- [ ] Test with real avatars (does size/crop look right?)
- [ ] Mobile preview (520×680 on actual phone)
- [ ] Twitter share test (color preservation, compression artifacts)
- [ ] A/B test both if feasible

---

## Performance Notes

- **Canvas size:** 520×680 @ 2x retina = 1040×1360px
- **Average render time:** 200-400ms with avatar load
- **File size:** PNG ~150-200KB
- **Optimization:** Pre-cache fonts, use single ctx.fill() where possible

