# Premium SaaS CSS Utilities & Copy-Paste Patterns

> **For:** Frontend engineers who want production-ready CSS
> **Status:** Ready to copy into your project

---

## 1. Color Variables (Add to CSS Root)

```css
/* Place in frontend/src/index.css or your global styles */

:root {
  /* Background Colors (60%) */
  --color-bg-primary: #09090B;      /* Main background */
  --color-bg-secondary: #111111;    /* Elevated surfaces */
  --color-bg-tertiary: #1A1A1F;     /* Hover states, slight lift */
  --color-bg-hover: #27272A;        /* Subtle hover overlay */

  /* Text Colors (30%) */
  --color-text-primary: #FAFAFA;    /* Primary text */
  --color-text-secondary: #A1A1AA;  /* Secondary text */
  --color-text-muted: #71717A;      /* Muted/hint text */
  --color-text-disabled: #52525B;   /* Disabled text */

  /* Border Colors (30%) */
  --color-border-primary: #27272A;  /* Primary borders */
  --color-border-secondary: #3F3F46; /* Subtle borders */

  /* Accent Colors (10% - USE SPARINGLY) */
  --color-accent-primary: #F59E0B;  /* Gold - CTAs ONLY */
  --color-accent-primary-hover: #FBBF24; /* Gold hover */
  --color-accent-primary-muted: #D97706; /* Gold disabled */

  /* Semantic Colors (status only) */
  --color-success: #10B981;         /* Success/Active */
  --color-error: #EF4444;           /* Error/Critical */
  --color-warning: #F59E0B;         /* Warning/Caution */
  --color-info: #3B82F6;            /* Info (rarely used) */

  /* Shadows */
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 12px 0 rgba(0, 0, 0, 0.6);
  --shadow-lg: 0 20px 40px 0 rgba(0, 0, 0, 0.8);
  --shadow-xl: 0 40px 80px 0 rgba(0, 0, 0, 0.9);

  /* Easing Functions */
  --ease-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 0.6, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Spacing Scale (4px-based) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

---

## 2. Button Utilities

```css
/* Buttons - Core styles */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  transition: all 150ms var(--ease-out);
  white-space: nowrap;
  user-select: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Primary Button - Gold CTA */
.btn-primary {
  background-color: var(--color-accent-primary);
  color: #000;
  font-weight: 700;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-accent-primary-hover);
}

.btn-primary:active:not(:disabled) {
  background-color: var(--color-accent-primary-muted);
  transform: translateY(0);
}

/* Secondary Button - Gray with border */
.btn-secondary {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-bg-tertiary);
  border-color: var(--color-border-secondary);
}

.btn-secondary:active:not(:disabled) {
  background-color: var(--color-bg-hover);
}

/* Ghost Button - Appears on hover */
.btn-ghost {
  background-color: transparent;
  color: var(--color-text-primary);
  border: none;
}

.btn-ghost:hover:not(:disabled) {
  background-color: var(--color-bg-secondary);
}

.btn-ghost:active:not(:disabled) {
  background-color: var(--color-bg-tertiary);
}

/* Destructive Button - Red, hidden until needed */
.btn-destructive {
  background-color: var(--color-error);
  color: white;
  font-weight: 700;
}

.btn-destructive:hover:not(:disabled) {
  background-color: #DC2626;
}

.btn-destructive:active:not(:disabled) {
  background-color: #B91C1C;
}

/* Button Sizes */
.btn-sm {
  padding: var(--space-1) var(--space-3);
  font-size: 0.875rem;
}

.btn-lg {
  padding: var(--space-3) var(--space-6);
  font-size: 1.125rem;
}

/* Icon Button */
.btn-icon {
  width: 2rem;
  height: 2rem;
  padding: 0;
  border-radius: 0.375rem;
  background-color: transparent;
  color: var(--color-text-secondary);
}

