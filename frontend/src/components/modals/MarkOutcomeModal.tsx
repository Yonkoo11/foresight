/**
 * Mark Outcome Modal
 * Modal for marking prediction outcomes (TRUE/FALSE)
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther } from 'viem';
import { formatDistanceToNow } from 'date-fns';
import { TIMECASTER_ARENA_ADDRESS } from '../../config/wagmi';
import type { Prediction } from '../terminal/PredictionCard';

interface MarkOutcomeModalProps {
  isOpen: boolean;
  prediction: Prediction | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function MarkOutcomeModal({
  isOpen,
  prediction,
  onClose,
  onSuccess,
}: MarkOutcomeModalProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { writeContract, data: hash, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedOutcome(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle submission
  const handleSubmit = async () => {
    if (!prediction || selectedOutcome === null || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // TODO: Update with correct contract function when deployed
      await writeContract({
        address: TIMECASTER_ARENA_ADDRESS,
        abi: [{
          type: 'function',
          name: 'markOutcome',
          inputs: [
            { name: 'predictionId', type: 'uint256' },
            { name: 'success', type: 'bool' }
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        }],
        functionName: 'markOutcome',
        args: [prediction.id, selectedOutcome],
      });
    } catch (err) {
      console.error('Error marking outcome:', err);
      setIsSubmitting(false);
    }
  };

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      setIsSubmitting(false);
      onSuccess?.();
      setTimeout(onClose, 1000); // Close after brief delay to show success
    }
  }, [isSuccess, onSuccess, onClose]);

  // Handle error
  useEffect(() => {
    if (error) {
      setIsSubmitting(false);
    }
  }, [error]);

  if (!prediction) return null;

  const createdAtMs = Number(prediction.createdAt) * 1000;
  const hasStake = prediction.stake > 0n;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100">
                      Mark Outcome
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Was your prediction correct?
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-200 transition-colors p-2 hover:bg-gray-800 rounded-lg"
                    aria-label="Close modal"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Prediction Details */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-2">Your Prediction:</p>
                  <p className="text-base text-gray-100 font-medium">
                    {prediction.text}
                  </p>

                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <span>📅</span>
                      <span>
                        Created {formatDistanceToNow(createdAtMs, { addSuffix: true })}
                      </span>
                    </div>
                    {hasStake && (
                      <div className="flex items-center gap-1 text-purple-400">
                        <span>💰</span>
                        <span>{formatEther(prediction.stake)} ETH staked</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Outcome Selection */}
                <div>
                  <p className="text-sm font-semibold text-gray-300 mb-3">
                    Select Outcome:
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {/* TRUE Button */}
                    <motion.button
                      onClick={() => setSelectedOutcome(true)}
                      className={`relative p-6 rounded-xl border-2 transition-all duration-200 ${
                        selectedOutcome === true
                          ? 'bg-green-500/20 border-green-500 shadow-lg shadow-green-500/30'
                          : 'bg-gray-800/50 border-gray-700 hover:border-green-500/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">✅</div>
                        <div className="text-lg font-bold text-green-400 mb-1">
                          TRUE
                        </div>
                        <div className="text-xs text-gray-400">
                          Prediction was correct
                        </div>
                      </div>

                      {selectedOutcome === true && (
                        <motion.div
                          className="absolute inset-0 rounded-xl border-2 border-green-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layoutId="outcome-selector"
                        />
                      )}
                    </motion.button>

                    {/* FALSE Button */}
                    <motion.button
                      onClick={() => setSelectedOutcome(false)}
                      className={`relative p-6 rounded-xl border-2 transition-all duration-200 ${
                        selectedOutcome === false
                          ? 'bg-red-500/20 border-red-500 shadow-lg shadow-red-500/30'
                          : 'bg-gray-800/50 border-gray-700 hover:border-red-500/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">❌</div>
                        <div className="text-lg font-bold text-red-400 mb-1">
                          FALSE
                        </div>
                        <div className="text-xs text-gray-400">
                          Prediction was wrong
                        </div>
                      </div>

                      {selectedOutcome === false && (
                        <motion.div
                          className="absolute inset-0 rounded-xl border-2 border-red-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layoutId="outcome-selector"
                        />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Stakes Warning */}
                {hasStake && selectedOutcome !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-lg p-4 border ${
                      selectedOutcome
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        selectedOutcome ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {selectedOutcome ? (
                        <>
                          ✅ Your {formatEther(prediction.stake)} ETH stake will be <strong>returned</strong>
                        </>
                      ) : (
                        <>
                          ⚠️ Your {formatEther(prediction.stake)} ETH stake will be <strong>lost</strong>
                        </>
                      )}
                    </p>
                  </motion.div>
                )}

                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
                  >
                    <p className="text-sm text-red-400">
                      ❌ {(error as Error).message || 'Transaction failed. Please try again.'}
                    </p>
                  </motion.div>
                )}

                {/* Success Message */}
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center"
                  >
                    <div className="text-3xl mb-2">🎉</div>
                    <p className="text-sm text-green-400 font-medium">
                      Outcome marked successfully!
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-800 bg-gray-900/50">
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 px-6 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-all duration-200"
                    disabled={isSubmitting || isConfirming}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={selectedOutcome === null || isSubmitting || isConfirming}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      selectedOutcome !== null && !isSubmitting && !isConfirming
                        ? selectedOutcome
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white shadow-lg shadow-green-500/30'
                          : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white shadow-lg shadow-red-500/30'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting || isConfirming ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </span>
                        {isConfirming ? 'Confirming...' : 'Marking...'}
                      </span>
                    ) : (
                      'Confirm Outcome'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
