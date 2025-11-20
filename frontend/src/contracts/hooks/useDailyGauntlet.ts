/**
 * Daily Gauntlet Contract Hooks
 * Wagmi hooks for interacting with the Gauntlet contract
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import DailyGauntletABI from '../abis/DailyGauntlet.json';
import { getContractAddresses } from '../addresses';
import { useChainId } from 'wagmi';

export function useDailyGauntlet() {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Submit Prediction
  const submitPrediction = async (day: bigint, predictionId: bigint, guess: bigint) => {
    return writeContract({
      address: addresses.dailyGauntlet,
      abi: DailyGauntletABI,
      functionName: 'submitPrediction',
      args: [day, predictionId, guess],
      value: parseEther('0.05'), // MIN_STAKE from contract
    });
  };

  // Claim Reward
  const claimReward = async (day: bigint) => {
    return writeContract({
      address: addresses.dailyGauntlet,
      abi: DailyGauntletABI,
      functionName: 'claimReward',
      args: [day],
    });
  };

  return {
    submitPrediction,
    claimReward,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// Read Hooks

export function useGetGauntlet(day: bigint | undefined) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const result = useReadContract({
    address: addresses.dailyGauntlet,
    abi: DailyGauntletABI,
    functionName: 'getGauntlet',
    args: day !== undefined ? [day] : undefined,
    query: {
      enabled: day !== undefined,
      retry: 3,
      retryDelay: 1000,
    },
  });

  return {
    ...result,
    error: result.error,
    isError: result.isError,
  };
}

export function useGetPrediction(day: bigint | undefined, predictionId: bigint | undefined) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const result = useReadContract({
    address: addresses.dailyGauntlet,
    abi: DailyGauntletABI,
    functionName: 'getPrediction',
    args: day !== undefined && predictionId !== undefined ? [day, predictionId] : undefined,
    query: {
      enabled: day !== undefined && predictionId !== undefined,
      retry: 3,
      retryDelay: 1000,
    },
  });

  return {
    ...result,
    error: result.error,
    isError: result.isError,
  };
}

export function useGetEntry(day: bigint | undefined, participant: `0x${string}` | undefined) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const result = useReadContract({
    address: addresses.dailyGauntlet,
    abi: DailyGauntletABI,
    functionName: 'getEntry',
    args: day !== undefined && participant ? [day, participant] : undefined,
    query: {
      enabled: !!participant && day !== undefined,
      retry: 3,
      retryDelay: 1000,
    },
  });

  return {
    ...result,
    error: result.error,
    isError: result.isError,
  };
}

export function useGetParticipants(day: bigint | undefined) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const result = useReadContract({
    address: addresses.dailyGauntlet,
    abi: DailyGauntletABI,
    functionName: 'getParticipants',
    args: day !== undefined ? [day] : undefined,
    query: {
      enabled: day !== undefined,
      retry: 3,
      retryDelay: 1000,
    },
  });

  return {
    ...result,
    error: result.error,
    isError: result.isError,
  };
}

export function useCurrentDay() {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  return useReadContract({
    address: addresses.dailyGauntlet,
    abi: DailyGauntletABI,
    functionName: 'currentDay',
  });
}

export function useGauntletConstants() {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const minStakeResult = useReadContract({
    address: addresses.dailyGauntlet,
    abi: DailyGauntletABI,
    functionName: 'MIN_STAKE',
    query: {
      retry: 3,
      retryDelay: 1000,
    },
  });

  const predictionsPerGauntletResult = useReadContract({
    address: addresses.dailyGauntlet,
    abi: DailyGauntletABI,
    functionName: 'PREDICTIONS_PER_GAUNTLET',
    query: {
      retry: 3,
      retryDelay: 1000,
    },
  });

  return {
    minStake: minStakeResult.data,
    predictionsPerGauntlet: predictionsPerGauntletResult.data,
    isLoading: minStakeResult.isLoading || predictionsPerGauntletResult.isLoading,
    isError: minStakeResult.isError || predictionsPerGauntletResult.isError,
    error: minStakeResult.error || predictionsPerGauntletResult.error,
  };
}
