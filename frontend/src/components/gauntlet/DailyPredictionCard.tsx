/**
 * DailyPredictionCard Component
 * Individual prediction question in the Daily Gauntlet
 */

import { useState } from 'react';

export interface DailyPrediction {
  id: bigint;
  day: bigint;
  question: string;
  oracleKey: string;
  targetValue: bigint;
  isAbove: boolean;
  deadline: bigint;
  resolved: boolean;
  actualValue?: bigint;
}

export interface UserPrediction {
  predictionId: bigint;
  guess: bigint;
  submitted: boolean;
}

interface DailyPredictionCardProps {
  prediction: DailyPrediction;
  userPrediction?: UserPrediction;
  onSubmit?: (predictionId: bigint, guess: bigint) => void;
  disabled?: boolean;
  index: number;
}

export function DailyPredictionCard({
  prediction,
  userPrediction,
  onSubmit,
  disabled,
  index,
}: DailyPredictionCardProps) {
  const [guess, setGuess] = useState('');
  const isExpired = Date.now() / 1000 > Number(prediction.deadline);
  const hasSubmitted = userPrediction?.submitted;

  const handleSubmit = () => {
    if (!guess || !onSubmit) return;
    const guessValue = BigInt(Math.floor(Number(guess) * 100)); // Convert to basis points or similar
    onSubmit(prediction.id, guessValue);
    setGuess('');
  };

  const getOracleLabel = (key: string) => {
    if (key.includes('USD')) return key.replace('_', '/');
    if (key.includes('TVL')) return 'TVL';
    return key;
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center text-sm font-bold text-green-400">
            {index + 1}
          </div>
          <div>
            <div className="text-sm font-bold text-gray-300">Prediction {index + 1}</div>
            <div className="text-xs text-gray-500">{getOracleLabel(prediction.oracleKey)}</div>
          </div>
        </div>

        {hasSubmitted && (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">
            ✓ Submitted
          </span>
        )}
        {isExpired && !hasSubmitted && (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/30">
            Expired
          </span>
        )}
      </div>

      {/* Question */}
      <p className="text-gray-200 mb-4 text-sm leading-relaxed">{prediction.question}</p>

      {/* Input or Result */}
      {!hasSubmitted && !isExpired && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter your prediction..."
              className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm focus:border-green-500 focus:outline-none"
              disabled={disabled}
            />
            <button
              onClick={handleSubmit}
              disabled={!guess || disabled}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Predict the {prediction.isAbove ? 'maximum' : 'minimum'} value for {getOracleLabel(prediction.oracleKey)}
          </p>
        </div>
      )}

      {hasSubmitted && userPrediction && (
        <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
          <div className="text-xs text-gray-500 mb-1">Your Prediction</div>
          <div className="text-lg font-bold text-green-400">
            {(Number(userPrediction.guess) / 100).toFixed(2)}
          </div>
          {prediction.resolved && prediction.actualValue !== undefined && (
            <div className="mt-2 pt-2 border-t border-green-500/30">
              <div className="text-xs text-gray-500">Actual Value</div>
              <div className="text-sm font-medium text-gray-300">
                {(Number(prediction.actualValue) / 100).toFixed(2)}
              </div>
            </div>
          )}
        </div>
      )}

      {isExpired && !hasSubmitted && (
        <div className="bg-gray-900/50 rounded p-3 text-center">
          <p className="text-sm text-gray-500">Time expired - no submission</p>
        </div>
      )}
    </div>
  );
}
