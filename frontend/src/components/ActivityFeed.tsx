/**
 * Live Activity Feed
 * Shows real-time wins, predictions, and big plays across the platform
 * Creates FOMO and social proof
 */

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useRealtime, type RealtimeEvent } from '../contexts/RealtimeContext';

// Convert RealtimeEvent to Activity format
function convertToActivity(event: RealtimeEvent): Activity | null {
  if (!event.data.game || !event.data.user) return null;

  return {
    id: event.id,
    type: event.type as 'win' | 'prediction' | 'streak' | 'achievement',
    user: event.data.user,
    amount: event.data.amount,
    game: event.data.game,
    description: event.data.description || '',
    timestamp: event.timestamp,
    multiplier: event.data.multiplier,
  };
}

interface Activity {
  id: string;
  type: 'win' | 'prediction' | 'streak' | 'achievement';
  user: string;
  amount?: number;
  game: 'draft' | 'whisperer' | 'arena' | 'gauntlet';
  description: string;
  timestamp: Date;
  multiplier?: number;
}

export function ActivityFeed({ limit = 10 }: { limit?: number }) {
  const { events, isConnected } = useRealtime();
  const [activities, setActivities] = useState<Activity[]>([]);

  // Convert real-time events to activities
  useEffect(() => {
    // Filter and convert events to activities
    const converted = events
      .map(convertToActivity)
      .filter((a): a is Activity => a !== null)
      .slice(0, limit);

    setActivities(converted);
  }, [events, limit]);

  const getGameColor = (game: Activity['game']) => {
    switch (game) {
      case 'draft': return 'from-blue-500 to-cyan-500';
      case 'whisperer': return 'from-purple-500 to-pink-500';
      case 'arena': return 'from-orange-500 to-red-500';
      case 'gauntlet': return 'from-green-500 to-emerald-500';
    }
  };

  const getGameIcon = (game: Activity['game']) => {
    switch (game) {
      case 'draft': return '🏆';
      case 'whisperer': return '🧠';
      case 'arena': return '⚔️';
      case 'gauntlet': return '🎯';
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'win': return '💰';
      case 'prediction': return '🔮';
      case 'streak': return '🔥';
      case 'achievement': return '🏅';
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="text-lg">📊</span>
            {isConnected && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
          <h3 className="font-bold text-white">Live Activity</h3>
        </div>
        <div
          className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
            isConnected
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-gray-700 text-gray-400 border border-gray-600'
          }`}
        >
          {isConnected ? '🔴 LIVE' : 'Connecting...'}
        </div>
      </div>

      {/* Activity Stream */}
      <div className="divide-y divide-gray-800 max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`p-3 hover:bg-gray-800/30 transition-all cursor-pointer group ${
              index === 0 ? 'animate-fade-in' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Game Icon */}
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getGameColor(activity.game)} flex items-center justify-center text-sm flex-shrink-0`}>
                {getGameIcon(activity.game)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm text-cyan-400 font-medium">
                    {activity.user}
                  </span>
                  {activity.amount && (
                    <span className="text-sm font-bold text-green-400">
                      +{activity.amount} ETH
                    </span>
                  )}
                  {activity.multiplier && (
                    <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded border border-orange-500/30 font-bold">
                      {activity.multiplier}x
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs">{getActivityIcon(activity.type)}</span>
                  <p className="text-sm text-gray-400 truncate">{activity.description}</p>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>

              {/* Hover CTA */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
                  Try →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="p-3 border-t border-gray-700 bg-gray-900/50 text-center">
        <p className="text-xs text-gray-500">
          🔥 {activities.filter(a => a.amount).length} winners in the last hour • Total paid: {activities.reduce((sum, a) => sum + (a.amount || 0), 0).toFixed(2)} ETH
        </p>
      </div>
    </div>
  );
}