.btn-icon:hover:not(:disabled) {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

/* Button Group (multiple buttons together) */
.btn-group {
  display: flex;
  gap: var(--space-2);
}

.btn-group > .btn {
  flex: 1;
}
```

---

## 3. Card & Surface Utilities

```css
/* Card Base Classes */

.card {
  background-color: var(--color-bg-primary);
  border-radius: 0.5rem;
  padding: var(--space-6);
  border: 1px solid var(--color-border-primary);
  box-shadow: var(--shadow-sm);
  transition: all 200ms var(--ease-out);
}

/* Elevated Card (modals, popovers) */
.card-elevated {
  background-color: var(--color-bg-secondary);
  border-color: var(--color-border-secondary);
  box-shadow: var(--shadow-lg);
}

/* Interactive Card (hoverable) */
.card-interactive {
  cursor: pointer;
}

.card-interactive:hover {
  border-color: var(--color-border-secondary);
  box-shadow: var(--shadow-md);
  background-color: var(--color-bg-tertiary);
}

/* Highlight Card (featured) */
.card-highlight {
  background-color: var(--color-bg-secondary);
  border-color: rgba(245, 158, 11, 0.2);
  box-shadow: var(--shadow-md);
}

/* Ghost Card (minimal) */
.card-ghost {
  background-color: transparent;
  border: 1px solid var(--color-border-primary);
  box-shadow: none;
  padding: var(--space-4);
}

.card-ghost:hover {
  background-color: rgba(17, 17, 17, 0.5);
}

/* Card Variants (padding) */
.card-compact {
  padding: var(--space-4);
}

.card-spacious {
  padding: var(--space-8);
}
```

---

## 4. Typography Classes

```css
/* Display - Page titles */
.display {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

/* Heading 1 */
.h1 {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-text-primary);
}

/* Heading 2 */
.h2 {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text-primary);
}

/* Heading 3 */
.h3 {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.5;
  color: var(--color-text-primary);
}

/* Heading 4 */
.h4 {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  color: var(--color-text-primary);
}

/* Body text */
.body {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-text-primary);
}

