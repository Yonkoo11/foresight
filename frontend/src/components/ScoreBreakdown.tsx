/**
 * ScoreBreakdown — Visual breakdown of a team's score by category
 *
 * Shows Activity / Engagement / Growth / Viral bars with values.
 * Used in ContestDetail to explain "why did I score this?"
 */

interface BreakdownData {
  activity?: number;
  engagement?: number;
  growth?: number;
  viral?: number;
}

interface ScoreBreakdownProps {
  breakdown: BreakdownData;
  captainBonus?: number;
  total?: number;
  className?: string;
}

const CATEGORIES = [
  { key: 'activity'   as const, label: 'Activity',   max: 35, color: 'bg-blue-500'    },
  { key: 'engagement' as const, label: 'Engagement', max: 60, color: 'bg-gold-500'    },
  { key: 'growth'     as const, label: 'Growth',     max: 40, color: 'bg-emerald-500' },
  { key: 'viral'      as const, label: 'Viral',      max: 25, color: 'bg-rose-500'    },
];

export default function ScoreBreakdown({
  breakdown,
  captainBonus,
  total,
  className = '',
}: ScoreBreakdownProps) {
  // Nothing to show if breakdown is empty
  const hasData = CATEGORIES.some(c => (breakdown[c.key] ?? 0) > 0);
  if (!hasData && !total) return null;

  return (
    <div className={`rounded-xl bg-gray-800/50 border border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/50">
        <span className="text-sm font-semibold text-white">Score Breakdown</span>
        {total != null && (
          <span className="text-base font-bold text-gold-400">{total.toLocaleString()} pts</span>
        )}
      </div>

      {/* Category bars */}
      <div className="px-4 py-3 space-y-2.5">
        {CATEGORIES.map(({ key, label, max, color }) => {
          const val = breakdown[key] ?? 0;
          const pct = max > 0 ? Math.min(100, Math.round((val / max) * 100)) : 0;
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-[72px] shrink-0">{label}</span>
              <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-mono text-white w-16 text-right shrink-0">
                {val.toFixed(1)}<span className="text-gray-600">/{max}</span>
              </span>
            </div>
          );
        })}

        {/* Captain bonus row */}
        {captainBonus != null && captainBonus > 0 && (
          <div className="flex items-center gap-3 pt-1.5 border-t border-gray-700/40">
            <span className="text-xs text-gold-400 w-[72px] shrink-0">Captain 2×</span>
            <div className="flex-1" />
            <span className="text-xs font-mono text-gold-400 w-16 text-right shrink-0">
              +{captainBonus.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
