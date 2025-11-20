/**
 * Transaction Loading Overlay
 * Shows transaction status with optimistic updates
 */

import { CheckCircle, WarningCircle, CircleNotch } from '@phosphor-icons/react';
import type { OptimisticState } from '../hooks/useOptimisticWrite';
import { getLoadingState } from '../hooks/useOptimisticWrite';

interface TransactionLoadingOverlayProps {
  state: OptimisticState;
  onClose?: () => void;
}

export function TransactionLoadingOverlay({
  state,
  onClose,
}: TransactionLoadingOverlayProps) {
  const loadingState = getLoadingState(state);

  // Don't show overlay if idle
  if (loadingState.type === 'idle') {
    return null;
  }

  // Auto-close success after delay
  if (loadingState.type === 'success' && onClose) {
    setTimeout(onClose, 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-4">
            {loadingState.type === 'pending' && (
              <div className="animate-spin text-cyan-500">
                <CircleNotch size={64} weight="bold" />
              </div>
            )}
            {loadingState.type === 'confirming' && (
              <div className="animate-pulse text-blue-500">
                <CircleNotch size={64} weight="bold" className="animate-spin" />
              </div>
            )}
            {loadingState.type === 'success' && (
              <CheckCircle size={64} weight="fill" className="text-green-500" />
            )}
            {loadingState.type === 'error' && (
              <WarningCircle size={64} weight="fill" className="text-red-500" />
            )}
          </div>

          {/* Message */}
          <div className="space-y-2 mb-4">
            <h3 className="text-xl font-bold text-gray-200">
              {loadingState.type === 'pending' && 'Preparing Transaction'}
              {loadingState.type === 'confirming' && 'Confirming on Blockchain'}
              {loadingState.type === 'success' && 'Transaction Confirmed!'}
              {loadingState.type === 'error' && 'Transaction Failed'}
            </h3>

            {loadingState.message && (
              <p className="text-sm text-gray-400">
                {loadingState.message}
              </p>
            )}
          </div>

          {/* Transaction hash link */}
          {state.hash && (
            <a
              href={`https://sepolia.basescan.org/tx/${state.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-400 hover:text-cyan-300 underline mb-4"
            >
              View on Basescan
            </a>
          )}

          {/* Progress steps */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className={`h-2 w-2 rounded-full ${
                loadingState.type === 'pending' || loadingState.type === 'confirming' || loadingState.type === 'success'
                  ? 'bg-cyan-500'
                  : 'bg-gray-600'
              }`}
            />
            <div className="h-0.5 w-12 bg-gray-700">
              <div
                className={`h-full bg-cyan-500 transition-all duration-500 ${
                  loadingState.type === 'confirming' || loadingState.type === 'success'
                    ? 'w-full'
                    : 'w-0'
                }`}
              />
            </div>
            <div
              className={`h-2 w-2 rounded-full ${
                loadingState.type === 'confirming' || loadingState.type === 'success'
                  ? 'bg-cyan-500'
                  : 'bg-gray-600'
              }`}
            />
            <div className="h-0.5 w-12 bg-gray-700">
              <div
                className={`h-full bg-cyan-500 transition-all duration-500 ${
                  loadingState.type === 'success' ? 'w-full' : 'w-0'
                }`}
              />
            </div>
            <div
              className={`h-2 w-2 rounded-full ${
                loadingState.type === 'success' ? 'bg-green-500' : 'bg-gray-600'
              }`}
            />
          </div>

          {/* Action buttons */}
          {loadingState.type === 'error' && onClose && (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 font-medium transition-all duration-200"
            >
              Close
            </button>
          )}

          {/* Tip */}
          {(loadingState.type === 'pending' || loadingState.type === 'confirming') && (
            <p className="text-xs text-gray-600 mt-4">
              Please don't close this window...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Inline transaction status - compact version
 */
interface InlineTransactionStatusProps {
  state: OptimisticState;
  compact?: boolean;
}

export function InlineTransactionStatus({
  state,
  compact = false,
}: InlineTransactionStatusProps) {
  const loadingState = getLoadingState(state);

  if (loadingState.type === 'idle') {
    return null;
  }

  const colors = {
    pending: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    confirming: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    success: 'text-green-400 bg-green-500/10 border-green-500/30',
    error: 'text-red-400 bg-red-500/10 border-red-500/30',
  };

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
        colors[loadingState.type]
      } ${compact ? 'text-xs' : 'text-sm'}`}
    >
      {loadingState.type === 'pending' && <CircleNotch size={16} className="animate-spin" weight="bold" />}
      {loadingState.type === 'confirming' && <CircleNotch size={16} className="animate-spin" weight="bold" />}
      {loadingState.type === 'success' && <CheckCircle size={16} weight="fill" />}
      {loadingState.type === 'error' && <WarningCircle size={16} weight="fill" />}

      <span className="flex-1 min-w-0 truncate">
        {compact
          ? loadingState.type.charAt(0).toUpperCase() + loadingState.type.slice(1)
          : loadingState.message}
      </span>

      {state.hash && (
        <a
          href={`https://sepolia.basescan.org/tx/${state.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs underline hover:no-underline"
        >
          View
        </a>
      )}
    </div>
  );
}
