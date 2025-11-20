/**
 * CreateDuelModal Component
 * Modal for creating new duels in the Arena
 */

import { useState } from 'react';
import { parseEther } from 'viem';

interface CreateDuelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (duel: {
    type: 'PRICE' | 'PROTOCOL' | 'NARRATIVE';
    question: string;
    position: string;
    stake: bigint;
    deadline: number;
    oracleKey?: string;
  }) => Promise<void>;
}

export function CreateDuelModal({ isOpen, onClose, onCreate }: CreateDuelModalProps) {
  const [duelType, setDuelType] = useState<'PRICE' | 'PROTOCOL' | 'NARRATIVE'>('NARRATIVE');
  const [question, setQuestion] = useState('');
  const [position, setPosition] = useState('');
  const [stake, setStake] = useState('0.01');
  const [days, setDays] = useState('7');
  const [oracleKey, setOracleKey] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const deadlineTimestamp = Math.floor(Date.now() / 1000) + Number(days) * 24 * 60 * 60;

      await onCreate({
        type: duelType,
        question,
        position,
        stake: parseEther(stake),
        deadline: deadlineTimestamp,
        oracleKey: duelType !== 'NARRATIVE' ? oracleKey : undefined,
      });

      // Reset form
      setQuestion('');
      setPosition('');
      setStake('0.01');
      setDays('7');
      setOracleKey('');
      onClose();
    } catch (error) {
      console.error('Failed to create duel:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const typeInfo = {
    PRICE: {
      emoji: '📈',
      color: 'from-blue-500 to-cyan-500',
      description: 'Predict price movements (oracle-resolved)',
      example: 'Will ETH reach $5,000 by end of month?',
      requiresOracle: true,
    },
    PROTOCOL: {
      emoji: '⚙️',
      color: 'from-purple-500 to-pink-500',
      description: 'Predict protocol metrics (oracle-resolved)',
      example: 'Will Uniswap TVL exceed $10B this quarter?',
      requiresOracle: true,
    },
    NARRATIVE: {
      emoji: '💭',
      color: 'from-orange-500 to-red-500',
      description: 'Subjective predictions (community-voted)',
      example: 'Will memecoins dominate the next cycle?',
      requiresOracle: false,
    },
  };

  const currentType = typeInfo[duelType];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Create Duel</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Duel Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Duel Type</label>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(typeInfo) as Array<'PRICE' | 'PROTOCOL' | 'NARRATIVE'>).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDuelType(type)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    duelType === type
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <div className="text-3xl mb-2">{typeInfo[type].emoji}</div>
                  <div className="text-sm font-bold">{type}</div>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-400">{currentType.description}</p>
          </div>

          {/* Question */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Question
              <span className="text-gray-500 text-xs ml-2">(max 280 characters)</span>
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value.slice(0, 280))}
              placeholder={currentType.example}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none resize-none"
              rows={3}
              required
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {question.length}/280
            </div>
          </div>

          {/* Your Position */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Position
              <span className="text-gray-500 text-xs ml-2">(what you believe)</span>
            </label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value.slice(0, 100))}
              placeholder="YES / Will reach $5k / Bullish / etc."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          {/* Oracle Key (for PRICE/PROTOCOL) */}
          {currentType.requiresOracle && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Oracle Key
                <span className="text-gray-500 text-xs ml-2">(e.g., ETH/USD, UNI/USD)</span>
              </label>
              <input
                type="text"
                value={oracleKey}
                onChange={(e) => setOracleKey(e.target.value)}
                placeholder="ETH/USD"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none font-mono text-sm"
                required
              />
              <p className="mt-2 text-xs text-gray-500">
                This key will be used to fetch oracle data for resolution
              </p>
            </div>
          )}

          {/* Stake & Duration Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Stake Amount */}
            <div>
              <label className="block text-sm font-medium mb-2">Stake Amount (ETH)</label>
              <select
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none"
              >
                <option value="0.01">0.01 ETH</option>
                <option value="0.05">0.05 ETH</option>
                <option value="0.1">0.1 ETH</option>
                <option value="0.5">0.5 ETH</option>
                <option value="1">1 ETH</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Opponent must match this stake
              </p>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-2">Duration (Days)</label>
              <select
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none"
              >
                <option value="1">1 Day</option>
                <option value="3">3 Days</option>
                <option value="7">7 Days</option>
                <option value="14">14 Days</option>
                <option value="30">30 Days</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Time until resolution
              </p>
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
            <div className="text-sm font-medium mb-2">Summary</div>
            <div className="space-y-1 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className={`font-bold bg-gradient-to-r ${currentType.color} bg-clip-text text-transparent`}>
                  {duelType}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Your Stake:</span>
                <span className="text-cyan-400 font-mono">{stake} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Potential Win:</span>
                <span className="text-green-400 font-mono">
                  {(Number(stake) * 1.9).toFixed(3)} ETH
                </span>
              </div>
              <div className="flex justify-between">
                <span>Deadline:</span>
                <span className="text-gray-300">
                  {new Date(Date.now() + Number(days) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : `Create Duel (${stake} ETH)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
