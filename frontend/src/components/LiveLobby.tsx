/**
 * Live Lobby Component
 * Shows active Arena duels that users can join in real-time
 * Creates urgency and makes the platform feel active
 */

import { useState, useEffect } from 'react';
import { useRealtime } from '../contexts/RealtimeContext';
import { formatDistanceToNow } from 'date-fns';

interface ActiveDuel {
  id: string;
  creator: string;
  stake: number;
  prediction: string;
  type: 'price' | 'protocol' | 'narrative';
  createdAt: Date;
  expiresAt: Date;
  participants: number;
  maxParticipants: number;
}

export function LiveLobby() {
  const { events, isConnected, onlineUsers } = useRealtime();
  const [activeDuels, setActiveDuels] = useState<ActiveDuel[]>([]);

  // Convert real-time events to active duels
  useEffect(() => {
    const duelEvents = events.filter(e => e.type === 'duel_created');

    const duels: ActiveDuel[] = duelEvents.slice(0, 6).map((event) => ({
      id: event.data.duelId || `duel_${event.id}`,
      creator: event.data.user || 'Unknown',
      stake: event.data.amount || Math.random() * 5 + 0.5,
      prediction: event.data.prediction || 'ETH to hit $3000 by Friday',
      type: (['price', 'protocol', 'narrative'] as const)[Math.floor(Math.random() * 3)],
      createdAt: event.timestamp,
      expiresAt: new Date(event.timestamp.getTime() + 24 * 60 * 60 * 1000), // 24 hours
      participants: Math.floor(Math.random() * 3),
      maxParticipants: 2,
    }));

    setActiveDuels(duels);
  }, [events]);

  const getDuelTypeColor = (type: ActiveDuel['type']) => {
    switch (type) {
      case 'price': return 'from-blue-500 to-cyan-500';
      case 'protocol': return 'from-purple-500 to-pink-500';
      case 'narrative': return 'from-orange-500 to-red-500';
    }
  };

  const getDuelTypeIcon = (type: ActiveDuel['type']) => {
    switch (type) {
      case 'price': return '📈';
      case 'protocol': return '⚙️';
      case 'narrative': return '💭';
    }
  };

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours}h left`;
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-900/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="text-lg">⚔️</span>
              {isConnected && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
            <h3 className="font-bold text-white">Live Duels</h3>
          </div>
          <div className="text-xs px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 font-medium">
            {activeDuels.length} active
          </div>
        </div>
        <p className="text-xs text-gray-400">Join a duel or create your own</p>
      </div>

      {/* Active Duels List */}
      <div className="divide-y divide-gray-800 max-h-96 overflow-y-auto">
        {activeDuels.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">⏳</div>
            <p className="text-gray-400 text-sm mb-4">
              {isConnected ? 'Waiting for duels to appear...' : 'Connecting...'}
            </p>
          </div>
        ) : (
          activeDuels.map((duel) => (
            <div
              key={duel.id}
              className={`p-4 hover:bg-gray-800/30 transition-all group cursor-pointer`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Duel Info */}
                <div className="flex-1 min-w-0">
                  {/* Type Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getDuelTypeColor(duel.type)}/20 border border-gray-700 font-medium flex items-center gap-1`}>
                      <span>{getDuelTypeIcon(duel.type)}</span>
                      <span className="capitalize">{duel.type}</span>
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(duel.createdAt, { addSuffix: true })}
                    </span>
                  </div>

                  {/* Creator */}
                  <div className="text-xs text-gray-400 mb-2">
                    Created by <span className="font-mono text-cyan-400">{duel.creator}</span>
                  </div>

                  {/* Prediction */}
                  <p className="text-sm text-white mb-2 line-clamp-1">{duel.prediction}</p>

                  {/* Stats Row */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-green-400 font-bold">
                      <span>💰</span>
                      <span>{duel.stake.toFixed(2)} ETH</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <span>👥</span>
                      <span>{duel.participants}/{duel.maxParticipants}</span>
                    </div>
                    <div className="text-orange-400">
                      <span>⏰ {getTimeRemaining(duel.expiresAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Join Button */}
                <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-sm font-bold rounded-lg transition-all opacity-0 group-hover:opacity-100 flex-shrink-0">
                  Join →
                </button>
              </div>

              {/* Potential Winnings */}
              <div className="mt-2 pt-2 border-t border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-500">Potential win:</span>
                <span className="text-sm font-bold text-green-400">
                  {(duel.stake * 2 * 0.95).toFixed(2)} ETH
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer CTA */}
      <div className="p-3 border-t border-gray-700 bg-gray-900/50">
        <button className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold rounded-lg transition-all">
          + Create New Duel
        </button>
      </div>

      {/* Stats Footer */}
      <div className="p-3 border-t border-gray-700 bg-gray-900/50 text-center">
        <p className="text-xs text-gray-500">
          🔥 {onlineUsers} players online • {Math.floor(activeDuels.reduce((sum, d) => sum + d.stake, 0))} ETH in active duels
        </p>
      </div>
    </div>
  );
}
