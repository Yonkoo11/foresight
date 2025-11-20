/**
 * Contract Error Display Component
 * Displays contract read errors with retry options
 */

import { Warning, ArrowsClockwise } from '@phosphor-icons/react';

interface ContractErrorDisplayProps {
  error: Error | null;
  onRetry?: () => void;
  componentName?: string;
}

export function ContractErrorDisplay({
  error,
  onRetry,
  componentName = 'Contract'
}: ContractErrorDisplayProps) {
  if (!error) return null;

  const isNetworkError = error.message?.includes('fetch') || error.message?.includes('network');
  const isContractError = error.message?.includes('execution reverted') || error.message?.includes('contract');

  return (
    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Warning size={24} weight="fill" className="text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-red-400 font-semibold mb-1">
            {isNetworkError && 'Network Error'}
            {isContractError && 'Contract Error'}
            {!isNetworkError && !isContractError && `${componentName} Error`}
          </h4>
          <p className="text-sm text-gray-300 mb-3 break-words">
            {isNetworkError && 'Unable to connect to the blockchain. Please check your internet connection or try again.'}
            {isContractError && 'The smart contract returned an error. The data may not be available yet.'}
            {!isNetworkError && !isContractError && error.message}
          </p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 text-sm font-medium transition-all duration-200"
            >
              <ArrowsClockwise size={16} weight="bold" />
              Retry
            </button>
          )}

          <div className="mt-3 p-2 bg-gray-900/50 rounded text-xs text-gray-500 font-mono overflow-x-auto">
            {error.message}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline Contract Error - Smaller version for inline display
 */
interface InlineContractErrorProps {
  error: Error | null;
  onRetry?: () => void;
}

export function InlineContractError({ error, onRetry }: InlineContractErrorProps) {
  if (!error) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 border border-red-500/30 rounded px-3 py-2">
      <Warning size={16} weight="fill" />
      <span className="flex-1 min-w-0 truncate">{error.message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex-shrink-0 p-1 hover:bg-red-500/20 rounded transition-colors"
          title="Retry"
        >
          <ArrowsClockwise size={14} weight="bold" />
        </button>
      )}
    </div>
  );
}
