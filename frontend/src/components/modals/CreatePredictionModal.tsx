/**
 * Create Prediction Modal
 * Full-screen modal for locking new predictions onchain
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { TIMECASTER_ARENA_ADDRESS } from '../../config/wagmi';

interface CreatePredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DURATION_OPTIONS = [
  { days: 30, label: '30 Days' },
  { days: 60, label: '60 Days' },
  { days: 90, label: '90 Days' },
];

const STAKE_PRESETS = [
  { value: '0', label: 'No Stake' },
  { value: '0.01', label: '0.01 ETH' },
  { value: '0.05', label: '0.05 ETH' },
  { value: '0.1', label: '0.1 ETH' },
];

export function CreatePredictionModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePredictionModalProps) {
  const [predictionText, setPredictionText] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [selectedStake, setSelectedStake] = useState('0');
  const [customStake, setCustomStake] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { writeContract, data: hash, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Character count
  const charCount = predictionText.length;
  const maxChars = 500;
  const isOverLimit = charCount > maxChars;

  // Validation
  const isValid =
    predictionText.trim().length >= 10 &&
    !isOverLimit &&
    selectedDuration > 0;

  // Handle submission
  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const stakeAmount =
        selectedStake === 'custom' ? customStake : selectedStake;
      const lockPeriod = selectedDuration * 24 * 60 * 60; // Convert days to seconds

      // TODO: Update with correct contract function when deployed
      await writeContract({
        address: TIMECASTER_ARENA_ADDRESS,
        abi: [{
          type: 'function',
          name: 'createPrediction',
          inputs: [
            { name: 'text', type: 'string' },
            { name: 'lockPeriod', type: 'uint256' }
          ],
          outputs: [],
          stateMutability: 'payable',
        }],
        functionName: 'createPrediction',
        args: [predictionText.trim(), BigInt(lockPeriod)],
        value: parseEther(stakeAmount),
      });
    } catch (err) {
      console.error('Error creating prediction:', err);
      setIsSubmitting(false);
    }
  };

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      setIsSubmitting(false);
      onSuccess?.();
      handleClose();
    }
  }, [isSuccess, onSuccess]);

  // Handle error
  useEffect(() => {
    if (error) {
      setIsSubmitting(false);
    }
  }, [error]);

  // Reset form on close
  const handleClose = () => {
    setPredictionText('');
    setSelectedDuration(30);
    setSelectedStake('0');
    setCustomStake('');
    setIsSubmitting(false);
    onClose();
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && isValid) {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, isValid, predictionText, selectedDuration, selectedStake]);

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
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-gray-700 max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ y: '100%', scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: '100%', scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div>
                  <h2 className="text-2xl font-bold text-gray-100">
                    Lock New Prediction
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Make a time-locked prediction and stake ETH for accountability
                  </p>
                </div>
                <button
                  onClick={handleClose}
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

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Prediction Text */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Your Prediction
                  </label>
                  <textarea
                    value={predictionText}
                    onChange={(e) => setPredictionText(e.target.value)}
                    placeholder="I predict that..."
                    className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                    autoFocus
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">
                      Minimum 10 characters
                    </p>
                    <p
                      className={`text-xs font-medium ${
                        isOverLimit
                          ? 'text-red-400'
                          : charCount > maxChars * 0.9
                          ? 'text-yellow-400'
                          : 'text-gray-500'
                      }`}
                    >
                      {charCount}/{maxChars}
                    </p>
                  </div>
                </div>

                {/* Duration Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Lock Duration
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {DURATION_OPTIONS.map(({ days, label }) => (
                      <button
                        key={days}
                        onClick={() => setSelectedDuration(days)}
                        className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                          selectedDuration === days
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    You can mark the outcome after the lock period expires
                  </p>
                </div>

                {/* Stake Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Stake Amount (Optional)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {STAKE_PRESETS.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => {
                          setSelectedStake(value);
                          setCustomStake('');
                        }}
                        className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                          selectedStake === value
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Stake */}
                  <div className="mt-3">
                    <button
                      onClick={() => setSelectedStake('custom')}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 text-left ${
                        selectedStake === 'custom'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                      }`}
                    >
                      Custom Amount
                    </button>
                    {selectedStake === 'custom' && (
                      <motion.input
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        type="number"
                        step="0.01"
                        min="0"
                        value={customStake}
                        onChange={(e) => setCustomStake(e.target.value)}
                        placeholder="0.00 ETH"
                        className="w-full mt-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    💡 Stake is returned if prediction is correct, lost if wrong
                  </p>
                </div>

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
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-800 bg-gray-900/50">
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3 px-6 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-all duration-200"
                    disabled={isSubmitting || isConfirming}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!isValid || isSubmitting || isConfirming}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      isValid && !isSubmitting && !isConfirming
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/30'
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
                        {isConfirming ? 'Confirming...' : 'Locking...'}
                      </span>
                    ) : (
                      'Lock Prediction Onchain'
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-600 text-center mt-3">
                  ⌘ + Enter to submit • Esc to cancel
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
