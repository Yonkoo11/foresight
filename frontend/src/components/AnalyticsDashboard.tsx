/**
 * Analytics Dashboard Component
 * Deep stats, charts, and insights for user performance
 */

import { useState } from 'react';

type TimeRange = '7d' | '30d' | 'all';

interface EarningsData {
  date: string;
  amount: number;
  source: string;
}

interface PerformanceMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  // Mock earnings data for the chart
  const earningsData: EarningsData[] = [
    { date: 'Nov 1', amount: 0.15, source: 'Draft' },
    { date: 'Nov 2', amount: 0.22, source: 'Arena' },
    { date: 'Nov 3', amount: 0.08, source: 'Gauntlet' },
    { date: 'Nov 4', amount: 0.31, source: 'Draft' },
    { date: 'Nov 5', amount: 0.18, source: 'Arena' },
    { date: 'Nov 6', amount: 0.42, source: 'Whisperer' },
    { date: 'Nov 7', amount: 0.27, source: 'Gauntlet' },
    { date: 'Nov 8', amount: 0.35, source: 'Arena' },
    { date: 'Nov 9', amount: 0.19, source: 'Draft' },
    { date: 'Nov 10', amount: 0.51, source: 'Arena' },
    { date: 'Nov 11', amount: 0.28, source: 'Gauntlet' },
    { date: 'Nov 12', amount: 0.45, source: 'Whisperer' },
    { date: 'Nov 13', amount: 0.33, source: 'Arena' },
    { date: 'Nov 14', amount: 0.29, source: 'Draft' },
  ];

  // Performance metrics
  const metrics: PerformanceMetric[] = [
    { label: 'Win Rate', value: 67, change: 5, trend: 'up' },
    { label: 'Avg Daily Earnings', value: 0.31, change: 12, trend: 'up' },
    { label: 'Best Streak', value: 7, change: 0, trend: 'neutral' },
    { label: 'Games Played', value: 42, change: -8, trend: 'down' },
  ];

  // Calculate max value for chart scaling
  const maxEarnings = Math.max(...earningsData.map(d => d.amount));

  // Earnings by source
  const earningsBySource = {
    draft: 1.2,
    whisperer: 0.87,
    arena: 1.54,
    gauntlet: 0.83,
  };

  const totalEarnings = Object.values(earningsBySource).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
        <div className="flex gap-2 bg-gray-800/50 border border-gray-700 rounded-lg p-1">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              timeRange === '7d'
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              timeRange === '30d'
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              timeRange === 'all'
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">{metric.label}</div>
            <div className="text-2xl font-bold text-white mb-1">
              {metric.label.includes('Earnings') ? `${metric.value.toFixed(2)} ETH` : metric.value}
            </div>
            <div className={`text-xs font-medium ${
              metric.trend === 'up' ? 'text-green-400' : metric.trend === 'down' ? 'text-red-400' : 'text-gray-500'
            }`}>
              {metric.trend === 'up' && '↗'}
              {metric.trend === 'down' && '↘'}
              {metric.trend === 'neutral' && '→'}
              {' '}
              {metric.change > 0 ? '+' : ''}{metric.change}% vs last period
            </div>
          </div>
        ))}
      </div>

      {/* Earnings Chart */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Daily Earnings</h3>
        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
            <span>{maxEarnings.toFixed(2)}</span>
            <span>{(maxEarnings * 0.75).toFixed(2)}</span>
            <span>{(maxEarnings * 0.5).toFixed(2)}</span>
            <span>{(maxEarnings * 0.25).toFixed(2)}</span>
            <span>0.00</span>
          </div>

          {/* Chart */}
          <div className="ml-12 h-full flex items-end gap-1">
            {earningsData.map((data, index) => {
              const height = (data.amount / maxEarnings) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative group">
                    <div
                      className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t transition-all hover:opacity-80 cursor-pointer"
                      style={{ height: `${height}%` }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs whitespace-nowrap shadow-xl">
                        <div className="font-bold text-cyan-400">{data.amount.toFixed(2)} ETH</div>
                        <div className="text-gray-400">{data.source}</div>
                        <div className="text-gray-500">{data.date}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 -rotate-45 mt-2 whitespace-nowrap">
                    {data.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Source */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Earnings by Source</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">🏆 CT Draft</span>
                <span className="font-bold text-cyan-400">{earningsBySource.draft.toFixed(2)} ETH</span>
              </div>
              <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  style={{ width: `${(earningsBySource.draft / totalEarnings) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">🧠 CT Whisperer</span>
                <span className="font-bold text-purple-400">{earningsBySource.whisperer.toFixed(2)} ETH</span>
              </div>
              <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${(earningsBySource.whisperer / totalEarnings) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">⚔️ Arena</span>
                <span className="font-bold text-orange-400">{earningsBySource.arena.toFixed(2)} ETH</span>
              </div>
              <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                  style={{ width: `${(earningsBySource.arena / totalEarnings) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">🎯 Gauntlet</span>
                <span className="font-bold text-green-400">{earningsBySource.gauntlet.toFixed(2)} ETH</span>
              </div>
              <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  style={{ width: `${(earningsBySource.gauntlet / totalEarnings) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Total Earnings</span>
              <span className="text-lg font-bold text-green-400">{totalEarnings.toFixed(2)} ETH</span>
            </div>
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">📊 Insights</h3>
          <div className="space-y-4">
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="font-semibold text-cyan-400 text-sm mb-1">Peak Performance</h4>
                  <p className="text-xs text-gray-400">
                    Your best earnings come from Arena. Consider increasing Arena participation for higher returns.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📈</span>
                <div>
                  <h4 className="font-semibold text-purple-400 text-sm mb-1">Improvement Area</h4>
                  <p className="text-xs text-gray-400">
                    Your win rate increased 5% this period. Maintaining this trend could increase earnings by ~20%.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h4 className="font-semibold text-yellow-400 text-sm mb-1">Consistency Bonus</h4>
                  <p className="text-xs text-gray-400">
                    You're 3 days away from a 7-day streak bonus. Keep playing daily for extra multipliers!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💰</span>
                <div>
                  <h4 className="font-semibold text-green-400 text-sm mb-1">Revenue Opportunity</h4>
                  <p className="text-xs text-gray-400">
                    Share your wins on Twitter to unlock referral earnings. Potential: +0.5 ETH/month.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
