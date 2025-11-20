/**
 * Custom Hook: useNFTData
 * Fetches user stats and foresight score
 * TODO: Replace with real contract calls once deployed
 */

import { useAccount } from 'wagmi';
import type { UserStats } from '../../utils/terminal/foresightCalculator';

export function useNFTData() {
  const { address, isConnected } = useAccount();

  // TODO: Replace with real contract reads once contracts are deployed
  // For now, return mock data to demonstrate the UI
  const stats: UserStats | null = isConnected && address
    ? {
        totalPredictions: 5n,
        resolvedPredictions: 3n,
        correctPredictions: 2n,
        currentStreak: 2n,
        foresightScore: 65n, // This will show as SEER level
      }
    : null;

  const isLoading = false; // Set to true when using real contract calls

  const refetch = () => {
    // TODO: Implement refetch from contract
    console.log('Refetching NFT data...');
  };

  return {
    stats,
    isLoading,
    isConnected,
    address,
    refetch,
  };
}
