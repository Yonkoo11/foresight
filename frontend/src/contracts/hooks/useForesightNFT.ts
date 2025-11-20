/**
 * Foresight NFT Contract Hooks
 * Interactions with the soulbound reputation display NFT
 *
 * NOTE: This is NOT a prediction contract. It's a reputation display NFT
 * that shows unified CT Mastery Score across all apps. Data comes from ReputationEngine.
 * For prediction functionality, use DailyGauntlet hooks instead.
 */

import { useReadContract } from 'wagmi';
import { getContractAddresses } from '../addresses';
import ForesightNFTABI from '../abis/ForesightNFT.json';
import ReputationEngineABI from '../abis/ReputationEngine.json';
import type { Address } from 'viem';
import { useChainId } from 'wagmi';

// ========================================
// Read Hooks
// ========================================

/**
 * Check if address owns a Foresight NFT (soulbound reputation display)
 */
export function useHasForesightNFT(address?: Address) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  return useReadContract({
    address: addresses.foresightNFT,
    abi: ForesightNFTABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      retry: 3,
      retryDelay: 1000,
    },
  });
}

/**
 * Get user's token ID
 */
export function useGetUserTokenId(address?: Address) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const result = useReadContract({
    address: addresses.foresightNFT,
    abi: ForesightNFTABI,
    functionName: 'ownerToTokenId',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
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

/**
 * Get token URI (contains dynamic SVG with reputation data)
 */
export function useGetTokenURI(tokenId: bigint | undefined) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const result = useReadContract({
    address: addresses.foresightNFT,
    abi: ForesightNFTABI,
    functionName: 'tokenURI',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined,
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

/**
 * Get reputation engine address
 */
export function useGetReputationEngine() {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  return useReadContract({
    address: addresses.foresightNFT,
    abi: ForesightNFTABI,
    functionName: 'reputationEngine',
    query: {
      retry: 3,
      retryDelay: 1000,
    },
  });
}

// ========================================
// Reputation Data (via ReputationEngine)
// ========================================

/**
 * Get user's full reputation data
 * This is what the NFT displays
 */
export function useGetUserReputation(address?: Address) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const result = useReadContract({
    address: addresses.reputationEngine,
    abi: ReputationEngineABI,
    functionName: 'getReputation',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
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

/**
 * Get user's CT Mastery Score (main reputation metric)
 */
export function useGetCTMasteryScore(address?: Address) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const result = useReadContract({
    address: addresses.reputationEngine,
    abi: ReputationEngineABI,
    functionName: 'getReputationScore',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
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
