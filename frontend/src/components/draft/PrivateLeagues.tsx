/**
 * PrivateLeagues Component
 * Manage private leagues for CT Draft (FPL-style mini-leagues)
 */

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { PrivateLeagueLeaderboard } from './PrivateLeagueLeaderboard';

export interface PrivateLeague {
  id: string;
  name: string;
  code: string;
  creator: string;
  members: string[];
  type: 'free' | 'prize';
  prizePool?: number; // ETH amount for prize leagues
  createdAt: number;
  description?: string;
}

interface PrivateLeaguesProps {
  onClose?: () => void;
}

export function PrivateLeagues({ onClose }: PrivateLeaguesProps) {
  const { address } = useAccount();
  const [view, setView] = useState<'list' | 'create' | 'join' | 'leaderboard'>('list');
  const [myLeagues, setMyLeagues] = useState<PrivateLeague[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<PrivateLeague | null>(null);

  // Create league form
  const [leagueName, setLeagueName] = useState('');
  const [leagueType, setLeagueType] = useState<'free' | 'prize'>('free');
  const [leagueDescription, setLeagueDescription] = useState('');
  const [prizePool, setPrizePool] = useState('');

  // Join league form
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');

  // Load user's leagues
  useEffect(() => {
    if (!address) return;

    const userLeaguesKey = `ctdraft_user_leagues_${address}`;
    const savedLeaguesStr = localStorage.getItem(userLeaguesKey);

    if (savedLeaguesStr) {
      try {
        const leagueIds = JSON.parse(savedLeaguesStr) as string[];
        const leagues: PrivateLeague[] = [];

        leagueIds.forEach(leagueId => {
          const leagueStr = localStorage.getItem(`ctdraft_league_${leagueId}`);
          if (leagueStr) {
            leagues.push(JSON.parse(leagueStr));
          }
        });

        setMyLeagues(leagues);
      } catch (e) {
        console.error('Error loading leagues:', e);
      }
    }
  }, [address]);

  // Generate unique league code
  const generateLeagueCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Create new league
  const handleCreateLeague = () => {
    if (!address || !leagueName.trim()) return;

    const leagueCode = generateLeagueCode();
    const newLeague: PrivateLeague = {
      id: `${Date.now()}_${leagueCode}`,
      name: leagueName.trim(),
      code: leagueCode,
      creator: address,
      members: [address],
      type: leagueType,
      prizePool: leagueType === 'prize' ? parseFloat(prizePool) || 0 : undefined,
      createdAt: Date.now(),
      description: leagueDescription.trim() || undefined,
    };

    // Save league
    localStorage.setItem(`ctdraft_league_${newLeague.id}`, JSON.stringify(newLeague));

    // Add to user's leagues
    const userLeaguesKey = `ctdraft_user_leagues_${address}`;
    const existingLeagues = JSON.parse(localStorage.getItem(userLeaguesKey) || '[]');
    existingLeagues.push(newLeague.id);
    localStorage.setItem(userLeaguesKey, JSON.stringify(existingLeagues));

    // Update state
    setMyLeagues([...myLeagues, newLeague]);

    // Reset form
    setLeagueName('');
    setLeagueDescription('');
    setPrizePool('');
    setView('list');
  };

  // Join existing league
  const handleJoinLeague = () => {
    if (!address || !joinCode.trim()) return;

    setJoinError('');

    // Search for league by code
    let foundLeague: PrivateLeague | null = null;

    // Search through all stored leagues
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('ctdraft_league_')) {
        try {
          const leagueStr = localStorage.getItem(key);
          if (leagueStr) {
            const league = JSON.parse(leagueStr) as PrivateLeague;
            if (league.code === joinCode.toUpperCase()) {
              foundLeague = league;
              break;
            }
          }
        } catch (e) {
          // Skip invalid entries
        }
      }
    }

    if (!foundLeague) {
      setJoinError('League not found. Check your code and try again.');
      return;
    }

    // Check if already a member
    if (foundLeague.members.includes(address)) {
      setJoinError('You are already a member of this league!');
      return;
    }

    // Add user to league
    foundLeague.members.push(address);
    localStorage.setItem(`ctdraft_league_${foundLeague.id}`, JSON.stringify(foundLeague));

    // Add to user's leagues
    const userLeaguesKey = `ctdraft_user_leagues_${address}`;
    const existingLeagues = JSON.parse(localStorage.getItem(userLeaguesKey) || '[]');
    if (!existingLeagues.includes(foundLeague.id)) {
      existingLeagues.push(foundLeague.id);
      localStorage.setItem(userLeaguesKey, JSON.stringify(existingLeagues));
    }

    // Update state
    setMyLeagues([...myLeagues, foundLeague]);
    setJoinCode('');
    setView('list');
  };

  // Leave league
  const handleLeaveLeague = (leagueId: string) => {
    if (!address) return;

    const league = myLeagues.find(l => l.id === leagueId);
    if (!league) return;

    // Can't leave if you're the creator
    if (league.creator === address) {
      alert("You can't leave a league you created. You can delete it instead.");
      return;
    }

    // Remove from league members
    league.members = league.members.filter(m => m !== address);
    localStorage.setItem(`ctdraft_league_${league.id}`, JSON.stringify(league));

    // Remove from user's leagues
    const userLeaguesKey = `ctdraft_user_leagues_${address}`;
    const existingLeagues = JSON.parse(localStorage.getItem(userLeaguesKey) || '[]');
    const updated = existingLeagues.filter((id: string) => id !== leagueId);
    localStorage.setItem(userLeaguesKey, JSON.stringify(updated));

    // Update state
    setMyLeagues(myLeagues.filter(l => l.id !== leagueId));
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Private Leagues</h2>
          <p className="text-sm text-gray-400 mt-1">Create or join leagues with friends</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        )}
      </div>

      {/* Navigation */}
      {view === 'list' && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setView('create')}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded font-medium transition-all"
          >
            + Create League
          </button>
          <button
            onClick={() => setView('join')}
            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white rounded font-medium transition-all"
          >
            Join League
          </button>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div>
          {myLeagues.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="text-4xl mb-3">🏆</div>
              <p className="text-gray-400 mb-2">No leagues yet</p>
              <p className="text-sm text-gray-500">Create or join a league to compete with friends</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myLeagues.map(league => (
                <div
                  key={league.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-100">{league.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          league.type === 'prize'
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {league.type === 'prize' ? '💰 Prize' : '🆓 Free'}
                        </span>
                        {league.creator === address && (
                          <span className="px-2 py-0.5 rounded text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                            Creator
                          </span>
                        )}
                      </div>
                      {league.description && (
                        <p className="text-sm text-gray-400 mb-2">{league.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-gray-900/50 rounded p-2">
                      <div className="text-xs text-gray-500">Members</div>
                      <div className="text-sm font-bold text-cyan-400">{league.members.length}</div>
                    </div>
                    <div className="bg-gray-900/50 rounded p-2">
                      <div className="text-xs text-gray-500">League Code</div>
                      <div className="text-sm font-bold text-orange-400">{league.code}</div>
                    </div>
                    {league.type === 'prize' && league.prizePool && (
                      <div className="bg-gray-900/50 rounded p-2">
                        <div className="text-xs text-gray-500">Prize Pool</div>
                        <div className="text-sm font-bold text-yellow-400">{league.prizePool} ETH</div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="flex-1 px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-400 rounded text-sm font-medium transition-all"
                      onClick={() => {
                        setSelectedLeague(league);
                        setView('leaderboard');
                      }}
                    >
                      View Leaderboard
                    </button>
                    {league.creator !== address && (
                      <button
                        onClick={() => handleLeaveLeague(league.id)}
                        className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded text-sm font-medium transition-all"
                      >
                        Leave
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create League View */}
      {view === 'create' && (
        <div>
          <button
            onClick={() => setView('list')}
            className="text-sm text-gray-400 hover:text-gray-200 mb-4 flex items-center gap-1"
          >
            ← Back to leagues
          </button>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                League Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={leagueName}
                onChange={(e) => setLeagueName(e.target.value)}
                placeholder="e.g., Crypto Twitter Elite, Weekend Warriors..."
                maxLength={40}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <div className="text-xs text-gray-500 mt-1">{leagueName.length}/40 characters</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                League Type <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setLeagueType('free')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    leagueType === 'free'
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-1">🆓</div>
                  <div className="font-bold text-gray-100">Free League</div>
                  <div className="text-xs text-gray-400">XP & bragging rights</div>
                </button>
                <button
                  onClick={() => setLeagueType('prize')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    leagueType === 'prize'
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-1">💰</div>
                  <div className="font-bold text-gray-100">Prize League</div>
                  <div className="text-xs text-gray-400">ETH prize pool</div>
                </button>
              </div>
            </div>

            {leagueType === 'prize' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prize Pool (ETH) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={prizePool}
                  onChange={(e) => setPrizePool(e.target.value)}
                  placeholder="0.1"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <div className="text-xs text-gray-400 mt-1">Total ETH to be distributed among winners</div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={leagueDescription}
                onChange={(e) => setLeagueDescription(e.target.value)}
                placeholder="What's this league about?"
                maxLength={200}
                rows={3}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <div className="text-xs text-gray-500 mt-1">{leagueDescription.length}/200 characters</div>
            </div>

            <button
              onClick={handleCreateLeague}
              disabled={!leagueName.trim() || (leagueType === 'prize' && !prizePool)}
              className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create League
            </button>
          </div>
        </div>
      )}

      {/* Join League View */}
      {view === 'join' && (
        <div>
          <button
            onClick={() => {
              setView('list');
              setJoinError('');
            }}
            className="text-sm text-gray-400 hover:text-gray-200 mb-4 flex items-center gap-1"
          >
            ← Back to leagues
          </button>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                League Code <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                maxLength={6}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 uppercase tracking-wider text-lg text-center font-bold"
              />
              <div className="text-xs text-gray-400 mt-1">Ask your friend for the league code</div>
            </div>

            {joinError && (
              <div className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
                {joinError}
              </div>
            )}

            <button
              onClick={handleJoinLeague}
              disabled={joinCode.length !== 6}
              className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join League
            </button>
          </div>
        </div>
      )}

      {/* Leaderboard View */}
      {view === 'leaderboard' && selectedLeague && (
        <PrivateLeagueLeaderboard
          league={selectedLeague}
          onBack={() => {
            setView('list');
            setSelectedLeague(null);
          }}
        />
      )}
    </div>
  );
}