/* Small body */
.body-sm {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

/* Caption/label */
.caption {
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

/* Monospace (data, code) */
.mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
  color: var(--color-text-secondary);
  letter-spacing: 0.05em;
}

/* Monospace with tabular numbers (for tables) */
.mono-tabular {
  font-variant-numeric: tabular-nums;
}
```

---

## 5. Shadow Classes

```css
.shadow-sm {
  box-shadow: var(--shadow-sm);
}

.shadow-md {
  box-shadow: var(--shadow-md);
}

.shadow-lg {
  box-shadow: var(--shadow-lg);
}

.shadow-xl {
  box-shadow: var(--shadow-xl);
}

/* Soft shadow (very subtle) */
.shadow-soft {
  box-shadow: 0 0.5px 1px 0 rgba(0, 0, 0, 0.3);
}
```

---

## 6. Status & Semantic Badge Classes

```css
/* Status Badge - Success */
.badge-success {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background-color: rgba(16, 185, 129, 0.1);
  color: #6EE7B7;
  padding: var(--space-1) var(--space-3);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Status Badge - Error */
.badge-error {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background-color: rgba(239, 68, 68, 0.1);
  color: #FCA5A5;
  padding: var(--space-1) var(--space-3);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Status Badge - Pending (gray, not blue) */
.badge-pending {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background-color: rgba(107, 114, 128, 0.2);
  color: var(--color-text-secondary);
  padding: var(--space-1) var(--space-3);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Status Badge - Warning */
.badge-warning {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background-color: rgba(245, 158, 11, 0.1);
  color: #FCD34D;
  padding: var(--space-1) var(--space-3);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Tier Badges */
.badge-s-tier {
  background-color: rgba(245, 158, 11, 0.1);
  color: #FCD34D;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.badge-a-tier {
  background-color: rgba(34, 197, 94, 0.1);
  color: #86EFAC;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.badge-b-tier {
  background-color: rgba(59, 130, 246, 0.1);
  color: #93C5FD;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.badge-c-tier {
  background-color: rgba(107, 114, 128, 0.1);
  color: #D1D5DB;
  border: 1px solid rgba(107, 114, 128, 0.3);
}
```

---

## 7. Status Indicator (Live Dot) Animation

```css
/* Live indicator (animated pulse) */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.indicator-live {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--color-success);
  border-radius: 9999px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Live indicator with outer ring */
.indicator-live-ring::before {
  content: '';
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border: 1px solid var(--color-success);
  border-radius: 9999px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  opacity: 0.7;
}

.indicator-live-ring {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--color-success);
  border-radius: 9999px;
}
```

---

## 8. Table Classes

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-bg-primary);
}

.table-head {
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border-primary);
}

.table-header {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.table-body {
  background-color: var(--color-bg-primary);
}

.table-row {
  border-bottom: 1px solid var(--color-border-primary);
  transition: background-color 150ms var(--ease-out);
}

.table-row:hover {
  background-color: var(--color-bg-secondary);
}

.table-cell {
  padding: var(--space-4) var(--space-4);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  vertical-align: middle;
}

/* Number column (right-aligned, monospace) */
.table-cell-numeric {
  text-align: right;
  font-family: 'JetBrains Mono', monospace;
  font-variant-numeric: tabular-nums;
}

/* Actions column (hidden until hover) */
.table-cell-actions {
  padding: var(--space-4) var(--space-4);
  visibility: hidden;
  white-space: nowrap;
}

.table-row:hover .table-cell-actions {
  visibility: visible;
}
```

---

## 9. Form Input Classes

```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: 0.375rem;
  color: var(--color-text-primary);
  font-size: 1rem;
  line-height: 1.5;
  transition: all 150ms var(--ease-out);
}

.input:hover {
  border-color: var(--color-border-secondary);
}

.input:focus {
  outline: none;
  border-color: var(--color-accent-primary);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.input::placeholder {
  color: var(--color-text-muted);
}

.input:disabled {
  background-color: var(--color-bg-primary);
  opacity: 0.5;
  cursor: not-allowed;
}

/* Input variants */
.input-error {
  border-color: var(--color-error);
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input-success {
  border-color: var(--color-success);
}

.input-success:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}
```

---

## 10. Layout & Grid Classes

```css
/* Container with max-width */
.container {
  width: 100%;
  max-width: 80rem;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-6);
  padding-right: var(--space-6);
}

/* Responsive grid */
.grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

/* Flex utilities */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.gap-sm { gap: var(--space-2); }
.gap-md { gap: var(--space-4); }
.gap-lg { gap: var(--space-6); }
.gap-xl { gap: var(--space-8); }

/* Section spacing */
.section {
  margin-bottom: var(--space-12);
}

.section-title {
  margin-bottom: var(--space-6);
}
```

---

## 11. Empty State Template

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12) var(--space-4);
  text-align: center;
}

.empty-state-icon {
  margin-bottom: var(--space-6);
  color: var(--color-text-muted);
  font-size: 3rem;
}

.empty-state-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.empty-state-description {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
  max-width: 28rem;
}

.empty-state-action {
  /* Use .btn-primary */
}
```

---

## 12. Animation Keyframes

```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide down */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Bounce */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* Spin */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Pulse (opacity) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Shimmer (loading) */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.loading-shimmer {
  background: linear-gradient(90deg, var(--color-bg-secondary) 25%, var(--color-bg-tertiary) 50%, var(--color-bg-secondary) 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

---

## Usage Example

```html
<!-- A complete example: Interactive card with button -->
<div class="card card-interactive">
  <h3 class="h3 mb-2">Team Name</h3>
  <p class="body-sm text-gray-400 mb-4">Your team score</p>

  <div class="flex-between mb-6">
    <span class="display">2,450</span>
    <span class="badge-success">✓ Active</span>
  </div>

  <div class="flex gap-md">
    <button class="btn btn-primary flex-1">View Team</button>
    <button class="btn btn-ghost">⋮</button>
  </div>
</div>
```

---

**Copy these classes directly into your CSS. Adjust variable values to match your design tokens.**
